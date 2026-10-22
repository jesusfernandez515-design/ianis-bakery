export type CatalogProduct = {
  id: string; name: string; price: number; image: string;
  tag?: string; description?: string; active?: boolean; fallbackImage?: string;
};
export const fallbackProducts: CatalogProduct[] = [
  {
    id: "nutella",
    name: "Nutella Supreme",
    price: 4.99,
    tag: "Nueva",
    description:
      "Cookie rellena de Nutella cremosa con chispas de chocolate.",
    image: "/nutella.png",
    active: true,
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter Explosion",
    price: 4.99,
    tag: "Especial",
    description:
      "Mantequilla de maní cremosa con chispas de chocolate.",
    image: "/peanut-butter.png",
    active: true,
  },
  {
    id: "double-chocolate",
    name: "Double Chocolate Lava",
    price: 4.99,
    tag: "Favorita",
    description:
      "Chocolate intenso con un irresistible centro fundido.",
    image: "/double-chocolate.png",
    active: true,
  },
  {
    id: "dulce-leche",
    name: "Dulce de Leche Dream",
    price: 4.99,
    tag: "Premium",
    description:
      "Cookie artesanal rellena de dulce de leche cremoso.",
    image: "/dulce-leche.png",
    active: true,
  },
  {
    id: "marshmallow",
    name: "Marshmallow Chocolate",
    price: 5.49,
    tag: "Especial",
    description:
      "Malvavisco suave con chocolate irresistible.",
    image: "/marshmallow.png",
    active: true,
  },
  {
    id: "coconut",
    name: "Coconut Paradise",
    price: 5.49,
    tag: "Tropical",
    description:
      "Chocolate relleno de coco cremoso y coco rallado.",
    image: "/coconut.png",
    active: true,
  },
];
