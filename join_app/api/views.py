from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from join_app.models import User, Contact, Task
from .serializers import UserSerializer, ContactSerializer, TaskSerializer


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact = serializer.save()

        user_id = request.data.get("userId")
        if user_id:
            try:
                user = User.objects.get(id=user_id)
                user.contacts.add(contact)
                user.save()
            except User.DoesNotExist:
                return Response(
                    {"detail": "User with given ID not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

   # Deine 'create' Methode in der UserViewSet
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
    
        # Hole alle existierenden User, aber schließe den aktuellen User aus
        other_users = User.objects.exclude(id=user.id)
    
        # Füge alle anderen User als Kontakte zum neuen User hinzu
        for other_user in other_users:
            user.contacts.add(other_user)  # Füge das ganze User-Objekt hinzu
            other_user.contacts.add(user)  # Füge den neuen User zu anderen Usern hinzu
            other_user.save()  # Speichern der Änderungen im anderen User
    
        user.save()  # Speichern der Änderungen im neuen User
    
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()

        user_id = request.data.get("userId")
        if user_id:
            try:
                user = User.objects.get(id=user_id)
                user.tasks.add(task)
                user.save()
            except User.DoesNotExist:
                return Response(
                    {"detail": "User with given ID not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

        return Response(serializer.data, status=status.HTTP_201_CREATED)
