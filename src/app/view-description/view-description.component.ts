import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap} from '@angular/router';
import { IssueHttpService } from './../issue-http.service';
import { CookieService } from 'ngx-cookie-service';
import { WatcherServiceService } from './../watcher-service.service';
import { UserService } from './../user.service';
import { SocketService } from './../socket.service';
import { MatSnackBar } from '@angular/material';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-view-description',
  templateUrl: './view-description.component.html',
  styleUrls: ['./view-description.component.css']
})

export class ViewDescriptionComponent implements OnInit {

public currentIssue;
public currentIssueId = this.route.snapshot.paramMap.get('issueId');
public allWatchers: any;
public index: number;
public singleIssue: any;
public userId: string;
public singleComment: string = "";
public cookieUserId: string;
public commentData: any = [];
public savedData: any = [];
public oldId: any = "";
public deletedBy: any;
durationInSeconds:number = 3;

  constructor(private route: ActivatedRoute, 
              private router : Router,
              private issueHttpService : IssueHttpService,
              private Cookie: CookieService,
              private watcherService: WatcherServiceService,
              private userService:UserService,
              private socketService: SocketService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
   this.onDisplayData();
    this.onConnection();
    this.userId = this.userService.getUserId();
    this.deletedBy = this.Cookie.get('userName');

    this.route.paramMap.subscribe((id: ParamMap) => {
    this.index = +id.get("issueId");
    this.issueHttpService.getSingleIssue(this.index).subscribe(
        data => {
          if(data){
          this.singleIssue = data;
          }
          else {
            this.snackBar.openFromComponent(ErrorComponent, {
              duration: this.durationInSeconds * 1000,
              data: { message: "Invalid issue" },
              panelClass: ["delete"],
              verticalPosition: "top"
            });
            this.router.navigateByUrl('page-not-found');
          }
        }
      
      );
    this.userId = this.userService.getUserId();
    this.getData();
    });

    this.checkStatus();
    this.currentIssue = this.issueHttpService.getSingleIssue(this.currentIssueId).subscribe(
      data =>{
        this.currentIssue = data.data;
      },
      error=>{
        this.snackBar.openFromComponent(ErrorComponent, {
        duration: this.durationInSeconds * 1000,
        data: { message: "Error occured" },
        panelClass: ["warning"],
        verticalPosition: "top"
        });
      }
    );
  }

  
  public onConnection() {
    this.socketService.onComment().subscribe(data => {
      const newData = data.map(id => id.issueId);
      const singleData = this.currentIssueId;
      this.oldId = newData[0];
      if (this.oldId === singleData) {
        this.savedData = data;
      } else {
        this.savedData = [];
      }
    });
  }

  onComment() {
    this.socketService.OnMessage({
      email: this.Cookie.get("email").split("@")[0],
      comment: this.singleComment,
      issueId: this.currentIssueId
    });

    this.singleComment = "";
  }

  getData() {
    this.socketService.onGetData({
      email: this.Cookie.get("email").split("@")[0],
      comment: this.singleComment,
      issueId: this.currentIssueId
    });
  }

  onDisplayData() {
    this.socketService.onDisplay().subscribe(data => {
      this.commentData = data;
    });
  }

  public onWatcher() {
    this.watcherService.addWatchers(
      this.currentIssueId,
      this.Cookie.get('userId'),
      this.Cookie.get("email")
    );
  }

  getWatchers() {
    this.watcherService.getWatchers(this.currentIssueId).subscribe(watchers => {
      const watcherList = watchers.data.map(name => name.email);
      this.allWatchers = watcherList;
    });
  }

  public deleteIssue(){
    this.issueHttpService.deleteIssue(this.currentIssueId).subscribe(
      data =>{
        this.socketService.onGetNotification({data: data.message});
        this.socketService.onShow().subscribe(data => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["delete"],
            verticalPosition: "top"
          });
        });
        setTimeout(()=>{
          this.router.navigate(['/dashboard']);
        },1000)
      },
      error =>{
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: this.durationInSeconds * 1000,
          data: { message: "Error in deleting issue" },
          panelClass: ["delete"],
          verticalPosition: "top"
        });
      }
    );
  }
  public goBackToPreviousPage(){
    window.history.back();
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
