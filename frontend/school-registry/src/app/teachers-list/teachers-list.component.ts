import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { TeachersService } from '../services/teachers.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'sr-teachers-list',
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.css'],
})
export class TeachersListComponent implements OnInit {
  hidden: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private teachersSvc: TeachersService,
    private title: Title,
    private usersSvc: UserService
  ) {}

  ngOnInit(): void {
    const pageTitle = this.title.getTitle();
    this.title.setTitle(`${pageTitle} - Teachers`);

    this.usersSvc.admin.subscribe((user) => (this.hidden = !!user.username));

    this.route.paramMap.subscribe((param) => {
      const gradeid = param.get('gradeid');
      const teacherid = param.get('teacherid');

      if (gradeid && gradeid.length > 0) {
        this.title.setTitle(`${pageTitle} - Teachers by Grade ${gradeid}`);
        this.teachersSvc.getTeachersByGrade(gradeid).subscribe({
          next: (teachers) => this.teachersSvc.sendTeacher(teachers),
          error: (err) => console.error(err.message),
          complete: () => {},
        });
      } else if (teacherid && teacherid.length > 0) {
        this.title.setTitle(`${pageTitle} - Teacher by Search`);
        this.teachersSvc.getTeacherById(+teacherid).subscribe({
          next: (teachers) => this.teachersSvc.sendTeacher([teachers]),
          error: (err) => console.error(err.message),
          complete: () => {},
        });
      } else {
        this.title.setTitle(`${pageTitle} - Teachers`);
        this.teachersSvc.getAllTeachers().subscribe({
          next: (teachers) => this.teachersSvc.sendTeacher(teachers),
          error: (err) => console.error(err.message),
          complete: () => {},
        });
      }
    });
  }
}
