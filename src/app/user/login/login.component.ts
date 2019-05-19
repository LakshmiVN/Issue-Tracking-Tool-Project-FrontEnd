import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './../../user.service';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public email: any;
  public password: any;
  durationInSeconds:number = 3;

  constructor(
    public userService: UserService,
    public router: Router,
    public route: ActivatedRoute,
    private cookieService: CookieService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  public goToSignUp: any = () => {
    this.router.navigate(['/sign-up']);
  } 

  public signinFunction: any = () => {
    if (!this.email) {
      this.snackBar.openFromComponent(ErrorComponent, {
        duration: this.durationInSeconds * 1000,
        data: { message: "Enter email" },
        panelClass: ["warning"],
        verticalPosition: "top"
      });
    } else if (!this.password) {
      this.snackBar.openFromComponent(ErrorComponent, {
        duration: this.durationInSeconds * 1000,
        data: { message: "Enter password" },
        panelClass: ["warning"],
        verticalPosition: "top"
      });
    } else {
      let data = {
        email: this.email,
        password: this.password
      }

      this.userService.signInFunction(data) 
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: apiResponse.message },
            panelClass: ["success"],
            verticalPosition: "top"
          });

            this.cookieService.set('authtoken', apiResponse.data.authToken);
            this.cookieService.set('userId', apiResponse.data.userDetails.userId);
            this.cookieService.set('email', apiResponse.data.userDetails.email);
            this.cookieService.set('userName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
            this.userService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
            this.router.navigate(['/dashboard']);
          } else {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: "Some error occured" },
            panelClass: ["warning"],
            verticalPosition: "top"
          });
          }
        }, (err) => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: "Some error occured" },
            panelClass: ["warning"],
            verticalPosition: "top"
          });
        });
    } 
  } 
}
