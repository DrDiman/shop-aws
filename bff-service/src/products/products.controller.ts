import {
  Controller,
  Get,
  Body,
  Bind,
  Param,
  Put,
  Delete,
  Dependencies,
  CacheTTL,
} from '@nestjs/common';
import { ProductsService } from './products.service';

const TTL_TWO_MIN = 120;
const TTL_NO_CACHE = 0;

@Controller('products')
@Dependencies(ProductsService)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @CacheTTL(TTL_TWO_MIN)
  @Get()
  getProductsList() {
    return this.productsService.getProductsList();
  }

  @CacheTTL(TTL_NO_CACHE)
  @Get(':id')
  @Bind(Param('id'))
  getProductById(id: string) {
    return this.productsService.getProductById(id);
  }

  @CacheTTL(TTL_NO_CACHE)
  @Put()
  @Bind(Body())
  putProduct(product) {
    return this.productsService.putProduct(product);
  }

  @CacheTTL(TTL_NO_CACHE)
  @Delete(':id')
  @Bind(Param('id'))
  deleteProduct(id: string) {
    return this.productsService.deleteProduct(id);
  }
}
