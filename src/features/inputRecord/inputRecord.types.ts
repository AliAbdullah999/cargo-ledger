
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

    // Transport
    driverName: string;
    vehicleNumber: string;
    emptyWeight: number;
    fullWeight: number;
    shippMiscCost: number;
    weighingFee: number;
    tonsCount: number;
    fixedAmount: boolean;
    byWeightUnit: boolean;
    payer: string;
    newPayer: string;
    transportNote: string;
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
  | 'tonsCount'
  | 'fixedAmount'
  | 'byWeightUnit'
  | 'payer'
  | 'newPayer'
  | 'transportNote'
>;
