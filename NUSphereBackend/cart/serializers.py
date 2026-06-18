from rest_framework import serializers
from .models import Cart, CartItem
from listings.serializers import ListingSerializer

class CartItemSerializer(serializers.ModelSerializer):
    #This embeds the full product details (title, price, image) inside the response.
    #read-only true means dat this field is only when a GET request is sent, a POST request will ignore the field
    product_details = ListingSerializer(source='product', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_details', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    #Tells Django to lookup all CartItem with column "cart" that matches the current Cart row's ID.
    #It knows to look at the "cart" column because in models.py, the foreignkey has related_name = "items" which match the variable name.
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']