from rest_framework import serializers
from .models import Shop, ShopProduct

class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ['id', 'store_name', 'owner', 'description', 'category', 'store_image']

class ShopProductSerializer(serializers.ModelSerializer):
    shop = ShopSerializer(read_only = True)

    class Meta:
        model = ShopProduct
        fields = ['id', 'shop', 'item_name', 'item_price', 'item_description', 'item_image', 'item_quantity', 'is_active']