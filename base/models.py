from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=255, blank=True, null=True)
    license_number = models.CharField(max_length=255, unique=True, blank=True, null=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    available = models.BooleanField(default=True) 
    description = models.TextField(blank=True, null=True) 
    max_appointments = models.PositiveIntegerField(default=1) 
    image=models.ImageField(null=True,blank=True)
    # _id=models.AutoField(primary_key=True,editable=False)
    rating=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    numReviews=models.IntegerField(null=True,blank=True,default=0)
    charge_rates = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.user.first_name
    
    def get_full_name(self):
        return f"{self.user.first_name} {self.user.last_name}".strip()
    
class Appointment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) 
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)  
    appointment_time = models.DateTimeField() 
    created_at = models.DateTimeField(auto_now_add=True) 
    status = models.CharField(max_length=50, default='Pending')  
    google_meet_link = models.URLField(blank=True, null=True)
    isPaid=models.BooleanField(default=False)
    paidAt=models.DateTimeField(auto_now_add=False,null=True,blank=True)
    isReviewed=models.BooleanField(default=False)
    # price=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    elapsed_time = models.DurationField(null=True, blank=True)
    chargeisPaid = models.BooleanField(default=False)

    def __str__(self):
        return f'Appointment with {self.doctor.user.first_name} on {self.appointment_time}'
    
    def __str__(self):
        return f"Appointment for {self.user} with {self.doctor}"
    
class Product(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.SET_NULL,null=True)
    name=models.CharField(max_length=200,null=True,blank=True)
    image=models.ImageField(null=True,blank=True)
    brand=models.CharField(max_length=200,null=True,blank=True)
    category=models.CharField(max_length=200,null=True,blank=True)
    description=models.TextField(null=True,blank=True)
    rating=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    numReviews=models.IntegerField(null=True,blank=True,default=0)
    price=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    countInStock=models.IntegerField(null=True,blank=True,default=0)
    createdAt=models.DateTimeField(auto_now_add=True)
    _id=models.AutoField(primary_key=True,editable=False)

    def __str__(self):
        return self.name

# class Review(models.Model):
#     product=models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
#     user=models.ForeignKey(CustomUser,on_delete=models.SET_NULL,null=True)
#     name=models.CharField(max_length=200,null=True,blank=True)
#     rating=models.IntegerField(null=True,blank=True,default=0)
#     comment=models.TextField(null=True,blank=True)
#     _id=models.AutoField(primary_key=True,editable=False)

#     def __str__(self):
#         return str(self.rating)
        
class DoctorReview(models.Model):
    doctor=models.ForeignKey(Doctor,on_delete=models.SET_NULL,null=True, related_name='reviews')
    user=models.ForeignKey(CustomUser,on_delete=models.SET_NULL,null=True)
    name=models.CharField(max_length=200,null=True,blank=True)
    rating=models.IntegerField(null=True,blank=True,default=0)
    comment=models.TextField(null=True,blank=True)
    _id=models.AutoField(primary_key=True,editable=False)
    createdAt=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review by {self.user.first_name} for Dr. {self.doctor.get_full_name()}'


class Order(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.SET_NULL,null=True)
    paymentMethod=models.CharField(max_length=200,null=True,blank=True)
    taxPrice=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    shippingPrice=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    totalPrice=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    isPaid=models.BooleanField(default=False)
    paidAt=models.DateTimeField(auto_now_add=False,null=True,blank=True)
    isDelivered=models.BooleanField(default=False)
    deliveredAt=models.DateTimeField(auto_now_add=False,null=True,blank=True)
    createdAt=models.DateTimeField(auto_now_add=True)
    _id=models.AutoField(primary_key=True,editable=False)
    
    
    def __str__(self):
        return str(self.createdAt)


class OrderItem(models.Model):
    product=models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    order=models.ForeignKey(Order,on_delete=models.SET_NULL,null=True)
    name=models.CharField(max_length=200,null=True,blank=True)
    qty=models.IntegerField(null=True,blank=True,default=0)
    price=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    image=models.CharField(max_length=200,null=True,blank=True)
    _id=models.AutoField(primary_key=True,editable=False)

        
    def __str__(self):
        return self.name

class ShippingAddress(models.Model):
    order=models.OneToOneField(Order,on_delete=models.CASCADE,null=True,blank=True)
    address=models.CharField(max_length=200,null=True,blank=True)
    city=models.CharField(max_length=200,null=True,blank=True)
    postalCode=models.CharField(max_length=200,null=True,blank=True)
    country=models.CharField(max_length=200,null=True,blank=True)
    shippingPrice=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    _id=models.AutoField(primary_key=True,editable=False)

    def __str__(self):
        return self.address