from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import CustomUser
from .serializers import CustomUserSerializer
# Create your views here.



#### Creating the Register User view
class RegisterUserViewSet(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]