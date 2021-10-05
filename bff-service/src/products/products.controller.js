import {
  Controller,
  Get,
  Post,
  Body,
  Bind,
  Dependencies,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
@Dependencies(ProductsService)
export class ProductsController {
  constructor(productsService) {
    this.productsService = productsService;
  }
}

// import { Controller, Get, Post, Body, Bind, Dependencies } from '@nestjs/common';
// import { CatsService } from './cats.service';

// @Controller('cats')
// @Dependencies(CatsService)
// export class CatsController {
//   constructor(catsService) {
//     this.catsService = catsService;
//   }

//   @Post()
//   @Bind(Body())
//   async create(createCatDto) {
//     this.catsService.create(createCatDto);
//   }

//   @Get()
//   async findAll() {
//     return this.catsService.findAll();
//   }
// }
