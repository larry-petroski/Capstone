import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Teacher } from '../../models/teacher.model';
import { TeachersService } from '../../services/teachers.service';

@Component({
  selector: 'sr-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit, OnDestroy {
  teachers!: Teacher[];
  teachersSub!: Subscription;
  hasTeachers!: boolean;

  constructor(private teachersSvc: TeachersService, private router: Router) {}

  ngOnInit(): void {
    this.teachersSub = this.teachersSvc.teachers().subscribe((teacher) => {
      if (teacher && teacher.length > 0) {
        this.hasTeachers = true;
        this.teachers = teacher;
      } else {
        this.hasTeachers = false;
      }
    });
  }

  openInfo(teacher: Teacher) {
    this.teachersSvc.getTeachersById(teacher.teacherId).subscribe((t) => {
      this.teachersSvc.sendTeacher(t);
      this.router.navigate(['/teacher-info', teacher.teacherId]);
    });
  }

  ngOnDestroy(): void {
    console.log('destroyed');
    this.teachersSub.unsubscribe();
  }
}
