import type { Money, Weight } from '../types';
import type { ShippingCostInput } from './pricing.types';
import { assertSameWeightUnit } from './pricing.validators';


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
  assertSameWeightUnit(full, empty);

  if (empty.value > full.value) {
    throw new Error('Empty weight cannot exceed full weight');
  }

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
