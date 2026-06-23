from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Listing, Categories, ListingItem, Order
from .serializers import ListingSerializer
from django.contrib.auth.models import User

# For login system
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class AddListingView(APIView):
    #This allows logged in people to add listings, but anyone can view listings :o
    permission_classes = [IsAuthenticatedOrReadOnly] 

    #When new listing is made
    def post(self, request):
        category = Categories.objects.get(name=request.data.get("category"))

        newListing, created = Listing.objects.get_or_create(
            user=request.user,
            item_name=request.data.get("item_name"),
            item_price=request.data.get("item_price"),
            category=category,
            item_quantity=request.data.get("item_quantity"),
            item_description=request.data.get("item_description"),
            image=request.FILES.get("image")
        )
        newListing.save()

        items = [ListingItem(listing=newListing) for _ in range(int(request.data.get("item_quantity")))]
        ListingItem.objects.bulk_create(items)
        
        serializer = ListingSerializer(newListing)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    #When people load marketplace
    def get(self, request):
        if request.user.is_authenticated:
            listings = Listing.objects.exclude(user=request.user)
        else:
            listings = Listing.objects.all()
        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)