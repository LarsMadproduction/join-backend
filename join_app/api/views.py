from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from join_app.models import User, Task
from .serializers import UserSerializer, TaskSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        other_users = User.objects.exclude(id=user.id)

        for other_user in other_users:
            user.contacts.add(other_user)  
            other_user.contacts.add(user)  
            other_user.save()  

        user.save()  

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
