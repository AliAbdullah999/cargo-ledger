
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
    shippOddCost: number;
    scalingCost: number;
    tonsCount: number;
    fixedAmount: boolean;
    inTons: boolean;
    purchasedFrom: string;
    loadTypeNote: string;
};
