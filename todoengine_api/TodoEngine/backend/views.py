from django.contrib.auth.models import User, Group
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login as auth_login
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from TodoEngine.backend.models import Category, Task
from TodoEngine.backend.serializers import (
    UserSerializer,
    GroupSerializer,
    CategorySerializer,
    TaskSerializer)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        auth_login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "detail": "Login successful"}, status=status.HTTP_200_OK)
    else:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        group = Group.objects.filter(name='free').first()
        if not group:
            group = Group.objects.create(name='free')
        serializer.instance.groups.add(group)
        serializer.instance.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all() 
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('user')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('created_at')
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            user = self.request.user
            completed = self.request.query_params.get('completed', None)
            if completed is not None:
                completed = completed.lower() == 'true'
                return Task.objects.filter(user=user, completed=completed).order_by('created_at')
            return Task.objects.filter(user=user).order_by('created_at')
        except Exception as e:
            print(e)
            raise e

    def create(self, serializer):
        user = self.request.user
        category_value = self.request.data.get('category', None)
        category, _ = Category.objects.get_or_create(name='default', user=user)
        if category_value:
            try:
                category_id = int(category_value)
                category = Category.objects.get(pk=category_id)
            except ValueError:
                category, _ = Category.objects.get_or_create(name=category_value, user=user)
            except Exception as e:
                raise e

        serializer = self.get_serializer(data=self.request.data)

        if serializer.is_valid():
            serializer.save(user=user, category=category)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print("Serializer errors:", serializer.errors)  # Add this line
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)