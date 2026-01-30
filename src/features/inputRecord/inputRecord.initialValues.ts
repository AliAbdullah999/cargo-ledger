// src/features/inputRecord/inputRecord.initialValues.ts

import type { InputRecordFormValues } from './inputRecord.types';

export const initialValues: InputRecordFormValues = {
    // Purchase
    purchaseNote: '',
    purchaseValue: 0,
    netWeight: 0,
    productType: '',
    sellerName: '',
    sellerType: '',
    newProductType: '',
    newSellerType: '',

    // Transport
    driverName: '',
    vehicleNumber: '',
    emptyWeight: 0,
    fullWeight: 0,
    shippOddCost: 0,
    scalingCost: 0,
    tonsCount: 0,
    fixedAmount: false,
    inTons: false,
    purchasedFrom: 'فروشنده',
    loadTypeNote: '',
};
