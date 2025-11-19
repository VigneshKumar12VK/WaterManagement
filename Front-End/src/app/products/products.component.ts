import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from './products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';

  showModal = false;
  editMode = false;
  modalProduct: Partial<Product> = {};

  constructor(private productsService: ProductsService) {}

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
    this.showModal = true;
  }

  openEditProduct(product: Product) {
    this.editMode = true;
    this.modalProduct = { ...product };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalProduct = {};
  }

  saveProduct() {
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
