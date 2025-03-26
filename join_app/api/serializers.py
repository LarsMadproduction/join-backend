from rest_framework import serializers
from join_app.models import Contact, Task, Subtask

class ContactSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contact
        fields = '__all__'
    
class SubtaskSerializer(serializers.ModelSerializer):
    subId = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = Subtask
        fields = ['subId', 'subTaskName', 'done', 'task'] 

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=Contact.objects.all(), many=True
    )
    subtasks = serializers.PrimaryKeyRelatedField(
        queryset=Subtask.objects.all(), many=True, required=False
    )
    class Meta:
        model = Task
        fields = '__all__'
