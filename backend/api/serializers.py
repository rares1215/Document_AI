from rest_framework import serializers
from .models import CustomUser,Resume,ResumeAnalysis
from .utils.get_hash_text import hash_text,extract_text_from_file


class CustomUserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(max_length=100,write_only=True)
    class Meta:
        model = CustomUser
        fields = [
            'id',
            'email',
            'username',
            'password',
            'password2',
        ]
        extra_kwargs = {'password':{'write_only':True}}

    ### check the password length ###
    def validate_password(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Password is too short.")
        return value
    
    ### check if both passwords match ###
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Both passwords must match.'})
        return attrs
        
    ### check if the user inputs an existing email ###

    def validate_email(self,value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Account already exists with that email.")
        return value

    
    #### eliminate password2 because it s not part of our model and then create our user
    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user
    

### Serialzer for the Resume Model
class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'user', 'doc_file', 'text', 'created_at']
        read_only_fields = ['user', 'text', 'created_at']

    
    #### checking if a resume is already in the system##
    def validate(self, attrs):
        ### getting the current file that we are uploading #
        curr_file = attrs['doc_file']
        if curr_file:
            ### extracting the text from the file
            curr_text = extract_text_from_file(curr_file)
            ### hashing the text ###
            hash_curr_text = hash_text(curr_text)

            ## chech in db if the file already exists##
            if Resume.objects.filter(text_hash=hash_curr_text).exists():
                raise serializers.ValidationError(
                    {"doc_file": "This Resume already exists."}
                )
            ## setting the text_hash atribute from the model to the hash_text of the current file if the file is not already in
            attrs['text_hash'] = hash_curr_text
        return attrs

### Serializer for the ResumeAnalysis model
class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = [
            "id",
            "resume",
            "skills",
            "experience_summary",
            "match_score",
            "suggestions",
            "raw_llm_res",
            "created_at",
        ]
        read_only_fields = fields