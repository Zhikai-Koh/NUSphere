from rest_framework import serializers
from .models import Cart, CartItem
from listings.models import Listing
from listings.serializers import ListingSerializer
from shop.models import ShopProduct

class CartItemSerializer(serializers.ModelSerializer):
    product_details = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'product_details', 'quantity']

    def get_product_details(self, obj):
        item = obj.product
        if not item:
            return None

        if isinstance(item, Listing):
            return {
                "id": item.id,
                "type": "listing",
                "item_name": item.item_name,
                "item_price": item.item_price,
                "image": item.image.url if item.image else None,
            }
        
        elif isinstance(item, ShopProduct):
            return {
                "id": item.id,
                "type": "shop_product",
                "item_name": item.item_name,
                "item_price": item.item_price,
                "image": item.item_image.url if item.item_image else None
            }

        return None

class CartSerializer(serializers.ModelSerializer):
    #Tells Django to lookup all CartItem with column "cart" that matches the current Cart row's ID.
    #It knows to look at the "cart" column because in models.py, the foreignkey has related_name = "items" which match the variable name.
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']
