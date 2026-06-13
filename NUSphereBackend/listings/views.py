from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Listing
from .serializers import ListingSerializer

class AddListingView(APIView):
    def post(self, request):
        serializer = ListingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        listings = Listing.objects.all()
        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)