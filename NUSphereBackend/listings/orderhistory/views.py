from rest_framework.views import APIView
from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework import status
from ..models import Listing, Categories, ListingItem, Order
from ..serializers import ListingSerializer, ListingItemSerializer
from shop.models import ShopOrder

from rest_framework.permissions import IsAuthenticated

class OrderHistoryView(APIView):
    permission_classes = [IsAuthenticated] 

    #For buyers to see their current/past orders.
    def get(self, request):
        pending_orders = Order.objects.filter(
            buyer=request.user,
            listingItem__status='pending'
        ).select_related('listingItem__listing', 'listingItem__listing__user')

        pending_data = {}
        for order in pending_orders:
            listing_id = order.listingItem.listing.id
            if listing_id not in pending_data:
                pending_data[listing_id] = {
                    "id": listing_id,
                    "user": order.listingItem.listing.user.username,
                    "seller": order.listingItem.listing.user.username,
                    "store_name": None,
                    "source_type": "listing",
                    "source_label": "Open Market",
                    "item_name": order.listingItem.listing.item_name,
                    "item_price": order.listingItem.listing.item_price,
                    "image": order.listingItem.listing.image.url if order.listingItem.listing.image else None,
                    "quantity": 1
                }
            else:
                pending_data[listing_id]["quantity"] += 1

        shop_orders = ShopOrder.objects.filter(
            buyer=request.user,
            order_status='pending'
        ).select_related('product__shop', 'product__shop__owner')

        for order in shop_orders:
            product = order.product
            product_key = ("shop_product", product.id)
            if product_key not in pending_data:
                pending_data[product_key] = {
                    "id": product.id,
                    "user": product.shop.owner.username,
                    "seller": product.shop.owner.username,
                    "store_name": product.shop.store_name,
                    "source_type": "store_product",
                    "source_label": "Store",
                    "item_name": product.item_name,
                    "item_price": order.purchase_price,
                    "image": product.item_image.url if product.item_image else None,
                    "quantity": order.quantity
                }
            else:
                pending_data[product_key]["quantity"] += order.quantity

        sold_orders = Order.objects.filter(
            buyer=request.user,
            listingItem__status='sold'
        ).select_related('listingItem__listing', 'listingItem__listing__user')

        sold_data = {}
        for order in sold_orders:
            listing_id = order.listingItem.listing.id

            if listing_id not in sold_data:
                sold_data[listing_id] = {
                    "id": listing_id,
                    "user": order.listingItem.listing.user.username,
                    "seller": order.listingItem.listing.user.username,
                    "store_name": None,
                    "source_type": "listing",
                    "source_label": "Open Market",
                    "item_name": order.listingItem.listing.item_name,
                    "item_price": order.listingItem.listing.item_price,
                    "image": order.listingItem.listing.image.url if order.listingItem.listing.image else None,
                    "quantity": 1
                }
            else:
                sold_data[listing_id]["quantity"] += 1

        confirmed_shop_orders = ShopOrder.objects.filter(
            buyer=request.user,
            order_status='sold'
        ).select_related('product__shop', 'product__shop__owner')

        for order in confirmed_shop_orders:
            product = order.product
            product_key = ("shop_product", product.id)
            if product_key not in sold_data:
                sold_data[product_key] = {
                    "id": product.id,
                    "user": product.shop.owner.username,
                    "seller": product.shop.owner.username,
                    "store_name": product.shop.store_name,
                    "source_type": "store_product",
                    "source_label": "Store",
                    "item_name": product.item_name,
                    "item_price": order.purchase_price,
                    "image": product.item_image.url if product.item_image else None,
                    "quantity": order.quantity
                }
            else:
                sold_data[product_key]["quantity"] += order.quantity

        data = {
            "pending": list(pending_data.values()),
            "sold": list(sold_data.values())
        }

        return Response(data, status=status.HTTP_200_OK)
