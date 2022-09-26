import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
})
export class StudentInfoComponent implements OnInit, OnDestroy {
  browserRefresh!: boolean;
  studentForm!: FormGroup;
  gradesSub!: Subscription;
  grades: Grade[] = [];
  teacher!: Teacher;

  student!: Student;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private gradesSvc: GradesService,
    private teachersSvc: TeachersService,
    private studentsService: StudentsService
  ) {
    this.route.paramMap.subscribe((pm) => {
      const teacherId = pm.get('teacherId');
      if (teacherId) {
        this.teacher.teacherId = +teacherId;
      }
    });

    this.gradesSub = this.gradesSvc
      .getGrades<Grade[]>()
      .subscribe((grades) => (this.grades = grades));
  }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      avatar: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      grade: [null, Validators.required],
      teacher: [null],
      phone: [null, Validators.required],
      email: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
      this.gradesSub.unsubscribe();
  }
}
