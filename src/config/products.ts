export type DeliveryArea = 'inside_dhaka' | 'outside_dhaka';
export type PaymentMethod = 'bkash' | 'nagad' | 'cod';

export const product = {
  id: 'aplb-glutathione-niacinamide-body-lotion-300ml',
  brand: 'APLB',
  name: 'Glutathione Niacinamide Body Lotion',
  size: '300ml',
  originalPrice: 1899,
  offerPrice: 1580,
  postOfferPrice: 1899,
  offerEndsAt: '2026-12-01T00:00:00+06:00',
  quantity: 1,
  image: '/assets/products/aplb/aplb-bottle.webp',
  benefits: ['Deep Moisturizing', 'Brighter-Looking Skin Tone', 'Softer, Healthier Skin', 'Helps Improve Uneven Tone'],
  keyIngredients: ['Centella Asiatica Extract (12.3%)', 'Glutathione (1,000ppm)', 'Niacinamide (1,000ppm)', 'Sodium Hyaluronate', 'Squalane'],
  ingredients: ['Water', 'Centella Asiatica Extract (12.3%)', 'Glycerin', 'Cetyl Ethylhexanoate', 'Cetearyl Alcohol', 'Glyceryl Stearate', 'Glutathione (1,000ppm)', 'Niacinamide (1,000ppm)', 'Madecassic Acid', 'Asiaticoside', 'Asiatic Acid', 'Solanum Melongena (Eggplant) Fruit Extract', 'Melaleuca Alternifolia (Tea Tree) Leaf Extract', 'Hydrolyzed Collagen', 'Beta-Glucan', 'Hippophae Rhamnoides Fruit Extract', 'Nelumbo Nucifera Extract', 'Artemisia Annua Extract', 'Oryza Sativa (Rice) Extract', 'Saccharomyces Ferment', 'Squalane', 'Sodium Hyaluronate', 'Dipropylene Glycol', 'Butylene Glycol', 'Hydrogenated Lecithin', 'Cholesterol', 'Xanthan Gum', 'Potassium Hydroxide', 'Disodium EDTA', 'Caprylic/Capric Triglyceride', 'Cyclopentasiloxane', 'Cyclohexasiloxane', 'Saccharide Hydrolysate', 'Sorbitan Stearate', 'Dimethicone', 'PEG-100 Stearate', 'Stearic Acid', '1,2-Hexanediol', 'Chlorphenesin', 'Carbomer', 'Caprylyl Glycol'],
  deliveryFees: { inside_dhaka: 80, outside_dhaka: 150 } satisfies Record<DeliveryArea, number>,
} as const;

export function getPrice(now = new Date()): { price: number; isOfferActive: boolean } {
  const isOfferActive = now.getTime() < new Date(product.offerEndsAt).getTime();
  return { price: isOfferActive ? product.offerPrice : product.postOfferPrice, isOfferActive };
}

export const taka = (amount: number) => `৳${new Intl.NumberFormat('en-BD').format(amount)}`;
