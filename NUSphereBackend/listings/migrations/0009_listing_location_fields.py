from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0008_order_order_status_alter_order_listingitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='listing',
            name='location_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='listing',
            name='longitude',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
