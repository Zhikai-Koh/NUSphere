# serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    # Ensure the password fields are write-only so they don't get returned in JSON responses for security reasons so that da hashed user passwords not sent back to frontend
    #instead oni the id username and email will be sent back as response
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    

    class Meta:
        model = User
        fields = ('username', 'password', 'password_confirm', 'email')

    def validate(self, inputs):
        # Double check that both passwords entered match perfectly
        if inputs['password'] != inputs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields must match."})
        return inputs

    def create(self, validated_data):
        # Create the user using Django's special create_user method to handle password hashing
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user
    
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'email', 'profile_picture']