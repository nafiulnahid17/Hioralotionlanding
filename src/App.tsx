import { BadgeCheck, ShieldCheck, Truck } from 'lucide-react';
import { Header } from './components/Header';
import { ProductHero } from './components/ProductHero';
import { PriceCard } from './components/PriceCard';
import { IngredientsCard } from './components/IngredientsCard';
import { OrderForm } from './components/OrderForm';
import { Footer } from './components/Footer';

export default function App() {
  return <div className="page-shell"><Header/><main><div className="desktop-grid"><div><ProductHero/><PriceCard/><div className="trust-strip"><span><BadgeCheck/>100% Original<br/>Products</span><span><Truck/>Fast & Secure<br/>Delivery</span><span><ShieldCheck/>Trusted by<br/>Thousands</span></div><IngredientsCard/></div><div className="checkout-column"><OrderForm/></div></div></main><Footer/></div>;
}
