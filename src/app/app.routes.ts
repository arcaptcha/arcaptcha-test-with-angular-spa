import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { LoginComponent } from './pages/login.component';
import { SignupComponent } from './pages/signup.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home · Arcaptcha Demo' },
  { path: 'login', component: LoginComponent, title: 'Login · Arcaptcha Demo' },
  { path: 'signup', component: SignupComponent, title: 'Sign up · Arcaptcha Demo' },
  { path: '**', redirectTo: '' },
];
