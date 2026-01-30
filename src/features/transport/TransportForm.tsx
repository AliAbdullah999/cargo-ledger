import { useEffect, useMemo, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import NumericField from '../../shared/components/NumericField';
import { commafy, addValueToArr, removeValueFromArr, } from '../../shared/utils/settings';
import type { Currency, WeightUnit } from '../../domain/types';
import type { InputRecordFormValues } from '../inputRecord/inputRecord.types';

type TransportProps = {
    currency: Currency;
    weightUnit: WeightUnit;
};

const TransportForm = ({ currency = 'IRR', weightUnit = 'ton' }: TransportProps) => {
    const { values, setFieldValue } = useFormikContext<InputRecordFormValues>();

    //  State

    const [payers, setPayers] = useState(['فروشنده', 'خریدار', 'صندوق']);
    const [showAddPayer, setShowAddPayer] = useState(false);
    const [hideNetWeightWarning, setHideNetWeightWarning] = useState(false);

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
        const full = values.fullWeight || 0;
        const empty = values.emptyWeight || 0;
        return full - empty;
    }, [values.fullWeight, values.emptyWeight]);

    const wholeShippingCost = useMemo(() => {
        const tonsCount = values.tonsCount || 0;
        const weighingFee = values.weighingFee || 0;
        const shippMiscCost = values.shippMiscCost || 0;

        let total = values.byWeightUnit
            ? tonsCount * netWeight
            : tonsCount;

        total += weighingFee + shippMiscCost;

        return total;
    }, [
        values.byWeightUnit,
        values.tonsCount,
        values.weighingFee,
        values.shippMiscCost,
        netWeight,
    ]);

    const isMeasured =
        values.fullWeight > 0 &&
        values.emptyWeight > 0 &&
        values.fullWeight > values.emptyWeight;

    // Effects 

    // Override netWeight when measured
    useEffect(() => {
        setFieldValue('netWeight', netWeight);
    }, [netWeight, setFieldValue]);

    // Reset warning visibility when measurement changes
    useEffect(() => {
        if (isMeasured) {
            setHideNetWeightWarning(false);
        }
    }, [values.fullWeight, values.emptyWeight, isMeasured]);


    return (
        <div className="container-fluid p-0 col-md-12">
            {/* Section Badge */}
            <div className="col-md p-1 text-end">
                <h1 className="fs-5 badge bg-info text-wrap">حمل</h1>
            </div>

            <div className="col-md-13 border border-5 shadow-lg p-1 bg-body">
                {/* --------------------------- First Row -------------------------------- */}
                <div className="row text-start">
                    {/* Net Weight */}
                    <div className="col-md">
                        <fieldset className="form-group text-end">
                            <label>:وزن خالص</label>
                            <h4>
                                {commafy(netWeight)} {weightUnit}
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
                        </fieldset>
                    </div>

                    {/* Full Weight */}
                    <div className="col-md">
                        <fieldset className="form-group text-end">
                            <label>{weightUnit} :وزن پر</label>
                            <NumericField name="fullWeight" />
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
                                {commafy(wholeShippingCost)} {currency}
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
                            <NumericField name="tonsCount" />
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
