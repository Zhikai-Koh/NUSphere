from django.db import models
from django.contrib.auth.models import User
from listings.models import Listing  # Pulls your existing product details

class Cart(models.Model):
    #OneToOneField make each user have exactly one cart row
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Cart"

class CartItem(models.Model):
    # Links each row to a parent Cart table row
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    # Links each row to a specific product
    product = models.ForeignKey(Listing, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.title} in {self.cart.user.username}'s cart"