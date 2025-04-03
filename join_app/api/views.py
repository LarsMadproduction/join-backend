from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from join_app.models import User, Task
from .serializers import UserSerializer, TaskSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate


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

        assigned_user_ids = request.data.get("assigned", [])
        for assigned_id in assigned_user_ids:
            try:
                assigned_user = User.objects.get(id=assigned_id)
                assigned_user.tasks.add(task)
                assigned_user.save()
            except User.DoesNotExist:
                return Response(
                    {"detail": f"User with ID {assigned_id} not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

        return Response(serializer.data, status=status.HTTP_201_CREATED)



class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(email=email, password=password)
        if user is None:
            return Response({"error": "Falsche E-Mail oder Passwort"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        tasks = list(user.tasks.values_list("id", flat=True))
        contacts = list(user.contacts.values_list("id", flat=True))

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "color": user.color,
                "initials": user.initials,
                "phone": user.phone,
                "tasks": tasks,
                "contacts": contacts,
            }
        }, status=status.HTTP_200_OK)
