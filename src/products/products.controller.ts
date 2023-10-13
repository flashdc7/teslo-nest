import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthDecorator, getUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/entities/auth.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @AuthDecorator( ValidRoles.admin )
  create(
    @Body() createProductDto: CreateProductDto,
    @getUser() user: Auth,
    ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @AuthDecorator( ValidRoles.admin )
  findAll( @Query() paginationDto: PaginationDto) {
    // console.log(paginationDto);
    
    return this.productsService.findAll( paginationDto );
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlane(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @getUser() user: Auth
    ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
