from django.contrib import admin
from .models import Department, Course, Student

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'department', 'credits')

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'roll_number', 'email', 'course', 'department')
    search_fields = ('first_name', 'last_name', 'roll_number', 'email')
    list_filter = ('department', 'course')
