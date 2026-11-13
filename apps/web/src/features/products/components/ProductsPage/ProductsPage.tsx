import { useProductSearch } from "../../hooks/useProductSearch";
import { formatResultRange } from "../../utils/formatResultRange";
import { Pagination } from "../Pagination/Pagination";
import { ProductFilters } from "../ProductFilters/ProductFilters";
import { ProductList } from "../ProductList/ProductList";
import styles from "./ProductsPage.module.css";

export function ProductsPage() {
  const { products, pagination, status, search, goToPage } = useProductSearch();

  const range = status === "success" && pagination ? formatResultRange(pagination) : "";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Products</h1>
        {range && <p>{range}</p>}
      </header>

      <ProductFilters onSearch={search} />

      <section aria-label="Results" className={styles.results}>
        <ProductList products={products} status={status} />
        {status === "success" && pagination && (
          <Pagination pagination={pagination} onPageChange={goToPage} />
        )}
      </section>
    </div>
  );
}
