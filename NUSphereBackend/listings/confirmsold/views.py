from rest_framework.views import APIView
from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework import status
from ..models import Listing, Categories, ListingItem, Order
from ..serializers import ListingSerializer
from rest_framework.permissions import IsAuthenticated

from django.db import transaction

class ConfirmSoldView(APIView):
    permission_classes = [IsAuthenticated]

    #Change from pending to sold
    def post(self,request):
        listing_id = request.data.get("product_id")
        buyer = request.data.get("buyer")

        if not listing_id:
            return Response({"error": "Invalid listing."}, status = status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                available_items = list(
                    ListingItem.objects.select_for_update()
                    .filter(listing_id=listing_id, status='pending',order_details__buyer = buyer)
                )

                orders_edited = []
                
                for item in available_items:
                    item.status = 'sold'
                    item.save()

                    order = Order.objects.get(listingItem = item)
                    order.order_status = 'confirmed'

                    orders_edited.append(order.id)

                return Response({
                    "message": "Order confirmed!",
                    "order_ids": orders_edited
                }, status=status.HTTP_201_CREATED)

        except Listing.DoesNotExist:
            return Response({"error": "Listing not found."}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": "An error occurred processing your order."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #This is for sellers to get list of pending orders by buyers
    def get(self, request):
        pending_orders = Order.objects.filter(
            listingItem__listing__user=request.user,
            listingItem__status='pending'
        ).values(
            'buyer',
            'listingItem__listing__id',
            'listingItem__listing__item_name',
            'listingItem__listing__item_price',
            'listingItem__listing__image'
        ).annotate(
            quantity=Count('id')
        )

        return Response(pending_orders, status=status.HTTP_200_OK)