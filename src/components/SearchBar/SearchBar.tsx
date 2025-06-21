import css from './SearchBar.module.css';

interface OpenModal {
  openModal: () => void;
}

export default function SearchBar({ openModal }: OpenModal) {
  return (
    <div className={css.container}>
      <button type="submit" className="create-product" onClick={openModal}>
        Create Product
      </button>
    </div>
  );
}
