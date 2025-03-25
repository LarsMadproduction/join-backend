from django.db import models

class Contact(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    color = models.CharField(max_length=255)
    initials = models.CharField(max_length=2)

    def __str__(self):
        return self.name

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    assigned_to = models.ManyToManyField(Contact, related_name="tasks", blank=True)
    due_date = models.DateField()
    status = models.CharField(max_length=255, default="todo")
    priority = models.CharField(max_length=255)
    category = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class Subtask(models.Model):
    subTaskName = models.CharField(max_length=255)
    done = models.BooleanField(default=False)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="subtasks", blank=True, null=True)
    

    def __str__(self):
        return self.subTaskName
