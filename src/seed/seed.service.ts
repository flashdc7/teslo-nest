import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService:ProductsService,

    @InjectRepository( Auth)
    private readonly userRepository: Repository<Auth>
  ){}

  async runSeed() {
    await this.deleteTables()

    const adminUser= await this.inserUsers();

    await this.insertNewProducts( adminUser );
    return `Seed executed`;
  }

  private async deleteTables(){
    await this.productsService.deleteAllProducts()

    const queryBuilder= this.userRepository.createQueryBuilder()
    await queryBuilder
          .delete()
          .where({})
          .execute()
  }

  private async inserUsers(){
    const seedUsers= initialData.users;
    const users: Auth[]= [];

    seedUsers.forEach( user=>{
      users.push( this.userRepository.create( user ) )
    } )

    const userDB= await this.userRepository.save( seedUsers );
    return userDB[0]
  }

  private async insertNewProducts( user: Auth ){
    await this.productsService.deleteAllProducts()
    
    const productos= initialData.products;

    const insertPromises=[]
    productos.forEach( producto=>{
      insertPromises.push( this.productsService.create(producto, user) );
    })
    
    await Promise.all( insertPromises );
    return true;
  }
  
}
