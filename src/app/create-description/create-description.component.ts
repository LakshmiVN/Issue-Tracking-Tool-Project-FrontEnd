import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IssueHttpService } from './../issue-http.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mimeType } from '../edit-component/mime-type.validator';
import { SocketService } from '../socket.service';
import { MatSnackBar } from '@angular/material';
import { ErrorComponent } from '../error/error.component';
import { NotificationService } from './../header/notification.service';

export interface Statuses {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-description',
  templateUrl: './create-description.component.html',
  styleUrls: ['./create-description.component.css']
})
export class CreateDescriptionComponent implements OnInit {

  selectedValue: string;
  formGroup: FormGroup;
  assignedTo: any = [];
  createdBy:any;
  imagePreview : string | ArrayBuffer ;
  durationInSeconds:number = 3;
  ngxToolbar = [
    [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "superscript",
      "subscript"
    ],
    ["fontName", "fontSize", "color"],
    [
      "justifyLeft",
      "justifyCenter",
      "justifyRight",
      "justifyFull",
      "indent",
      "outdent"
    ],
    ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
    [
      "paragraph",
      "blockquote",
      "removeBlockquote",
      "orderedList",
      "unorderedList"
    ]
  ];

  constructor(public IssueHttpService: IssueHttpService,
              public activatedRoute: ActivatedRoute,
              public router: Router,
              public Cookie:CookieService,
              public userService:UserService,
              private socketService: SocketService,
              private snackBar: MatSnackBar,
              public notificationService: NotificationService
              ) { }

  ngOnInit() {
              this.checkStatus();
              this.getAssignedTo();
              this.createForm();
              this.createdBy = this.Cookie.get('userName');
  }

  createForm()
  {
  this.formGroup = new FormGroup({
    title: new FormControl(null, {
      validators: [Validators.required, Validators.minLength(3)]
    }),
    status: new FormControl(null, { validators: [Validators.required] }),
    description: new FormControl(null),
    assigned: new FormControl(null, {
      validators: [Validators.required]
    }),
    image: new FormControl(null, {
      validators: [Validators.required],
      asyncValidators: [mimeType]
    })
 })
}

  statuses: Statuses[] = [
    {value: 'Backlog', viewValue: 'Backlog'},
    {value: 'In-progress', viewValue: 'In-progress'},
    {value: 'In-test', viewValue: 'In-test'},
    {value: 'Done', viewValue: 'Done'}
  ];

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.formGroup.patchValue({ image: file });
    this.formGroup.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onIssueSubmit(){
    let date =  new Date();
    const postImage: File = this.formGroup.value.image;
    const issuPost = {
      title: this.formGroup.value.title,
      status: this.formGroup.value.status,
      assigned: this.formGroup.value.assigned,
      description: this.formGroup.value.description,
      image: postImage,
      date: date.toLocaleString(),
      createdBy: this.createdBy
    }
    
    const post = new FormData();
    post.append("title", issuPost.title);
    post.append("status", issuPost.status);
    post.append("assigned", issuPost.assigned);
    post.append("description", issuPost.description);
    post.append("date", issuPost.date);
    post.append("createdBy", issuPost.createdBy);
    post.append("image", issuPost.image, issuPost.title);
      
    this.IssueHttpService.createIssue(post).subscribe(
      data =>{
        this.socketService.onGetNotification({data: data.message});
        this.socketService.onShow().subscribe(data => {
          
        this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["success"],
            verticalPosition: "top"
          });

        });
       this.notificationService.postNotifications(
          data.data.issueId,
          data.data.createdBy,
          data.message
        );

      
        setTimeout(()=>{
          this.router.navigate(['/dashboard']);
        },1000)
      },

      error =>{
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: this.durationInSeconds * 1000,
          data: { message: "Error in posting issue" },
          panelClass: ["delete"],
          verticalPosition: "top"
        });
      }

    )
  } 

  private getAssignedTo() {
    this.userService.getAllUsers();
    this.userService.getUserUpdateListener().subscribe(data => {
      this.assignedTo = data.map(data => data.firstName)
    });
  }

  //Check status
  public checkStatus: any = () => {
    if (this.Cookie.get('authtoken') === undefined || 
        this.Cookie.get('authtoken') === '' || this.Cookie.get('authtoken') === null) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  } // end checkStatus
}
