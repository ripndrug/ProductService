import type Product from '../../types/product';
import css from './ProductList.module.css';
import { useState } from 'react';
import ConfirmDelete from '../ConfirmDelete/ConfirmDelete';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function openDelete(id: number) {
    setDeleteId(id);
  }

  function closeDelete() {
    setDeleteId(null);
  }

  return (
    <>
      <ul>
        {products.map(product => (
          <li key={product.id} className={css.productCard}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className={css.productImage}
            />
            <h3 className={css.productName}>{product.name}</h3>
            <p>
              <strong>Count:</strong> {product.count}
            </p>
            <p>
              <strong>Size:</strong> {product.size.width} x{' '}
              {product.size.height}
            </p>
            <p>
              <strong>Weight:</strong> {product.weight + 'g'}
            </p>
            <button onClick={() => openDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {deleteId && <ConfirmDelete closeDelete={closeDelete} id={deleteId} />}
    </>
  );
}
