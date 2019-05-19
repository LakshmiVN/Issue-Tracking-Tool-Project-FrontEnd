import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../user.service';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {
  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;
  durationInSeconds: number = 3;

  constructor(
    public userService: UserService,
    public router: Router,
    private toastrService: ToastrService,
    public route: ActivatedRoute,
    private snackBar : MatSnackBar) { }

  ngOnInit() {
  }

  public goToSignIn: any = () => {
    this.router.navigate(['/login']);
  } 

  public signupFunction: any = () => {
    if (!this.firstName) {
      this.snackBar.openFromComponent(ErrorComponent, {
      duration: this.durationInSeconds * 1000,
      data: { message: "Enter First Name" },
      panelClass: ["warning"],
      verticalPosition: "top"
      });
    } else if (!this.lastName) {
      this.snackBar.openFromComponent(ErrorComponent, {
        duration: this.durationInSeconds * 1000,
        data: { message: "Enter Last Name" },
        panelClass: ["warning"],
        verticalPosition: "top"
        });
    } else if (!this.mobile) {
      this.snackBar.openFromComponent(ErrorComponent, {
        duration: this.durationInSeconds * 1000,
        data: { message: "Enter Mobile Number" },
        panelClass: ["warning"],
        verticalPosition: "top"
        });
    } else if (!this.email) {
      this.snackBar.openFromComponent(ErrorComponent, {
        duration: this.durationInSeconds * 1000,
        data: { message: "Enter Email" },
        panelClass: ["warning"],
        verticalPosition: "top"
        });
    } else if (!this.password) {
      this.snackBar.openFromComponent(ErrorComponent, {
        duration: this.durationInSeconds * 1000,
        data: { message: "Enter Password" },
        panelClass: ["warning"],
        verticalPosition: "top"
        });
    } else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.mobile,
        email: this.email,
        password: this.password
      }

      this.userService.signUpFunction(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.snackBar.openFromComponent(ErrorComponent, {
              duration: this.durationInSeconds * 1000,
              data: { message: apiResponse.message },
              panelClass: ["success"],
              verticalPosition: "top"
            });
            
            setTimeout(() => {
              this.goToSignIn();
            }, 2000);
          } else {
            this.snackBar.openFromComponent(ErrorComponent, {
              duration: this.durationInSeconds * 1000,
              data: { message: "Some error occured" },
              panelClass: ["delete"],
              verticalPosition: "top"
              });
          }
        }, (err) => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: "Some error occured" },
            panelClass: ["delete"],
            verticalPosition: "top"
            });
        });
    } // end condition
  } //
}
