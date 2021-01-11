import { Subscription } from 'rxjs/Subscription';

import { ShoppingCartService } from './../shopping-cart.service';
import { Product } from './../models/product';
import { ProductService } from './../product.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit,OnDestroy {
  products: Product[] = [];
  filtercategory: Product[] = [];
  category: string;
  cart;
  subscription: Subscription;
  
  constructor(
    productService: ProductService, 
    route: ActivatedRoute, 
    private shoppingCartService: ShoppingCartService)
  {
    productService
      .getAll()
      .switchMap(products => {
        this.products = products;
        return route.queryParamMap;
      })
      .subscribe(params => {
        this.category = params.get('category');

        this.filtercategory = (this.category) ?
          this.products.filter(p => p.category === this.category) : 
          this.products;
      });

  }
  async ngOnInit(){
   this.subscription = (await this.shoppingCartService.getCart())
   .subscribe(cart => this.cart = cart);
  }
 
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
