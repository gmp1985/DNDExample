import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
// shared components
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from './components/header/header.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { BannerComponent } from './components/banner/banner.component';
import { FooterComponent } from './components/footer/footer.component';

// shared services
import { ConstantsService } from './services/constants.service';
import { SharedService } from './services/shared.service';
const routes: Routes = [];

@NgModule({
  declarations: [HeaderComponent, BreadcrumbsComponent, BannerComponent, FooterComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule, HeaderComponent, BreadcrumbsComponent, BannerComponent, FooterComponent],
  providers: [
    ConstantsService,
    SharedService
  ]
})
export class SharedModule { }
