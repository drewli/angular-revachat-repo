import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { LandingComponent } from '../components/landing/landing.component';
import { ChatComponent } from '../components/chat/chat.component';
import { AccountInfoComponent } from '../components/account-info/account-info.component';

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'account-info',
    component: AccountInfoComponent
  },
  {
    path: 'chat',
    component: LandingComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
