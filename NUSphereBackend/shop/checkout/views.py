from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Shop, ShopOrder, ShopProduct
from ..serializers import ShopProductSerializer, ShopSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q

from django.db import transaction

class StoreCheckOutView(APIView):
    permission_classes = [IsAuthenticated]

    #This is to check if the amount the buyer want to check out is available in the listings db
    def get(self,request):
        product_id = request.query_params.get("product_id")

        if not product_id:
            return Response({"error": "Product ID is required"}, status=400)

        try:
            itemCount = ShopProduct.objects.get(id=product_id).item_quantity
            data = {
                "item_quantity": itemCount
            }
            return Response(data)

        except ShopProduct.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)


    #Changing state of listing items to pending
    def post(self,request):
        product_id = request.data.get("product_id")
        try:
            quantity = int(request.data.get("quantity", 0))
        except (TypeError, ValueError):
            return Response({"error": "Invalid product or quantity."}, status = status.HTTP_400_BAD_REQUEST)

        if not product_id or quantity <= 0:
            return Response({"error": "Invalid product or quantity."}, status = status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                product = ShopProduct.objects.select_for_update().get(id=product_id)
                productCount = product.item_quantity

                if productCount < quantity:
                    return Response(
                        {"error": "Not enough stock available."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                order = ShopOrder.objects.create(
                        product=product,
                        buyer=request.user,
                        quantity=quantity,
                        purchase_price=product.item_price,
                        order_status='pending'
                    )

                product.item_quantity -= quantity
                product.save()

                return Response({
                    "message": "Order placed successfully!",
                    "quantity_purchased": quantity,
                    "order_id": order.id
                }, status=status.HTTP_201_CREATED)

        except ShopProduct.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": "An error occurred processing your order."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
