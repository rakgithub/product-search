import type { Product } from "../../types";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from "./ProductList.module.css";

interface ProductListProps {
  products: Product[];
  status: "loading" | "error" | "success";
}

export function ProductList({ products, status }: ProductListProps) {
  if (status === "loading") return <p className={styles.message}>Loading products...</p>;
  if (status === "error") {
    return <p className={`${styles.message} ${styles.error}`}>Could not load products</p>;
  }
  if (products.length === 0) return <p className={styles.message}>No products found</p>;

  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
