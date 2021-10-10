import { Request, Response, NextFunction } from 'express';
import { BadGatewayException } from '@nestjs/common';

const SERVICE = {
  PRODUCTS: 'products',
  CART: 'cart',
};

const MAP_PATH_TO_REDIRECTION_URL = {
  [SERVICE.PRODUCTS]: process.env.PRODUCTS,
  [SERVICE.CART]: process.env.CART,
};

const checkPaths = () => (req: Request, res: Response, next: NextFunction) => {
  const service = Object.values(SERVICE).find(s => req.url.includes(s));

  if (!service || !MAP_PATH_TO_REDIRECTION_URL[service]) {
    throw new BadGatewayException('Cannot process request');
  }
  next();
};

export { checkPaths };
