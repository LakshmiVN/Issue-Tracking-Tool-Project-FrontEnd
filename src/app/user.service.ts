import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { CookieService } from 'ngx-cookie-service'
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Subject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth: any;
  public url = 'http://localhost:3000/api/v1/users';
  private authListener = new Subject<boolean>();
  private isAuthenticated = false;
  private users:any = [];
  private userId:string;
  private userSubject = new Subject<any>();

  constructor(public http: HttpClient, public Cookie: CookieService) {
    this.auth = this.Cookie.get('authtoken');
  }

  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  public getAllUsers() {
    this.auth = this.Cookie.get('authtoken');
    return this.http.get<any>(this.url + "/all" + '?authToken='+ this.auth).subscribe((response) => {
      this.users = response.data;
      this.userId = response.data.userId;
      this.userSubject.next([...this.users]);
    });
  }

  getUserId(){
    return this.userId;
  }

  getUserUpdateListener() {
    return this.userSubject.asObservable();
  }

  public getAuthStatus() {
    return this.authListener.asObservable();
  }

  public getIsAuth() {
    return this.isAuthenticated;
  }
  public signUpFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/signup`, params);
  }

  public signInFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);
    return this.http.post<any>(`${this.url}/login`, params);
  }

  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', this.Cookie.get('authtoken'))
    return this.http.post(`${this.url}/logout`, params);
  } 

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    } 
    return Observable.throw(errorMessage);
  }  
}
