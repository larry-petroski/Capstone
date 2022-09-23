import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TeacherComponent } from './teacher/teacher.component';
import { TeachersListComponent } from './teachers-list/teachers-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'teachers', component: TeachersListComponent },
  { path: 'teachers/:id', component: TeachersListComponent, pathMatch: 'full' },
  { path: 'teacher-info', component: TeacherComponent },
  { path: 'teacher-info/:id', component: TeacherComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
