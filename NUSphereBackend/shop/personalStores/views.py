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
        shops = Shop.objects.filter(owner=request.user)

        data = []
        for shop in shops:
            data.append({
                "id": shop.id,
                "category": shop.category.name,
                "description": shop.description,
                "store_name": shop.store_name,
                "store_image": shop.store_image.url if shop.store_image else None,
            })

        return Response(data)

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
