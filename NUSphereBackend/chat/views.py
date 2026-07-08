from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from listings.models import Listing
from shop.models import ShopProduct
from .models import Conversation, Message


def conversation_data(conversation, user):
    product = conversation.listing or conversation.shop_product
    source_type = "listing" if conversation.listing else "shop_product"
    image = None
    item_name = ""

    if conversation.listing:
        image = conversation.listing.image.url if conversation.listing.image else None
        item_name = conversation.listing.item_name
    elif conversation.shop_product:
        image = conversation.shop_product.item_image.url if conversation.shop_product.item_image else None
        item_name = conversation.shop_product.item_name

    other_user = conversation.seller if conversation.buyer == user else conversation.buyer
    latest_message = conversation.messages.order_by('-created_at').first()

    return {
        "id": conversation.id,
        "buyer": conversation.buyer.username,
        "seller": conversation.seller.username,
        "other_user": other_user.username,
        "source_type": source_type,
        "product_id": product.id if product else None,
        "item_name": item_name,
        "image": image,
        "latest_message": latest_message.body if latest_message else "",
        "updated_at": conversation.updated_at,
    }


class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversations = Conversation.objects.filter(
            Q(buyer=request.user) | Q(seller=request.user)
        ).select_related('buyer', 'seller', 'listing', 'shop_product').order_by('-updated_at')

        return Response([conversation_data(conversation, request.user) for conversation in conversations])

    def post(self, request):
        source_type = request.data.get("source_type")
        product_id = request.data.get("product_id")

        if source_type == "listing":
            try:
                listing = Listing.objects.get(id=product_id)
            except Listing.DoesNotExist:
                return Response({"error": "Listing not found."}, status=status.HTTP_404_NOT_FOUND)

            if listing.user == request.user:
                return Response({"error": "You cannot message yourself about your own listing."}, status=status.HTTP_400_BAD_REQUEST)

            conversation, _ = Conversation.objects.get_or_create(
                buyer=request.user,
                seller=listing.user,
                listing=listing,
                shop_product=None,
            )
            return Response(conversation_data(conversation, request.user), status=status.HTTP_200_OK)

        if source_type == "shop_product":
            try:
                product = ShopProduct.objects.select_related('shop', 'shop__owner').get(id=product_id)
            except ShopProduct.DoesNotExist:
                return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

            if product.shop.owner == request.user:
                return Response({"error": "You cannot message yourself about your own product."}, status=status.HTTP_400_BAD_REQUEST)

            conversation, _ = Conversation.objects.get_or_create(
                buyer=request.user,
                seller=product.shop.owner,
                listing=None,
                shop_product=product,
            )
            return Response(conversation_data(conversation, request.user), status=status.HTTP_200_OK)

        return Response({"error": "A valid source_type is required."}, status=status.HTTP_400_BAD_REQUEST)


class ConversationMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get_conversation(self, request, conversation_id):
        return Conversation.objects.filter(
            Q(buyer=request.user) | Q(seller=request.user),
            id=conversation_id
        ).select_related('buyer', 'seller', 'listing', 'shop_product').first()

    def get(self, request, conversation_id):
        conversation = self.get_conversation(request, conversation_id)
        if not conversation:
            return Response({"error": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

        messages = conversation.messages.select_related('sender').order_by('created_at')
        return Response({
            "conversation": conversation_data(conversation, request.user),
            "messages": [
                {
                    "id": message.id,
                    "sender": message.sender.username,
                    "body": message.body,
                    "created_at": message.created_at,
                    "is_mine": message.sender == request.user,
                }
                for message in messages
            ]
        })

    def post(self, request, conversation_id):
        conversation = self.get_conversation(request, conversation_id)
        if not conversation:
            return Response({"error": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

        body = request.data.get("body", "").strip()
        if not body:
            return Response({"error": "Message cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            body=body,
        )
        conversation.save()

        return Response({
            "id": message.id,
            "sender": message.sender.username,
            "body": message.body,
            "created_at": message.created_at,
            "is_mine": True,
        }, status=status.HTTP_201_CREATED)
