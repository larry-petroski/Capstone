import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TeachersService } from '../services/teachers.service';

@Component({
  selector: 'sr-teachers-list',
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.css']
})
export class TeachersListComponent implements OnInit {

  constructor(private route: ActivatedRoute, private teachersSvc: TeachersService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');

      if (id && id.length === 1) {
        this.teachersSvc.getTeachersByGrade(id);
      } else {
        this.teachersSvc.getAllTeachers();
      }
    });
  }

}
