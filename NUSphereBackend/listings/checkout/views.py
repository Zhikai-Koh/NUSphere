from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Listing, Categories, ListingItem, Order
from ..serializers import ListingSerializer
from rest_framework.permissions import IsAuthenticated

from django.db import transaction

class CheckOutView(APIView):
    permission_classes = [IsAuthenticated]

    #Changing state of listing items to pending
    def post(self,request):
        listing_id = request.data.get("product_id")
        quantity = request.data.get("quantity")

        if not listing_id or quantity <= 0:
            return Response({"error": "Invalid listing or quantity."}, status = status.HTTP_400_BAD_REQUEST)
        
        try:
            #transaction.atomic() make sure that all queries go through or none go through at all
            with transaction.atomic():
                #list() executes the statement and put them into a python list
                available_items = list(
                    #select_for_update() locks rows that are currently in used so no duplicate stuff happens
                    ListingItem.objects.select_for_update()
                    .filter(listing_id=listing_id, status='unsold')[:quantity]
                )

                if len(available_items) < quantity:
                    return Response(
                        {"error": f"Not enough stock available. Only {len(available_items)} remaining."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

                orders_created = []
                
                for item in available_items:
                    item.status = 'pending'
                    item.save()

                    order = Order.objects.create(
                        buyer=request.user,
                        listingItem=item,
                        purchase_price=item.listing.item_price
                    )
                    orders_created.append(order.id)

                return Response({
                    "message": "Order placed successfully!",
                    "quantity_purchased": quantity,
                    "order_ids": orders_created
                }, status=status.HTTP_201_CREATED)

        except Listing.DoesNotExist:
            return Response({"error": "Listing not found."}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": "An error occurred processing your order."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)