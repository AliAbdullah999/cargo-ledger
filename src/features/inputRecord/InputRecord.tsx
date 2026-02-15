import { Formik } from 'formik';
import type { Currency, WeightUnit } from '../../domain/types';
import PurchaseForm from '../purchase/PurchaseForm';
import TransportForm from '../transport/TransportForm';
import { initialValues } from './inputRecord.initialValues';
import WorkerForm from '../worker/WorkerForm';


// configuration (app-level / feature-level config)
const currency: Currency = 'IRR';
const weightUnit: WeightUnit = 'ton';

function InputRecord() {
    return (
        <div className="content-wrapper bg-secondary h-100">
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}
            >
                <div className="d-flex flex-column ms-1 vw-90 mb-1">
                    <PurchaseForm currency={currency} weightUnit={weightUnit} />
                    <TransportForm currency={currency} weightUnit={weightUnit}/>
                    <WorkerForm currency={currency} weightUnit={weightUnit}/>
                </div>
            </Formik>
        </div>
    );
}

export default InputRecord;
