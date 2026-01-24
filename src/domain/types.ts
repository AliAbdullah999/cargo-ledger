export type Currency = 'USD' | 'EUR' | 'IRR'

export type Money = {
  amount: number
  currency: Currency
}

export type WeightUnit = 'kg' | 'ton'

export type Weight = {
  value: number
  unit: WeightUnit
}

export type ShipmentInput = {
  pricePerUnit: Money
  weight: Weight
}
