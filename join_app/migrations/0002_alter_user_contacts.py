# Generated by Django 5.1.7 on 2025-03-28 11:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('join_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='contacts',
            field=models.ManyToManyField(blank=True, default=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], related_name='users', to='join_app.contact'),
        ),
    ]
