import { useEffect, useMemo, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import NumericField from '../../shared/components/NumericField';
import { commafy, addValueToArr, removeValueFromArr, } from '../../shared/utils/settings';
import type { Currency, WeightUnit, Weight, Money } from '../../domain/types';
import type { InputRecordFormValues } from '../inputRecord/inputRecord.types';
import { calculateNetWeight, calculateShippingCost } from '../../domain/pricing';
import { DomainValidationError } from '../../domain/domainErrors';
import { FieldError } from '../../shared/components/FieldError';

type TransportProps = {
    currency: Currency;
    weightUnit: WeightUnit;
};

const TransportForm = ({ currency = 'IRR', weightUnit = 'ton' }: TransportProps) => {
    const { values, setFieldValue, setErrors, errors, status, setStatus } = useFormikContext<InputRecordFormValues>();

    // State
    const [payers, setPayers] = useState(['فروشنده', 'خریدار', 'صندوق']);
    const [showAddPayer, setShowAddPayer] = useState(false);
    const [hideNetWeightWarning, setHideNetWeightWarning] = useState(false);

    const isMeasured = values.fullWeight > 0 && values.emptyWeight > 0 && values.fullWeight > values.emptyWeight;

    // Event Handlers
    const handleAddPayer = () => {
        if (!showAddPayer) { setShowAddPayer(true); return; }
        if (!values.newPayer?.trim()) { setShowAddPayer(false); return; }
        setPayers((prev) => addValueToArr(prev, values.newPayer!));
        setFieldValue('newPayerType', '');
        setFieldValue('addPayerVisible', false);
        setShowAddPayer(false);
    };

    const handleDeletePayer = () => {
        setPayers(removeValueFromArr(payers, values.payer));
    };

    // Derived Values
    const netWeight = useMemo(() => {
        const full: Weight = { value: values.fullWeight, unit: weightUnit };
        const empty: Weight = { value: values.emptyWeight, unit: weightUnit };
        try {
            return { value: calculateNetWeight(full, empty).value, error: null };
        } catch (e) {
            return { value: 0, error: e instanceof Error ? e : null };
        }
    }, [values.fullWeight, values.emptyWeight, weightUnit]);

    const wholeShippingCost = useMemo<Money>(() => {
        const net: Weight = { value: netWeight.value, unit: weightUnit };
        return calculateShippingCost({
            quantity: values.quantity,
            net,
            weighingFee: { amount: values.weighingFee, currency },
            shippMiscCost: { amount: values.shippMiscCost, currency },
            pricingMode: values.byWeightUnit ? 'PER_WEIGHT' : 'FLAT',
        });
    }, [values.byWeightUnit, values.quantity, values.weighingFee, values.shippMiscCost, netWeight, currency, weightUnit]);

    // Effects

    useEffect(() => { setFieldValue('wholeShippingCost', wholeShippingCost); }, [wholeShippingCost, setFieldValue]);
    useEffect(() => { setFieldValue('netWeight', netWeight.value); }, [netWeight, setFieldValue]);
    useEffect(() => { if (isMeasured) setHideNetWeightWarning(false); }, [values.fullWeight, values.emptyWeight, isMeasured]);

    useEffect(() => {
        if (!netWeight.error) {
            if (errors.fullWeight || errors.emptyWeight) {
                const newErrors = { ...errors };
                delete newErrors.fullWeight; delete newErrors.emptyWeight;
                setErrors(newErrors);
            }
            return;
        }
        if (netWeight.error instanceof DomainValidationError) {
            setErrors({ ...errors, [netWeight.error.field]: netWeight.error.message });
        } else {
            setStatus('Unexpected error calculating net weight');
        }
    }, [netWeight.error, errors, setErrors, setStatus]);

    return (
        <div className="card shadow-sm border-0 mb-4 text-end" dir="rtl">
            <div className="card-header bg-info text-white">
                <h5 className="mb-0 py-1 fw-bold">جزئیات حمل و نقل</h5>
            </div>

            <div className="card-body bg-body">
                {status && <div className="alert alert-danger mb-3">{status}</div>}

                {/* --- Row 1: Weight & Scale --- */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <label className="form-label small fw-bold">وزن پر</label>
                        <div className="input-group flex-row-reverse">
                            <span className="input-group-text small bg-body">{weightUnit}</span>
                            <NumericField name="fullWeight" />
                        </div>
                        <FieldError name="fullWeight" />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label small fw-bold">وزن خالی</label>
                        <div className="input-group flex-row-reverse">
                            <span className="input-group-text small bg-body">{weightUnit}</span>
                            <NumericField name="emptyWeight" />
                        </div>
                        <FieldError name="emptyWeight" />
                    </div>

                    <div className="col-md-6">
                        <div className="p-3 border rounded bg-body shadow-sm h-100 d-flex flex-column justify-content-center">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label className="text-muted small fw-bold">وزن خالص محاسبه شده</label>
                                {isMeasured && !hideNetWeightWarning && (
                                    <span className="badge bg-warning text-body px-2 py-1" style={{ fontSize: '0.7rem' }}>
                                        محاسبه خودکار فعال
                                        <button type="button" className="btn-close ms-1" style={{ fontSize: '0.5rem' }} onClick={() => setHideNetWeightWarning(true)} />
                                    </span>
                                )}
                            </div>
                            <h3 className="mb-0 fw-bold text-body">
                                {commafy(values.netWeight)} <small className="fs-6 fw-normal text-muted">{weightUnit}</small>
                            </h3>
                        </div>
                    </div>
                </div>

                {/* --- Row 2: Driver & Logistics --- */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <label className="form-label small fw-bold">اسم راننده</label>
                        <Field className="form-control text-end" name="driverName" placeholder="نام راننده..." />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small fw-bold">شماره ماشین</label>
                        <Field className="form-control text-end" name="vehicleNumber" placeholder="۱۲ب۳۴۵ / ایران۱۱" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">توضیحات حمل</label>
                        <Field as="textarea" rows="1" className="form-control text-end" name="transportNote" />
                    </div>
                </div>

                <hr className="my-4 opacity-25" />

                {/* --- Row 3: Financials --- */}
                <div className="row g-3 align-items-end">
                    {/* Payment Mode */}
                    <div className="col-md-2">
                        <div className="form-check form-switch bg-body p-2 border rounded text-center d-flex flex-column align-items-center justify-content-center">
                            <label className="form-check-label mb-2 small fw-bold">مبنای محاسبه</label>
                            <div className="d-flex align-items-center">
                                <span className={`small me-2 ${!values.byWeightUnit ? 'fw-bold text-primary' : 'text-muted'}`}>دربستی</span>
                                <Field type="checkbox" className="form-check-input m-0" name="byWeightUnit" />
                                <span className={`small ms-2 ${values.byWeightUnit ? 'fw-bold text-primary' : 'text-muted'}`}>وزنی</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label small fw-bold">{values.byWeightUnit ? 'تعداد/تناژ' : 'تعداد دربستی'}</label>
                        <NumericField name="quantity" />
                    </div>

                    <div className="col-md-2">
                        <label className="form-label small fw-bold">هزینه باسکول</label>
                        <div className="input-group flex-row-reverse">
                            <span className="input-group-text small bg-body">{currency}</span>
                            <NumericField name="weighingFee" />
                        </div>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label small fw-bold">هزینه متفرقه</label>
                        <div className="input-group flex-row-reverse">
                            <span className="input-group-text small bg-body">{currency}</span>
                            <NumericField name="shippMiscCost" />
                        </div>
                    </div>

                    {/* Payer Selection */}
                    <div className="col-md-4">
                        <label className="form-label small fw-bold">پرداخت شده از</label>
                        <div className="input-group">
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleDeletePayer} title="حذف">×</button>
                            <button type="button" className="btn btn-outline-success btn-sm" onClick={handleAddPayer}>{showAddPayer ? 'تایید' : '+'}</button>
                            <Field as="select" className="form-select text-end" name="payer">
                                {payers.map((p) => <option key={p} value={p}>{p}</option>)}
                            </Field>
                        </div>
                        {showAddPayer && (
                            <div className="mt-2">
                                <Field className="form-control form-control-sm text-end border-success" name="newPayer" placeholder="منبع پرداخت جدید..." autoFocus />
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Row 4: Shipping Summary --- */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="p-4 border border-success border-2 rounded-3 bg-body text-center shadow-sm">
                            <label className="text-success fw-bold d-block mb-1">کل کرایه حمل</label>
                            <h2 className="mb-0 fw-bold text-success">
                                {commafy(wholeShippingCost.amount)} 
                                <span className="fs-5 fw-normal ms-2 text-muted">{wholeShippingCost.currency}</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportForm;