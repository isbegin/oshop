import { Product } from './models/product';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import { DatabaseSnapshot } from 'angularfire2/interfaces';
@Injectable()
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  private create(){
    return this.db.list('/shopping-carts').push({
      dateCreated : new Date().getTime()
    });
  }

  async getCart(){
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-cart'+ cartId);
  }
  
  getItem(cartId: string,productId:string){
    return this.db.object('/shopping-carts/'+ cartId + '/items/'+ productId);
  }

  private async getOrCreateCartId(): Promise<string>
    {
      let cartId = localStorage.getItem('cartId');
      if (cartId) return cartId;
      
      let result = await this.create();
      localStorage.setItem('cartId', result.key);
      return result.key;      
    }
  
  async addToCart( product : Product){
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId,product.$key);
    item$.take(1).subscribe(item => {
      item$.update({ product:product, quantity: (item.quantity || 0 ) + 1});
    });
  }
}
