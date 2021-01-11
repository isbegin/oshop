import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';

@Injectable()
export class ProductService {

  constructor(private db:AngularFireDatabase) { }
  create(product){
    return this.db.list('/products').push(product);
  }

  getAll():Observable<Product[]>{
    return this.db.list('/products');
  }

  get(productId){
  return this.db.object('/products/'+ productId);
  }

  update(id,product){
    return this.db.object('/products/'+ id).update(product);
  }

  delete(id){
    return this.db.object('/products/'+ id).remove();
  }

}
