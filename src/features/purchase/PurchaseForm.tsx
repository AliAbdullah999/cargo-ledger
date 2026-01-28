import { useMemo, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import type { Money, Weight, Currency, WeightUnit } from '../../domain/types';
import { calculateWholePurchaseValue } from '../../domain/calculations';
import { commafy, addValueToArr, removeValueFromArr } from '../../shared/utils/settings';
import NumericField from '../../shared/components/NumericField';


type PurchaseProps = {
    currency?: Currency;
    weightUnit?: WeightUnit;
};

type FormValues = {
    purchaseNote: string;
    purchaseValue: number;
    netWeight: number;
    productType: string;
    sellerName: string;
    sellerType: string;
    newProductType?: string;
    newSellerType?: string;
};

// The goal is to calculate that we bought from this seller and Selled to a Buyer, that's why we call this
// section Purchase(خرید)
function PurchaseForm({ currency = 'IRR', weightUnit = 'ton' }: PurchaseProps) {
    const { values, setFieldValue } = useFormikContext<FormValues>();
    const [productTypes, setProductTypes] = useState(['کلید', 'پوشالی', 'محلی'])
    const [sellerTypes, setSellerTypes] = useState(['مرغداری', 'اقای', 'شرکت'])



    const wholePurchaseValue = useMemo(() => {
        const price: Money = {
            amount: values.purchaseValue,
            currency,
        }

        const weight: Weight = {
            value: values.netWeight,
            unit: weightUnit,
        }

        return calculateWholePurchaseValue(price, weight)
    }, [values.purchaseValue, values.netWeight, currency, weightUnit])


    // settings
    // Showing visible fields
    const [showAddSeller, setShowAddSeller] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    // Functions
    const handleAddProduct = () => {
        if (!showAddProduct) return setShowAddProduct(true);


        if (!values.newProductType?.trim()) return setShowAddProduct(false);

        setProductTypes(prev =>
            addValueToArr(prev, values.newProductType!)
        );

        setFieldValue('newProductType', '');
        setFieldValue('addProductVisible', false);
    };

    const handleDeleteProductType = () => {
        setProductTypes(removeValueFromArr(productTypes, values.productType));
    };

    const handleAddSeller = () => {
        if (!showAddSeller) return setShowAddSeller(true);

        if (!values.newSellerType?.trim()) return setShowAddSeller(false);

        setSellerTypes(prev => addValueToArr(prev, values.newSellerType));
        setFieldValue('newSellerType', '');
        setShowAddSeller(false);
    };

    const handleDeleteSellerType = () => {
        setSellerTypes(removeValueFromArr(sellerTypes, values.sellerType));
    };


    return (
        <>
            <div className="container-fluid p-0 col-md-12">
                {/* Section Badge */}
                <div className="col-md p-1 text-end">
                    <h1 className="fs-5 badge bg-info text-wrap ">خرید</h1>
                </div>

                <div className="col-md-12 border border-5 shadow-lg p-1 bg-body">
                    <div className="row text-start">

                        {/* Purchase Note */}
                        <div className="col-md-2">
                            <fieldset className="form-group text-end">
                                <label htmlFor="purchaseNote">:توضیحات</label>
                                <Field
                                    as="textarea"
                                    className="form-control text-end"
                                    name="purchaseNote"
                                />
                            </fieldset>
                        </div>

                        {/* Whole Purchase Value */}
                        <div className="col-md-2">
                            <div className="border-4 border border-success mt-2 p-1 bg-success-subtle">
                                <fieldset className="form-group text-end">
                                    <label className="text-success">:مبلغ کل خرید</label>
                                    <h4 className="text-success text-center">
                                        {commafy(wholePurchaseValue)}
                                    </h4>
                                </fieldset>
                            </div>
                        </div>

                        {/* Purchase Price */}
                        <div className="col-md-2">
                            <fieldset className="form-group text-end">
                                <label htmlFor="purchaseValue">:قيمت خريد</label>
                                <NumericField name="purchaseValue" />
                            </fieldset>
                            <fieldset className="form-group text-end">
                                <label htmlFor="purchaseValue">:وزن خالص</label>
                                <NumericField name="netWeight" />
                            </fieldset>
                        </div>

                        {/* Product Type */}
                        <div className="col-md-2">
                            <fieldset className="form-group text-end">
                                <label htmlFor="productType">:نوع کالا</label>

                                <Field
                                    as="select"
                                    className="form-control text-end"
                                    name="productType"
                                >
                                    {productTypes.map(e => (
                                        <option key={e} value={e}>
                                            {e}
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
                                        <label htmlFor="newProductType">:اضافه به نوع کالا</label>
                                        <Field
                                            type="text"
                                            className="form-control text-end"
                                            name="newProductType"
                                        />
                                    </div>
                                )}
                            </fieldset>
                        </div>


                        {/* Seller Name */}
                        <div className="col-md-2">
                            <fieldset className="form-group text-end">
                                <label htmlFor="sellerName">:اسم فروشنده</label>
                                <Field
                                    className="form-control text-end"
                                    type="text"
                                    name="sellerName"
                                />
                            </fieldset>
                        </div>

                        {/* Seller Type */}
                        <div className="col-md-2">
                            <fieldset className="form-group text-end">
                                <label htmlFor="sellerType">:نوع فروشنده</label>
                                <Field
                                    as="select"
                                    className="form-control text-end"
                                    name="sellerType"
                                >
                                    {sellerTypes.map((e) => (
                                        <option key={e} value={e}>
                                            {e}
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
                                        <label htmlFor="newSellerType">:اضافه به نوع فروشنده</label>
                                        <Field
                                            type="text"
                                            className="form-control text-end"
                                            name="newSellerType"
                                        />
                                    </div>
                                )}
                            </fieldset>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default PurchaseForm;
