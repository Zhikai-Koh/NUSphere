from rest_framework.views import APIView
from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework import status
from ..models import Listing, Categories, ListingItem, Order
from ..serializers import ListingSerializer, ListingItemSerializer

from rest_framework.permissions import IsAuthenticated

class OrderHistoryView(APIView):
    permission_classes = [IsAuthenticated] 

    #For buyers to see their current/past orders.
    def get(self, request):
        pending_orders = Order.objects.filter(
            buyer=request.user,
            listingItem__status='pending'
        ).select_related('listingItem__listing', 'listingItem__listing__user')

        pending_data = {}
        for order in pending_orders:
            listing_id = order.listingItem.listing.id
            if listing_id not in pending_data:
                pending_data[listing_id] = {
                    "id": listing_id,
                    "user": order.listingItem.listing.user.username,
                    "item_name": order.listingItem.listing.item_name,
                    "item_price": order.listingItem.listing.item_price,
                    "image": order.listingItem.listing.image.url,
                    "quantity": 1
                }
            else:
                pending_data[listing_id]["quantity"] += 1


        sold_orders = Order.objects.filter(
            buyer=request.user,
            listingItem__status='sold'
        ).select_related('listingItem__listing', 'listingItem__listing__user')

        sold_data = {}
        for order in sold_orders:
            listing_id = order.listingItem.listing.id

            if listing_id not in sold_data:
                sold_data[listing_id] = {
                    "id": listing_id,
                    "user": order.listingItem.listing.user.username,
                    "item_name": order.listingItem.listing.item_name,
                    "item_price": order.listingItem.listing.item_price,
                    "image": order.listingItem.listing.image.url,
                    "quantity": 1
                }
            else:
                sold_data[listing_id]["quantity"] += 1

        data = {
            "pending": list(pending_data.values()),
            "sold": list(sold_data.values())
        }

        return Response(data, status=status.HTTP_200_OK)