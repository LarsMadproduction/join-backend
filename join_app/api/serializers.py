from rest_framework import serializers
from join_app.models import User, Contact, Task

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    subtasks = serializers.JSONField()
    class Meta:
        model = Task
        fields = '__all__'