import { Component, OnInit, ViewChild  } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { IssueHttpService  } from './../issue-http.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ErrorComponent } from '../error/error.component';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['Title', 'Status', 'AssignedTo', 'Date','Options'];
  dataSource = new MatTableDataSource;
  durationInSeconds: number = 3;

  constructor( 
              public IssueHttpService : IssueHttpService, 
              private cdr: ChangeDetectorRef,
              public router: Router,
              public Cookie: CookieService,
              public snackBar: MatSnackBar) { }

  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  
  ngOnInit() {
    this.checkStatus();
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    setTimeout(() => (this.dataSource.sort = this.sort));
    this.IssueHttpService.getAllIssues().subscribe(
      data=>{
        this.dataSource.data = data.data;
      },
      error=>{
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: this.durationInSeconds * 1000,
          data: { message: "Error in posting issue" },
          panelClass: ["delete"],
          verticalPosition: "top"
        });
      }
      )}

  //Check Status    
  public checkStatus: any = () => {
    if (this.Cookie.get('authtoken') === undefined || this.Cookie.get('authtoken') === '' || this.Cookie.get('authtoken') === null) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  } // end checkStatus
}
