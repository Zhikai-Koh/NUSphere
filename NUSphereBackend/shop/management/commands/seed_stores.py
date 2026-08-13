from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from listings.models import Categories
from shop.models import Shop, ShopOrder, ShopProduct


class Command(BaseCommand):
    help = "Create clean filler student stores and products for local development."

    sample_stores = [
        {
            "username": "matcha_corner",
            "store_name": "UTown Matcha Corner",
            "description": "Small batch drinks and snacks for study breaks around UTown.",
            "category": "Food",
            "store_image": "store_image/Matcha.jpeg",
            "location_name": "UTown Stephen Riady Centre",
            "latitude": 1.3048,
            "longitude": 103.7739,
            "products": [
                {
                    "item_name": "Iced Matcha Latte",
                    "item_price": Decimal("4.80"),
                    "item_quantity": 12,
                    "item_description": "Freshly mixed matcha latte with milk, served chilled.",
                    "item_image": "store_products/Matcha_Latte.jpeg",
                },
                {
                    "item_name": "Matcha Cake Slice",
                    "item_price": Decimal("5.20"),
                    "item_quantity": 8,
                    "item_description": "Soft matcha cake slice for a quick afternoon treat.",
                    "item_image": "store_products/Matcha_Cake.jpeg",
                },
                {
                    "item_name": "Green Tea Bottle",
                    "item_price": Decimal("2.40"),
                    "item_quantity": 16,
                    "item_description": "Ready-to-go green tea for lectures and library sessions.",
                    "item_image": "store_products/Green_Tea.jpeg",
                },
            ],
        },
        {
            "username": "hall_essentials",
            "store_name": "Hall Essentials Co.",
            "description": "Dorm and laundry basics for students living on campus.",
            "category": "Dorm Living",
            "store_image": "store_image/Detergent_Pod.jpg",
            "location_name": "PGPR",
            "latitude": 1.2916,
            "longitude": 103.7808,
            "products": [
                {
                    "item_name": "Laundry Pods Pack",
                    "item_price": Decimal("6.90"),
                    "item_quantity": 20,
                    "item_description": "Unopened laundry pods for hall laundry runs.",
                    "item_image": "store_products/Screenshot_2026-07-15_010050.png",
                },
                {
                    "item_name": "Foldable Room Chair",
                    "item_price": Decimal("18.00"),
                    "item_quantity": 5,
                    "item_description": "Compact chair for dorm rooms and study corners.",
                    "item_image": "store_products/Chair.jpeg",
                },
            ],
        },
        {
            "username": "com_corner",
            "store_name": "COM Corner Tech",
            "description": "Useful tech accessories for coding, projects, and presentations.",
            "category": "Electronics",
            "store_image": "store_image/ImageOfKeyboard.jpg",
            "location_name": "COM3",
            "latitude": 1.2949,
            "longitude": 103.7739,
            "products": [
                {
                    "item_name": "Wireless Keyboard",
                    "item_price": Decimal("18.00"),
                    "item_quantity": 7,
                    "item_description": "Lightweight keyboard for laptop desk setups.",
                    "item_image": "store_products/Fantastic_Jofo.png",
                },
                {
                    "item_name": "Portable Printer Access",
                    "item_price": Decimal("3.00"),
                    "item_quantity": 25,
                    "item_description": "Pay-per-use quick printing for notes and submissions.",
                    "item_image": "store_products/Fantastic_Jofo_DqBP8DR.png",
                },
            ],
        },
    ]

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=len(self.sample_stores),
            help="Number of stores to create.",
        )
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing store orders, products, and stores before seeding.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        count = options["count"]

        if count < 1:
            raise CommandError("--count must be at least 1.")

        if options["reset"]:
            ShopOrder.objects.all().delete()
            ShopProduct.objects.all().delete()
            Shop.objects.all().delete()
            self.stdout.write(self.style.WARNING("Deleted existing stores and store orders."))

        created_stores = 0
        created_products = 0

        for index in range(count):
            sample = self.sample_stores[index % len(self.sample_stores)]
            username = sample["username"] if index < len(self.sample_stores) else f"{sample['username']}_{index + 1}"
            store_name = sample["store_name"] if index < len(self.sample_stores) else f"{sample['store_name']} {index + 1}"

            owner, _ = User.objects.get_or_create(
                username=username,
                defaults={"email": f"{username}@example.com"},
            )
            category, _ = Categories.objects.get_or_create(name=sample["category"])

            shop = Shop.objects.create(
                owner=owner,
                store_name=store_name,
                description=sample["description"],
                category=category,
                is_open=True,
                store_image=sample["store_image"],
                location_name=sample["location_name"],
                latitude=sample["latitude"],
                longitude=sample["longitude"],
            )
            created_stores += 1

            products = [
                ShopProduct(
                    shop=shop,
                    item_name=product["item_name"],
                    item_price=product["item_price"],
                    item_quantity=product["item_quantity"],
                    item_description=product["item_description"],
                    item_image=product["item_image"],
                )
                for product in sample["products"]
            ]
            ShopProduct.objects.bulk_create(products)
            created_products += len(products)

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {created_stores} clean store(s) with {created_products} product(s)."
            )
        )
