import {
    Controller,
    Get,
    Body,
    Bind,
    Put,
    Dependencies,
  } from '@nestjs/common';
  import { CartService } from './cart.service';

  @Controller('profile/cart')
  @Dependencies(CartService)
  export class CartController {
    constructor(private cartService: CartService) {}

    @Get()
    getItemsInCart() {
      return this.cartService.getItemsInCart();
    }

    @Put()
    @Bind(Body())
    putProductsInCart(items) {
      return this.cartService.putProductsInCart(items);
    }
  }
