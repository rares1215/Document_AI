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


### The resume view set use for adding,listing and visualize the resumes
class ResumeViewSet (viewsets.ModelViewSet):
    queryset = Resume.objects.all().order_by('-created_at')
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (FormParser,MultiPartParser)


    ### override perform create to set the current user to the user that is uploading the file

    def perform_create(self, serializer):
        user = self.request.user
        resume = serializer.save(user=user)

        ### we get the text from the pdf
        text = extract_text_from_pdf(resume.file.path)
        resume.text = text
        resume.save()

        ### we analyze the text with our llm
        ai_data = analyze_resume_with_llm(text)

        ### create the analyze object
        ResumeAnalysis.objects.create(
            resume=resume,
            skills=ai_data.get("skills", []),
            experience_summary=ai_data.get("experience_summary", ""),
            match_score=ai_data.get("match_score", 0),
            suggestions=ai_data.get("suggestions", ""),
            raw_llm_response=ai_data,
        )

        return resume
    ## Over ride create to return the analysis directly
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume = self.perform_create(serializer)

        # We get the correct analysis
        analysis = resume.analysis
        analysis_serializer = ResumeAnalysisSerializer(analysis)

        headers = self.get_success_headers(serializer.data)
        return Response(
            analysis_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )
