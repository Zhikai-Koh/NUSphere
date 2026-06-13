from rest_framework import serializers
from .models import Listing

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['id', 'item_name', 'item_price', 'category', 'image']