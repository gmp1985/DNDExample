import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanvasComponent } from './canvas.component';
import { AuthGuard } from '../shared/guards/auth.guard';


const routes: Routes = [
  {path: 'editor', component: CanvasComponent/*, canActivate: [AuthGuard]*/},
  {path: 'editor/:id', component: CanvasComponent/*, canActivate: [AuthGuard]*/}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanvasRoutingModule { }
