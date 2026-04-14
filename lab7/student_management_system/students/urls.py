from django.urls import path
from . import views

urlpatterns = [
    path('', views.StudentListView.as_view(), name='student-list'),
    path('add/', views.StudentCreateView.as_view(), name='student-add'),
    path('<int:pk>/edit/', views.StudentUpdateView.as_view(), name='student-update'),
    path('<int:pk>/delete/', views.StudentDeleteView.as_view(), name='student-delete'),
]
