from django.db import models

class User(models.Model):
    color = models.CharField(max_length=10, default='#ffffff')
    email = models.EmailField(unique=True)
    initials = models.CharField(max_length=5)
    name = models.CharField(max_length=255)
    contacts = models.ManyToManyField('self', related_name="users", blank=True, symmetrical=False)
    tasks = models.ManyToManyField('Task', related_name="users", blank=True)
    password = models.CharField(max_length=255, default=None)
    phone = models.CharField(max_length=20, blank=True, null=True)

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

    assigned = models.ManyToManyField(User, related_name="tasks", blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    date = models.DateField()
    userId = models.CharField(max_length=50, default=None)
    description = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    title = models.CharField(max_length=255)
    subtasks = models.JSONField(default=list)

    def __str__(self):
        return self.title
