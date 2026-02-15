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
    wholePurchaseValue: { amount: 0, currency: 'IRR' },

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
    wholeShippingCost: { amount: 0, currency: 'IRR' },

    // Labor
    laborName: '',
    laborType: '',
    wage: 0,
    laborMiscCost: 0,
    tips: 0,
    housingCost: 0,
    feedingCost: 0,
    wholeLaborCost: { amount: 0, currency: 'IRR' },

    // Sell
    customerName: '',
    customerType: '',
    pulloutCost: 0,
    sellPrice: 0,
};
