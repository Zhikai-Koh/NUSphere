from rest_framework.views import APIView
from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework import status
from ..models import Listing, Categories, ListingItem, Order
from ..serializers import ListingSerializer, ListingItemSerializer

# For login system
from rest_framework.permissions import IsAuthenticated

class PersonalListingView(APIView):
    permission_classes = [IsAuthenticated] 

    #For logged in people to see their own listings
    def get(self, request):
        listings = Listing.objects.filter(user=request.user).annotate(
            total_unsold = Count('listing_item', filter = Q(listing_item__status = 'unsold')),
            total_pending = Count('listing_item', filter = Q(listing_item__status = 'pending')),
            total_sold = Count('listing_item', filter = Q(listing_item__status = 'sold'))
        )

        data = []
        for listing in listings:
            data.append({
                "id": listing.id,
                "item_name": listing.item_name,
                "item_price": str(listing.item_price),
                "item_quantity": str(listing.item_quantity),
                "image": listing.image.url if listing.image else None,
                "location_name": listing.location_name,
                "latitude": listing.latitude,
                "longitude": listing.longitude,
                "inventory": {
                    "unsold": listing.total_unsold,
                    "pending": listing.total_pending,
                    "sold": listing.total_sold,
                    "total": listing.total_unsold + listing.total_pending + listing.total_sold
                }
            })

        return Response(data)
    
    #For logged in people to delete their unsold listings
    def delete(self, request):
        listing_id = request.data.get("listing_id")
        listing = Listing.objects.filter(id=listing_id, user=request.user).first()

        if not listing:
            return Response({
                "error": "Listing not found or you do not have permission to delete it"
            }, status=status.HTTP_404_NOT_FOUND)

        unsold_listings = ListingItem.objects.filter(listing=listing, status="unsold")
        protected_listings = ListingItem.objects.filter(listing=listing).exclude(status="unsold")

        if not unsold_listings.exists() and not protected_listings.exists():
            listing.delete()
            return Response({"message": "Listing deleted successfully"}, status=status.HTTP_200_OK)

        if not unsold_listings.exists():
            return Response({
                "error": "This listing has no unsold stock to delete."
            }, status=status.HTTP_400_BAD_REQUEST)

        if protected_listings.exists():
            unsold_listings.delete()
            return Response({
                "message": "Unsold stock deleted. Pending or sold items are still kept in your listing history."
            }, status=status.HTTP_200_OK)

        listing.delete()
        return Response({"message": "Listing deleted successfully"}, status=status.HTTP_200_OK)
