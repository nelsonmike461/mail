# Generated by Django 5.1.2 on 2024-10-19 14:16

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='email',
            name='recipients',
            field=models.ManyToManyField(related_name='emails_received', to=settings.AUTH_USER_MODEL),
        ),
    ]
