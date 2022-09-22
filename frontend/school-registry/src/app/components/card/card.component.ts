import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Teacher } from '../../models/teacher.model';
import { TeachersService } from '../../services/teachers.service';

@Component({
  selector: 'sr-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnDestroy {

  teachers!: Teacher[];
  teachersSub!: Subscription;
  hasTeachers!: boolean;
  
  constructor(private teachersSvc: TeachersService) { }

  ngOnInit(): void {
    
    this.teachersSub = this.teachersSvc.teachers().subscribe(teacher => {
      if (teacher && teacher.length > 0) {
        this.hasTeachers = true;
        this.teachers = teacher
      } else {
        this.hasTeachers = false;
      }
    });
  }

  ngOnDestroy(): void {
    console.log('cards destroyed');
      this.teachersSub.unsubscribe();
  }

}
