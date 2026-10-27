import { Droplets, ShieldCheck, Sparkles, Leaf } from 'lucide-react';
import { product } from '../config/products';

const icons = [Droplets, Sparkles, Leaf, ShieldCheck];
export function ProductBenefits() {
  return <div className="benefit-list">{product.benefits.map((label, i) => { const Icon = icons[i]; return <div className="benefit" key={label}><span><Icon/></span><p>{label}</p></div>; })}</div>;
}
