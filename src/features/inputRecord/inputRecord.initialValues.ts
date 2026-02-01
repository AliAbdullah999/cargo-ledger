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
    shippMiscCost: 0,
    weighingFee: 0,
    quantity: 0,
    fixedAmount: false,
    byWeightUnit: false,
    payer: 'فروشنده',
    newPayer: '',
    transportNote: '',
};
