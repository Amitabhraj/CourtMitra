from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AppStudent', '0001_initial'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='application',
            constraint=models.UniqueConstraint(
                fields=('student', 'internship'),
                name='unique_student_internship_application',
            ),
        ),
    ]
