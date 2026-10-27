import type { DeliveryArea, PaymentMethod } from '../config/products';

export type OrderInput = {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryArea: DeliveryArea;
  paymentMethod: PaymentMethod;
  clientRequestId: string;
  turnstileToken?: string;
  demo?: boolean;
};

export type OrderSuccess = { ok: true; orderId: string; orderNumber: string; demo?: boolean };

export async function createOrder(input: OrderInput): Promise<OrderSuccess> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(input.demo ? { 'X-Demo-Mode': 'true' } : {}) },
    body: JSON.stringify(input),
  });
  const payload = await response.json().catch(() => ({})) as { error?: string } & Partial<OrderSuccess>;
  if (!response.ok || !payload.ok) throw new Error(payload.error || 'We could not place your order. Please try again.');
  return payload as OrderSuccess;
}
