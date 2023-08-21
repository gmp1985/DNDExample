import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';

import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ThemelistComponent } from './components/themelist/themelist.component';

const routes: Routes = [
    {
      path: 'home',
      component: DashboardComponent, canActivate: [AuthGuard],
      children: [
                    {
                      path: '',
                      component: HomeComponent,
                      pathMatch: 'full',
                      data: { bc: [{url: '', text: 'Home'}] }
                    }
                ]
    },
    {
      path: 'mythemes',
      component: DashboardComponent, canActivate: [AuthGuard],
      children: [
        { path: '', component: ThemelistComponent, pathMatch: 'full', data: {bc: [{url: '/home', text: 'Home'}, {url: '', text: 'My Themes'}] }}
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
