import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ConfigModule.forRoot(), ProductsModule, CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
