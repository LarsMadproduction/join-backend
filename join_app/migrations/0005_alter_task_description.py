# Generated by Django 5.1.7 on 2025-03-27 10:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('join_app', '0004_remove_user_password_remove_user_phone_user_tasks_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='description',
            field=models.TextField(default=''),
        ),
    ]
