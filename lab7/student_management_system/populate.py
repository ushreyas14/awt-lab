import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_management.settings')
django.setup()

from django.contrib.auth.models import User
from students.models import Department, Course, Student

def populate():
    print("Populating data...")
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin_password')
        print("Created superuser 'admin' with password 'admin_password'")

    if Department.objects.count() == 0:
        cse = Department.objects.create(name='Computer Science')
        me = Department.objects.create(name='Mechanical Engineering')
        
        btech_cse = Course.objects.create(name='B.Tech CSE', department=cse, credits=160)
        mtech_cse = Course.objects.create(name='M.Tech CSE', department=cse, credits=80)
        
        Student.objects.get_or_create(
            first_name='Jeenil',
            last_name='Makwana',
            roll_number='23BCP013',
            email='jeenil@gmail.com',
            department=cse,
            course=btech_cse
        )
        Student.objects.get_or_create(
            first_name='Neel',
            last_name='Godhaniya',
            roll_number='23BCP023',
            email='neel@egmail.com',
            department=cse,
            course=btech_cse
        )
        print("Initial Department, Course, and Student data populated.")
    else:
        print("Data already populated.")

if __name__ == '__main__':
    populate()
