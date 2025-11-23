from rest_framework.throttling import UserRateThrottle


class ResumeUploadThrotleBurst(UserRateThrottle):
    scope = 'resume_upload_burst'

class ResumeUploadThrotleSustained(UserRateThrottle):
    scope = 'resume_upload_sustained'