import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CartService {
  #baseURL = process.env.CART;

  async getItemsInCart() {
    const { data } = await axios.get(`${this.#baseURL}/profile/cart`);
    return data;
  }

  async putProductsInCart(items) {
    const { data } = await axios.put(`${this.#baseURL}/profile/cart`, items);
    return data;
  }
}
