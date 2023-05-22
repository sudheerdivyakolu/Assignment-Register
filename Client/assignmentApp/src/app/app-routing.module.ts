import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { ShowAssignmentComponent } from './assignment/show-assignment/show-assignment.component';
import { EditAssignmentComponent } from './assignment/edit-assignment/edit-assignment.component';
import { CreateAssignmentComponent } from './assignment/create-assignment/create-assignment.component';
import { loginGuard } from './guards/login.guard';
import { BinComponent } from './bin/bin.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'assignments', component: AssignmentsComponent, canActivate: [loginGuard] },
  { path: 'assignments/bin', component: BinComponent, canActivate: [loginGuard] },
  { path: 'assignments/new', component: CreateAssignmentComponent, canActivate: [loginGuard] },
  { path: 'assignments/:id', component: ShowAssignmentComponent, canActivate: [loginGuard] },
  { path: 'assignments/:id/edit', component: EditAssignmentComponent, canActivate: [loginGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
