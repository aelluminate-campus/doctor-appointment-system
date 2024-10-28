from django.urls import path
from base import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('',views.getRoutes,name="getRoutes"),
    # !!USERS
    path('users/register/',views.registerUser,name='register'),
    path('users/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/profile/',views.getUserProfile,name="getUserProfiles"),
    path('users/',views.getUsers,name="getUsers"),
    path('users/profile/update/', views.updateUserProfile, name="user-profile-update"),
    path('users/<str:pk>/', views.getUserById, name='user'),
    path('users/update/<str:pk>/', views.updateUser, name='user-update'),
    path('users/delete/<str:pk>/', views.deleteUser, name='user-delete'),
    # !!PRODUCTS
    path('products/',views.getProducts,name="getProducts"),
    path('products/<str:pk>',views.getProduct,name="getProduct"),
    # !!ORDERS
    path('orders/', views.getOrders, name='orders'),
    path('orders/add/', views.addOrderItems, name='orders-add'),
    path('orders/myorders/', views.getMyOrders, name='myorders'),
    path('orders/<str:pk>/deliver/', views.updateOrderToDelivered, name='order-delivered'),
    path('orders/<str:pk>/', views.getOrderById, name='user-order'),
    path('orders/<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    # !!DOCTORS
    path('doctors/', views.getAllDoctors, name='get-all-doctors'),
    path('doctors/<str:pk>/', views.getDoctorDetail, name='get-doctor-detail'),
    # !!APPOINTMENTS
    path('appointments/create/', views.create_appointment, name='create-appointment'),
    path('appointments/', views.UserAppointmentsView.as_view(), name='user-appointments'),
    path('appointments/doctor/', views.DoctorAppointmentsView.as_view(), name='doctor-appointments'),
    path('appointments/<int:pk>/', views.getAppointmentById, name='appointment-detail'),
    path('appointments/<int:pk>/pay/', views.updateAppointmentToPaid, name='appoinment-pay'),
    path('appointments/<int:pk>/review/', views.updateAppointmentToReviewed, name='appointment-review'),
    # !!DOCTORS & APPOINTMENTS
    path('doctors/<str:pk>/create-reviews/',views.createDoctorReview,name="create-doctor-review"),
    path('doctors/<int:doctor_id>/reviews/', views.doctor_review_list, name='doctor-reviews'),
    path('appointments/doctor/update/', views.DoctorUpdateAppointmentsView.as_view(), name='doctor-appointment-update'),
    path('appointments/doctor/consulted-update/', views.DoctorUpdateStatusToConsultedView.as_view(), name='doctor-appointment-consulted-update'),
    path('appointments/<int:appointment_id>/elapsed_time/', views.save_elapsed_time, name='save_elapsed_time'),
    # !!SEARCH
    path('search/', views.search_api, name='search_api'),

]
