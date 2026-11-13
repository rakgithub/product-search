import { useState, type ChangeEvent, type FormEvent } from "react";
import { BRANDS, CATEGORIES } from "../../filterOptions";
import { EMPTY_FILTERS, type ProductFilters as Filters } from "../../types";
import { formatCategory } from "../../utils/formatCategory";
import styles from "./ProductFilters.module.css";

interface ProductFiltersProps {
  onSearch: (filters: Filters) => void;
}

export function ProductFilters({ onSearch }: ProductFiltersProps) {
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);

  const min = draft.minPrice === "" ? undefined : Number(draft.minPrice);
  const max = draft.maxPrice === "" ? undefined : Number(draft.maxPrice);
  const rangeInvalid = min !== undefined && max !== undefined && min > max;

  const update = (field: keyof Filters) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDraft((d) => ({ ...d, [field]: e.target.value }));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!rangeInvalid) onSearch(draft);
  }

  function handleReset() {
    setDraft(EMPTY_FILTERS);
    onSearch(EMPTY_FILTERS);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Product filters">
      <div className={`${styles.field} ${styles.wide}`}>
        <label htmlFor="filter-name">Name</label>
        <input
          id="filter-name"
          type="search"
          placeholder="e.g. ibuprofen"
          value={draft.q}
          onChange={update("q")}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="filter-category">Category</label>
        <select id="filter-category" value={draft.category} onChange={update("category")}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {formatCategory(c)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="filter-brand">Brand</label>
        <select id="filter-brand" value={draft.brand} onChange={update("brand")}>
          <option value="">All brands</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <fieldset className={styles.price}>
        <legend>Price (€)</legend>
        <div className={styles.range}>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="Min"
            aria-label="Minimum price"
            aria-invalid={rangeInvalid}
            value={draft.minPrice}
            onChange={update("minPrice")}
          />
          <span aria-hidden="true">–</span>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="Max"
            aria-label="Maximum price"
            aria-invalid={rangeInvalid}
            value={draft.maxPrice}
            onChange={update("maxPrice")}
          />
        </div>
      </fieldset>

      <div className={styles.actions}>
        <button type="button" className={styles.reset} onClick={handleReset}>
          Reset
        </button>
        <button type="submit" className={styles.submit} disabled={rangeInvalid}>
          Search
        </button>
      </div>

      {rangeInvalid && (
        <p role="alert" className={styles.error}>
          Minimum price can't be higher than maximum price.
        </p>
      )}
    </form>
  );
}
