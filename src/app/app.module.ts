import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Ark modules gose down
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CanvasModule } from './canvas/canvas.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SafePipe } from './shared/pipes/safe.pipes';
// Ark Services
import { ConstantsService } from './shared/services/constants.service';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule,
    AuthenticationModule,
    CanvasModule,
    DashboardModule        

  ],
  exports: [
    SafePipe
  ],
  providers: [ConstantsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
