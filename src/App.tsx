import './App.css';
import { useState } from 'react';
import ProductList from './components/ProductList/ProductList';
import SearchBar from './components/SearchBar/SearchBar';
import { fetchProduct } from './services/productService';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ProductModal from './components/ProductModal/ProductModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProduct,
    placeholderData: keepPreviousData,
  });

  console.log(data);

  return (
    <>
      <SearchBar openModal={openModal} />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching data</p>}
      {data && <ProductList products={data} />}
      {isModalOpen && <ProductModal closeModal={closeModal} />}
    </>
  );
}
