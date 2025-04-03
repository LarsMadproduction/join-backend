from rest_framework import serializers
from join_app.models import User, Task

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'color', 'email', 'initials', 'name', 'contacts', 'tasks', 'phone']
        read_only_fields = ['id']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
