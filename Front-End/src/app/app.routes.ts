import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { AdminDashboardComponent } from './admin/dashboard.component';
import { SiteLayoutComponent } from './site-layout.component';

export const routes: Routes = [
	{ path: '', component: LoginComponent },
	{
		path: '',
		component: SiteLayoutComponent,
		children: [
			{ path: 'dashboard', component: AdminDashboardComponent },
			{ path: 'products', loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent) },
			{ path: 'users', loadComponent: () => import('./users/users.component').then(m => m.UsersComponent) },
			{ path: 'sales', loadComponent: () => import('./sales/sales.component').then(m => m.SalesComponent) },
			{ path: 'orders', loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent) },
		]
	}
];
