import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Renderer2,
  QueryList
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BusinessService } from '../../../../services/business/business.service';
import { ProductService } from '../../../../services/product/product.service';
import { Business } from '../../../../models/business';
import { Product } from '../../../../models/product';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { CouponCardComponent } from '../coupon-card/coupon-card.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, SearchFilterComponent, CouponCardComponent, RouterModule,],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  providers: [DatePipe],
})
export class HomepageComponent implements OnInit, AfterViewInit {
  businesses: Business[] = [];
  products: Product[] = [];
  errorMessage: string = '';

  @ViewChild('businessTrack', { static: false }) businessTrack!: ElementRef<HTMLDivElement>;
  @ViewChild('productTrack', { static: false }) productTrack!: ElementRef<HTMLDivElement>;


  businessArray: Business[] = [];
  productArray: Product[] = [];

  filteredBusinesses: Business[] = [];
  filteredProducts: Product[] = [];


  //Products

  couponPrices: { [key: number]: number } = {};
  couponCreateDates: { [key: number]: Date } = {};
  couponExpDates: { [key: number]: Date } = {};

  constructor(
    private businessService: BusinessService,
    private productService: ProductService,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadBusinesses();
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    console.log('View Initialized');
  }

  loadBusinesses(): void {
    this.businessService.getAllBusinesses().subscribe({
      next: (data) => {
        this.businesses = data;
        this.businessArray = [...this.businesses];
        this.filteredBusinesses = [...this.businesses];
      },
      error: (err) => {
        this.errorMessage = 'Failed to load businesses.';
        console.error(err);
      },
    });
  }

  loadProducts(): void {
    this.productService.getEveryProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.productArray = [...this.products];
        this.filteredProducts = [...this.products];
      },
      error: (err) => {
        this.errorMessage = 'Failed to load products.';
        console.error(err);
      },
    });
  }

  scrollLeft(track: HTMLDivElement, items: any[]): void {
    const trackEl = track;
    const currentScroll = trackEl.scrollLeft;

    if (currentScroll === 0) {
      const lastItem = items.pop();
      if (lastItem) {
        items.unshift(lastItem); // Move the last item to the beginning
      }
      this.renderer.setStyle(trackEl, 'scroll-behavior', 'auto'); // Disable smooth scroll for reset
      trackEl.scrollLeft = trackEl.scrollWidth; // Jump to the end
      setTimeout(() => {
        this.renderer.setStyle(trackEl, 'scroll-behavior', 'smooth'); // Re-enable smooth scroll
      });
    } else {
      trackEl.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(track: HTMLDivElement, items: any[]): void {
    const trackEl = track;
    const currentScroll = trackEl.scrollLeft;

    if (currentScroll + trackEl.clientWidth >= trackEl.scrollWidth) {
      const firstItem = items.shift();
      if (firstItem) {
        items.push(firstItem);
      }
      this.renderer.setStyle(trackEl, 'scroll-behavior', 'auto');
      trackEl.scrollLeft = 0;
      setTimeout(() => {
        this.renderer.setStyle(trackEl, 'scroll-behavior', 'smooth');
      });
    } else {
      trackEl.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }


  viewBusinessDetails(id: number): void {
    this.router.navigate(['/homepage/business/detail' + id])

  }

  viewProductDetails(id: number): void {
  }

  filterItems(searchTerm: string): void {
    this.filteredBusinesses = this.businesses.filter((business) =>
      business.name.toLowerCase().includes(searchTerm)
    );
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
  }



  //Products ***
  getImageUrl(imagePath: string): any {
    return this.businessService.getImageUrl(imagePath);
  }

  getCouponPrice(productId: number): number {
    return this.couponPrices[productId] || 0; // Default to 0 if no coupon price is available
  }
  // getCouponValidity(productId: number): string {
  //   const createDate = this.datePipe.transform(this.couponCreateDates[productId], 'MMM d EEE');
  //   const expDate = this.datePipe.transform(this.couponExpDates[productId], 'MMM d EEE');
  //   return createDate && expDate ? `${createDate} ~ ${expDate}` : '';
  // }

}
