from django.urls import path, include

from .views import ResumeViewSet as RVS
from .views import ResumeAnalyzerViewSet as RAVS

from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('analysis',RAVS,basename='analysis')

urlpatterns = [
    path('resumes/', RVS.as_view(), name='upload_resume'),
    path('', include(router.urls)),
]
