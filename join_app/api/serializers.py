from rest_framework import serializers
from join_app.models import User, Task


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'color', 'email', 'initials', 'name', 'contacts', 'tasks', 'phone', 'password']
        read_only_fields = ['id']

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    def update(self, instance, validated_data):
        if "password" in validated_data:
            instance.set_password(validated_data["password"])
        return super().update(instance, validated_data)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
