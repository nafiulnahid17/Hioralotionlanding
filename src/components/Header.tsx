import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function Header() {
  const [open, setOpen] = useState(false);
  const go = (id: string) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  return <header className="site-header">
    <button className="icon-button" aria-label="Open menu" onClick={() => setOpen(true)}><Menu /></button>
    <button className="brand-button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <img src="/assets/branding/hiora-logo.webp" alt="Hiora — Premium Korean Skincare" />
    </button>
    <div className="header-actions">
      <button className="icon-button" aria-label="Go to ingredients" onClick={() => go('ingredients')}><Search /></button>
      <button className="icon-button cart-button" aria-label="Go to order form" onClick={() => go('order')}><ShoppingCart/><span>1</span></button>
    </div>
    <AnimatePresence>{open && <>
      <motion.button aria-label="Close menu" className="menu-backdrop" onClick={() => setOpen(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />
      <motion.nav className="mobile-menu" aria-label="Primary navigation" initial={{x:'-100%'}} animate={{x:0}} exit={{x:'-100%'}} transition={{type:'spring', damping:28, stiffness:280}}>
        <div className="menu-top"><img src="/assets/branding/hiora-logo.webp" alt="Hiora"/><button className="icon-button" onClick={() => setOpen(false)} aria-label="Close menu"><X/></button></div>
        <button onClick={() => go('product')}>Product details</button>
        <button onClick={() => go('ingredients')}>Ingredients</button>
        <button onClick={() => go('order')}>Place your order</button>
        <button onClick={() => go('contact')}>Contact Hiora</button>
      </motion.nav>
    </>}</AnimatePresence>
  </header>;
}
