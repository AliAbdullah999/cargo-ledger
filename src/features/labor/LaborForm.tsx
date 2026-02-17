import { useEffect, useMemo, } from 'react';
import type { Currency, Money, WeightUnit } from "../../domain/types"
import type { InputRecordFormValues } from '../inputRecord/inputRecord.types';
import { Field, useFormikContext } from 'formik';
import { commafy } from '../../shared/utils/settings';
import NumericField from '../../shared/components/NumericField';
import { calculateWholeLaborCost } from '../../domain/pricing';

type LaborProps = {
    currency: Currency,
    weightUnit: WeightUnit
};


const LaborForm = ({ currency = 'IRR', weightUnit = 'ton' }: LaborProps) => {

    const { values, setFieldValue } = useFormikContext<InputRecordFormValues>();

    // Helper for the dynamic unit display (e.g. IRR or IRR / ton)
    const displayUnitLabel = values.byWeightUnit
        ? `${currency} / ${weightUnit}`
        : currency;

    // Derived Values
    const loadingCost = useMemo(() => {
        const wage: Money = {
            amount: values.byWeightUnit ? values.wage * values.netWeight : values.wage,
            currency
        }
        return wage;
    }, [values.wage, values.byWeightUnit, values.netWeight]);


    const wholeLaborCost = useMemo(() => {
        const laborMisc: Money = {
            amount: values.laborMiscCost,
            currency
        };

        const tips: Money = {
            amount: values.tips,
            currency
        };

        const housingCost: Money = {
            amount: values.housingCost,
            currency
        };

        const feedingCost: Money = {
            amount: values.feedingCost,
            currency
        };

        return calculateWholeLaborCost({
            wage: loadingCost,
            laborMiscCost: laborMisc,
            tips,
            housingCost,
            feedingCost
        });
    }, [values.laborMiscCost,
    values.housingCost,
    values.tips,
    values.byWeightUnit,
    values.wage,
    values.feedingCost
    ]);

    // Effects 

    useEffect(() => {
        setFieldValue('loadingCost', loadingCost.amount);
    }, [loadingCost]);

    useEffect(() => {
        setFieldValue('wholeLaborCost', wholeLaborCost);
    }, [wholeLaborCost]);

    return (
        <div className="card shadow-sm border-0 mb-4 text-end" dir="rtl">
            {/* Header aligned to the right */}
            <div className="card-header bg-info text-white">
                <h5 className="mb-0 py-1 fw-bold">جزئیات کارگر و بارگیری</h5>
            </div>

            <div className="card-body bg-body">
                {/* Top Row: Notes and Names */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <label htmlFor='loaderName' className="form-label d-block">لودر</label>
                        <Field className='form-control text-end' name="loaderName" />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor='laborName' className="form-label d-block">کارگر</label>
                        <Field className='form-control text-end' name="laborName" />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor='laborNote' className="form-label d-block">توضیحات</label>
                        <Field as="textarea" rows="1" className='form-control text-end' name="laborNote" />
                    </div>
                </div>

                <hr className="my-4 text-muted" />

                {/* Middle Row: Costs Inputs */}
                <div className="row g-3 align-items-end">
                    {/* Shipping Price */}
                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="form-label fw-bold text-success mb-1">
                                قیمت حمل {!values.byWeightUnit ? "(دربستی)" : "(فی واحد وزن)"}
                            </label>
                            <div className="input-group flex-row-reverse">
                                <span className="input-group-text bg-body text-muted small px-2">
                                    {displayUnitLabel}
                                </span>
                                <NumericField name="wage" />
                            </div>
                        </div>
                    </div>

                    {/* Feeding Cost */}
                    <div className="col-md-2">
                        <label className="form-label small fw-bold">خوراک</label>
                        <div className="input-group flex-row-reverse">
                            <span className="input-group-text small bg-body">{currency}</span>
                            <NumericField name="feedingCost" />
                        </div>
                    </div>

                    {/* Housing Cost */}
                    <div className="col-md-2">
                        <label className="form-label small fw-bold">اسکان</label>
                        <div className="input-group flex-row-reverse">
                            <span className="input-group-text small bg-body">{currency}</span>
                            <NumericField name="housingCost" />
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="col-md-2">
                        <label className="form-label small fw-bold">انعام</label>
                        <div className="input-group flex-row-reverse">
                            <span className="input-group-text small bg-body">{currency}</span>
                            <NumericField name="tips" />
                        </div>
                    </div>

                    {/* Misc Labor Cost */}
                    <div className="col-md-2">
                        <label className="form-label small fw-bold">هزینه متفرقه</label>
                        <div className="input-group flex-row-reverse">
                            <span className="input-group-text small bg-body">{currency}</span>
                            <NumericField name="laborMiscCost" />
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Summaries */}
                <div className="row g-3 mt-4">
                    <div className="col-md-6">
                        <div className="p-3 border rounded bg-body text-center">
                            <label className="text-muted small d-block mb-1">هزینه بارگیری</label>
                            <h4 className="mb-0 fw-bold text-body">
                                {commafy(loadingCost.amount)} <small className="fs-6 fw-normal">{currency}</small>
                            </h4>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="p-3 border border-success rounded bg-body text-center">
                            <label className="text-success small d-block mb-1">مبلغ کل کارگری</label>
                            <h3 className="mb-0 fw-bold text-success">
                                {commafy(wholeLaborCost.amount)} <small className="fs-6 fw-normal">{currency}</small>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaborForm;