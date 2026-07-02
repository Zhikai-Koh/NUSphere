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
        category = Categories.objects.get(name=request.data.get("category"))

        try:
            with transaction.atomic():
                newShop, created = Shop.objects.get_or_create(
                    owner=request.user,
                    store_name=request.data.get("store_name"),
                    category=category,
                    description=request.data.get("description"),
                    store_image=request.FILES.get("image")
                )
                
                serializer = ShopSerializer(newShop)


                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Failed to create new table: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)


    #When people load shop
    def get(self, request):
        if request.user.is_authenticated:
            shops = Shop.objects.exclude(owner=request.user)
        else:
            shops = Shop.objects.all()

        data = []
        for shop in shops:
            # if shop.is_open:
            data.append({
                "id": shop.id,
                "owner": shop.owner.username,
                "category": shop.category.name,
                "description": shop.description,
                "store_name": shop.store_name,
                "image": shop.store_image.url if shop.store_image else None,
            })
        return Response(data)