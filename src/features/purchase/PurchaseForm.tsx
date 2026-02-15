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

// Purchase section (خرید)
function PurchaseForm({ currency = 'IRR', weightUnit = 'ton' }: PurchaseProps) {
    const { values, setFieldValue } = useFormikContext<InputRecordFormValues>();

    // State
    const [productTypes, setProductTypes] = useState<string[]>(['کلید', 'پوشالی', 'محلی']);
    const [sellerTypes, setSellerTypes] = useState<string[]>(['مرغداری', 'اقای', 'شرکت']);

    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showAddSeller, setShowAddSeller] = useState(false);

    // Derived values
    const wholePurchaseValue = useMemo<Money>(() => {
        const price: Money = {
            amount: values.purchaseValue,
            currency,
        };

        const weight: Weight = {
            value: values.netWeight,
            unit: weightUnit,
        };

        return {
            amount: calculateWholePurchaseValue(price, weight),
            currency: price.currency,
        };
    }, [
        values.purchaseValue,
        values.netWeight,
        currency,
        weightUnit,
    ]);

    // Sync calculated value to Formik state
    useEffect(() => {
        setFieldValue('wholePurchaseValue', wholePurchaseValue);
    }, [wholePurchaseValue, setFieldValue]);

    // Handlers
    const handleAddProduct = () => {
        if (!showAddProduct) {
            setShowAddProduct(true);
            return;
        }

        if (!values.newProductType?.trim()) {
            setShowAddProduct(false);
            return;
        }

        setProductTypes(prev =>
            addValueToArr(prev, values.newProductType!)
        );

        setFieldValue('newProductType', '');
        setShowAddProduct(false);
    };

    const handleDeleteProductType = () => {
        setProductTypes(prev =>
            removeValueFromArr(prev, values.productType)
        );
    };

    const handleAddSeller = () => {
        if (!showAddSeller) {
            setShowAddSeller(true);
            return;
        }

        if (!values.newSellerType?.trim()) {
            setShowAddSeller(false);
            return;
        }

        setSellerTypes(prev =>
            addValueToArr(prev, values.newSellerType!)
        );

        setFieldValue('newSellerType', '');
        setShowAddSeller(false);
    };

    const handleDeleteSellerType = () => {
        setSellerTypes(prev =>
            removeValueFromArr(prev, values.sellerType)
        );
    };

    return (
        <div className="container-fluid p-0 col-md-12">
            {/* Section Badge */}
            <div className="col-md p-1 text-end">
                <h1 className="fs-5 badge bg-info text-wrap">
                    خرید
                </h1>
            </div>

            <div className="col-md-12 border border-5 shadow-lg p-1 bg-body">
                <div className="row text-start">

                    {/* Purchase Note */}
                    <div className="col-md-2">
                        <fieldset className="form-group text-end">
                            <label htmlFor="purchaseNote">:توضیحات</label>
                            <Field
                                as="textarea"
                                name="purchaseNote"
                                className="form-control text-end"
                            />
                        </fieldset>
                    </div>

                    {/* Whole Purchase Value */}
                    <div className="col-md-2">
                        <div className="border-4 border border-success mt-2 p-1 bg-success-subtle">
                            <fieldset className="form-group text-end">
                                <label className="text-success">
                                    :مبلغ کل خرید
                                </label>
                                <h4 className="text-success text-center">
                                    {commafy(wholePurchaseValue.amount)} {currency}
                                </h4>
                            </fieldset>
                        </div>
                    </div>

                    {/* Purchase Price & Net Weight */}
                    <div className="col-md-2">
                        <fieldset className="form-group text-end">
                            <label htmlFor="purchaseValue">
                                {currency} :قيمت خريد
                            </label>
                            <NumericField name="purchaseValue" />
                        </fieldset>

                        <fieldset className="form-group text-end">
                            <label htmlFor="netWeight">
                                {weightUnit} :وزن خالص
                            </label>
                            <NumericField name="netWeight" />
                        </fieldset>
                    </div>

                    {/* Product Type */}
                    <div className="col-md-2">
                        <fieldset className="form-group text-end">
                            <label htmlFor="productType">:نوع کالا</label>

                            <Field
                                as="select"
                                name="productType"
                                className="form-control text-end"
                            >
                                {productTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Field>

                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm mx-2 mt-1"
                                onClick={handleDeleteProductType}
                            >
                                حذف
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-success btn-sm mt-1"
                                onClick={handleAddProduct}
                            >
                                افزایش
                            </button>

                            {showAddProduct && (
                                <div className="mt-2">
                                    <label htmlFor="newProductType">
                                        :اضافه به نوع کالا
                                    </label>
                                    <Field
                                        name="newProductType"
                                        type="text"
                                        className="form-control text-end"
                                    />
                                </div>
                            )}
                        </fieldset>
                    </div>

                    {/* Seller Name */}
                    <div className="col-md-2">
                        <fieldset className="form-group text-end">
                            <label htmlFor="sellerName">
                                :اسم فروشنده
                            </label>
                            <Field
                                name="sellerName"
                                type="text"
                                className="form-control text-end"
                            />
                        </fieldset>
                    </div>

                    {/* Seller Type */}
                    <div className="col-md-2">
                        <fieldset className="form-group text-end">
                            <label htmlFor="sellerType">
                                :نوع فروشنده
                            </label>

                            <Field
                                as="select"
                                name="sellerType"
                                className="form-control text-end"
                            >
                                {sellerTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Field>

                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm mx-2 mt-1"
                                onClick={handleDeleteSellerType}
                            >
                                حذف
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-success btn-sm mt-1"
                                onClick={handleAddSeller}
                            >
                                افزایش
                            </button>

                            {showAddSeller && (
                                <div className="mt-2">
                                    <label htmlFor="newSellerType">
                                        :اضافه به نوع فروشنده
                                    </label>
                                    <Field
                                        name="newSellerType"
                                        type="text"
                                        className="form-control text-end"
                                    />
                                </div>
                            )}
                        </fieldset>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PurchaseForm;
