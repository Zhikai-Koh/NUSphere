from rest_framework.views import APIView
from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework import status
from ..models import Shop, ShopOrder, ShopProduct
from ..serializers import ShopProductSerializer, ShopSerializer 

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
    
    #For logged in people to delete their shops
    # def delete(self, request):
    #     shop_id = request.data.get("shop_id")
    #     shop = Shop.objects.get(id=shop_id, owner=request.user)
    #     try:
    #         if not shop.exists():
    #             return Response({
    #                 "error": "No unsold items found for this listing, or you don't have permission."
    #             }, status=status.HTTP_404_NOT_FOUND)

    #         shop.delete()
    #         return Response({"message": "Unsold stock deleted successfully"}, status=status.HTTP_200_OK)
    #     except Shop.DoesNotExist:
    #         return Response({"error": "Listing not found or you do not have permission to delete it"}, status=status.HTTP_404_NOT_FOUND)