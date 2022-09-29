import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem, MessageService } from 'primeng/api';

import { Grade } from '../../models/grade.model';
import { GradesService } from '../../services/grades.service';
import { TeachersService } from '../../services/teachers.service';
import { Teacher } from '../../models/teacher.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'sr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [MessageService],
})
export class HeaderComponent implements OnInit {
  items!: MenuItem[];

  grades!: Grade[];
  teachers!: Teacher[];
  filteredTeachers!: Teacher[];
  searchText!: string;
  showLoginDialog: boolean = false;
  currentAdmin!: User;

  constructor(
    private gradesSvc: GradesService,
    private teachersSvc: TeachersService,
    private router: Router,
    private msgSvc: MessageService,
    private userSvc: UserService
  ) {}

  ngOnInit(): void {
    this.gradesSvc.getGrades<Grade[]>().subscribe(
      (grades) => {
        this.grades = grades;
        this.setMenuItems();
      },
      (err) => {
        this.msgSvc.add({
          severity: 'error',
          summary: 'No connection',
          detail: 'Unable to connect with server. Please try again later.',
          sticky: true,
        });
        console.error(err.message);
      }
    );
    this.userSvc.admin.subscribe((user) => (this.currentAdmin = user));
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

  showLogin() {
    this.showLoginDialog = true;
  }

  hideLogin() {
    this.showLoginDialog = false;
  }

  logout() {
    this.userSvc.logout();
  }
}
