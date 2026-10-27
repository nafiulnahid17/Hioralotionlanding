import { MessageCircle, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { brand } from '../config/brand';

export function Footer() {
  return <footer id="contact"><p className="help-title">Need Help? Contact Us</p><div className="contact-grid"><a className="contact-button whatsapp" href={brand.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle/><span><small>WhatsApp</small>{brand.phone}</span></a><a className="contact-button facebook" href={brand.facebookUrl} target="_blank" rel="noreferrer"><span className="facebook-mark" aria-hidden="true">f</span><span><small>Facebook Page</small>{brand.facebookName}</span></a></div><div className="trust-row"><span><PackageCheck/>Genuine Products</span><span><ShieldCheck/>Secure Ordering</span><span><Truck/>Nationwide Delivery</span></div><p className="copyright">© 2026 Hiora. Premium Korean Skincare.</p></footer>;
}
