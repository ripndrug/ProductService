import css from './ProductModal.module.css';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../../services/productService';

interface ProductModalProps {
  closeModal: () => void;
}

interface ProductFormValues {
  name: string;
  imageUrl: string;
  count: number;
  width: number;
  height: number;
  weight: string;
}

export default function ProductModal({ closeModal }: ProductModalProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    function handleEscapeClose(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }
    document.addEventListener('keydown', handleEscapeClose);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscapeClose);
      document.body.style.overflow = '';
    };
  }, [closeModal]);

  function handleBackdropClose(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }

  const initialValues: ProductFormValues = {
    name: '',
    imageUrl: '',
    count: 0,
    width: 0,
    height: 0,
    weight: '',
  };

  const ProductAddSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name too short')
      .max(100, 'Name too long')
      .required('Name is required'),
    imageUrl: Yup.string().url('Invalid URL').required('Image URL is required'),
    count: Yup.number()
      .min(0, 'Count cannot be negative')
      .required('Count is required'),
    width: Yup.number()
      .min(0, 'Width cannot be negative')
      .required('Width is required'),
    height: Yup.number()
      .min(0, 'Height cannot be negative')
      .required('Height is required'),
    weight: Yup.string().required('Weight is required'),
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    },
  });

  function handleSubmit(
    values: ProductFormValues,
    actions: FormikHelpers<ProductFormValues>
  ) {
    const transformedData = {
      name: values.name,
      imageUrl: values.imageUrl,
      count: values.count,
      size: {
        width: values.width,
        height: values.height,
      },
      weight: values.weight,
      comments: [],
    };

    createProductMutation.mutate(transformedData);
    actions.resetForm();
  }

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClose}
    >
      <div className={css.modal}>
        <h2>Create New Product</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={ProductAddSchema}
          onSubmit={handleSubmit}
        >
          <Form className={css.form}>
            <label>
              Product Name:
              <Field type="text" name="name" className={css.input} />
              <ErrorMessage name="name" component="div" className={css.error} />
            </label>

            <label>
              Image URL:
              <Field type="text" name="imageUrl" className={css.input} />
              <ErrorMessage
                name="imageUrl"
                component="div"
                className={css.error}
              />
            </label>

            <label>
              Count:
              <Field type="number" name="count" className={css.input} />
              <ErrorMessage
                name="count"
                component="div"
                className={css.error}
              />
            </label>

            <div className={css.sizeGroup}>
              <label>
                Width:
                <Field type="number" name="width" className={css.input} />
                <ErrorMessage
                  name="width"
                  component="div"
                  className={css.error}
                />
              </label>

              <label>
                Height:
                <Field type="number" name="height" className={css.input} />
                <ErrorMessage
                  name="height"
                  component="div"
                  className={css.error}
                />
              </label>
            </div>

            <label>
              Weight:
              <Field type="text" name="weight" className={css.input} />
              <ErrorMessage
                name="weight"
                component="div"
                className={css.error}
              />
            </label>

            <div className={css.buttonGroup}>
              <button
                type="button"
                onClick={closeModal}
                className={css.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>,
    document.body
  );
}
