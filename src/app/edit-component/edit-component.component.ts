import { Component, OnInit } from '@angular/core';
import { IssueHttpService } from './../issue-http.service';
import { ActivatedRoute,Router } from'@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './../user.service';
import { SocketService } from '../socket.service';
import { MatSnackBar } from '@angular/material';
import { ErrorComponent } from '../error/error.component';
import { NotificationService } from './../header/notification.service';

export interface Statuses {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-edit-component',
  templateUrl: './edit-component.component.html',
  styleUrls: ['./edit-component.component.css']
})

export class EditComponentComponent implements OnInit {
  public currentIssue;
  public issueTitle:string;
  public issueStatus:string;
  public issueAssignedTo:string;
  public issueDescription:string;
  public image:any;
  public editedBy:any;
  assignedTo: any = [];
  durationInSeconds:number = 3;

  public issueId = this._route.snapshot.paramMap.get('issueId');

  constructor(public _route:ActivatedRoute, 
              public router:Router, 
              public issueHttpService:IssueHttpService,
              public Cookie:CookieService,
              public userService:UserService,
              private socketService: SocketService,
              private snackBar: MatSnackBar,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.checkStatus();
    this.getAssignedTo();
    this.editedBy = this.Cookie.get('userName');
    this.issueHttpService.getSingleIssue(this.issueId).subscribe(

      data =>{
        this.currentIssue = data.data;
      },
      error=>{
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: this.durationInSeconds * 1000,
          data: { message: "Some error occured" },
          panelClass: ["delete"],
          verticalPosition: "top"
        });
      }
    );
  }
  
  public statuses: Statuses[] = [
     {value: 'Backlog', viewValue: 'Backlog'},
     {value: 'In-progress', viewValue: 'In-progress'},
     {value: 'In-test', viewValue: 'In-test'},
     {value: 'Done', viewValue: 'Done'}
   ]; 

  public editIssue(){
    let issueData = {
      title: this.currentIssue.title,
      status: this.currentIssue.status,
      reporter: this.currentIssue.reporter,
      image: this.currentIssue.image,
      description: this.currentIssue.description,
      editedBy: this.editedBy
    }
    
    this.issueHttpService.editIssue(this.issueId,issueData).subscribe(
      data =>{
        this.socketService.onGetNotification({data: data.message});
        this.socketService.onShow().subscribe(data => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["warning"],
            verticalPosition: "top"
          });
        });
        this.notificationService.postNotifications(
          this.issueId,
          this.editedBy,
          data.message
        );
        setTimeout(()=>{
          this.router.navigate(['/dashboard']);
        },1000)
      },
      error =>{
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: this.durationInSeconds * 1000,
          data: { message: "Error in editing issue" },
          panelClass: ["warning"],
          verticalPosition: "top"
        });
      }
    );
  }

  private getAssignedTo() {
    this.userService.getAllUsers();
    this.userService.getUserUpdateListener().subscribe(data => {
      this.assignedTo = data.map(data => data.firstName)
    });
  }

  //Check status
  public checkStatus: any = () => {
    if (this.Cookie.get('authtoken') === undefined || this.Cookie.get('authtoken') === '' || this.Cookie.get('authtoken') === null) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  } // end checkStatus
}
