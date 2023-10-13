import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService:ProductsService
  ){}

  async runSeed() {
    this.insertNewProducts();
    return `Seed executed`;
  }

  private async insertNewProducts(){
    await this.productsService.deleteAllProducts()
    
    const productos= initialData.products;

    const insertPromises=[]
    // productos.forEach( producto=>{
    //   insertPromises.push( this.productsService.create(producto) );
    // })
    
    await Promise.all( insertPromises );
    return true;
  }
  
}
