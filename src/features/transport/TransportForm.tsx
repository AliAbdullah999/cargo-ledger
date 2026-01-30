import { useMemo, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import { useEffect } from 'react';
import NumericField from '../../shared/components/NumericField';
import { commafy, addValueToArr, removeValueFromArr } from '../../shared/utils/settings';


type FormValues = {
    driverName: string;
    vehicleNumber: string;
    netWeight: number;
    emptyWeight: number;
    fullWeight: number;
    shippOddCost: number;
    scalingCost: number;
    tonsCount: number;
    fixedAmount: boolean;
    inTons: boolean;
    purchasedFrom: string;
    newPayer?: string;
    loadTypeNote: "";
}

const TransportForm = () => {
    const { values, setFieldValue } = useFormikContext<FormValues>();

    const [payers, setPayers] = useState(['فروشنده', 'خریدار', 'صندوق'])
    const [showAddPayer, setShowAddPayer] = useState(false);

    const handleAddPayer = () => {
        if (!showAddPayer) return setShowAddPayer(true);


        if (!values.newPayer?.trim()) return setShowAddPayer(false);

        setPayers(prev =>
            addValueToArr(prev, values.newPayer!)
        );

        setFieldValue('newPayerType', '');
        setFieldValue('addPayerVisible', false);
    };

    const handleDeletePayer = () => {
        setPayers(removeValueFromArr(payers, values.purchasedFrom));
    };

    const netWeight = useMemo(() => {
        const full = Number(values.fullWeight) || 0;
        const empty = Number(values.emptyWeight) || 0;
        return full - empty;
    }, [values.fullWeight, values.emptyWeight]);

    const wholeShippingCost = useMemo(() => {
        const tonsCount = Number(values.tonsCount) || 0;
        const scalingCost = Number(values.scalingCost) || 0;
        const shippOddCost = Number(values.shippOddCost) || 0;
        const nWeight = Number(netWeight) || 0;

        let total = values.inTons ? tonsCount * nWeight : tonsCount;
        total += scalingCost + shippOddCost;

        console.log(total);
        return total;
    }, [values.inTons, values.tonsCount, values.scalingCost, values.shippOddCost, netWeight]);

    useEffect(() => {
        setFieldValue('netWeight', netWeight);
    }, [netWeight, setFieldValue]);

    return (
        <>
            <div className="container-fluid p-0 col-md-12">
                {/* Section Badge */}
                <div className="col-md p-1 text-end">
                    <h1 className='fs-5 badge bg-info text-wrap' >نوع حمل</h1>
                </div>

                <div className="col-md-13 border border-5 shadow-lg p-1 bg-body">
                    <div className="row  text-start ">

                        {/* Net Weight*/}
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor="netWeight">:وزن خالص</label>
                                    <h4>{commafy(netWeight)}</h4>
                                </fieldset>
                            </div>
                        </div>


                        {/* Empty Weight*/}
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='emptyWeight'>:وزن خالی</label>
                                    <NumericField name={"emptyWeight"} />
                                </fieldset>
                            </div>
                        </div>

                        {/* Full Weight*/}
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='fullWeight'>:وزن پر</label>
                                    {/* <Field className='form-control text-end' type="text" name="fullWeight" onKeyUp={netWeight} /> */}
                                    <NumericField name="fullWeight" />
                                </fieldset>
                            </div>
                        </div>

                        {/* Miscellaneous Expenses*/}
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='shippOddCost'>:هزینه متفرقه</label>
                                    {/* <Field className='form-control text-end' type="text" name="shippOddCost" onKeyUp={calculateWholeShippingCost} /> */}
                                    <NumericField name="shippOddCost" />
                                </fieldset>
                            </div>
                        </div>

                        {/* Bascul Cost */}
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='scalingCost'>:هزینه باسکول</label>
                                    {/* <Field className='form-control text-end' type="text" name="scalingCost" onKeyUp={calculateWholeShippingCost} /> */}
                                    <NumericField name="scalingCost" />
                                </fieldset>
                            </div>
                        </div>

                        {/* Driver Name */}
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='driverName'>:اسم راننده </label>
                                    <Field className='form-control text-end' type="text" name="driverName" />
                                </fieldset>
                            </div>
                        </div>

                        {/* Vehicle Number*/}
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='vehicleNumber'>:شماره ماشین</label>
                                    <Field className='form-control text-end' type="text" name="vehicleNumber" />
                                </fieldset>
                            </div>
                        </div>
                    </div>


                    <div className="row  text-start ">

                        {/* Transport Note */}
                        <div className="col-md">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='loadTypeNote'>:توضیحات</label>
                                    <Field as="textarea" className='form-control text-end' name="loadTypeNote"></Field>
                                </fieldset>
                            </div>
                        </div>

                        {/* Purchased From (Payer) */}
                        <div className="col-md-2">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='purchasedFrom'>:پرداخت شد از</label>
                                    <Field as="select" className='form-control text-end' name="purchasedFrom">
                                        {payers.map(e => (
                                            <option key={e} value={e} >{e}</option>
                                        )
                                        )}
                                    </Field>
                                    <button className='btn btn-outline-danger btn-sm mx-2 my-1' onClick={handleDeletePayer}>حذف</button>
                                    <button className='btn btn-outline-success btn-sm ml-2 ' onClick={handleAddPayer}>افزایش</button>
                                </fieldset>
                            </div>
                        </div>

                        {/* Seller Name */}
                        <div className="col-md-2">
                            <div className="form-floating border-4 border border-success mt-2 p-1 ">
                                <fieldset className="form-group text-end">
                                    <label className='text-success' htmlFor='sellerName'>:کل کرایه حمل</label>
                                    <h4 className='text-success text-center'>{commafy(wholeShippingCost)}</h4>
                                </fieldset>
                            </div>
                        </div>

                        {/* By Weight Unit or Fixed*/}
                        <div className="col-md-2">
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    <label htmlFor='tonsCount'>{values.inTons && ":تنی"}{!values.inTons && ":دربستی"}</label>
                                    {/* <Field className='form-control text-end' type="text" name="tonsCount" onKeyUp={calculateWholeShippingCost} /> */}
                                    <NumericField name="tonsCount" />
                                </fieldset>
                            </div>
                        </div>

                        {/* Payment Basis */}
                        <div className="col-md-2">
                            <div className="form-check">
                                <fieldset className="form-group text-end">
                                    <label htmlFor="checkbox-group">:کرایه پرداختی</label>
                                </fieldset>
                            </div>
                            <div className="form-floating">
                                <fieldset className="form-group text-end">
                                    {/* <div className="form-check form-check-inline form-switch">
                                                        <Field className="form-check-Field" type="checkbox" id="flexCheckDefault" name='fixedAmount' />
                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                            دربستی
                                                        </label>
                                                    </div> */}
                                    <div className="form-check form-check-inline form-switch">
                                        <Field className="form-check-Field" type="checkbox" id="flexCheckChecked" name='inTons' />
                                        <label className="form-check-label" htmlFor="flexCheckChecked">
                                            تنی
                                        </label>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    {/* <div className="row  text-start ">
                                            <div className="col-md">
                                                <div className="form-floating">
                                                </div>
                                            </div>
                                            {values.addCustomerVisible && <div className="col-md">
                                                <div className="form-floating">
                                                    <fieldset className="form-group text-end">
                                                        <label htmlFor='productType'>:اضافه به مقصد</label>
                                                        <Field type="text" className='form-control text-end' name="newPayerType" />
                                                    </fieldset>
                                                </div>
                                            </div>}
                                        </div> */}
                </div>
            </div>
        </>
    );

}

export default TransportForm;
