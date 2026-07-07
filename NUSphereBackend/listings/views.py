from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Listing, Categories, ListingItem, Order
from .serializers import ListingSerializer
from django.contrib.auth.models import User
from django.db.models import Count, Q
from decimal import Decimal, InvalidOperation

# For login system
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class AddListingView(APIView):
    #This allows logged in people to add listings, but anyone can view listings :o
    permission_classes = [IsAuthenticatedOrReadOnly] 

    #When new listing is made
    def post(self, request):
        item_name = request.data.get("item_name")
        image = request.FILES.get("image")

        try:
            item_price = Decimal(request.data.get("item_price", ""))
        except (InvalidOperation, TypeError):
            return Response({"error": "Invalid item price."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item_quantity = int(request.data.get("item_quantity", ""))
        except (TypeError, ValueError):
            return Response({"error": "Invalid item quantity."}, status=status.HTTP_400_BAD_REQUEST)

        if item_price < 0:
            return Response({"error": "Invalid item price."}, status=status.HTTP_400_BAD_REQUEST)

        if item_quantity < 0:
            return Response({"error": "Invalid item quantity."}, status=status.HTTP_400_BAD_REQUEST)

        if not item_name:
            return Response({"error": "Item name is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not image:
            return Response({"error": "Listing image is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            category = Categories.objects.get(name=request.data.get("category"))
        except Categories.DoesNotExist:
            return Response({"error": "Invalid category."}, status=status.HTTP_400_BAD_REQUEST)

        newListing, created = Listing.objects.get_or_create(
            user=request.user,
            item_name=item_name,
            item_price=item_price,
            category=category,
            item_quantity=item_quantity,
            item_description=request.data.get("item_description"),
            image=image
        )
        newListing.save()

        items = [ListingItem(listing=newListing) for _ in range(item_quantity)]
        ListingItem.objects.bulk_create(items)
        
        serializer = ListingSerializer(newListing)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    #When people load marketplace
    def get(self, request):
        if request.user.is_authenticated:
            listings = Listing.objects.exclude(user=request.user)
        else:
            listings = Listing.objects.all()

        listings = listings.annotate(
            total_unsold = Count('listing_item', filter = Q(listing_item__status = 'unsold')),
            total_pending = Count('listing_item', filter = Q(listing_item__status = 'pending')),
            total_sold = Count('listing_item', filter = Q(listing_item__status = 'sold'))
        )

        data = []
        for listing in listings:
            if listing.total_unsold > 0:
                data.append({
                    "id": listing.id,
                    "item_description": listing.item_description,
                    "item_name": listing.item_name,
                    "item_price": str(listing.item_price),
                    "item_quantity": str(listing.item_quantity),
                    "image": listing.image.url if listing.image else None,
                    "category": listing.category.name if listing.category else None,
                    "inventory": {
                        "unsold": listing.total_unsold,
                        "pending": listing.total_pending,
                        "sold": listing.total_sold,
                        "total": listing.total_unsold + listing.total_pending + listing.total_sold
                    }
            })
        return Response(data)
