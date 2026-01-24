import { useMemo, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import type { Money, Weight } from '../domain/types';
import { calculateWholePurchaseValue } from '../domain/calculations';
import { commafy, addValueToArr, removeValueFromArr } from '../utils/settings';
import NumericField from './NumericField';


type PurchaseProps = {
    purchaseValue: Money;
    netWeight: Weight;
};

type FormValues = {
    addProductVisible: boolean;
    addSellerVisible: boolean;
    purchaseNote: string;
    purchaseValue: number;
    productType: string;
    sellerName: string;
    sellerType: string;
    newProductType?: string;
    newSellerType?: string;
};

function Purchase({ purchaseValue, netWeight }: PurchaseProps) {
    const { values } = useFormikContext<FormValues>();
    const [productTypes, setProductTypes] = useState(['کلید', 'پوشالی', 'محلی'])
    const [sellerTypes, setSellerTypes] = useState(['مرغداری', 'اقای', 'شرکت'])

    const wholePurchaseValue = useMemo(() => {
        return calculateWholePurchaseValue(purchaseValue, netWeight)
    }, [purchaseValue, netWeight])
    // settings
    const handleAddProduct = () => {
        if (!values.addProductVisible) {
            values.addProductVisible = true
        }
        else if (values.addProductVisible) {
            if (values.newProductType == "") {
                values.addProductVisible = false
            }
        }
        else {
            let newValue = values.newProductType;
            let res = addValueToArr(productTypes, newValue);
            setProductTypes(res);
            values.newProductType = ""
        }
    }

    const handleDeleteProductType = () => {
        let valueToDelete = values.productType;
        let res = removeValueFromArr(productTypes, valueToDelete);
        setProductTypes(res);
    }

    const handleDeleteSellerType = () => {
        let valueToDelete = values.sellerType;
        let res = removeValueFromArr(sellerTypes, valueToDelete);
        setSellerTypes(res);
    }

    const handleAddSeller = () => {
        if (!values.addSellerVisible) {
            values.addSellerVisible = true
        }
        else if (values.addSellerVisible) {
            if (values.newSellerType == "") {
                values.addSellerVisible = false
            }
        }
        else {
            let newValue = values.newSellerType;
            let res = addValueToArr(sellerTypes, newValue);
            setSellerTypes(res);
            values.newSellerType = "";
        }
    }

    return (
        <>
            <div className="container p-0 col-md-12">
                {/* Section Badge */}
                <div className="p-1 w-25">
                    <h1 className="fs-5 badge bg-info text-wrap">خرید</h1>
                </div>
                <div className="col-md-12 border border-5 shadow-lg p-1 bg-light">
                    <div className="row text-start">

                        {/* Purchase Note */}
                        <div className="col-md-3">
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
                            <div className="border-4 border border-success mt-2 p-1">
                                <fieldset className="form-group text-end">
                                    <label className="text-success">:مبلغ کل خرید</label>
                                    <h4 className="text-success text-center">
                                        {commafy(wholePurchaseValue)}
                                    </h4>
                                </fieldset>
                            </div>
                        </div>

                        {/* Purchase Price */}
                        <div className="col-md-1">
                            <fieldset className="form-group text-end">
                                <label htmlFor="purchaseValue">:قیمت خرید</label>
                                <NumericField name="purchaseValue" />
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
                                    {productTypes.map((e) => (
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
                            </fieldset>
                        </div>

                        {/* Seller Name */}
                        <div className="col-md-2">
                            <fieldset className="form-group text-end">
                                <label htmlFor="sellerName">:اسم مشتری</label>
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
                                <label htmlFor="sellerType">:نوع مشتری</label>
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
                            </fieldset>
                        </div>
                    </div>

                    {/* Conditional Fields */}
                    <div className="row text-start">
                        {values.addProductVisible && (
                            <div className="col-md">
                                <fieldset className="form-group text-end">
                                    <label htmlFor="newProductType">:اضافه به نوع کالا</label>
                                    <Field
                                        type="text"
                                        className="form-control text-end"
                                        name="newProductType"
                                    />
                                </fieldset>
                            </div>
                        )}

                        {values.addSellerVisible && (
                            <div className="col-md">
                                <fieldset className="form-group text-end">
                                    <label htmlFor="newSellerType">:اضافه به نوع مشتری</label>
                                    <Field
                                        type="text"
                                        className="form-control text-end"
                                        name="newSellerType"
                                    />
                                </fieldset>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Purchase;
