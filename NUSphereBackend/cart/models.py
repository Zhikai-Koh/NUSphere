from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from listings.models import Listing 

class Cart(models.Model):
    #OneToOneField make each user have exactly one cart row
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Cart"

class CartItem(models.Model):
    # Links each row to a parent Cart table row
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    product_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'product_id')

    quantity = models.PositiveIntegerField(default=1)
