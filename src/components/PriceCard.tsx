import { Clock3 } from 'lucide-react';
import { getPrice, product, taka } from '../config/products';

export function PriceCard() {
  const { price, isOfferActive } = getPrice();
  return <section className="price-card" aria-label="Product offer">
    <div><span className="label">{isOfferActive ? 'Special Offer' : 'Current Price'}</span>{isOfferActive && <p className="original">Price: <s>{taka(product.originalPrice)}</s></p>}<strong className="offer-price">{taka(price)} <small>only</small></strong></div>
    <div className="deadline"><Clock3/><p>{isOfferActive ? <>Offer valid until<br/><strong>30 November 2026</strong></> : <><strong>Promotion ended</strong><br/>Current price applies</>}</p></div>
  </section>;
}
