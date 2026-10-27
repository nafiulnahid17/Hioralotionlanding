import { describe, expect, it } from 'vitest';
import { getPrice, product } from './products';

describe('Hiora pricing',()=>{
  it('uses the offer through the end of 30 November 2026 Dhaka time',()=>{expect(getPrice(new Date('2026-11-30T23:59:59+06:00'))).toEqual({price:1580,isOfferActive:true});});
  it('uses the configured post-offer price from 1 December',()=>{expect(getPrice(new Date('2026-12-01T00:00:00+06:00'))).toEqual({price:product.postOfferPrice,isOfferActive:false});});
  it('calculates expected offer totals',()=>{expect(product.offerPrice+product.deliveryFees.inside_dhaka).toBe(1660);expect(product.offerPrice+product.deliveryFees.outside_dhaka).toBe(1730);});
});
