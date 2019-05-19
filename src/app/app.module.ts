import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule} from './material.module';
import { NgxEditorModule } from 'ngx-editor';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { CreateDescriptionComponent } from './create-description/create-description.component';
import { EditComponentComponent } from './edit-component/edit-component.component';
import { ViewDescriptionComponent } from './view-description/view-description.component';
import { LoginComponent } from './user/login/login.component';
import { UserModule } from './user/user.module';
import { ErrorComponent } from './error/error.component'

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    CreateDescriptionComponent,
    EditComponentComponent,
    ViewDescriptionComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    UserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FormsModule,
    TooltipModule,
    NgxEditorModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path:'dashboard',component:DashboardComponent},   
      {path:'login', component:LoginComponent, pathMatch:'full'}, 
      {path:'',redirectTo:'login',pathMatch:'full'},
      {path:'create',component:CreateDescriptionComponent},      
      {path:'edit/:issueId', component:EditComponentComponent},
      {path:'view/:issueId',component:ViewDescriptionComponent}
    ])
  ],
  
  providers: [HttpClientModule, CookieService],
  bootstrap: [AppComponent],
  entryComponents: [ ErrorComponent ]
})
export class AppModule { }
