import { Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function SuccessModal({open,onClose,orderNumber,demo=false}:{open:boolean;onClose:()=>void;orderNumber?:string;demo?:boolean}) {
  const doneRef=useRef<HTMLButtonElement>(null);
  useEffect(()=>{if(!open)return; const previous=document.activeElement as HTMLElement; const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()}; document.body.style.overflow='hidden'; window.addEventListener('keydown',onKey); setTimeout(()=>doneRef.current?.focus(),80); return()=>{document.body.style.overflow='';window.removeEventListener('keydown',onKey);previous?.focus?.()};},[open,onClose]);
  return createPortal(<AnimatePresence>{open&&<motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} role="presentation">
    <motion.section className="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title" initial={{opacity:0,scale:.9,y:22}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.94,y:10}} transition={{type:'spring',damping:24,stiffness:290}}>
      <img className="modal-leaves" src="/assets/illustrations/centella-botanical.webp" alt=""/>
      <button className="modal-close" onClick={onClose} aria-label="Close confirmation"><X/></button>
      <img className="modal-logo" src="/assets/branding/hiora-logo.webp" alt="Hiora"/>
      {demo&&<div className="demo-badge">Demo Preview — no live order saved</div>}
      <div className="success-check"><Check/></div>
      <h2 id="success-title">Thank You For<br/>Connecting With Hiora</h2>
      <p>Our Team Will contact you soon</p>
      {orderNumber&&<small className="order-reference">Order reference: <strong>{orderNumber}</strong></small>}
      <button ref={doneRef} className="primary-button done-button" onClick={onClose}>Done</button>
    </motion.section>
  </motion.div>}</AnimatePresence>,document.body);
}
