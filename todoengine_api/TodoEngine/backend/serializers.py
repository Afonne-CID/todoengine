from django.contrib.auth import password_validation
from django.contrib.auth.models import User, Group
from rest_framework import serializers
from TodoEngine.backend.models import Task, Category


class UserSerializer(serializers.HyperlinkedModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'password', 'groups']

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'url', 'name', 'user']

    def create(self, validated_data):
        user = self.context['request'].user
        category = Category.objects.create(user=user, **validated_data)
        return category
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        instance.user = user
        return super().update(instance, validated_data)
    

class TaskSerializer(serializers.HyperlinkedModelSerializer):

    category = CategorySerializer(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'url', 'title', 'description', 'completed', 'category', 'user']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super(TaskSerializer, self).create(validated_data)
    
    def update(self, instance, validated_data):
        user = self.context['request'].user 
        instance.user = user
        return super().update(instance, validated_data)
