from rest_framework import serializers
from .models import CustomUser


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