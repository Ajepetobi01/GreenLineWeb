import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AirlinesComponent } from './components/airlines/airlines.component';
import { AirportsComponent } from './components/airports/airports.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FlightsComponent } from './components/flights/flights.component';
import { LoginComponent } from './components/login/login.component';
import { PassengersComponent } from './components/passengers/passengers.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { AuthguardService } from './services/authguard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: RegisterUserComponent,
  },
  {
    path: 'airlines',
    component: AirlinesComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'airports',
    component: AirportsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'flights',
    component: FlightsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'passengers',
    component: PassengersComponent,
    canActivate: [AuthguardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
