
import { Product } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Hydrating Hyaluronic Serum",
    brand: "SkinLog Essentials",
    category: "Serum",
    ingredients: ["Hyaluronic Acid", "Vitamin B5"],
    imageUrl: "https://picsum.photos/seed/serum1/200/200",
    matchReason: "Perfect for boosting hydration in dry areas."
  },
  {
    id: "p2",
    name: "Clarifying BHA Cleanser",
    brand: "ClearPure",
    category: "Cleanser",
    ingredients: ["Salicylic Acid", "Tea Tree Oil"],
    imageUrl: "https://picsum.photos/seed/cleanse1/200/200",
    matchReason: "Targeted at controlling oil and clearing troubles."
  },
  {
    id: "p3",
    name: "Cera-Repair Barrier Cream",
    brand: "DermoCare",
    category: "Moisturizer",
    ingredients: ["Ceramides", "Squalane"],
    imageUrl: "https://picsum.photos/seed/cream1/200/200",
    matchReason: "Strengthens sensitive or compromised skin barriers."
  },
  {
    id: "p4",
    name: "Aze-Bright Pigment Corrector",
    brand: "LumaSkin",
    category: "Treatment",
    ingredients: ["Azelaic Acid", "Niacinamide"],
    imageUrl: "https://picsum.photos/seed/bright1/200/200",
    matchReason: "Reduces the appearance of dark spots and pigmentation."
  }
];

export const SKIN_TYPE_COLORS = {
  Dry: "text-blue-600 bg-blue-50",
  Oily: "text-yellow-600 bg-yellow-50",
  Combination: "text-purple-600 bg-purple-50",
  Sensitive: "text-red-600 bg-red-50",
  Normal: "text-green-600 bg-green-50"
};
