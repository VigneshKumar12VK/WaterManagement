import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: number;
  roleName: 'dealer' | 'admin' | 'user';
  pendingPayments: number;
  completedPayments: number;
}
export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  status: string;
  items: OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private apiUrl = 'http://localhost:3000/api/v1/users';

  constructor(private http: HttpClient) { }

  getUsers(filters?: any): Observable<User[]> {
    let params = {};
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = { ...params, [key]: filters[key] };
        }
      });
    }
    return this.http.get<User[]>(this.apiUrl, { params });
  }

  addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getUserOrders(id: string): Observable<Order[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/orders`).pipe(
      map(orders => orders.map(o => ({
        id: o.id,
        amount: o.totalAmount,
        date: o.createdAt,
        paymentMethod: o.paymentMethod,
        status: o.status,
        items: o.items
      })))
    );
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/v1/orders', orderData);
  }

  getLookups(): Observable<any> {
    return this.http.get('http://localhost:3000/api/v1/lookups');
  }
}
