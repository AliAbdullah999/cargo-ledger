
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
    quantity: number;
    fixedAmount: boolean;
    byWeightUnit: boolean;
    payer: string;
    newPayer: string;
    transportNote: string;

    // worker
    workerName: string;
    workerType: string;
    wage: number;
    workerMiscCost: number;
    tips: number;
    housingCost: number;
    feedingCost: number;


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

export type WorkerFormValues = Pick<
  InputRecordFormValues,
  | 'workerName'
  | 'workerType'
  | 'wage'
  | 'workerMiscCost'
  | 'tips'
  | 'housingCost'
  | 'feedingCost'
>;