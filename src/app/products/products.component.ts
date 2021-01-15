import { Subscription } from 'rxjs/Subscription';

import { ShoppingCartService } from './../shopping-cart.service';
import { Product } from './../models/product';
import { ProductService } from './../product.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { ShoppingCart } from 'app/models/shopping-cart';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filtercategory: Product[] = [];
  category: string;
  cart$: Observable<ShoppingCart>;
  
  constructor(
    private productService: ProductService, 
    private route: ActivatedRoute, 
    private shoppingCartService: ShoppingCartService){}
  private applyFilter(){
    this.filtercategory = (this.category) ?
    this.products.filter(p => p.category === this.category) : 
    this.products;
  }

  private populateProducts(){
    
    this.productService
    .getAll()
    .switchMap(products => {
      this.products = products;
      return this.route.queryParamMap;
    })
    .subscribe(params => {
      this.category = params.get('category');
      this.applyFilter();
    });
  }

  async ngOnInit(){
   this.cart$ = await this.shoppingCartService.getCart();
   this.populateProducts();
  }
 
}
