from rest_framework import serializers
from .models import Listing, ListingItem, Order

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = [
            'id', 'item_name', 'item_price', 'item_quantity', 'item_description',
            'category', 'image', 'location_name', 'latitude', 'longitude'
        ]

class ListingItemSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only = True)

    class Meta:
        model = ListingItem
        fields = ['id','listing','status']
