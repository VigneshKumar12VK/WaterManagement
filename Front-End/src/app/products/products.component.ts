import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductsService, Product } from './products.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';

  @ViewChild('productModal') productModal!: TemplateRef<any>;
  @ViewChild('productForm') productForm!: NgForm;
  modalRef?: BsModalRef;
  editMode = false;
  modalProduct: Partial<Product> = {};

  constructor(private productsService: ProductsService, private bsModalService: BsModalService) { }

  ngOnInit() {
    this.productsService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  filteredProducts(): Product[] {
    if (!this.searchTerm) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.size.toLowerCase().includes(term)
    );
  }

  openAddProduct() {
    this.editMode = false;
    this.modalProduct = {};
    this.modalRef = this.bsModalService.show(this.productModal);
  }

  openEditProduct(product: Product) {
    this.editMode = true;
    this.modalProduct = { ...product };
    this.modalRef = this.bsModalService.show(this.productModal);
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = undefined;
    }
    this.modalProduct = {};
  }

  saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.control.markAllAsTouched();
      return;
    }

    if (this.editMode && this.modalProduct.id) {
      // Edit product
      this.productsService.editProduct(this.modalProduct as Product).subscribe(() => {
        this.refreshProducts();
        this.closeModal();
      });
    } else {
      // Add product
      this.productsService.addProduct(this.modalProduct as Product).subscribe(() => {
        this.refreshProducts();
        this.closeModal();
      });
    }
  }

  deleteProduct(product: Product) {
    if (confirm(`Delete product: ${product.name}?`)) {
      this.productsService.deleteProduct(product.id).subscribe(() => {
        this.refreshProducts();
      });
    }
  }

  refreshProducts() {
    this.productsService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
}
