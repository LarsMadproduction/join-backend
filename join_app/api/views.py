from rest_framework import viewsets
from join_app.models import Contact, Task, Subtask
from .serializers import ContactSerializer, TaskSerializer, SubtaskSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class SubtaskViewSet(viewsets.ModelViewSet):
    queryset = Subtask.objects.all()
    serializer_class = SubtaskSerializer
