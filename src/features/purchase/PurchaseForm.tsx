import { useMemo, useState, useEffect } from 'react';
import { Field, useFormikContext } from 'formik';
import type { Money, Weight, Currency, WeightUnit } from '../../domain/types';
import { calculateWholePurchaseValue } from '../../domain/pricing/pricing.calculations';
import { commafy, addValueToArr, removeValueFromArr } from '../../shared/utils/settings';
import NumericField from '../../shared/components/NumericField';
import type { InputRecordFormValues } from '../inputRecord/inputRecord.types';

type PurchaseProps = {
    currency: Currency;
    weightUnit: WeightUnit;
};

function PurchaseForm({ currency = 'IRR', weightUnit = 'ton' }: PurchaseProps) {
    const { values, setFieldValue } = useFormikContext<InputRecordFormValues>();

    // State
    const [productTypes, setProductTypes] = useState<string[]>(['کلید', 'پوشالی', 'محلی']);
    const [sellerTypes, setSellerTypes] = useState<string[]>(['مرغداری', 'اقای', 'شرکت']);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showAddSeller, setShowAddSeller] = useState(false);

    // Derived values
    const wholePurchaseValue = useMemo<Money>(() => {
        const price: Money = { amount: values.purchaseValue, currency };
        const weight: Weight = { value: values.netWeight, unit: weightUnit };
        return {
            amount: calculateWholePurchaseValue(price, weight),
            currency: price.currency,
        };
    }, [values.purchaseValue, values.netWeight, currency, weightUnit]);

    useEffect(() => {
        setFieldValue('wholePurchaseValue', wholePurchaseValue);
    }, [wholePurchaseValue, setFieldValue]);

    // Handlers
    const handleAddProduct = () => {
        if (!showAddProduct) { setShowAddProduct(true); return; }
        if (!values.newProductType?.trim()) { setShowAddProduct(false); return; }
        setProductTypes(prev => addValueToArr(prev, values.newProductType!));
        setFieldValue('newProductType', '');
        setShowAddProduct(false);
    };

    const handleDeleteProductType = () => {
        setProductTypes(prev => removeValueFromArr(prev, values.productType));
    };

    const handleAddSeller = () => {
        if (!showAddSeller) { setShowAddSeller(true); return; }
        if (!values.newSellerType?.trim()) { setShowAddSeller(false); return; }
        setSellerTypes(prev => addValueToArr(prev, values.newSellerType!));
        setFieldValue('newSellerType', '');
        setShowAddSeller(false);
    };

    const handleDeleteSellerType = () => {
        setSellerTypes(prev => removeValueFromArr(prev, values.sellerType));
    };

    return (
        <div className="card shadow-sm border-0 mb-4 text-end" dir="rtl">
            {/* Section Header */}
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 py-1 fw-bold">جزئیات خرید</h5>
            </div>

            <div className="card-body bg-body">
                <div className="row g-3">
                    
                    {/* Right Side: Primary Inputs (6 cols) */}
                    <div className="col-lg-8">
                        <div className="row g-3">
                            {/* Seller Name */}
                            <div className="col-md-4">
                                <label htmlFor="sellerName" className="form-label small fw-bold">نام فروشنده</label>
                                <Field name="sellerName" type="text" className="form-control text-end" placeholder="نام را وارد کنید" />
                            </div>

                            {/* Seller Type + Actions */}
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">نوع فروشنده</label>
                                <div className="input-group">
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleDeleteSellerType} title="حذف">×</button>
                                    <button type="button" className="btn btn-outline-success btn-sm" onClick={handleAddSeller}>{showAddSeller ? 'تایید' : '+'}</button>
                                    <Field as="select" name="sellerType" className="form-select text-end">
                                        {sellerTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </Field>
                                </div>
                                {showAddSeller && (
                                    <div className="mt-2 animate__animated animate__fadeIn">
                                        <Field name="newSellerType" type="text" className="form-control form-control-sm text-end" placeholder="نوع جدید..." autoFocus />
                                    </div>
                                )}
                            </div>

                            {/* Product Type + Actions */}
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">نوع کالا</label>
                                <div className="input-group">
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleDeleteProductType} title="حذف">×</button>
                                    <button type="button" className="btn btn-outline-success btn-sm" onClick={handleAddProduct}>{showAddProduct ? 'تایید' : '+'}</button>
                                    <Field as="select" name="productType" className="form-select text-end">
                                        {productTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </Field>
                                </div>
                                {showAddProduct && (
                                    <div className="mt-2 animate__animated animate__fadeIn">
                                        <Field name="newProductType" type="text" className="form-control form-control-sm text-end" placeholder="کالای جدید..." autoFocus />
                                    </div>
                                )}
                            </div>

                            {/* Purchase Price */}
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">قیمت خرید</label>
                                <div className="input-group flex-row-reverse">
                                    <span className="input-group-text small bg-body">{currency}</span>
                                    <NumericField name="purchaseValue" />
                                </div>
                            </div>

                            {/* Net Weight */}
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">وزن خالص</label>
                                <div className="input-group flex-row-reverse">
                                    <span className="input-group-text small bg-body">{weightUnit}</span>
                                    <NumericField name="netWeight" />
                                </div>
                            </div>

                            {/* Purchase Note */}
                            <div className="col-md-4">
                                <label htmlFor="purchaseNote" className="form-label small fw-bold">توضیحات</label>
                                <Field as="textarea" name="purchaseNote" rows="1" className="form-control text-end" />
                            </div>
                        </div>
                    </div>

                    {/* Left Side: Summary / Result (4 cols) */}
                    <div className="col-lg-4">
                        <div className="h-100 p-4 border border-success rounded bg-body shadow-sm d-flex flex-column justify-content-center text-center">
                            <label className="text-success fw-bold mb-2">مبلغ کل خرید</label>
                            <h2 className="mb-0 text-success fw-bold">
                                {commafy(wholePurchaseValue.amount)}
                                <span className="fs-6 fw-normal ms-2 text-muted">{currency}</span>
                            </h2>
                            <div className="mt-3 pt-3 border-top border-success-subtle border-opacity-25">
                                <small className="text-muted italic">محاسبه بر اساس وزن خالص و قیمت واحد</small>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PurchaseForm;