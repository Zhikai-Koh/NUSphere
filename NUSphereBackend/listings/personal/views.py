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
    
    def delete(self, request):
        listing_id = request.data.get("listing_id")
        try:
            listing = Listing.objects.get(id=listing_id, user=request.user)
            listing.delete()
            return Response({"message": "Listing deleted successfully"}, status=status.HTTP_200_OK)
        except Listing.DoesNotExist:
            return Response({"error": "Listing not found or you do not have permission to delete it"}, status=status.HTTP_404_NOT_FOUND)