from django.contrib import admin
from django.urls import path,include
## import the tokenObatin and token refresh views 
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api.views import RegisterUserViewSet
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),
    ## Paths for the obtain and refresh tokens ##
    path("api/token/", TokenObtainPairView.as_view(),name='access_token'),
    path("api/token/refresh/", TokenRefreshView.as_view(), name='refresh_token'),
    ### Url for the register User ##
    path("api/register/", RegisterUserViewSet.as_view(), name='register_user'),
    path('api/', include('api.urls')),
    path('silk/', include("silk.urls", namespace='silk')),  
]




if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)