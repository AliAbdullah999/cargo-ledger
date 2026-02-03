import type { Money, Weight } from '../types';
import type { ShippingCostInput } from './pricing.types';
import { assertFullExceedsEmpty, assertSameWeightUnit } from './pricing.validators';


export function calculateWholePurchaseValue(
  price: Money,
  weight: Weight
): number {
  return price.amount * weight.value;
}
export function calculateNetWeight(
  full: Weight,
  empty: Weight
): Weight {

  assertSameWeightUnit(full, empty, 'fullWeight');
  assertFullExceedsEmpty(full, empty);
  return {
    value: full.value - empty.value,
    unit: full.unit,
  };
}

export function calculateShippingCost(
  input: ShippingCostInput
): Money {
  const base =
    input.pricingMode === 'PER_WEIGHT'
      ? input.quantity * input.net.value
      : input.quantity;

  return {
    amount:
      base +
      input.weighingFee.amount +
      input.shippMiscCost.amount,
    currency: input.weighingFee.currency,
  };
}
