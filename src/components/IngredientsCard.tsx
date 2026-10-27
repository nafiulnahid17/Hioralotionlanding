import { ChevronDown, Leaf } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { product } from '../config/products';

export function IngredientsCard() {
  const [open, setOpen] = useState(false);
  return <motion.section className="content-card ingredients-card" id="ingredients" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}}>
    <img className="corner-botanical" src="/assets/illustrations/centella-botanical.webp" alt="" loading="lazy" />
    <div className="section-heading"><span><Leaf/></span><div><h2>Ingredients</h2><p>Korean Derma Formula</p></div></div>
    <div className="ingredient-layout">
      <div className="ingredient-visual"><div className="droplet">12.3%<small>Centella</small></div></div>
      <div><p className="ingredient-lead">A skin-comforting formula centered on Centella Asiatica, Glutathione and Niacinamide.</p><div className="chip-row">{product.keyIngredients.map(x=><span key={x}>{x}</span>)}</div></div>
    </div>
    <button className="accordion-button" onClick={() => setOpen(v=>!v)} aria-expanded={open}>View All Ingredients <ChevronDown className={open?'rotated':''}/></button>
    <AnimatePresence initial={false}>{open && <motion.div className="all-ingredients" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}><p>{product.ingredients.join(', ')}.</p><small>Ingredient information should be verified against the current product carton before production launch because formulations may change.</small></motion.div>}</AnimatePresence>
  </motion.section>;
}
