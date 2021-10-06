import {
  Controller,
  Get,
  Body,
  Bind,
  Param,
  Put,
  Delete,
  Dependencies,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
@Dependencies(ProductsService)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProductsList() {
    return this.productsService.getProductsList();
  }

  @Get(':id')
  @Bind(Param('id'))
  getProductById(id: string) {
    return this.productsService.getProductById(id);
  }

  @Put()
  @Bind(Body())
  putProduct(product) {
    return this.productsService.putProduct(product);
  }

  @Delete(':id')
  @Bind(Param('id'))
  deleteProduct(id: string) {
    return this.productsService.deleteProduct(id);
  }
}
