import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Grade } from '../models/grade.model';
import { Teacher } from '../models/teacher.model';
import { GradesService } from '../services/grades.service';
import { TeachersService } from '../services/teachers.service';

@Component({
  selector: 'sr-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent implements OnInit, OnDestroy {
  teacherForm!: FormGroup;
  gradesSub!: Subscription;
  grades!: Grade[];
  teacherId!: number;
  teacher!: Teacher | undefined;
  teacherSub!: Subscription;

  titles: string[] = ['Mr.', 'Mrs.', 'Ms.'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private teachersSvc: TeachersService,
    private gradesSvc: GradesService
  ) {
    this.gradesSub = this.gradesSvc
      .getGrades<Grade[]>()
      .subscribe((grades) => (this.grades = grades));
    this.teacherId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.teachersSvc.teachers().subscribe(teachers => console.log(teachers));
    // this.teacherSub = this.teachersSvc.teachers().subscribe((teach) => {
    //   this.teacher = teach.find((t) => {
    //     t.teacherId === this.teacherId;
    //     console.log(this.teacherId);
    //   });
    //   console.log(this.teacher);
    // });

    this.teacherForm = this.fb.group({
      title: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      grade: [null, Validators.required],
      classSize: [null, Validators.required],
      avatar: [null],
    });
  }

  onSubmit(formValues: any) {
    const teacher: Teacher = {
      teacherId: 0,
      teacherName: `${formValues['title']} ${formValues['firstName']} ${formValues['lastName']}`,
      gradeName: formValues['grade'],
      teacherPhone: formValues['phone'],
      teacherEmail: formValues['email'],
      maxClassSize: formValues['classSize'],
    };

    let grade = this.grades.find((g) => g.gradeName === teacher.gradeName);

    this.teachersSvc.addTeacher(teacher).subscribe({
      next: () => this.router.navigate(['/teachers', grade?.gradeId]),
      error: (err) => console.error(err.message),
      complete: () => {},
    });
  }

  onCancel() {
    this.router.navigate(['/teachers']);
  }

  onDelete() {
    this.teachersSvc.deleteTeacher(this.teacherId).subscribe({
      next: () => this.router.navigate(['/teachers']),
      error: (err) => console.error(err.message),
      complete: () => {},
    });
  }

  ngOnDestroy(): void {
    this.gradesSub.unsubscribe();
    // this.teacherSub.unsubscribe();
  }
}
