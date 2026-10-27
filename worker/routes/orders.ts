import { z } from 'zod';
import { getRepository, type RepositoryEnv, type StoredOrder } from '../services/orderRepository';

export type OrderEnv=RepositoryEnv&{TURNSTILE_SECRET_KEY?:string};
const schema=z.object({customerName:z.string().trim().min(2).max(80),customerPhone:z.string().regex(/^\+8801[3-9]\d{8}$/),deliveryAddress:z.string().trim().min(8).max(300),deliveryArea:z.enum(['inside_dhaka','outside_dhaka']),paymentMethod:z.enum(['bkash','nagad','cod']),clientRequestId:z.string().uuid(),turnstileToken:z.string().max(2048).optional(),demo:z.boolean().optional()}).strict();
const PRODUCT={id:'aplb-glutathione-niacinamide-body-lotion-300ml',name:'APLB Glutathione Niacinamide Body Lotion 300ml',originalPrice:1899,offerPrice:1580,postOfferPrice:1899,offerEndsAt:'2026-12-01T00:00:00+06:00',delivery:{inside_dhaka:80,outside_dhaka:150}} as const;
const recent=new Map<string,number>();
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
function clientIp(request:Request){return request.headers.get('CF-Connecting-IP')||'local';}
function rateLimited(request:Request){const key=clientIp(request);const now=Date.now();const previous=recent.get(key)||0;if(now-previous<2500)return true;recent.set(key,now);if(recent.size>500)for(const[k,t]of recent)if(now-t>60_000)recent.delete(k);return false;}
async function verifyTurnstile(secret:string|undefined,token:string|undefined,ip:string){if(!secret)return true;if(!token)return false;const form=new FormData();form.set('secret',secret);form.set('response',token);form.set('remoteip',ip);const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});const result=await response.json() as {success:boolean};return result.success;}
const orderNumber=()=>`HIO-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;

export async function handleCreateOrder(request:Request,env:OrderEnv){
  if(request.headers.get('Content-Type')?.split(';')[0]!=='application/json')return json({ok:false,error:'Content-Type must be application/json.'},415);
  if(rateLimited(request))return json({ok:false,error:'Please wait a moment before trying again.'},429);
  let body:unknown;try{body=await request.json();}catch{return json({ok:false,error:'Invalid request body.'},400)}
  const parsed=schema.safeParse(body);if(!parsed.success)return json({ok:false,error:'Please review the submitted details.',issues:parsed.error.issues.map(x=>({path:x.path.join('.'),message:x.message}))},400);
  if(!await verifyTurnstile(env.TURNSTILE_SECRET_KEY,parsed.data.turnstileToken,clientIp(request)))return json({ok:false,error:'Security verification failed. Please refresh and try again.'},403);
  const demoRequested=request.headers.get('X-Demo-Mode')==='true'||parsed.data.demo===true;const {repository,demo}=getRepository(env,demoRequested);
  const now=new Date();const unitPrice=now.getTime()<new Date(PRODUCT.offerEndsAt).getTime()?PRODUCT.offerPrice:PRODUCT.postOfferPrice;const deliveryCharge=PRODUCT.delivery[parsed.data.deliveryArea];
  const order:StoredOrder={id:crypto.randomUUID(),order_number:orderNumber(),idempotency_key:parsed.data.clientRequestId,product_id:PRODUCT.id,product_name:PRODUCT.name,quantity:1,unit_price:unitPrice,original_price:PRODUCT.originalPrice,discount_amount:Math.max(0,PRODUCT.originalPrice-unitPrice),customer_name:parsed.data.customerName,customer_phone:parsed.data.customerPhone,delivery_address:parsed.data.deliveryAddress,delivery_area:parsed.data.deliveryArea,delivery_charge:deliveryCharge,total_amount:unitPrice+deliveryCharge,payment_method:parsed.data.paymentMethod,payment_status:'pending',order_status:'new',source:'hiora_product_landing'};
  try{const saved=await repository.create(order);return json({ok:true,orderId:saved.id,orderNumber:saved.order_number,demo});}catch(error){const code=error instanceof Error?error.message:'ORDER_STORAGE_FAILED';if(code==='ORDER_STORAGE_UNAVAILABLE')return json({ok:false,error:'Order service is not connected yet. Your form details are still here—please contact Hiora on WhatsApp or try again later.'},503);return json({ok:false,error:'We could not save your order. Your form details are still here—please try again.'},500);}
}
