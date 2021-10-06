import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProductsService {
  #baseURL = process.env.PRODUCTS;

  async getProductsList() {
    const { data } = await axios.get(`${this.#baseURL}/products`);
    return data;
  }

  async getProductById(id: string) {
    const { data } = await axios.get(`${this.#baseURL}/products/${id}`);
    return data;
  }

  async putProduct(product) {
    const { data } = await axios.put(`${this.#baseURL}/products`, product);
    return data;
  }

  async deleteProduct(id: string) {
    const { data } = await axios.delete(`${this.#baseURL}/products/${id}`);
    return data;
  }
}
