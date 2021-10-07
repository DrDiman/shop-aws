import { Request, Response, NextFunction } from 'express';
import { BadGatewayException } from '@nestjs/common';

const PRODUCTS_SERVICE = 'products';
const CART_SERVICE = 'cart';

const API_URL = {
  [PRODUCTS_SERVICE]: '/products',
  [CART_SERVICE]: '/profile/cart',
};

const MAP_PATH_TO_REDIRECTION_URL = {
  [API_URL[PRODUCTS_SERVICE]]: process.env.PRODUCTS,
  [API_URL[CART_SERVICE]]: process.env.CART,
};

const checkPaths = () => (req: Request, res: Response, next: NextFunction) => {
  if (
    !Object.values(API_URL).find(url => url === req.url) ||
    !MAP_PATH_TO_REDIRECTION_URL[req.url]
  ) {
    throw new BadGatewayException('Cannot process request');
  }
  next();
};

export { checkPaths };
