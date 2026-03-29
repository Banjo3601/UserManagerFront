import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../../models/user.model';
import { PagedResult } from '../../models/paged-result.model';


@Injectable({
  providedIn: 'root',
})

export class UserService {

  private apiUrl = 'http://localhost:5209/api/users';

  constructor(private http: HttpClient) {}

  // 🔹 GET simple
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getusers`);
  }

  // 🔹 GET search + pagination
  searchUsers(search: string, page: number, pageSize: number): Observable<PagedResult<User>> {
    return this.http.get<PagedResult<User>>(
      `${this.apiUrl}/search?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`
    );
  }

  // 🔹 POST
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // 🔹 PUT
  updateUser(user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${user.id}`, user);
  }

  // 🔹 DELETE
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
