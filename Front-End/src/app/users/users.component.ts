import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UsersService, User, Order } from './users.service';
import { CommonModule } from '@angular/common';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VktoggleDirective } from '../vktoggle.directive';
import { ProductsService, Product } from '../products/products.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ModalModule, VktoggleDirective, ReactiveFormsModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error = '';
  orders: Order[] = [];
  modalRef?: BsModalRef;
  @ViewChild('orderHistoryModal') orderHistoryModal!: TemplateRef<any>;
  @ViewChild('userModal') userModal!: TemplateRef<any>;
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;
  @ViewChild('createOrderModal') createOrderModal!: TemplateRef<any>;

  userForm: FormGroup;
  createOrderForm: FormGroup;
  isEditMode = false;
  currentUserId?: string;
  userToDelete?: User;
  products: Product[] = [];
  paymentMethods: any[] = [];
  orderStatuses: any[] = [];
  selectedUserForOrder?: User;

  roles = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'dealer' },
    { id: 3, name: 'user' }
  ];

  constructor(
    private usersService: UsersService,
    private productsService: ProductsService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      roleId: [3, Validators.required], // Default to User
      password: [''] // Required only for add
    });

    this.createOrderForm = this.fb.group({
      items: this.fb.array([]),
      paymentMethodId: ['', Validators.required],
      statusId: ['', Validators.required],
      address: ['Chennai', Validators.required] // Hardcoded for now as per requirement context or simple input
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadLookups();
    this.loadProducts();
  }

  loadLookups(): void {
    this.usersService.getLookups().subscribe(data => {
      this.paymentMethods = data.paymentMethods;
      this.orderStatuses = data.orderStatus;
    });
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  filterName = '';
  filterEmail = '';
  filterRole = '';

  loadUsers(): void {
    this.loading = true;
    const filters = {
      name: this.filterName,
      email: this.filterEmail,
      roleId: this.filterRole
    };
    this.usersService.getUsers(filters).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadUsers();
  }

  clearFilters(): void {
    this.filterName = '';
    this.filterEmail = '';
    this.filterRole = '';
    this.loadUsers();
  }

  openAddUserModal(): void {
    this.isEditMode = false;
    this.currentUserId = undefined;
    this.userForm.reset({ roleId: 3 });
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.modalRef = this.modalService.show(this.userModal, { backdrop: 'static', keyboard: false });
  }

  openEditUserModal(user: User): void {
    this.isEditMode = true;
    this.currentUserId = user.id;
    // Map roleName to roleId for the form
    const role = this.roles.find(r => r.name === user.roleName);
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      roleId: role ? role.id : 3,
      phone: user.phone // Phone is not in the User interface currently, might need to fetch or ignore
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.modalRef = this.modalService.show(this.userModal, { backdrop: 'static', keyboard: false });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData = this.userForm.value;
    // If password is empty in edit mode, remove it so it doesn't get hashed as empty string
    if (this.isEditMode && !userData.password) {
      delete userData.password;
    }
    if (this.isEditMode && this.currentUserId) {
      this.usersService.updateUser(this.currentUserId, userData).subscribe({
        next: () => {
          this.userForm.get('password')?.setValue(null);
          this.loadUsers();
          this.modalRef?.hide();
        },
        error: () => alert('Failed to update user')
      });
    } else {
      this.usersService.addUser(userData).subscribe({
        next: () => {
          this.userForm.get('password')?.setValue(null);
          this.loadUsers();
          this.modalRef?.hide();
        },
        error: () => alert('Failed to create user')
      });
    }
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.modalRef = this.modalService.show(this.deleteModal, { backdrop: 'static', keyboard: false, class: 'modal-sm' });
  }

  deleteUser(): void {
    if (this.userToDelete) {
      this.usersService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.loadUsers();
          this.modalRef?.hide();
          this.userToDelete = undefined;
        },
        error: () => alert('Failed to delete user')
      });
    }
  }

  openOrderHistoryModal(user: User): void {
    this.orders = [];
    this.usersService.getUserOrders(user.id).subscribe({
      next: (data) => {
        this.orders = data;
        this.modalRef = this.modalService.show(this.orderHistoryModal, { class: 'modal-lg' });
      },
      error: () => alert('Failed to load user orders')
    });
  }

  openCreateOrderModal(user: User): void {
    this.selectedUserForOrder = user;
    this.createOrderForm.reset({ address: 'Chennai' });
    this.items.clear();
    this.addItem(); // Add one empty item row by default
    this.modalRef = this.modalService.show(this.createOrderModal, { class: 'modal-lg', backdrop: 'static', keyboard: false });
  }

  get items(): FormArray {
    return this.createOrderForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }]
    });

    itemGroup.get('productId')?.valueChanges.subscribe(id => {
      // Ensure id is compared correctly (string vs number)
      const product = this.products.find(p => p.id == Number(id));
      if (product) {
        const qty = itemGroup.get('quantity')?.value || 0;
        itemGroup.patchValue({ price: product.price, total: product.price * qty });
      }
    });

    itemGroup.get('quantity')?.valueChanges.subscribe(qty => {
      const price = itemGroup.get('price')?.value || 0;
      itemGroup.patchValue({ total: price * (qty || 0) });
    });

    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  calculateTotalAmount(): number {
    return this.items.controls.reduce((acc, control) => {
      const total = control.get('total')?.value || 0;
      return acc + total;
    }, 0);
  }

  submitOrder(): void {
    if (this.createOrderForm.invalid) {
      this.createOrderForm.markAllAsTouched();
      return;
    }

    const formValue = this.createOrderForm.getRawValue();
    const orderData = {
      userId: this.selectedUserForOrder?.id,
      paymentMethodId: Number(formValue.paymentMethodId),
      statusId: Number(formValue.statusId),
      address: formValue.address,
      totalAmount: this.calculateTotalAmount(),
      items: formValue.items.map((item: any) => ({
        productId: Number(item.productId),
        quantity: item.quantity,
        price: item.price
      }))
    };

    this.usersService.createOrder(orderData).subscribe({
      next: () => {
        alert('Order created successfully');
        this.loadUsers();
        this.modalRef?.hide();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create order');
      }
    });
  }
}
