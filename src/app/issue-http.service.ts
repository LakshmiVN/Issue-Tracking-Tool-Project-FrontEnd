import { Injectable } from '@angular/core';

//Import http
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

//Import Observables
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class IssueHttpService {
  
  private cookie:any; 

  constructor(private _http: HttpClient,public Cookie: CookieService) {
    this.cookie = this.Cookie.get('authtoken'); 
  }

  public baseUrl = "http://localhost:3000/api/v1/issues";

  public getAllIssues(): Observable<any> {
    let myResponse = this._http.get(this.baseUrl + '/all' + '?authToken='+ this.cookie);
    return myResponse;
  }

  public getSingleIssue(currentIssueId): any {
    let theResponse = this._http.get(this.baseUrl + '/view' + '/' + currentIssueId + '?authToken='+ this.cookie);
    return theResponse;

  }

  public createIssue(post): any {
    let theResponse = this._http.post<any>(this.baseUrl + '/create' + '?authToken='+ this.cookie, post);
    return theResponse;
  }

  public deleteIssue(issueId): any {
    let data = {};
    let theResponse = this._http.post(this.baseUrl + '/' + issueId + '/delete'+ '?authToken='+ this.cookie, data);
    return theResponse;
  }

  public editIssue(issueId, issueData): any {
    let theResponse = this._http.put(this.baseUrl + '/' + issueId + '/edit' + '?authToken='+ this.cookie, issueData);
    return theResponse;
  }

  private errorHandler(err: HttpErrorResponse) {
    return Observable.throw(err.message);
  }

  }

