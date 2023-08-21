import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../shared/guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ThemelistComponent } from './components/themelist/themelist.component';

@NgModule({
  declarations: [DashboardComponent, HomeComponent, ThemelistComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    DashboardRoutingModule
  ],
  providers: [AuthGuard]
})
export class DashboardModule { }
