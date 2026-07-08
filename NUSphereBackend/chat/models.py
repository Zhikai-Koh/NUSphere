from django.db import models
from django.contrib.auth.models import User

from listings.models import Listing
from shop.models import ShopProduct


class Conversation(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='buyer_conversations')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seller_conversations')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True, blank=True, related_name='conversations')
    shop_product = models.ForeignKey(ShopProduct, on_delete=models.CASCADE, null=True, blank=True, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
