from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from listings.models import Categories, Listing, ListingItem, Order


class Command(BaseCommand):
    help = "Create clean filler open-market listings for local development."

    sample_listings = [
        {
            "item_name": "Logitech Keyboard",
            "item_price": Decimal("18.00"),
            "item_quantity": 4,
            "item_description": "Wireless keyboard suitable for laptop setups, coding sessions, and project work.",
            "category": "Electronics",
            "image": "listings/Keyboard.jpg",
            "location_name": "COM3",
            "latitude": 1.2949,
            "longitude": 103.7739,
        },
        {
            "item_name": "USB-C Multiport Adapter",
            "item_price": Decimal("16.00"),
            "item_quantity": 3,
            "item_description": "Compact adapter for presentations, external displays, and group projects.",
            "category": "Electronics",
            "image": "listings/Electronics.png",
            "location_name": "Central Library",
            "latitude": 1.2966,
            "longitude": 103.7732,
        },
        {
            "item_name": "3D Printer",
            "item_price": Decimal("25.00"),
            "item_quantity": 2,
            "item_description": "Portable printer useful for project submissions, worksheets, and quick handouts.",
            "category": "Electronics",
            "image": "listings/Printer.webp",
            "location_name": "UTown Residence",
            "latitude": 1.3048,
            "longitude": 103.7739,
        },
        {
            "item_name": "CS1010S Notes Bundle",
            "item_price": Decimal("4.00"),
            "item_quantity": 8,
            "item_description": "Printed lecture notes, recap sheets, and practice question summaries.",
            "category": "Academics",
            "image": "listings/Academics.png",
            "location_name": "Central Library",
            "latitude": 1.2966,
            "longitude": 103.7732,
        },
        {
            "item_name": "React Workshop Print Pack",
            "item_price": Decimal("5.00"),
            "item_quantity": 10,
            "item_description": "Printable notes and exercises for frontend workshops.",
            "category": "Academics",
            "image": "listings/React_Logo_SVG.svg.png",
            "location_name": "COM1",
            "latitude": 1.2940,
            "longitude": 103.7730,
        },
        {
            "item_name": "Foldable Floor Chair",
            "item_price": Decimal("18.00"),
            "item_quantity": 3,
            "item_description": "Lightly used floor chair for compact hostel rooms and late-night study sessions.",
            "category": "Furniture",
            "image": "listings/Chair.jpeg",
            "location_name": "Ridge View Residential College",
            "latitude": 1.2977,
            "longitude": 103.7767,
        },
        {
            "item_name": "Monitor Stand",
            "item_price": Decimal("12.00"),
            "item_quantity": 4,
            "item_description": "Simple desk riser for a laptop or monitor, with space underneath for notes.",
            "category": "Furniture",
            "image": "listings/Furniture.png",
            "location_name": "COM3",
            "latitude": 1.2949,
            "longitude": 103.7739,
        },
        {
            "item_name": "Hall Laundry Starter Kit",
            "item_price": Decimal("9.90"),
            "item_quantity": 6,
            "item_description": "Detergent pods and small laundry essentials for move-in week.",
            "category": "Dorm Living",
            "image": "listings/Detergent_Pod.jpg",
            "location_name": "Sheares Hall",
            "latitude": 1.2912,
            "longitude": 103.7746,
        },
        {
            "item_name": "Desk Lamp",
            "item_price": Decimal("8.00"),
            "item_quantity": 5,
            "item_description": "Compact study lamp in good condition, useful for hostel desks.",
            "category": "Dorm Living",
            "image": "listings/Dorm.png",
            "location_name": "PGPR",
            "latitude": 1.2916,
            "longitude": 103.7808,
        },
        {
            "item_name": "Spiderman Hoodie",
            "item_price": Decimal("22.00"),
            "item_quantity": 2,
            "item_description": "Comfortable hoodie for cool lecture theatres and study nights.",
            "category": "Fashion",
            "image": "listings/Hoodie.jpg",
            "location_name": "Kent Ridge MRT",
            "latitude": 1.2942,
            "longitude": 103.7849,
        },
        {
            "item_name": "Pastries Box",
            "item_price": Decimal("5.50"),
            "item_quantity": 7,
            "item_description": "Assorted pastries for a quick campus snack or group meeting.",
            "category": "Food",
            "image": "listings/Pastries.jpeg",
            "location_name": "The Deck",
            "latitude": 1.2948,
            "longitude": 103.7720,
        },
        {
            "item_name": "Peer Tutoring Session",
            "item_price": Decimal("15.00"),
            "item_quantity": 6,
            "item_description": "One-hour introductory help session for coding assignments or math revision.",
            "category": "Services & Collaboration",
            "image": "listings/Service.png",
            "location_name": "Education Resource Centre",
            "latitude": 1.3050,
            "longitude": 103.7723,
        },
    ]

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            default="demo_seller",
            help="User that owns the seeded listings. Created if missing.",
        )
        parser.add_argument(
            "--count",
            type=int,
            default=len(self.sample_listings),
            help="Number of filler listings to create.",
        )
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing listing orders, listing items, and listings before seeding.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        count = options["count"]
        username = options["username"]

        if count < 1:
            raise CommandError("--count must be at least 1.")

        if options["reset"]:
            Order.objects.all().delete()
            ListingItem.objects.all().delete()
            Listing.objects.all().delete()
            self.stdout.write(self.style.WARNING("Deleted existing listings and listing orders."))

        user, user_created = User.objects.get_or_create(
            username=username,
            defaults={"email": f"{username}@example.com"},
        )

        created_count = 0
        for index in range(count):
            sample = self.sample_listings[index % len(self.sample_listings)]
            category, _ = Categories.objects.get_or_create(name=sample["category"])
            suffix = "" if index < len(self.sample_listings) else f" {index + 1}"

            listing = Listing.objects.create(
                user=user,
                item_name=f"{sample['item_name']}{suffix}",
                item_price=sample["item_price"],
                item_quantity=sample["item_quantity"],
                item_description=sample["item_description"],
                category=category,
                image=sample["image"],
                location_name=sample["location_name"],
                latitude=sample["latitude"],
                longitude=sample["longitude"],
            )

            ListingItem.objects.bulk_create(
                ListingItem(listing=listing) for _ in range(sample["item_quantity"])
            )
            created_count += 1

        if user_created:
            self.stdout.write(self.style.SUCCESS(f"Created user '{username}'."))

        self.stdout.write(
            self.style.SUCCESS(f"Created {created_count} clean listing(s) for '{username}'.")
        )
