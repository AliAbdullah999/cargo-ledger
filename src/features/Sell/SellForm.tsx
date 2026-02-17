import { useEffect, useMemo, useState } from 'react';
import type { Currency, Money, MoneyPerUnit, WeightUnit } from "../../domain/types";
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
    const totalSaleValue = useMemo<Money>(() => ({
        amount: values.sellPrice * values.netWeight,
        currency,
    }), [values.sellPrice, values.netWeight, currency]);

    const finalCost = useMemo<Money>(() => ({
        amount: values.wholeShippingCost.amount + values.wholeLaborCost.amount + values.wholePurchaseValue.amount + values.pulloutCost,
        currency,
    }), [values.wholeShippingCost, values.wholeLaborCost, values.wholePurchaseValue, values.pulloutCost, currency]);

    const finalCostPerweightUnit = useMemo<MoneyPerUnit>(() => {
        if (values.netWeight === 0) return { amount: 0, currency, unit: weightUnit };
        return { amount: finalCost.amount / values.netWeight, currency, unit: weightUnit };
    }, [finalCost, values.netWeight, currency, weightUnit]);

    const netProfit = useMemo<Money>(() => ({
        amount: totalSaleValue.amount - finalCost.amount,
        currency,
    }), [totalSaleValue, finalCost, currency]);

    const netProfitPerWeightUnit = useMemo<MoneyPerUnit>(() => {
        if (values.netWeight === 0) return { amount: 0, currency, unit: weightUnit };
        return { amount: netProfit.amount / values.netWeight, currency, unit: weightUnit };
    }, [netProfit, values.netWeight, currency, weightUnit]);

    // Handlers
    const handleAddCustomerType = () => {
        if (!showAddCustomerType) { setShowAddCustomerType(true); return; }
        if (!values.newSellerType?.trim()) { setShowAddCustomerType(false); return; }
        setCustomerTypeOptions(prev => addValueToArr(prev, values.newSellerType.trim()));
        setFieldValue('newSellerType', '');
        setShowAddCustomerType(false);
    };

    const handleDeleteCustomerType = () => {
        setCustomerTypeOptions(prev => removeValueFromArr(prev, values.customerType));
        setFieldValue('customerType', '');
    };

    // Effects
    useEffect(() => {
        setFieldValue('finalCost', finalCost);
        setFieldValue('finalCostPerweightUnit', finalCostPerweightUnit);
        setFieldValue('totalSaleValue', totalSaleValue);
        setFieldValue('wholeLaborCost', values.wholeLaborCost);
    }, [finalCost, finalCostPerweightUnit, totalSaleValue, values.wholeLaborCost, setFieldValue]);

    return (
        <div className="card shadow-sm border-0 mb-4 text-end" dir="rtl">
            {/* Header */}
            <div className="card-header bg-info text-body">
                <h5 className="mb-0 py-1 fw-bold">جزئیات فروش</h5>
            </div>

            <div className="card-body bg-body">
                {/* --- Row 1: Destination & Pricing Inputs --- */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <label className="form-label small fw-bold">نام مشتری</label>
                        <Field className='form-control text-end' type="text" name="customerName" placeholder="نام..." />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label small fw-bold">مقصد (نوع)</label>
                        <div className="input-group">
                            <button className='btn btn-outline-danger btn-sm' onClick={handleDeleteCustomerType}>×</button>
                            <button className='btn btn-outline-success btn-sm' onClick={handleAddCustomerType}>{showAddCustomerType ? 'تایید' : '+'}</button>
                            <Field as="select" className='form-select text-end' name="customerType">
                                {CustomerTypeOptions.map(e => <option key={e} value={e}>{e}</option>)}
                            </Field>
                        </div>
                        {showAddCustomerType && (
                            <div className="mt-2">
                                <Field type="text" className='form-control form-control-sm text-end border-success' name="newSellerType" placeholder="مقصد جدید..." autoFocus />
                            </div>
                        )}
                    </div>

                    <div className="col-md-3">
                        <label className="form-label small fw-bold">قیمت فروش واحد</label>
                        <div className="input-group flex-row-reverse">
                            <span className="input-group-text small bg-body">{currency} / {weightUnit}</span>
                            <NumericField name="sellPrice" />
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label small fw-bold">هزینه تخلیه (پشته)</label>
                        <div className="input-group flex-row-reverse">
                            <span className="input-group-text small bg-body">{currency}</span>
                            <NumericField name="pulloutCost" />
                        </div>
                    </div>
                </div>

                {/* --- Row 2: Secondary Info & Breakdown --- */}
                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">توضیحات فروش</label>
                        <Field as="textarea" rows="1" className='form-control text-end' name="sellNote" />
                    </div>

                    <div className="col-md-3">
                        <div className="p-2 border rounded bg-body text-center h-100 d-flex flex-column justify-content-center">
                            <span className="text-muted x-small d-block mb-1">قیمت تمام شده (کل)</span>
                            <span className="fw-bold text-body">
                                {commafy(finalCost.amount)} <small className="fw-normal">{currency}</small>
                            </span>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="p-2 border rounded bg-body text-center h-100 d-flex flex-column justify-content-center border-info">
                            <span className="text-info x-small d-block mb-1">فی تمام شده (واحد)</span>
                            <span className="fw-bold text-info">
                                {isNaN(finalCostPerweightUnit.amount) ? '0' : commafy(finalCostPerweightUnit.amount.toFixed(0))} 
                                <small className="fw-normal fs-6">{finalCostPerweightUnit.currency} / {finalCostPerweightUnit.unit}</small>
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- Summary: Profit & Sales Totals --- */}
                <div className="row g-3 mt-2">
                    {/* Total Sale Value */}
                    <div className="col-md-4">
                        <div className="p-3 border border-primary border-2 rounded bg-body text-center shadow-sm">
                            <label className="text-primary fw-bold d-block mb-1 small">مبلغ کل فروش</label>
                            <h3 className="mb-0 fw-bold text-primary">
                                {commafy(totalSaleValue.amount)} <small className="fs-6 fw-normal text-muted">{currency}</small>
                            </h3>
                        </div>
                    </div>

                    {/* Net Profit Summary */}
                    <div className="col-md-8">
                        <div className="p-3 border border-success border-2 rounded bg-body shadow-sm h-100">
                            <div className="row align-items-center h-100">
                                <div className="col-md-7 border-start text-center">
                                    <label className="text-success fw-bold d-block mb-1">سود خالص (کل)</label>
                                    <h2 className="mb-0 fw-bold text-success">
                                        {commafy(netProfit.amount)} <small className="fs-6 fw-normal text-muted">{currency}</small>
                                    </h2>
                                    <div className="mt-2 text-muted" style={{ fontSize: '0.65rem' }}>
                                        فروش کل - (خرید + حمل + کارگر + تخلیه)
                                    </div>
                                </div>
                                <div className="col-md-5 text-center">
                                    <label className="text-success fw-bold d-block mb-1 small">سود در واحد وزن</label>
                                    <h4 className="mb-0 fw-bold text-success">
                                        {isNaN(netProfitPerWeightUnit.amount) ? '0' : commafy(netProfitPerWeightUnit.amount.toFixed(2))}
                                        <small className="fs-6 fw-normal text-muted">{netProfitPerWeightUnit.currency} / {netProfitPerWeightUnit.unit}</small>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellForm;