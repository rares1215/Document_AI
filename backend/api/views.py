from django.shortcuts import render
from rest_framework import generics,viewsets,status
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import CustomUser,Resume,ResumeAnalysis
from .serializers import CustomUserSerializer,ResumeSerializer,ResumeAnalysisSerializer
from rest_framework.parsers import FormParser,MultiPartParser
from rest_framework.decorators import action
from .services.extract_pdf import extract_text_from_pdf
from .services.llm_analyzer import analyze_resume_with_llm
from rest_framework.response import Response

# Create your views here.



#### Creating the Register User view
class RegisterUserViewSet(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]


### The resume view set use for adding and listing the resumes 

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all().order_by("-created_at")
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [FormParser,MultiPartParser]

    def perform_create(self, serializer):
        user = self.request.user
        return serializer.save(user=user)
    
    
#### Resume analysis view set for listing and getting the analyze of the resume ####    
class ResumeAnalyzerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResumeAnalysis.objects.all()
    serializer_class = ResumeAnalysisSerializer
    permission_classes = [IsAuthenticated]