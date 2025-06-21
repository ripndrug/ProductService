import { createPortal } from 'react-dom';
import css from './ConfirmDelete.module.css';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProduct } from '../../services/productService';

interface ConfirmDeleteProps {
  closeDelete: () => void;
  id: number;
}

export default function ConfirmDelete({ closeDelete, id }: ConfirmDeleteProps) {
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeDelete();
    },
  });

  useEffect(() => {
    function handleEscapeClose(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeDelete();
      }
    }
    document.addEventListener('keydown', handleEscapeClose);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscapeClose);
      document.body.style.overflow = '';
    };
  }, [closeDelete]);

  function handleBackdropClose(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      closeDelete();
    }
  }

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClose}
    >
      <div className={css.modal}>
        <p>Please confirm if you wish to delete that item</p>
        <button onClick={() => deleteProductMutation.mutate(id)}>Yes</button>
        <button onClick={closeDelete}>No</button>
      </div>
    </div>,
    document.body
  );
}
