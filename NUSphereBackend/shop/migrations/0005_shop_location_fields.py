from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0004_alter_shop_owner'),
    ]

    operations = [
        migrations.AddField(
            model_name='shop',
            name='latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='shop',
            name='location_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='shop',
            name='longitude',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
