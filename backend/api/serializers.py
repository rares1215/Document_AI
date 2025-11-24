from rest_framework import serializers
from .models import CustomUser,Resume,ResumeAnalysis
from .utils.get_hash_text import hash_text,extract_text_from_file
import re



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

    
    #### validation logic for when we upload the resume.

    def validate(self, attrs):
        ### getting the current file that we are uploading #
        curr_file = attrs['doc_file']

        MAX_SIZE = 5 *1024*1024 ### the maximum size we accept for a pdf file
        ## check if the file is of valid size if not raise an error
        if curr_file.size > MAX_SIZE:
            raise serializers.ValidationError({"doc_file": f"The pdf file is to big (max:{MAX_SIZE // (1024 * 1024)} MB)"})

        if curr_file:
            ### extracting the text from the file
            curr_text = extract_text_from_file(curr_file)

            ### check if the pdf is valid if not raise an error##
            if not curr_text:
                raise serializers.ValidationError({"doc_file": "the pdf file is corrupt or it can't be read."})
            
            ### check if the pdf is a valid resume format using regular expresions if not raise an error
            cv_keywords = [
            r"experience", r"work history", r"employment",
            r"education", r"studies", r"university",
            r"skills", r"technologies",
            r"projects", r"personal projects"
            ]

            matches = sum(1 for kw in cv_keywords if re.search(kw, curr_text, re.IGNORECASE))

            if matches < 2:
                raise serializers.ValidationError({
                " doc_file": "This PDF does not appear to be a valid CV format."
            })
            
            ### hashing the text ###
            hash_curr_text = hash_text(curr_text)

            ## chech in db if the file already exists if it does raise an error##
            if Resume.objects.filter(text_hash=hash_curr_text).exists():
                raise serializers.ValidationError(
                    {"doc_file": "This Resume already exists."}
                )
            ## setting the text_hash atribute from the model to the hash_text of the current file if the file is not already in
            attrs['text_hash'] = hash_curr_text
        return attrs
    
    ### We want to keep only 10 resumes and analyses for user in our data base so we don't populate it with ussles resumes that we are never gonna use again
    def create(self, validated_data):
        # get the logged in user from context
        user = self.context['request'].user

        ### get all the user analyses and order them by latest
        analyses = ResumeAnalysis.objects.filter(resume__user = user).order_by("-created_at")

        ### check if the user has more then 10 analyses
        if analyses.count() >=10:
            ### if it is then we are deleting the oldest resume from the db
            oldest_analysis = analyses.last()
            oldest_resume = oldest_analysis.resume
            print(f"Deleting the oldes resume + analysis{oldest_resume.id}")
            ## we are deleting only the resume because the analysis will be delete automatically by the cascading efect in our model
            oldest_resume.delete()

        resume = Resume.objects.create(**validated_data)
        return resume


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