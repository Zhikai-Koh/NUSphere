from django.db import models

class CartItem(models.Model):
    quantity = models.PositiveIntegerField(default=1)
    item_name = models.CharField(max_length=255, default="")
    item_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def __str__(self):
        return f"Item Number {self.id}: Product {self.item_name} (x{self.quantity})"