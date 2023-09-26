import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid'

@Injectable()
export class ProductsService {
  private readonly logger= new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const product= this.productRepository.create( createProductDto ); 
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async findAll( paginationDto:PaginationDto ) {
    const { limit=10, offset=10}= paginationDto;
    return await this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    });
  }

  async findOne(term: string) {
    let producto: Product;

    if( !producto && isUUID(term) ){
      producto= await this.productRepository.findOneBy({id: term})
    }else{
      const queryBuilder= this.productRepository.createQueryBuilder()
      producto= await queryBuilder.where('UPPER(title)= :title or slug= :slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      }).getOne()
      // producto= await this.productRepository.findOneBy({ slug: term })
    }

    if( !producto )
      throw new NotFoundException(`El producto con el ID ${term} no fue encontrado`)

    return producto;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const producto= await this.productRepository.preload({
      id: id,
      ...updateProductDto
    })

    if( !producto )
      throw new NotFoundException( `El producto con el id: ${id} no exite` )

    try {
      return await this.productRepository.save( producto );
    } catch (error) {
      this.handleExceptions( error );
    }

  }

  async remove(id: string) {
    const producto= await this.findOne( id );

    return await this.productRepository.remove(producto)
  }

  private handleExceptions( error: any ){
    if( error.code === '23505' )
        throw new BadRequestException(error.detail);

      this.logger.error(error);
      throw new InternalServerErrorException('Ayudaaaaaaa');
  }
}
