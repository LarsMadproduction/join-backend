from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


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

    assigned = models.ManyToManyField(
        "User", related_name="assigned_tasks", blank=True)
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


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Die E-Mail-Adresse muss angegeben werden")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=10, default='#ffffff')
    initials = models.CharField(max_length=5)
    phone = models.CharField(max_length=20, blank=True, null=True)
    contacts = models.ManyToManyField(
        "self", related_name="user_contacts", blank=True)
    tasks = models.ManyToManyField(
        "Task", related_name="task_users", blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_groups",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions",
        blank=True
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email
