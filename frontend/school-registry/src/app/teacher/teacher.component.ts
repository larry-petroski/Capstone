import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { browserRefresh } from '../app.component';
import { Grade } from '../models/grade.model';
import { Teacher } from '../models/teacher.model';
import { GradesService } from '../services/grades.service';
import { TeachersService } from '../services/teachers.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'sr-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
  providers: [MessageService],
})
export class TeacherComponent implements OnInit, OnDestroy {
  browserRefresh!: boolean;
  teacherForm!: FormGroup;
  gradesSub!: Subscription;
  grades: Grade[] = [];
  teacherId!: number;
  teacherSub!: Subscription;
  teacher!: Teacher;
  updateExistingTeacher: boolean = false;
  hidden: boolean = true;

  titles: string[] = ['Mr.', 'Mrs.', 'Ms.'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private teachersSvc: TeachersService,
    private gradesSvc: GradesService,
    private msgSvc: MessageService,
    private locSvc: Location,
    private title: Title,
    private userSvc: UserService
  ) {
    this.gradesSub = this.gradesSvc
      .getGrades<Grade[]>()
      .subscribe((grades) => (this.grades = grades));
    this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id');
      if (id) {
        this.teacherId = +id;
      }
    });
  }

  ngOnInit(): void {
    this.browserRefresh = browserRefresh;

    const pageTitle = this.title.getTitle();
    this.title.setTitle(`${pageTitle} - Teacher Info`);

    this.teacherForm = this.fb.group({
      title: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phone: [null, [Validators.compose([Validators.required, Validators.minLength(10)])]],
      email: [null, [Validators.compose([Validators.required, Validators.email])]],
      grade: [null, Validators.required],
      classSize: [0, Validators.required],
      avatar: [null],
    });

    if (this.browserRefresh) {
      this.teachersSvc.getTeacherById(this.teacherId).subscribe((teacher) => {
        this.teacher = teacher;
        this.updateForm(teacher);
      });
    } else {
      this.teacherSub = this.teachersSvc.teachers().subscribe((teacher) => {
        let t = teacher.find((teach) => teach.teacherId === this.teacherId);

        if (t) {
          this.teacher = t;
          this.updateForm(this.teacher);
        }
      });
    }

    this.userSvc.admin.subscribe(user => this.hidden = !user.username);
  }

  updateForm(teacher: Teacher) {
    const name: string[] = teacher.teacherName.split(' ');

    this.teacherForm.patchValue({
      title: name[0],
      firstName: name[1],
      lastName: name[2],
      phone: teacher.teacherPhone,
      email: teacher.teacherEmail,
      grade: teacher.gradeName,
      classSize: teacher.maxClassSize,
    });

    this.updateExistingTeacher = true;
  }

  onSubmit(formValues: any) {
    const title = formValues['title'] ? formValues['title'] : this.titles[0];

    const teacher: Teacher = {
      teacherId: this.teacherId ? this.teacherId : 0,
      teacherName: `${title} ${formValues['firstName']} ${formValues['lastName']}`,
      gradeName: formValues['grade'],
      teacherPhone: formValues['phone'],
      teacherEmail: formValues['email'],
      maxClassSize: formValues['classSize'],
    };

    if (!this.updateExistingTeacher) {
      this.teachersSvc.addTeacher(teacher).subscribe({
        next: () =>
          this.createToastMsg(
            'success',
            'Success!',
            `${teacher.teacherName} has been added as a teacher.`,
            false
          ),
        error: (err) => {
          this.createToastMsg(
            'error',
            'Error',
            'Unknown error has occurred! Please try again later.',
            true
          );
          console.error(err.message);
        },
        complete: () => {},
      });
    } else {
      this.teachersSvc.updateTeacher(teacher).subscribe({
        next: () =>
          this.createToastMsg(
            'success',
            'Success!',
            `${teacher.teacherName} has been updated.`,
            false
          ),
        error: (err) => {
          this.createToastMsg(
            'error',
            'Error',
            'Unknown error has occurred! Please try again later.',
            true
          );
          console.error(err.message);
        },
        complete: () => {},
      });
    }
  }

  createToastMsg(
    severity: string,
    summary: string,
    detail: string,
    isError: boolean
  ): void {
    this.msgSvc.add({ severity, summary, detail });

    if (!isError) {
      setTimeout(() => {
        this.router.navigate(['/teachers']);
      }, 1500);
    }
  }

  onCancel() {
    this.locSvc.back();
  }

  confirmDelete() {
    this.msgSvc.clear();
    this.msgSvc.add({
      key: 'center',
      sticky: true,
      severity: 'warn',
      summary: 'Delete Teacher?',
      detail: `Please confirm that you would like to delete ${this.teacher.teacherName}`,
    });
  }

  cancelled() {
    this.msgSvc.clear();
  }

  onDelete() {
    this.teachersSvc.deleteTeacher(this.teacherId).subscribe({
      next: () =>
        this.createToastMsg(
          'success',
          'Success!',
          `${this.teacher.teacherName} has been removed.`,
          false
        ),
      error: (err) => {
        this.createToastMsg(
          'error',
          'Error',
          'Unknown error has occurred! Please try again later.',
          true
        );
        console.error(err.message);
      },
      complete: () => {},
    });
  }

  ngOnDestroy(): void {
    this.gradesSub.unsubscribe();
    if (this.teacherSub) {
      this.teacherSub.unsubscribe();
    }
  }
}
