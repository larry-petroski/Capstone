import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/api';

import { Grade } from '../../models/grade.model';
import { GradesService } from '../../services/grades.service';
import { TeachersService } from '../../services/teachers.service';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'sr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  items!: MenuItem[];

  grades!: Grade[];
  teachers!: Teacher[];
  filteredTeachers!: Teacher[];
  searchText!: string;

  constructor(
    private gradesSvc: GradesService,
    private teachersSvc: TeachersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gradesSvc.getGrades<Grade[]>().subscribe(
      (grades) => {
        this.grades = grades;
        this.setMenuItems();
      },
      (err) => console.error(err.message)
    );
  }

  setMenuItems(): void {
    this.items = [];
    this.grades.forEach((grade) => {
      let item: MenuItem = {
        label: grade.gradeName,
        routerLink: ['teachers', grade.gradeId],
      };
      this.items.push(item);
    });

    this.teachersSvc
      .getAllTeachers()
      .subscribe((teachers) => (this.teachers = teachers));
  }

  search(event: any) {
    this.filteredTeachers = this.teachers.filter((teacher) =>
      teacher.teacherName.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  onSelect(value: any) {
    let teacher: Teacher = value;

    this.router.navigate(['/teachers', { teacherid: teacher.teacherId }]);
    this.filteredTeachers = [];
    this.searchText = '';
  }
}
