from decimal import Decimal

from django.db.models import Count, Sum, F, DecimalField, ExpressionWrapper, Q
from django.db.models.functions import Coalesce
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from listings.models import Listing, ListingItem, Order
from shop.models import Shop, ShopOrder, ShopProduct


class SellerAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        listings = Listing.objects.filter(user=request.user)
        shops = Shop.objects.filter(owner=request.user)
        products = ShopProduct.objects.filter(shop__owner=request.user)

        listing_revenue = Order.objects.filter(
            listingItem__listing__user=request.user,
            listingItem__status='sold'
        ).aggregate(
            total=Coalesce(
                Sum('purchase_price'),
                Decimal('0'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            )
        )['total']

        shop_revenue_expression = ExpressionWrapper(
            F('purchase_price') * F('quantity'),
            output_field=DecimalField(max_digits=12, decimal_places=2)
        )
        shop_revenue = ShopOrder.objects.filter(
            product__shop__owner=request.user,
            order_status='sold'
        ).aggregate(
            total=Coalesce(
                Sum(shop_revenue_expression),
                Decimal('0'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            )
        )['total']

        listing_items = ListingItem.objects.filter(listing__user=request.user).aggregate(
            unsold=Count('id', filter=Q(status='unsold')),
            pending=Count('id', filter=Q(status='pending')),
            sold=Count('id', filter=Q(status='sold')),
        )

        pending_listing_orders = Order.objects.filter(
            listingItem__listing__user=request.user,
            listingItem__status='pending'
        ).count()
        completed_listing_orders = Order.objects.filter(
            listingItem__listing__user=request.user,
            listingItem__status='sold'
        ).count()

        pending_shop_orders = ShopOrder.objects.filter(
            product__shop__owner=request.user,
            order_status='pending'
        ).aggregate(total=Coalesce(Sum('quantity'), 0))['total']
        completed_shop_orders = ShopOrder.objects.filter(
            product__shop__owner=request.user,
            order_status='sold'
        ).aggregate(total=Coalesce(Sum('quantity'), 0))['total']

        store_stock = products.aggregate(total=Coalesce(Sum('item_quantity'), 0))['total']

        best_selling_listings = Listing.objects.filter(user=request.user).annotate(
            sold_count=Count('listing_item', filter=Q(listing_item__status='sold'))
        ).filter(sold_count__gt=0).order_by('-sold_count')[:5]

        best_selling_products = ShopProduct.objects.filter(shop__owner=request.user).annotate(
            sold_count=Coalesce(Sum('shop_orders__quantity', filter=Q(shop_orders__order_status='sold')), 0)
        ).filter(sold_count__gt=0).order_by('-sold_count')[:5]

        low_stock_products = products.filter(item_quantity__lte=3).order_by('item_quantity')[:5]

        data = {
            "summary": {
                "total_revenue": str(listing_revenue + shop_revenue),
                "listing_revenue": str(listing_revenue),
                "store_revenue": str(shop_revenue),
                "pending_orders": pending_listing_orders + pending_shop_orders,
                "completed_orders": completed_listing_orders + completed_shop_orders,
                "active_listings": listings.count(),
                "stores": shops.count(),
                "open_stores": shops.filter(is_open=True).count(),
            },
            "inventory": {
                "market_unsold": listing_items["unsold"],
                "market_pending": listing_items["pending"],
                "market_sold": listing_items["sold"],
                "store_stock": store_stock,
            },
            "best_selling": [
                {
                    "source": "Open Market",
                    "item_name": listing.item_name,
                    "sold_count": listing.sold_count,
                }
                for listing in best_selling_listings
            ] + [
                {
                    "source": "Store",
                    "item_name": product.item_name,
                    "sold_count": product.sold_count,
                }
                for product in best_selling_products
            ],
            "low_stock": [
                {
                    "store_name": product.shop.store_name,
                    "item_name": product.item_name,
                    "quantity": product.item_quantity,
                }
                for product in low_stock_products
            ],
        }

        return Response(data)
