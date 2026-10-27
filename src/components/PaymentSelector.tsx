import { Banknote, Check } from 'lucide-react';
import type { PaymentMethod } from '../config/products';

export function PaymentSelector({value,onChange}:{value:PaymentMethod;onChange:(value:PaymentMethod)=>void}) {
  const items = [{id:'bkash' as const,name:'bKash',mark:'✦',className:'bkash'},{id:'nagad' as const,name:'Nagad',mark:'◉',className:'nagad'},{id:'cod' as const,name:'Cash on Delivery',mark:<Banknote/>,className:'cod'}];
  return <fieldset className="form-fieldset"><legend>Payment Method</legend><div className="choice-grid">{items.map(item=><button type="button" key={item.id} className={`choice-card ${value===item.id?'selected':''}`} onClick={()=>onChange(item.id)} aria-pressed={value===item.id}><span className="radio">{value===item.id&&<Check/>}</span><span className={`payment-mark ${item.className}`}>{item.mark}</span><strong>{item.name}</strong></button>)}</div><p className="field-note">bKash and Nagad selection is recorded only. Online payment is not enabled yet.</p></fieldset>;
}
