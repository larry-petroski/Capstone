import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { MessageService } from 'primeng/api';

import { Grade } from '../models/grade.model';
import { Student } from '../models/student.model';
import { Teacher } from '../models/teacher.model';
import { GradesService } from '../services/grades.service';
import { StudentsService } from '../services/students.service';
import { TeachersService } from '../services/teachers.service';

@Component({
  selector: 'sr-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css'],
  providers: [MessageService],
})
export class StudentInfoComponent implements OnInit, OnDestroy {
  studentForm!: FormGroup;
  gradesSub!: Subscription;
  grades: Grade[] = [];
  teachers: Teacher[] = [];
  teacherId!: number;
  studentId!: number;
  student!: Student;
  updateExistingStudent: boolean = false;
  currentGrade!: Grade;
  previousGrade!: Grade;
  changedGrade: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private gradesSvc: GradesService,
    private teachersSvc: TeachersService,
    private studentsSvc: StudentsService,
    private msgSvc: MessageService,
    private title: Title
  ) {
    this.route.paramMap.subscribe((pm) => {
      const teacherId = pm.get('teacherid');
      const studentId = pm.get('id');
      if (teacherId) {
        this.teacherId = +teacherId;
      }
      if (studentId) {
        this.studentId = +studentId;
      }
    });

    this.gradesSub = this.gradesSvc.getGrades<Grade[]>().subscribe((grades) => {
      this.grades = grades;
    });

    this.teachersSvc.getAllTeachers().subscribe({
      next: (teachers) => (this.teachers = teachers),
      error: (err) => console.error(err.message),
      complete: () => {},
    });
  }

  ngOnInit(): void {
    const pageTitle = this.title.getTitle();
    this.title.setTitle(`${pageTitle} - Student Info`);
    
    this.studentForm = this.fb.group({
      avatar: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      grade: [null, Validators.required],
      teacher: [{ value: null, disabled: true }],
      phone: [null, Validators.required],
      email: [null, Validators.required],
    });

    if (this.teacherId && this.studentId) {
      this.studentsSvc
        .getStudent(this.teacherId, this.studentId)
        .subscribe((student) => {
          this.student = student;
          this.updateForm();
        });
    }
  }

  updateForm() {
    const name: string[] = this.student.studentName.split(' ');
    const teacher = this.teachers.find((t) => t.teacherId === this.teacherId);

    this.studentForm.patchValue({
      firstName: name[0],
      lastName: name[1],
      grade: teacher?.gradeName,
      teacher: teacher?.teacherName,
      phone: this.student?.studentPhone,
      email: this.student?.studentEmail,
    });

    this.updateExistingStudent = true;
  }

  resetTeacher(event: any) {
    if (event) {
      this.previousGrade = this.currentGrade;
      this.currentGrade = event;
    }

    let teacher = this.teachers.find((t) => t.teacherId === this.teacherId);

    if (this.currentGrade.gradeName !== teacher?.gradeName) {
      this.studentForm.patchValue({
        teacher: null,
      });
      this.changedGrade = true;
    }
  }

  onSubmit(formValues: any) {
    if (!this.updateExistingStudent) {
      let teacher: Teacher = this.getRandomTeacherByGrade();

      const student: Student = {
        studentId: 0,
        studentName: `${formValues['firstName']} ${formValues['lastName']}`,
        studentPhone: formValues['phone'],
        studentEmail: formValues['email'],
      };

      this.studentsSvc.addStudent(teacher.teacherId, student).subscribe({
        next: () => {
          let name = teacher.teacherName.split(' ');
          this.createToastMessage(
            'success',
            'Success!',
            `${student.studentName} has been assigned to ${name[0]} ${name[2]}\'s class`,
            false
          );
        },
        error: (err) => {
          this.createToastMessage(
            'error',
            'Error',
            'Unknown error has occurred! Please try again later.',
            true
          );
          console.error(err.message);
        },
      });
    } else if (this.changedGrade) {
      let teacher = this.getRandomTeacherByGrade();

      const student = {
        studentId: this.student.studentId,
        studentName: `${formValues['firstName']} ${formValues['lastName']}`,
        studentPhone: formValues['phone'],
        studentEmail: formValues['email'],
      };

      const addStudent = this.studentsSvc.addStudent(
        teacher.teacherId,
        student
      );
      const deleteStudent = addStudent.pipe(
        concatMap((teacher) =>
          this.studentsSvc.deleteStudent(this.teacherId, this.studentId)
        )
      );
      deleteStudent.subscribe({
        next: () => {
          let name = teacher.teacherName.split(' ');
          this.createToastMessage(
            'success',
            'Success!',
            `${student.studentName} has been switched to ${name[0]} ${name[2]}'s class.`,
            false
          );
        },
        error: (err) => {
          this.createToastMessage(
            'error',
            'Error',
            'Unknown error has occurred. Please try again later.',
            true
          );
          console.log(err.message);
        },
      });
    } else {
      const student = {
        studentId: this.student.studentId,
        studentName: `${formValues['firstName']} ${formValues['lastName']}`,
        studentPhone: formValues['phone'],
        studentEmail: formValues['email'],
      };

      this.studentsSvc.updateStudent(this.teacherId, student).subscribe({
        next: () => {
          this.createToastMessage(
            'success',
            'Success!',
            `${student.studentName} has been updated.`,
            false
          );
        },
        error: (err) => {
          this.createToastMessage(
            'error',
            'Error',
            'Unknown error has occurred. Please try again later.',
            true
          );
          console.log(err.message);
        },
      });
    }
  }

  createToastMessage(
    severity: string,
    summary: string,
    detail: string,
    isError: boolean
  ): void {
    this.msgSvc.add({ severity, summary, detail });

    if (!isError) {
      setTimeout(() => {
        this.router.navigate(['/students', this.teacherId]);
      }, 1000);
    }
  }

  getRandomTeacherByGrade() {
    let teachersByGrade = this.teachers.filter(
      (teachers) =>
        teachers.gradeName === this.studentForm.controls['grade'].value
    );

    if (teachersByGrade.length > 1) {
      let randomNum = Math.floor(Math.random() * teachersByGrade.length);
      return teachersByGrade[randomNum];
    } else {
      return teachersByGrade[0];
    }
  }

  onCancel() {
    if (this.teacherId && this.studentId) {
      this.router.navigate(['/students', this.teacherId]);
    } else {
      this.router.navigate(['/teachers']);
    }
  }

  confirmDelete() {
    this.msgSvc.clear();
    this.msgSvc.add({
      key: 'center',
      sticky: true,
      severity: 'warn',
      summary: 'Delete Student?',
      detail: `Please confirm that you would like to delete ${this.student.studentName}`,
    });
  }

  cancelled() {
    this.msgSvc.clear();
  }

  onDelete() {
    this.studentsSvc.deleteStudent(this.teacherId, this.studentId).subscribe({
      next: () => {
        this.createToastMessage(
          'success',
          'Success!',
          `${this.student.studentName} has been removed.`,
          false
        );
      },
      error: (err) => {
        this.createToastMessage(
          'error',
          'Error',
          'Unknown error has occurred. Please try again later.',
          true
        );
        console.log(err.message);
      },
    });
  }

  ngOnDestroy(): void {
    this.gradesSub.unsubscribe();
  }
}
