from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import ShopOrder


class StoreConfirmSoldView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, store_id):
        orders = ShopOrder.objects.filter(
            product__shop_id=store_id,
            product__shop__owner=request.user,
            order_status='pending'
        ).select_related('product', 'buyer')

        data = {}
        for order in orders:
            product_id = order.product.id
            key = (product_id, order.buyer.username)

            if key not in data:
                data[key] = {
                    "buyer": order.buyer.username,
                    "product_id": product_id,
                    "item_name": order.product.item_name,
                    "item_price": order.purchase_price,
                    "quantity": order.quantity,
                    "image": order.product.item_image.url if order.product.item_image else None,
                    "order_status": order.order_status
                }
            else:
                data[key]["quantity"] += order.quantity

        return Response(list(data.values()), status=status.HTTP_200_OK)

    def post(self, request, store_id):
        product_id = request.data.get("product_id")
        buyer = request.data.get("buyer")

        if not product_id or not buyer:
            return Response({"error": "Product ID and buyer are required."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            orders = list(
                ShopOrder.objects.select_for_update()
                .filter(
                    product_id=product_id,
                    buyer__username=buyer,
                    product__shop_id=store_id,
                    product__shop__owner=request.user,
                    order_status='pending'
                )
            )

            if not orders:
                return Response({"error": "No pending store order found for this product and buyer."}, status=status.HTTP_404_NOT_FOUND)

            order_ids = []
            for order in orders:
                order.order_status = 'sold'
                order.save()
                order_ids.append(order.id)

        return Response({"message": "Store order sold.", "order_ids": order_ids}, status=status.HTTP_200_OK)
