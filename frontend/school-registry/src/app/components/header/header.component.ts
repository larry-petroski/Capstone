import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { Grade } from 'src/app/models/grade.model';
import { GradesService } from 'src/app/services/grades.service';

@Component({
  selector: 'sr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  items!: MenuItem[];

  constructor(private gradesSvc: GradesService) {}

  ngOnInit(): void {
    this.gradesSvc.getGrades<Grade[]>().subscribe(
      (grades) => this.setMenuItems(grades),
      (err) => console.error(err.message)
      );
    }
    
    setMenuItems(grades: Grade[]): void {
      this.items = [];
      grades.forEach((grade) => {
      let item: MenuItem = { label: grade.gradeName, routerLink: ['teachers', grade.gradeId] };
      this.items.push(item);
    });
  }
}
