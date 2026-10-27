import { motion } from 'motion/react';
import { getPrice, product, taka, type DeliveryArea } from '../config/products';

export function OrderSummary({area}:{area:DeliveryArea}) {
  const {price}=getPrice(); const delivery=product.deliveryFees[area];
  return <div className="order-summary"><div><span>Product × 1</span><strong>{taka(price)}</strong></div><div><span>Delivery Charge</span><motion.strong key={delivery} initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}>{taka(delivery)}</motion.strong></div><div className="total-row"><span>Total Payable</span><motion.strong key={price+delivery} initial={{scale:.95}} animate={{scale:1}}>{taka(price+delivery)}</motion.strong></div></div>;
}
