from django.db import models
from rest_framework import serializers
from django.contrib.auth.models import User
from base.models import DoctorReview, Appointment, Doctor, Product, CustomUser, Order, OrderItem, ShippingAddress
from rest_framework_simplejwt.tokens import RefreshToken




class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=User
#         fields=['id','username','email']
        
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    email = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', '_id', 'email', 'name', 'isAdmin']

    def get_name(self, obj):
        name = obj.first_name
        if name == "":
            name = obj.email
        return name

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff
    
    def get_email(self, obj):
        return obj.email

class UserSerializerWithToken(UserSerializer):
    access = serializers.SerializerMethodField(read_only=True)
    refresh = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name', 'isAdmin', 'access', 'refresh']

    def get_access(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

    def get_refresh(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token)

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(
                obj.shippingaddress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data

class DoctorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'user', 'specialization', 'license_number']



class AppointmentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)  
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True) 
    fee = serializers.DecimalField(max_digits=10, decimal_places=2, source='doctor.fee', read_only=True) 
    doctorId = serializers.IntegerField(source='doctor.id', read_only=True)  # Include doctor ID
    charge_rate = serializers.DecimalField(max_digits=10, decimal_places=2, source='doctor.charge_rates', read_only=True) 
    userofdoctorId = serializers.IntegerField(source='doctor.user.id', read_only=True)
    class Meta:
        model = Appointment
        fields = ['userofdoctorId', 'chargeisPaid', 'charge_rate', 'elapsed_time', 'id', 'user_name', 'doctor_name', 'doctorId', 'appointment_time', 'status', 'google_meet_link', 'isPaid', 'paidAt', 'fee'] 

class DoctorReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)  
    class Meta:
        model = DoctorReview
        fields = ['createdAt', 'user_name', '_id', 'doctor', 'user', 'name', 'rating', 'comment']

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer() 
    reviews = DoctorReviewSerializer(many=True, read_only=True)
    
    class Meta:
        model = Doctor
        fields = '__all__'