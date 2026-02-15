import type { Money } from "../../domain/types";


export type InputRecordFormValues = {
    // Purchase
    purchaseNote: string;
    purchaseValue: number;
    netWeight: number;
    productType: string;
    sellerName: string;
    sellerType: string;
    newProductType: string;
    newSellerType: string;
    wholePurchaseValue: Money;

    // Transport
    driverName: string;
    vehicleNumber: string;
    emptyWeight: number;
    fullWeight: number;
    shippMiscCost: number;
    weighingFee: number;
    quantity: number;
    fixedAmount: boolean;
    byWeightUnit: boolean;
    payer: string;
    newPayer: string;
    transportNote: string;
    wholeShippingCost: Money;

    // Labor
    laborName: string;
    laborType: string;
    wage: number;
    laborMiscCost: number;
    tips: number;
    housingCost: number;
    feedingCost: number;
    wholeLaborCost: Money;

    // Sell
    customerName: string;
    customerType: string;
    pulloutCost: number;
    sellPrice: number;
};

export type PurchaseFormValues = Pick<
  InputRecordFormValues,
  | 'purchaseNote'
  | 'purchaseValue'
  | 'netWeight'
  | 'productType'
  | 'sellerName'
  | 'sellerType'
  | 'newProductType'
  | 'newSellerType'
>;

export type TransportFormValues = Pick<
  InputRecordFormValues,
  | 'driverName'
  | 'vehicleNumber'
  | 'emptyWeight'
  | 'fullWeight'
  | 'shippMiscCost'
  | 'weighingFee'
  | 'quantity'
  | 'fixedAmount'
  | 'byWeightUnit'
  | 'payer'
  | 'newPayer'
  | 'transportNote'
>;

export type LaborFormValues = Pick<
  InputRecordFormValues,
  | 'laborName'
  | 'laborType'
  | 'wage'
  | 'laborMiscCost'
  | 'tips'
  | 'housingCost'
  | 'feedingCost'
>;

export type SellFormValues = Pick<
  InputRecordFormValues,
  | 'customerName'
  | 'customerType'
  | 'pulloutCost'
  | 'sellPrice'
>;