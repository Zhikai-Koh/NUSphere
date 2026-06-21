from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Listing, Categories
from ..serializers import ListingSerializer

# For login system
from rest_framework.permissions import IsAuthenticated

class PersonalListingView(APIView):
    #This allows logged in people to add listings, but anyone can view listings :o
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        listings = Listing.objects.filter(user=request.user)
        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)