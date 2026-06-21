from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Listing, Categories
from .serializers import ListingSerializer

# For login system
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class AddListingView(APIView):
    #This allows logged in people to add listings, but anyone can view listings :o
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def post(self, request):
        category = Categories.objects.get(name=request.data.get("category"))

        listing, created = Listing.objects.get_or_create(
            user=request.user,
            item_name=request.data.get("item_name"),
            item_price=request.data.get("item_price"),
            category=category,
            item_quantity=request.data.get("item_quantity"),
            item_description=request.data.get("item_description"),
            image=request.FILES.get("image")
        )
        listing.save()
        serializer = ListingSerializer(listing)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request):
        listings = Listing.objects.all()
        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)