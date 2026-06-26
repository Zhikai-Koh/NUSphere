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
        ).values(
            'listingItem__listing__id',
            'listingItem__listing__user',
            'listingItem__listing__item_name',
            'listingItem__listing__item_price',
            'listingItem__listing__image'
        ).annotate(
            quantity=Count('id')
        )

        sold_orders = Order.objects.filter(
            buyer=request.user,
            listingItem__status='sold'
        ).values(
            'listingItem__listing__id',
            'listingItem__listing__user',
            'listingItem__listing__item_name',
            'listingItem__listing__item_price',
            'listingItem__listing__image'
        ).annotate(
            quantity=Count('id')
        )

        data = {
            "pending": list(pending_orders),
            "sold": list(sold_orders)
        }

        return Response(data, status=status.HTTP_200_OK)