import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class WatcherServiceService {

  private auth:any; 

  constructor( private http:HttpClient, private Cookie: CookieService) {
    this.auth = this.Cookie.get('authtoken'); 
   }

public baseUrl = 'http://localhost:3000/api/v1/watcher';

  addWatchers(issueid: string, userId: any, email: string) {
    const issueId = { issueId: issueid, userId: userId, email:email };
    this.http.post<any>(this.baseUrl + '?authToken='+ this.auth, issueId).subscribe(data => {
    });
  }

  getWatchers(issueId: string) {
    return this.http.get<any>(this.baseUrl + '/'+ issueId + '?authToken='+ this.auth);
  }
}
