import { Component, OnInit ,OnDestroy,} from '@angular/core';
import { UserService } from './../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { from, Subscription } from "rxjs";
import { IssueHttpService } from "../issue-http.service";
import { MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { NotificationService } from "./notification.service";
import { ErrorComponent } from "./../error/error.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuthenticated = false;
  private authSub: Subscription;
  badgeNumber: number;
  notificationArray: any;
  dataArray: any;
  index: any = [];
  email: string;
  durationInSeconds = 3;
  userName: string;


  constructor(public userService:UserService, 
              public router: Router, 
              public Cookie: CookieService,
              public issueHttpService: IssueHttpService,
              public notificationService: NotificationService,
              public snackBar: MatSnackBar) { }


  ngOnInit() {
    this.userName = this.Cookie.get('userName');
    this.notificationService.getBadgeNumber();
    this.notificationService.badgeNoListener().subscribe(badgeNo => {
      this.badgeNumber = badgeNo;
      this.email = this.Cookie.get("email").split("@")[0];
    });
    this.notificationService.getNotifications();
    this.notificationService.notificationListener().subscribe(data => {
      this.notificationArray = data;
      this.badgeNumber = data.length;
    });
    

    this.isAuthenticated = this.userService.getIsAuth();
    this.authSub = this.userService
      .getAuthStatus()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      });
  }
  
  onClick(index: string) {
    if (!index) {
      this.snackBar.openFromComponent(ErrorComponent, {
        duration: this.durationInSeconds * 1000,
        data: { message: "Issue could not be found" },
        panelClass: ["delete"],
        verticalPosition: "top"
      });
    }
   this.router.navigate(['view', index]);
   
  }
  onClose(notificationId: string) {
    this.notificationService.deleteNotification(notificationId);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  public goToSignIn: any = () => {
    this.router.navigate(['/login']);
  } // end goToSignIn

  public logout: any = () => {
    this.userService.logout()
      .subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          this.Cookie.deleteAll();
          localStorage.clear();
          setTimeout(()=>{
            this.router.navigate(['/thank-you']);
          },500);
        } // end condition

      });
    }
  }
