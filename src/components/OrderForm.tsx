import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LoaderCircle, MapPin, Phone, ShoppingCart, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { createOrder } from '../lib/orders';
import type { DeliveryArea, PaymentMethod } from '../config/products';
import { PaymentSelector } from './PaymentSelector';
import { DeliverySelector } from './DeliverySelector';
import { OrderSummary } from './OrderSummary';
import { SuccessModal } from './SuccessModal';

const phonePattern = /^(?:\+?880|0)?1[3-9]\d{8}$/;
const normalizePhone=(value:string)=>{const digits=value.replace(/[^\d+]/g,'').replace(/^00880/,'+880'); if(digits.startsWith('+880'))return digits; if(digits.startsWith('880'))return `+${digits}`; if(digits.startsWith('01'))return `+88${digits}`; return digits;};
const makeUuid=()=>typeof crypto.randomUUID==='function'?crypto.randomUUID():'10000000-1000-4000-8000-100000000000'.replace(/[018]/g,c=>(Number(c)^crypto.getRandomValues(new Uint8Array(1))[0]&15>>Number(c)/4).toString(16));
const schema=z.object({
  customerName:z.string().trim().min(2,'Please enter your full name').max(80,'Name is too long'),
  customerPhone:z.string().trim().transform(normalizePhone).refine(v=>phonePattern.test(v),'Enter a valid Bangladesh mobile number'),
  deliveryAddress:z.string().trim().min(8,'Please enter your complete delivery address').max(300,'Address is too long'),
  deliveryArea:z.enum(['inside_dhaka','outside_dhaka']),
  paymentMethod:z.enum(['bkash','nagad','cod']),
});
type FormData=z.infer<typeof schema>;

export function OrderForm() {
  const [success,setSuccess]=useState<{orderNumber:string;demo:boolean}|null>(null); const [serverError,setServerError]=useState(''); const [requestId,setRequestId]=useState(makeUuid);
  const demo=import.meta.env.VITE_DEMO_MODE==='true';
  const {register,handleSubmit,control,formState:{errors,isSubmitting}}=useForm<FormData>({resolver:zodResolver(schema),defaultValues:{customerName:'',customerPhone:'',deliveryAddress:'',deliveryArea:'inside_dhaka',paymentMethod:'cod'}});
  const area=useWatch({control,name:'deliveryArea'});
  const submit=async(data:FormData)=>{setServerError('');try{const result=await createOrder({...data,clientRequestId:requestId,demo});setSuccess({orderNumber:result.orderNumber,demo:Boolean(result.demo)});setRequestId(makeUuid());}catch(error){setServerError(error instanceof Error?error.message:'Order service is unavailable. Your details have been kept.');}};
  return <>
    <section className="content-card order-card" id="order">
      <div className="section-heading order-heading"><span><ShoppingCart/></span><div><h2>Place Your Order</h2><p>Fill in your details and our team will contact you shortly.</p></div></div>
      {demo&&<div className="demo-notice"><strong>Development demo mode</strong><span>Checkout can be previewed, but no live order will be stored.</span></div>}
      <form onSubmit={handleSubmit(submit)} noValidate>
        <label className="input-group"><span><UserRound/></span><div><b>Full Name</b><input placeholder="Your full name" autoComplete="name" {...register('customerName')}/>{errors.customerName&&<small className="error">{errors.customerName.message}</small>}</div></label>
        <label className="input-group"><span><Phone/></span><div><b>Phone Number</b><input placeholder="017XXXXXXXX" inputMode="tel" autoComplete="tel" {...register('customerPhone')}/>{errors.customerPhone&&<small className="error">{errors.customerPhone.message}</small>}</div></label>
        <label className="input-group address-input"><span><MapPin/></span><div><b>Delivery Address</b><textarea placeholder="House, Road, Area, City" autoComplete="street-address" rows={2} {...register('deliveryAddress')}/>{errors.deliveryAddress&&<small className="error">{errors.deliveryAddress.message}</small>}</div></label>
        <Controller control={control} name="paymentMethod" render={({field})=><PaymentSelector value={field.value as PaymentMethod} onChange={field.onChange}/>} />
        <Controller control={control} name="deliveryArea" render={({field})=><DeliverySelector value={field.value as DeliveryArea} onChange={field.onChange}/>} />
        <OrderSummary area={area}/>
        {serverError&&<div className="server-error" role="alert"><strong>Order not submitted</strong><span>{serverError}</span></div>}
        <button className="primary-button place-order" type="submit" disabled={isSubmitting}>{isSubmitting?<><LoaderCircle className="spinner"/>Submitting securely…</>:<><ShoppingCart/>Place Order<ArrowRight/></>}</button>
      </form>
    </section>
    <SuccessModal open={Boolean(success)} onClose={()=>setSuccess(null)} orderNumber={success?.orderNumber} demo={success?.demo}/>
  </>;
}
