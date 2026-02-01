import type { Money, Weight } from '../types';

export type PricingMode = 'PER_WEIGHT' | 'FLAT';

export type ShippingCostInput = {
  quantity: number;
  net: Weight;
  weighingFee: Money;
  shippMiscCost: Money;
  pricingMode: PricingMode;
};
