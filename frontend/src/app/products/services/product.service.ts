import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { products } from '../types/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';
  private baseUrl = 'http://localhost:3000';

  http = inject(HttpClient);

  getProduct(): Observable<products[]> {
    console.log('Making HTTP request to:', this.apiUrl);
    return this.http.get<products[]>(this.apiUrl).pipe(
      tap((data) => console.log('HTTP response received:', data)),
      catchError((error) => {
        console.error('HTTP error:', error);
        return throwError(() => error);
      })
    );
  }

  getFullImageUrl(imageUrl: string): string {
    return imageUrl ? `${this.baseUrl}${imageUrl}` : '';
  }
}
