import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

interface NewProduct {
    name: string;
    imageUrl: string;
    count: number;
    size: {
      width: number;
      height: number;
    };
    weight: string;
    comments: string[];
  }

export async function fetchProduct() {
    const response = await axios.get('/products');

  return response.data;
}

export async function deleteProduct(productId: number) {
  const response = await axios.delete(`/products/${productId}`);
  return response.data;
}

export async function createProduct(productData: NewProduct) {
  const response = await axios.post(`/products/`, productData);
  return response.data;
}