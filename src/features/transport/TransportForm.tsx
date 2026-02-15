import { useEffect, useMemo, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import NumericField from '../../shared/components/NumericField';
import { commafy, addValueToArr, removeValueFromArr, } from '../../shared/utils/settings';
import type { Currency, WeightUnit, Weight, Money } from '../../domain/types';
import type { InputRecordFormValues } from '../inputRecord/inputRecord.types';
import { calculateNetWeight } from '../../domain/pricing';
import { calculateShippingCost } from '../../domain/pricing';
import { DomainValidationError } from '../../domain/domainErrors';
import { FieldError } from '../../shared/components/FieldError'

type TransportProps = {
    currency: Currency;
    weightUnit: WeightUnit;
};

const TransportForm = ({ currency = 'IRR', weightUnit = 'ton' }: TransportProps) => {
    const { values, setFieldValue, setErrors, errors } = useFormikContext<InputRecordFormValues>();
    const { status, setStatus } = useFormikContext<InputRecordFormValues>();

    const formik = useFormikContext<InputRecordFormValues>();

    useEffect(() => {
        console.log('Formik errors:', formik.errors);
    }, [formik.errors]);


    //  State

    const [payers, setPayers] = useState(['فروشنده', 'خریدار', 'صندوق']);
    const [showAddPayer, setShowAddPayer] = useState(false);
    const [hideNetWeightWarning, setHideNetWeightWarning] = useState(false);

    const isMeasured =
        values.fullWeight > 0 &&
        values.emptyWeight > 0 &&
        values.fullWeight > values.emptyWeight;

    // Event Handlers 

    const handleAddPayer = () => {
        if (!showAddPayer) {
            setShowAddPayer(true);
            return;
        }

        if (!values.newPayer?.trim()) {
            setShowAddPayer(false);
            return;
        }

        setPayers((prev) =>
            addValueToArr(prev, values.newPayer!)
        );

        setFieldValue('newPayerType', '');
        setFieldValue('addPayerVisible', false);
    };

    const handleDeletePayer = () => {
        setPayers(
            removeValueFromArr(payers, values.payer)
        );
    };

    // Derived Values 

    const netWeight = useMemo(() => {

        const full: Weight = {
            value: values.fullWeight,
            unit: weightUnit,
        };

        const empty: Weight = {
            value: values.emptyWeight,
            unit: weightUnit,
        };

        try {
            console.log('net weight Calculated Succsefully');
            return {
                value: calculateNetWeight(full, empty).value,
                error: null,
            };
        } catch (e) {
            console.log('net weight error being returned');
            return {
                value: 0,
                error: e instanceof Error ? e : null,
            }
        }

    }, [values.fullWeight, values.emptyWeight, weightUnit]);

    const wholeShippingCost = useMemo<Money>(() => {
        const quantity = values.quantity;

        const shippMiscCost: Money = {
            amount: values.shippMiscCost,
            currency,
        };

        const weighingFee: Money = {
            amount: values.weighingFee,
            currency,
        };

        const net: Weight = {
            value: netWeight.value,
            unit: weightUnit,
        };
        return calculateShippingCost({
            quantity,
            net,
            weighingFee,
            shippMiscCost,
            pricingMode: values.byWeightUnit
                ? 'PER_WEIGHT'
                : 'FLAT',
        });
    }, [
        values.byWeightUnit,
        values.quantity,
        values.weighingFee,
        values.shippMiscCost,
        netWeight,
    ]);

    // Effects 

    useEffect(() => {
        setFieldValue('wholeShippingCost', wholeShippingCost);
    }, [wholeShippingCost, setFieldValue]);


    // Override netWeight when measured
    useEffect(() => {
        setFieldValue('netWeight', netWeight.value);
    }, [netWeight, setFieldValue]);

    // Reset warning visibility when measurement changes
    useEffect(() => {
        if (isMeasured) {
            setHideNetWeightWarning(false);
        }
    }, [values.fullWeight, values.emptyWeight, isMeasured]);

    // Show net Weight calculation error

    // If net weight is valid, clear any related errors
    useEffect(() => {
        if (!netWeight.error) {
            // Clear the error if it was previously set
            if (errors.fullWeight || errors.emptyWeight) {
                const newErrors = { ...errors };
                delete newErrors.fullWeight;
                delete newErrors.emptyWeight;
                setErrors(newErrors);
            }
            return;
        }

        if (netWeight.error instanceof DomainValidationError) {
            console.log('Domain Validation Error', netWeight.error.message);
            setErrors({
                ...errors,
                [netWeight.error.field]: netWeight.error.message
            });
        } else {
            console.log('Unexpected error calculating net weight');
            setStatus('Unexpected error calculating net weight');
        }
    }, [netWeight.error, errors, setErrors, setStatus]);


    return (
        <div className="container-fluid p-0 col-md-12">
            {/* Section Badge */}
            <div className="col-md p-1 text-end">
                <h1 className="fs-5 badge bg-info text-wrap">حمل</h1>
            </div>

            {status && (
                <div className="alert alert-danger text-end my-2">
                    {status}
                </div>
            )}

            <div className="col-md-13 border border-5 shadow-lg p-1 bg-body">
                {/* --------------------------- First Row -------------------------------- */}
                <div className="row text-start">
                    {/* Net Weight */}
                    <div className="col-md">
                        <fieldset className="form-group text-end">
                            <label>:وزن خالص</label>
                            <h4>
                                {commafy(values.netWeight)} {weightUnit}
                            </h4>

                            {isMeasured && !hideNetWeightWarning && (
                                <div className="alert alert-warning d-flex justify-content-between align-items-center py-2 mt-2">
                                    <span>
                                        وزن خالص از وزن پر و خالی محاسبه شد و مقدار دستی جایگزین گردید
                                    </span>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() =>
                                            setHideNetWeightWarning(true)
                                        }
                                    />
                                </div>
                            )}
                        </fieldset>
                    </div>

                    {/* Empty Weight */}
                    <div className="col-md">
                        <fieldset className="form-group text-end">
                            <label>{weightUnit} :وزن خالی</label>
                            <NumericField name="emptyWeight" />
                            <FieldError name="emptyWeight" />
                        </fieldset>

                    </div>

                    {/* Full Weight */}
                    <div className="col-md">
                        <fieldset className="form-group text-end">
                            <label>{weightUnit} :وزن پر</label>
                            <NumericField name="fullWeight" />
                            <FieldError name="fullWeight" />
                        </fieldset>
                    </div>

                    {/* Misc Cost */}
                    <div className="col-md">
                        <fieldset className="form-group text-end">
                            <label>{currency} :هزینه متفرقه</label>
                            <NumericField name="shippMiscCost" />
                        </fieldset>
                    </div>

                    {/* Weighing Fee */}
                    <div className="col-md">
                        <fieldset className="form-group text-end">
                            <label>{currency} :هزینه باسکول</label>
                            <NumericField name="weighingFee" />
                        </fieldset>
                    </div>

                    {/* Driver */}
                    <div className="col-md">
                        <fieldset className="form-group text-end">
                            <label>:اسم راننده</label>
                            <Field
                                className="form-control text-end"
                                name="driverName"
                            />
                        </fieldset>
                    </div>

                    {/* Vehicle */}
                    <div className="col-md">
                        <fieldset className="form-group text-end">
                            <label>:شماره ماشین</label>
                            <Field
                                className="form-control text-end"
                                name="vehicleNumber"
                            />
                        </fieldset>
                    </div>
                </div>

                {/* --------------------------- Second Row ------------------------------- */}
                <div className="row text-start">
                    {/* Transport Note */}
                    <div className="col-md">
                        <fieldset className="form-group text-end">
                            <label>:توضیحات</label>
                            <Field
                                as="textarea"
                                className="form-control text-end"
                                name="transportNote"
                            />
                        </fieldset>
                    </div>

                    {/* Payer */}
                    <div className="col-md-2">
                        <fieldset className="form-group text-end">
                            <label>:پرداخت شد از</label>
                            <Field
                                as="select"
                                className="form-control text-end"
                                name="payer"
                            >
                                {payers.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </Field>

                            <button
                                className="btn btn-outline-danger btn-sm mx-2 my-1"
                                onClick={handleDeletePayer}
                            >
                                حذف
                            </button>
                            <button
                                className="btn btn-outline-success btn-sm"
                                onClick={handleAddPayer}
                            >
                                افزایش
                            </button>
                        </fieldset>

                        {showAddPayer && (
                            <fieldset className="form-group text-end mt-2">
                                <label>:اضافه به مقصد</label>
                                <Field
                                    className="form-control text-end"
                                    name="newPayer"
                                />
                            </fieldset>
                        )}
                    </div>

                    {/* Total Cost */}
                    <div className="col-md-2">
                        <fieldset className="form-group text-end border border-success mt-2 p-1">
                            <label className="text-success">
                                :کل کرایه حمل
                            </label>
                            <h4 className="text-success text-center">
                                {commafy(wholeShippingCost.amount)} {wholeShippingCost.currency}
                            </h4>
                        </fieldset>
                    </div>

                    {/* Tons Count */}
                    <div className="col-md-2">
                        <fieldset className="form-group text-end">
                            <label>
                                {values.byWeightUnit
                                    ? ':وزنى'
                                    : ':دربستی'}
                            </label>
                            <NumericField name="quantity" />
                        </fieldset>
                    </div>

                    {/* Payment Basis */}
                    <div className="col-md-2">
                        <fieldset className="form-group text-end">
                            <label>:کرایه پرداختی</label>
                            <div className="form-check form-switch">
                                <Field
                                    type="checkbox"
                                    className="form-check-input"
                                    name="byWeightUnit"
                                />
                                <label className="form-check-label">
                                    وزنى
                                </label>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportForm;
