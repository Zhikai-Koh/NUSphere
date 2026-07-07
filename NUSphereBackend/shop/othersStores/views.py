from rest_framework.views import APIView
from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework import status
from ..models import Shop, ShopOrder, ShopProduct
from ..serializers import ShopProductSerializer, ShopSerializer 

from rest_framework.permissions import IsAuthenticatedOrReadOnly

class OthersStoreItemView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly] 

    #For people to see inside other's stores.
    def get(self, request, store_id):
        try:
            shop = Shop.objects.get(id=store_id)
        except Shop.DoesNotExist:
            return Response({"error": "Store not found."}, status=status.HTTP_404_NOT_FOUND)

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
