import { use, useEffect, useMemo, useState } from 'react';
import type { Currency, Money, WeightUnit } from "../../domain/types"
import type { InputRecordFormValues } from '../inputRecord/inputRecord.types';
import { Field, useFormikContext } from 'formik';
import { commafy } from '../../shared/utils/settings';
import NumericField from '../../shared/components/NumericField';
import { calculateWholeWorkerCost } from '../../domain/pricing';

type WorkerProps = {
    currency: Currency,
    weightUnit: WeightUnit
};


const WorkerForm = ({ currency = 'IRR', weightUnit = 'ton' }: WorkerProps) => {

    const { values, setFieldValue } = useFormikContext<InputRecordFormValues>();

    // Derived Values
    const loadingCost = useMemo(() => {
        const wage: Money = {
            amount: values.byWeightUnit ? values.wage * values.netWeight : values.wage,
            currency
        }
        return wage;
    }, [values.wage]);


    const wholeWorkerCost = useMemo(() => {
        const workerMisc: Money = {
            amount: values.workerMiscCost,
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

        return calculateWholeWorkerCost({
            wage: loadingCost,
            workerMiscCost: workerMisc,
            tips,
            housingCost,
            feedingCost
        });
    }, [values.workerMiscCost,
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
        setFieldValue('wholeWorkerCost', wholeWorkerCost.amount);
    }, [wholeWorkerCost]);

    return (
        <div className="container-fluid p-0 col-md-12">
            <div className="col-md p-1 text-end">
                <h1 className='fs-5 badge bg-info text-wrap' >کارگر</h1>
            </div>

            <div className="col-md-13 border border-5 shadow-lg p-1 bg-body">
                <div className="col-md-12 border border-5 shadow-lg p-1 bg-body">
                    <div className="row  text-start ">
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='workerNote'>:توضیحات</label>
                                    <Field as="textarea" className='form-control text-end' name="workerNote"></Field>
                                </fieldset>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='loaderName'>:لودر</label>
                                    <Field className='form-control text-end' type="text" name="loaderName" />
                                </fieldset>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='workerName'>:کارگر</label>
                                    <Field className='form-control text-end' type="text" name="workerName" />
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="row  text-start ">
                        <div className="col-md">
                            <div className="form-floating border-4 border border-success ms-2 mt-2 p-1 ">
                                <fieldset className="form-group text-end">
                                    <label className='text-success' htmlFor='sellerName'>:مبلغ کل کارگری</label>
                                    <h4 className="form-group text-center text-success">{commafy(wholeWorkerCost.amount)}</h4>
                                </fieldset>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='workerMiscCost'>:هزینه متفرقه</label>
                                    {/* <Field className='form-control text-end' type="text" name="workerMiscCost" onKeyUp={calculateWholeWorkerCost} /> */}
                                    <NumericField name="workerMiscCost" />
                                </fieldset>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='tips'>:انعام</label>
                                    {/* <Field className='form-control text-end' type="text" name="tips" onKeyUp={calculateWholeWorkerCost} /> */}
                                    <NumericField name="tips" />
                                </fieldset>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='housingCost'>:اسکان</label>
                                    {/* <Field className='form-control text-end' type="text" name="housingCost" onKeyUp={calculateWholeWorkerCost} /> */}
                                    <NumericField name="housingCost" />
                                </fieldset>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='feedingCost'>:خوراک</label>
                                    {/* <Field className='form-control text-end' type="text" name="feedingCost" onKeyUp={calculateWholeWorkerCost} /> */}
                                    <NumericField name="feedingCost" />
                                </fieldset>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-floating border-1 border border-success mt-2 p-1 ">
                                <fieldset className="form-group text-end">
                                    <label className='text-success'>:هزینه بارگیری </label>
                                    <h6 className="form-group text-center text-success">{commafy(loadingCost.amount)}</h6>
                                </fieldset>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='wage'>{!values.byWeightUnit && ":فی قیمت"} {values.byWeightUnit && ": کل قیمت حمل"}</label>
                                    {/* <Field className='form-control text-end' type="text" name="wage" onKeyUp={function (event) { calculateLoadingCost(); calculateWholeWorkerCost() }} /> */}
                                    <NumericField name="wage" />
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerForm;