from rest_framework.views import APIView
from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework import status
from ..models import Shop, ShopOrder, ShopProduct
from ..serializers import ShopProductSerializer, ShopSerializer 
from django.db.models import ProtectedError

# For login system
from rest_framework.permissions import IsAuthenticated

class PersonalStoresView(APIView):
    permission_classes = [IsAuthenticated] 

    #For logged in people to see their own stores
    def get(self, request):
        shops = Shop.objects.filter(owner=request.user).annotate(
            pending_order_count=Count('products__shop_orders', filter=Q(products__shop_orders__order_status='pending'))
        )

        data = []
        for shop in shops:
            data.append({
                "id": shop.id,
                "category": shop.category.name if shop.category else None,
                "description": shop.description,
                "store_name": shop.store_name,
                "is_open": shop.is_open,
                "store_image": shop.store_image.url if shop.store_image else None,
                "pending_order_count": shop.pending_order_count,
            })

        return Response(data)

    def patch(self, request):
        shop_id = request.data.get("shop_id")
        is_open = request.data.get("is_open")

        if shop_id is None or is_open is None:
            return Response({"error": "Store ID and open status are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(is_open, bool):
            return Response({"error": "Open status must be true or false."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            shop = Shop.objects.get(id=shop_id, owner=request.user)
            shop.is_open = is_open
            shop.save()

            return Response({
                "id": shop.id,
                "is_open": shop.is_open,
            }, status=status.HTTP_200_OK)
        
        except Shop.DoesNotExist:
            return Response({"error": "Store not found or you do not have permission to update it."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        shop_id = request.data.get("shop_id")

        if not shop_id:
            return Response({"error": "Store ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            shop = Shop.objects.get(id=shop_id, owner=request.user)
            shop.delete()
            return Response({"message": "Store deleted successfully."}, status=status.HTTP_200_OK)
        except Shop.DoesNotExist:
            return Response({"error": "Store not found or you do not have permission to delete it."}, status=status.HTTP_404_NOT_FOUND)
        except ProtectedError:
            return Response({"error": "Store cannot be deleted because one or more products already have orders."}, status=status.HTTP_400_BAD_REQUEST)
