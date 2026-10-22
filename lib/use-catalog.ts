"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fallbackProducts, type CatalogProduct } from "@/lib/catalog";

export function useCatalog() {
  const [catalog, setCatalog] = useState({ products: fallbackProducts, loading: true });
  useEffect(() => {
    const timeout = setTimeout(() => setCatalog(current => ({ ...current, loading: false })), 10000);
    const stop = onSnapshot(collection(db, "products"), snapshot => {
      clearTimeout(timeout);
      const products = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CatalogProduct))
        .filter(product => product.active !== false && typeof product.name === "string" && Number.isFinite(product.price) && product.price >= 0)
        .map(product => ({ ...product, image: product.image || "/logo-ianis.png" }));
      // An intentionally inactive catalog must stay empty.
      setCatalog({ products: snapshot.empty ? fallbackProducts : products, loading: false });
    }, () => { clearTimeout(timeout); setCatalog({ products: fallbackProducts, loading: false }); });
    return () => { clearTimeout(timeout); stop(); };
  }, []);
  return catalog;
}
