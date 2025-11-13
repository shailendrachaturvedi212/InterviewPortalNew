import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserInfoServiceService {

  private apiUrl = environment.apiUrl + "/interview";
  constructor(private http: HttpClient) { }

  ping(): Observable<string> {
    return this.http.get(this.apiUrl + '/ping', { responseType: 'text' });
  }

  getQuestions(Skills: string, Experience: number): Observable<any> {
    const requestBody = { Skills, Experience };
    return this.http.post<string[]>(this.apiUrl + '/questions', requestBody);
  }

  uploadDetails(body: any): Observable<string[]> {
    return this.http.post<string[]>(this.apiUrl + '/upload', body);
  }
}
