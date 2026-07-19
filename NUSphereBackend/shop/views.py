from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Shop, ShopProduct, ShopOrder
from listings.models import Categories
from .serializers import ShopSerializer
from django.contrib.auth.models import User
from django.db.models import Count, Q
from django.db import transaction

from rest_framework.permissions import IsAuthenticatedOrReadOnly

class AddStoreView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly] 

    #Creating new store
    def post(self, request):
        store_name = request.data.get("store_name")
        image = request.FILES.get("image")
        location_name = request.data.get("location_name", "").strip()
        latitude = request.data.get("latitude")
        longitude = request.data.get("longitude")

        if not store_name:
            return Response({"error": "Store name is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not image:
            return Response({"error": "Store cover image is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not location_name or latitude is None or longitude is None:
            return Response({"error": "Store location is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except (TypeError, ValueError):
            return Response({"error": "Store coordinates must be valid numbers."}, status=status.HTTP_400_BAD_REQUEST)

        if not -90 <= latitude <= 90 or not -180 <= longitude <= 180:
            return Response({"error": "Store coordinates are outside the valid range."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            category = Categories.objects.get(name=request.data.get("category"))
        except Categories.DoesNotExist:
            return Response({"error": "Invalid category."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                newShop, created = Shop.objects.get_or_create(
                    owner=request.user,
                    store_name=store_name,
                    category=category,
                    description=request.data.get("description"),
                    store_image=image,
                    location_name=location_name,
                    latitude=latitude,
                    longitude=longitude
                )
                
                serializer = ShopSerializer(newShop)


                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Failed to create new table: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)


    #When people load shop
    def get(self, request):
        if request.user.is_authenticated:
            shops = Shop.objects.exclude(owner=request.user).filter(is_open=True)
        else:
            shops = Shop.objects.filter(is_open=True)

        data = []
        for shop in shops:
            # if shop.is_open:
            data.append({
                "id": shop.id,
                "owner": shop.owner.username,
                "category": shop.category.name if shop.category else None,
                "description": shop.description,
                "store_name": shop.store_name,
                "is_open": shop.is_open,
                "image": shop.store_image.url if shop.store_image else None,
                "location_name": shop.location_name,
                "latitude": shop.latitude,
                "longitude": shop.longitude,
            })
        return Response(data)
