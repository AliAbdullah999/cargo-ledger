import { useEffect, useMemo, useState, } from 'react';
import type { Currency, Money, MoneyPerUnit, WeightUnit } from "../../domain/types"
import type { InputRecordFormValues } from '../inputRecord/inputRecord.types';
import { Field, useFormikContext } from 'formik';
import { addValueToArr, commafy, removeValueFromArr } from '../../shared/utils/settings';
import NumericField from '../../shared/components/NumericField';

type SellProps = {
    currency: Currency,
    weightUnit: WeightUnit
};

const SellForm = ({ currency = 'IRR', weightUnit = 'ton' }: SellProps) => {

    const { values, setFieldValue } = useFormikContext<InputRecordFormValues>();

    // State
    const [CustomerTypeOptions, setCustomerTypeOptions] = useState<string[]>(['اقای', 'زمین', 'کارخانه', 'انبار']);

    const [showAddCustomerType, setShowAddCustomerType] = useState(false);

    // Derived Values
    const totalSaleValue = useMemo<Money>(() => {
        return {
            amount: values.sellPrice * values.netWeight,
            currency,
        };
    }, [values.sellPrice, values.netWeight]);

    const finalCost = useMemo<Money>(() => {
        return {
            amount: values.wholeShippingCost.amount + values.wholeLaborCost.amount + values.wholePurchaseValue.amount + values.pulloutCost,
            currency,
        };
    }, [values.wholeShippingCost, values.wholeLaborCost, values.wholePurchaseValue, values.pulloutCost]);

    const finalCostPerweightUnit = useMemo<MoneyPerUnit>(() => {
        if (values.netWeight === 0) return { amount: 0, currency, unit: weightUnit };

        return {
            amount: finalCost.amount / values.netWeight,
            currency,
            unit: weightUnit,
        };
    }, [finalCost, values.netWeight]);

    const netProfit = useMemo<Money>(() => {
        return {
            amount: totalSaleValue.amount - finalCost.amount,
            currency,
        };
    }, [totalSaleValue, finalCost]);

    const netProfitPerWeightUnit = useMemo<MoneyPerUnit>(() => {
        if (values.netWeight === 0) return { amount: 0, currency, unit: weightUnit };
        return {
            amount: netProfit.amount / values.netWeight,
            currency,
            unit: weightUnit,
        };
    }, [netProfit, values.netWeight]);

    // Handlers
    const handleAddCustomerType = () => {
        if (!showAddCustomerType) {
            setShowAddCustomerType(true);
            return;
        }


        if (!values.newSellerType.trim()) {
            setShowAddCustomerType(false);
            return;
        }

        setCustomerTypeOptions(prev => addValueToArr(prev, values.newSellerType.trim()));
        setFieldValue('newSellerType', '');
        setShowAddCustomerType(false);



    }

    const handleDeleteCustomerType = () => {
        setCustomerTypeOptions(prev => removeValueFromArr(prev, values.customerType));
        setFieldValue('customerType', '');
    }

    // Effects

    useEffect(() => {
        setFieldValue('finalCost', finalCost);
        setFieldValue('finalCostPerweightUnit', finalCostPerweightUnit);
        setFieldValue('totalSaleValue', totalSaleValue);
        setFieldValue('wholeLaborCost', values.wholeLaborCost);
    }, [finalCost, finalCostPerweightUnit, totalSaleValue, values.wholeLaborCost, setFieldValue]);

    return (
        <div className="container-fluid p-0 col-md-12">

            {/* Section Badge */}
            <div className="col-md p-1 text-end">
                <h1 className="fs-5 badge bg-info text-wrap">فروش</h1>
            </div>

            <div className="col-md-15 border border-5 shadow-lg p-1 bg-body ">
                <div className="row  text-start ">

                    <div className="col-md-4 mx-3">
                        <div className="form-floating">
                            <fieldset className="form-group text-end">
                                <label htmlFor='sellNote'>:توضیحات</label>
                                <Field as="textarea" className='form-control text-end' name="sellNote"></Field>
                            </fieldset>
                        </div>
                    </div>

                    <div className="col-md-3 border-1 border border-success p-1 mx-5 text-end">
                        {/* Final Costs */}
                        <h1 className='fs-6 text-success' >قیمت تمام شده به ازاى هر واحد وزن</h1>
                        {/* <p  >مبلغ کل خرید + کل کرایه حمل + کرایه کل کارگری = قیمت تمام شده </p> */}
                        {!(isNaN(finalCostPerweightUnit.amount)) && <p className='text-success'>{commafy(finalCostPerweightUnit.amount)} {finalCostPerweightUnit.currency} / {finalCostPerweightUnit.unit}  </p>}
                    </div>

                    <div className="col-md-3 border-1 border border-success p-1 mx-4 text-end">
                        {/* Final Costs */}
                        <h1 className='fs-6 text-success' >:قیمت تمام شده</h1>
                        {/* <p  >مبلغ کل خرید + کل کرایه حمل + کرایه کل کارگری = قیمت تمام شده </p> */}
                        <p className='text-success'>{currency} {commafy(finalCost.amount)} = {commafy(values.wholeShippingCost.amount)} + {commafy(values.wholeLaborCost.amount)} + {commafy(values.wholePurchaseValue.amount)}</p>
                    </div>

                </div>
                <div className="row  text-start">
                    <div className="col-md">
                        <div className="form-floating border-4 border border-success mx-1 mt-3 p-1 ">
                            <fieldset className="form-group text-end">
                                <label className='text-success' htmlFor='purchaseValue'>:مبلغ کل فروش</label>
                                <h4 className="form-group text-center text-success">{commafy(totalSaleValue.amount)} {totalSaleValue.currency}</h4>
                            </fieldset>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="form-floating">
                            <fieldset className="form-group text-end">
                                <label htmlFor='sellPrice'>:مبلغ فروش</label>
                                <NumericField name="sellPrice" />
                            </fieldset>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="form-floating">
                            <fieldset className="form-group text-end">
                                <label htmlFor='pulloutCost'>:هزینه تخلیه</label>
                                <NumericField name="pulloutCost" />
                            </fieldset>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="form-floating">
                            <fieldset className="form-group text-end">
                                <label htmlFor='customerName'>:اسم  </label>
                                <Field className='form-control text-end' type="text" name="customerName" />
                            </fieldset>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="form-floating">
                            <fieldset className="form-group text-end">
                                <label htmlFor='customerType'>:مقصد</label>
                                <Field as="select" className='form-control text-end' name="customerType">
                                    {CustomerTypeOptions.map(e => (
                                        <option key={e} value={e} >{e}</option>
                                    )
                                    )}
                                </Field>
                                <button className='btn btn-outline-danger btn-sm mx-2 mt-1' onClick={handleDeleteCustomerType}>حذف</button>
                                <button className='btn btn-outline-success btn-sm mt-1 ' onClick={handleAddCustomerType}>افزایش</button>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <div className="row  text-start ">
                    <div className="col-md">
                        <div className="form-floating">
                        </div>
                    </div>
                    {showAddCustomerType && <div className="col-md">
                        <div className="form-floating">
                            <fieldset className="form-group text-end">
                                <label htmlFor='productType'>:اضافه به مقصد</label>
                                <Field type="text" className='form-control text-end' name="newProductType" />
                            </fieldset>
                        </div>
                    </div>}
                </div>
            </div>

            {/* Container for Profit Section */}
            <div className="col-12 border border-5 shadow-lg p-3 bg-body mt-3">
                <div className="row g-2 align-items-stretch"> 

                    {/* Left Box: Total Profit Formula */}
                    <div className="col-sm-9">
                        <div className="h-100 border border-2 shadow-sm bg-body p-3 text-center d-flex flex-column justify-content-center">
                            <h1 className='fs-3 badge bg-success text-white text-wrap mb-3 w-auto mx-auto'>
                                :سود خالص
                            </h1>

                            {/* Simplified Formula using the new variable names */}
                            <p className='text-muted small mb-1' dir="ltr">
                                netProfit = totalSaleValue - (wholeLaborCost + pulloutCost + wholePurchaseValue)
                            </p>

                            <p className='mb-2 fw-bold'>
                                مبلغ کل فروش - (هزینه تخلیه + کرایه کل کارگری + قیمت کل خرید) = سود خالص
                            </p>

                            <div className="border-top pt-2">
                                <h3 className='text-success mb-0'>
                                    {commafy(netProfit.amount)} {netProfit.currency} =
                                    {commafy(totalSaleValue.amount)} - ({commafy(values.wholeLaborCost.amount)} + {commafy(values.pulloutCost)} + {commafy(values.wholePurchaseValue.amount)})
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Right Box: Profit Per Unit */}
                    <div className="col-sm-3">
                        <div className="h-100 border border-3 border-success p-3 text-center d-flex flex-column justify-content-center bg-body">
                            <h1 className='fs-6 text-success fw-bold mb-3'>سود خالص به ازاى هر واحد وزن</h1>

                            {!(isNaN(netProfitPerWeightUnit.amount)) && (
                                <div className="h-100 d-flex align-items-center justify-content-center">
                                    <h4 className='text-success fw-bold'>
                                        {commafy(netProfitPerWeightUnit.amount.toFixed(2))}
                                        <br />
                                        <small className="fs-6">{netProfitPerWeightUnit.currency} / {netProfitPerWeightUnit.unit}</small>
                                    </h4>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SellForm;
