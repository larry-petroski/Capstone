import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Grade } from '../models/grade.model';
import { GradesService } from '../services/grades.service';

@Component({
  selector: 'sr-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  gradesSub!: Subscription;
  grades!: Grade[];

  constructor(private gradesSvc: GradesService, private title: Title) {}

  ngOnInit(): void {
    const pageTitle = this.title.getTitle();
    this.title.setTitle(`${pageTitle} - Home`);

    this.gradesSub = this.gradesSvc
      .getGrades<Grade[]>()
      .subscribe((grades) => (this.grades = grades));
  }

  ngOnDestroy(): void {
    this.gradesSub.unsubscribe();
  }
}
