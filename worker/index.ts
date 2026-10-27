import { handleCreateOrder, type OrderEnv } from './routes/orders';

export interface Env extends OrderEnv { ASSETS: Fetcher; }
const apiJson=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});

export default {
  async fetch(request:Request,env:Env):Promise<Response>{
    const url=new URL(request.url);
    if(url.pathname==='/api/health'&&request.method==='GET')return apiJson({ok:true,app:'hiora-product-order',storage:env.ORDER_STORAGE_PROVIDER==='supabase'&&Boolean(env.SUPABASE_URL&&env.SUPABASE_SECRET_KEY)?'ready':'unconfigured',turnstile:Boolean(env.TURNSTILE_SECRET_KEY)});
    if(url.pathname==='/api/config/public'&&request.method==='GET')return apiJson({productId:'aplb-glutathione-niacinamide-body-lotion-300ml',deliveryFees:{inside_dhaka:80,outside_dhaka:150},offerEndsAt:'2026-12-01T00:00:00+06:00'});
    if(url.pathname==='/api/orders'&&request.method==='POST')return handleCreateOrder(request,env);
    if(url.pathname.startsWith('/api/'))return apiJson({ok:false,error:'Not found'},404);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
