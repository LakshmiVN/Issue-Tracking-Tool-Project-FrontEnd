import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Data } from "@angular/router";
import { Subject, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
private auth:any;
private id:any;

constructor(private http: HttpClient,private Cookie: CookieService) {
  this.auth = this.Cookie.get('authtoken'); 
  this.id = this.Cookie.get('userId');
}

public baseUrl ='http://IssueTrackingTool-env.p23byauyic.us-east-2.elasticbeanstalk.com/api/v1/notification/';


  notifications: any = [];
  private notifiCationBadge: number;
  private badgeSubject = new BehaviorSubject<number>(this.notifications.length);
  private notificationSubject = new Subject<any>();

  notificationListener() {
    return this.notificationSubject.asObservable();
  }

  getBadgeNumber() {
    return this.notifiCationBadge;
  }

  badgeNoListener() {
    return this.badgeSubject.asObservable();
  }

  postNotifications(issueId: string, userId: string, notification: string) {
    const notifications = {
      issueId: issueId,
      userId: userId,
      notification: notification
    };
    this.auth = this.Cookie.get('authtoken'); 
    this.http.post<any>(this.baseUrl + '?authToken='+ this.auth, notifications).subscribe(response => {
      const data = {
        notification: response.notification,
        issueid: response.id,
        userId: response.userid
      };
      this.notifications.push(data);
      this.notifiCationBadge = this.notifications.length;
      this.badgeSubject.next(this.notifiCationBadge);
      this.notificationSubject.next([...this.notifications]);
    });
  }

  getNotifications() {
    this.http
      .get<any>(this.baseUrl + '?id=' + this.id)
      .pipe(
        map(data => {
          return data.result.map(result => {
            return {
              notification: result.notification,
              issueid: result.issueId,
              userId: result.userId,
              notificationId: result._id
            };
          });
        })
      )
      .subscribe(transformedData => {
        this.notifications = transformedData;
        this.notifiCationBadge = this.notifications.length;
        this.badgeSubject.next(this.notifiCationBadge);
        this.notificationSubject.next([...this.notifications]);
      });
  }

  deleteNotification(notificationId: string) {
    this.http
      .delete<{ message: string }>(this.baseUrl + notificationId + '?authToken='+ this.auth)
      .subscribe(response => {
        const updatedNotification = this.notifications.filter(
          notification => notification.notificationId !== notificationId
        );
        this.notifications = updatedNotification;
        this.notifiCationBadge = this.notifications.length;
        this.badgeSubject.next(this.notifiCationBadge);
        this.notificationSubject.next([...this.notifications]);
      });
  }
}
