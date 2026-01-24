import type { Money, Weight } from './types'

export function calculateWholePurchaseValue(
  price: Money,
  weight: Weight
): number {
  return price.amount * weight.value
}
