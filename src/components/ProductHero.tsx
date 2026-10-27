import { motion } from 'motion/react';
import { BadgeCheck } from 'lucide-react';
import { product } from '../config/products';
import { ProductBenefits } from './ProductBenefits';

export function ProductHero() {
  return <section className="hero" id="product">
    <div className="hero-copy">
      <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.55}}>
        <div className="origin-pill"><span>🇰🇷</span> Korean Skincare</div>
        <p className="eyebrow">{product.brand}</p>
        <h1>{product.name}</h1>
        <p className="size">{product.size}</p>
        <p className="hero-tagline">Healthy Brighter, Softer Skin</p>
      </motion.div>
      <ProductBenefits />
    </div>
    <motion.div className="product-stage" initial={{opacity:0,scale:.92,y:20}} animate={{opacity:1,scale:1,y:0}} transition={{duration:.7,ease:'easeOut'}}>
      <div className="aqua-orb" />
      <img className="botanical botanical-one" src="/assets/illustrations/centella-botanical.webp" alt="" aria-hidden="true" />
      <picture><source srcSet="/assets/products/aplb/aplb-bottle.webp" type="image/webp"/><img className="bottle" src="/assets/products/aplb/aplb-bottle.png" alt="APLB Glutathione Niacinamide Body Lotion 300ml bottle" fetchPriority="high"/></picture>
      <div className="auth-badge"><BadgeCheck/><strong>Korean Product</strong><span>Authentic</span></div>
    </motion.div>
  </section>;
}
