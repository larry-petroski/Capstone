import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { StudentListComponent } from './student-list/student-list.component';
import { TeacherComponent } from './teacher/teacher.component';
import { TeachersListComponent } from './teachers-list/teachers-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'teachers', component: TeachersListComponent },
  { path: 'teachers/:id', component: TeachersListComponent, pathMatch: 'full' },
  { path: 'teachers/:teacherid/student-info/:id', component: StudentInfoComponent, pathMatch: 'full' },
  { path: 'teacher-info', component: TeacherComponent },
  { path: 'teacher-info/:id', component: TeacherComponent, pathMatch: 'full' },
  { path: 'students/:teacherId', component: StudentListComponent },
  { path: 'student-info', component: StudentInfoComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
