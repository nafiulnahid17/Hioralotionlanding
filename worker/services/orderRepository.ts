export type StoredOrder = {
  id: string; order_number: string; idempotency_key: string; product_id: string; product_name: string; quantity: number;
  unit_price: number; original_price: number; discount_amount: number; customer_name: string; customer_phone: string;
  delivery_address: string; delivery_area: string; delivery_charge: number; total_amount: number; payment_method: string;
  payment_status: 'pending'; order_status: 'new'; source: 'hiora_product_landing';
};

export interface OrderRepository { create(order: StoredOrder): Promise<StoredOrder>; }

export type RepositoryEnv = { SUPABASE_URL?:string; SUPABASE_SECRET_KEY?:string; ORDER_STORAGE_PROVIDER?:string; ENVIRONMENT?:string; ALLOW_DEMO_MODE?:string };

export class UnconfiguredRepository implements OrderRepository {
  async create(): Promise<StoredOrder> { throw new Error('ORDER_STORAGE_UNAVAILABLE'); }
}

const demoOrders = new Map<string, StoredOrder>();
export class DevelopmentMockRepository implements OrderRepository {
  async create(order: StoredOrder): Promise<StoredOrder> {
    const previous=demoOrders.get(order.idempotency_key); if(previous)return previous;
    demoOrders.set(order.idempotency_key,order); return order;
  }
}

export class SupabaseOrderRepository implements OrderRepository {
  constructor(private env: RepositoryEnv) {}
  async create(order: StoredOrder): Promise<StoredOrder> {
    if(!this.env.SUPABASE_URL||!this.env.SUPABASE_SECRET_KEY)throw new Error('ORDER_STORAGE_UNAVAILABLE');
    const response=await fetch(`${this.env.SUPABASE_URL.replace(/\/$/,'')}/rest/v1/orders?on_conflict=idempotency_key`,{method:'POST',headers:{apikey:this.env.SUPABASE_SECRET_KEY,Authorization:`Bearer ${this.env.SUPABASE_SECRET_KEY}`,'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=representation'},body:JSON.stringify(order)});
    if(!response.ok)throw new Error('ORDER_STORAGE_FAILED'); const rows=await response.json() as StoredOrder[];
    if(rows[0])return rows[0];
    const existing=await fetch(`${this.env.SUPABASE_URL.replace(/\/$/,'')}/rest/v1/orders?idempotency_key=eq.${encodeURIComponent(order.idempotency_key)}&select=*`,{headers:{apikey:this.env.SUPABASE_SECRET_KEY,Authorization:`Bearer ${this.env.SUPABASE_SECRET_KEY}`}});
    if(!existing.ok)throw new Error('ORDER_STORAGE_FAILED'); const existingRows=await existing.json() as StoredOrder[]; if(!existingRows[0])throw new Error('ORDER_STORAGE_FAILED'); return existingRows[0];
  }
}

export function getRepository(env:RepositoryEnv,demoRequested=false):{repository:OrderRepository;demo:boolean} {
  if(demoRequested&&env.ALLOW_DEMO_MODE==='true'&&env.ENVIRONMENT!=='production')return {repository:new DevelopmentMockRepository(),demo:true};
  if(env.ORDER_STORAGE_PROVIDER==='supabase'&&env.SUPABASE_URL&&env.SUPABASE_SECRET_KEY)return {repository:new SupabaseOrderRepository(env),demo:false};
  return {repository:new UnconfiguredRepository(),demo:false};
}
