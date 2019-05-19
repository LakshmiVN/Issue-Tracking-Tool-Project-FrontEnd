import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { MaterialModule } from './../material.module';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [LoginComponent, SignUpComponent, ThankYouComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    ToastrModule.forRoot(),
    FormsModule,
    MaterialModule,
    RouterModule.forChild([
      {path:'sign-up',component:SignUpComponent},
      {path: 'thank-you',component:ThankYouComponent}
    ])
  ]
})
export class UserModule { }
