import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';

describe('Products Controller', () => {
  let controller;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProductsController],
    }).compile();

    controller = module.get(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
