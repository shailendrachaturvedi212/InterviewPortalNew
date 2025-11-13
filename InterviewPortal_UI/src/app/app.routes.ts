import { Routes } from '@angular/router';
import { UserInfoComponent }  from '../app/user-info/user-info.component';
export const routes: Routes = [
  { path: '', redirectTo: 'UserInfo', pathMatch: 'full', title: 'UserInfo' },
  { path: 'UserInfo', component: UserInfoComponent },];
