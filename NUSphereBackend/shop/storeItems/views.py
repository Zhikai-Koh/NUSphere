from rest_framework.views import APIView
from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework import status
from ..models import Shop, ShopOrder, ShopProduct
from ..serializers import ShopProductSerializer, ShopSerializer 

# For login system
from rest_framework.permissions import IsAuthenticated

class StoreItemView(APIView):
    permission_classes = [IsAuthenticated] 

    #For logged in people to see their own store products
    def get(self, request, store_id):
        shop = Shop.objects.get(owner=request.user, id=store_id)

        products = ShopProduct.objects.filter(shop = shop)

        data = []
        for product in products:
            data.append({
                "id": product.id,
                "item_name": product.item_name,
                "item_quantity": product.item_quantity,
                "item_price": product.item_price,
                "description": product.item_description,
                "item_image": product.item_image.url if product.item_image else None,
            })
        return Response(data)
    
    def post(self, request,store_id):
        shop = Shop.objects.get(owner = request.user, id=store_id)

        newProduct, created = ShopProduct.objects.get_or_create(
            shop = shop,
            item_name=request.data.get("item_name"),
            item_price=request.data.get("item_price"),
            item_quantity=request.data.get("item_quantity"),
            item_description=request.data.get("item_description"),
            item_image=request.FILES.get("image")
        )
        newProduct.save()
        
        serializer = ShopProductSerializer(newProduct)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
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