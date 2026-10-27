import { MapPin } from 'lucide-react';
import { product, taka, type DeliveryArea } from '../config/products';

export function DeliverySelector({value,onChange}:{value:DeliveryArea;onChange:(value:DeliveryArea)=>void}) {
  return <fieldset className="form-fieldset"><legend>Delivery Charge Preview</legend><div className="delivery-grid">
    <button type="button" className={`delivery-card ${value==='inside_dhaka'?'selected':''}`} onClick={()=>onChange('inside_dhaka')}><MapPin/><span>Inside Dhaka<strong>{taka(product.deliveryFees.inside_dhaka)}</strong></span></button>
    <button type="button" className={`delivery-card ${value==='outside_dhaka'?'selected':''}`} onClick={()=>onChange('outside_dhaka')}><MapPin/><span>Outside Dhaka<strong>{taka(product.deliveryFees.outside_dhaka)}</strong></span></button>
  </div></fieldset>;
}
