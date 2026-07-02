from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType

from .models import Cart, CartItem
from listings.models import Listing
from .serializers import CartSerializer

from shop.models import ShopProduct

class CartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        product_type = request.data.get('product_type')

        cart, _ = Cart.objects.get_or_create(user=request.user)
        post_type = request.data.get('post_type')
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 0))

        if product_type == "listing":
            model_class = Listing
        elif product_type == "shop_product":
            model_class = ShopProduct
        else:
            return Response(
                {"error": "A valid product_type ('listing' or 'shop_product') is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        target_content_type = ContentType.objects.get_for_model(model_class)


        if not product_id:
            return Response({"error": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Django auto make product_id column from the "product" ForeignKey in model.py, so we can immediate use it to find the specific row without manually querying for the product and then using it to query for the cart item.
        # Since we queried for the cart at the top, we dont need to use the cart's foreign key, instead we directly use the cart object to query for the cart item.


        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            content_type=target_content_type, 
            product_id=product_id,
            )

        if post_type =='add':
            if(not created):
                cart_item.quantity += quantity
            else:
                cart_item.quantity = quantity
        elif post_type == 'change':
            cart_item.quantity = quantity
        cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        product_type = request.data.get('product_type')

        if product_type == "listing":
            model_class = Listing
        elif product_type == "shop_product":
            model_class = ShopProduct
        else:
            return Response(
                {"error": "A valid product_type ('listing' or 'shop_product') is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        target_content_type = ContentType.objects.get_for_model(model_class)

        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id,)
            cart_item.delete()
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)