from django.db import models

# Create your models here.
from django.db import models

class Contact(models.Model):
    color = models.CharField(max_length=10)
    email = models.EmailField(unique=True)
    initials = models.CharField(max_length=5)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.name
    
class Task(models.Model):
    CATEGORY_CHOICES = [
        ('Tutorial', 'Tutorial'),
        ('Technical Task', 'Technical Task'),
        ('User Story', 'User Story'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'low'),
        ('medium', 'medium'),
        ('urgent', 'urgent'),
    ]

    STATUS_CHOICES = [
        ('todo', 'todo'),
        ('inprogress', 'inprogress'),
        ('awaitfeedback', 'awaitfeedback'),
        ('done', 'done'),
    ]

    assigned = models.ManyToManyField(Contact, related_name="tasks", blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    title = models.CharField(max_length=255)
    subtasks = models.JSONField(default=list)

    def __str__(self):
        return self.title
    
class User(models.Model):
    USER_COLOR = [('#ffffff', '#ffffff'),]
    color = models.CharField(max_length=10, default='#ffffff', choices=USER_COLOR)
    email = models.EmailField(unique=True)
    initials = models.CharField(max_length=5)
    name = models.CharField(max_length=255)
    contacts = models.ManyToManyField(Contact, related_name="users", blank=True)
    tasks = models.ManyToManyField(Task, related_name="users", blank=True)
    password = models.CharField(max_length=255, default=None)

    def __str__(self):
        return self.name