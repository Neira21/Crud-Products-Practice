import { Component, inject, signal } from '@angular/core';
import { ProductService } from './services/product.service';
import { JsonPipe } from '@angular/common';
import { products } from './types/products';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export default class ProductsComponent {
  private productService = inject(ProductService);

  // Signals para el estado
  products = signal<products[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    this.loadProducts();
  }

  getImageUrl(imageUrl: string): string {
    return this.productService.getFullImageUrl(imageUrl);
  }

  loadProducts(): void {
    console.log('Loading products...');
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProduct().subscribe({
      next: (data: products[]) => {
        console.log('Products received:', data);
        this.products.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error.set('Error al cargar los productos: ' + error.message);
        this.loading.set(false);
      },
    });
  }
}
