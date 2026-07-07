from rest_framework.views import APIView
from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework import status
from ..models import Shop, ShopOrder, ShopProduct
from ..serializers import ShopProductSerializer, ShopSerializer 
from django.db.models import ProtectedError

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
    
    #For logged in people to add products to their own stores
    def post(self, request,store_id):
        if int(request.data.get("item_price")) < 0:
            return Response({"error": "Invalid item price."}, status=status.HTTP_400_BAD_REQUEST)

        if int(request.data.get("item_quantity")) < 0:
            return Response({"error": "Invalid item quantity."}, status=status.HTTP_400_BAD_REQUEST)

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

    def delete(self, request, store_id):
        product_id = request.data.get("product_id")

        if not product_id:
            return Response({"error": "Product ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = ShopProduct.objects.get(id=product_id, shop_id=store_id, shop__owner=request.user)
            product.delete()
            return Response({"message": "Product deleted successfully."}, status=status.HTTP_200_OK)
        except ShopProduct.DoesNotExist:
            return Response({"error": "Product not found or you do not have permission to delete it."}, status=status.HTTP_404_NOT_FOUND)
        except ProtectedError:
            return Response({"error": "Product cannot be deleted because it already has orders."}, status=status.HTTP_400_BAD_REQUEST)
