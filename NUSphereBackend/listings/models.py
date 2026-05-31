from django.db import models

class Categories(models.Model):
    name = models.CharField(max_length=255, default="")
    
    def __str__(self):
        return self.name

class Listing(models.Model):
    item_name = models.CharField(max_length=255, default="", null=True, blank=True)
    item_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    category = models.ForeignKey(Categories, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to='listings/', null=True, blank=True)