from rest_framework import serializers
from .models import Listing

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['id', 'item_name', 'item_price', 'item_quantity', 'item_description', 'category', 'image', 'status']