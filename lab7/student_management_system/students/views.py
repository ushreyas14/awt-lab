from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from .models import Student

class StudentListView(ListView):
    model = Student
    template_name = 'students/student_list.html'
    context_object_name = 'students'

class StudentCreateView(CreateView):
    model = Student
    fields = ['first_name', 'last_name', 'roll_number', 'email', 'department', 'course']
    template_name = 'students/student_form.html'
    success_url = reverse_lazy('student-list')

class StudentUpdateView(UpdateView):
    model = Student
    fields = ['first_name', 'last_name', 'roll_number', 'email', 'department', 'course']
    template_name = 'students/student_form.html'
    success_url = reverse_lazy('student-list')

class StudentDeleteView(DeleteView):
    model = Student
    template_name = 'students/student_confirm_delete.html'
    success_url = reverse_lazy('student-list')
