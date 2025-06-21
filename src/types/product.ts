export default interface Product {
    id: number,
    imageUrl: string,
    name: string,
    count: number
    size: ProductSize,
    weight: string,
    comments: Comment
}

interface ProductSize {
    width: number,
    height: number,
}

interface Comment {
    id: number;
    productId: number;
    description: string;
    date: string;
  }
