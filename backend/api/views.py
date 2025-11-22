from rest_framework import generics,viewsets
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import CustomUser,Resume,ResumeAnalysis
from .serializers import CustomUserSerializer,ResumeSerializer,ResumeAnalysisSerializer
from rest_framework.parsers import FormParser,MultiPartParser
from .utils.cache_resumes import get_cached_analysis,set_analysis_in_cache
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

    def retrieve(self, request, *args, **kwargs):
        resume_analysis = self.get_object()

        ## Veryfing if it's in cache already
        cached_data = get_cached_analysis(resume_id=resume_analysis.id)
        if cached_data:
            print('CACHED HIT, retriving data from cache')
            return Response(cached_data)
        
        ### If it s not in cache
        serializer = self.get_serializer(resume_analysis)

        ## save the analysis in redis:
        set_analysis_in_cache(resume_analysis.id,serializer.data)

        return Response(serializer.data)
