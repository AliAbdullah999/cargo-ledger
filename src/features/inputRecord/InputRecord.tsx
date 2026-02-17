import { Formik, Form } from 'formik';
import type { Currency, WeightUnit } from '../../domain/types';
import PurchaseForm from '../purchase/PurchaseForm';
import TransportForm from '../transport/TransportForm';
import { initialValues } from './inputRecord.initialValues';
import LaborForm from '../labor/LaborForm';
import SellForm from '../Sell/SellForm';

const currency: Currency = 'IRR';
const weightUnit: WeightUnit = 'ton';

function InputRecord() {
    

    return (
        <div className="min-vh-100 bg-body py-4" dir="rtl">
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => { console.log("Submit", values); }}
            >
                {({ handleSubmit, handleReset }) => (
                    <Form>
                        <div className="container">
                            {/* Page Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h3 className="fw-bold text-dark mb-0">ثبت رکورد جدید</h3>
                                <div className="text-muted small">
                                    واحد: {weightUnit} | ارز: {currency}
                                </div>
                            </div>

                            <div className="row">
                                {/* Side Navigation */}
                                <div className="col-lg-2 d-none d-lg-block">
                                    <div className="sticky-top" style={{ top: '2rem' }}>
                                        <nav className="nav flex-column nav-pills small shadow-sm bg-body p-2 rounded">
                                            <a className="nav-link mb-1" href="#purchase">۱. خرید</a>
                                            <a className="nav-link mb-1" href="#transport">۲. حمل و نقل</a>
                                            <a className="nav-link mb-1" href="#labor">۳. کارگر</a>
                                            <a className="nav-link" href="#sell">۴. فروش و سود</a>
                                        </nav>
                                    </div>
                                </div>

                                {/* Main Form Stack */}
                                <div className="col-lg-10">
                                    <div className="d-flex flex-column gap-4">
                                        <section id="purchase">
                                            <PurchaseForm currency={currency} weightUnit={weightUnit} />
                                        </section>
                                        
                                        <section id="transport">
                                            <TransportForm currency={currency} weightUnit={weightUnit}/>
                                        </section>

                                        <section id="labor">
                                            <LaborForm currency={currency} weightUnit={weightUnit}/>
                                        </section>

                                        <section id="sell">
                                            <SellForm currency={currency} weightUnit={weightUnit}/>
                                        </section>
                                    </div>
                                </div>
                            </div>

                            {/* Spacer for Sticky Footer */}
                            <div style={{ height: '100px' }}></div>

                            {/* Sticky Bottom Action Bar */}
                            <div className="fixed-bottom bg-body border-top shadow-lg p-3">
                                <div className="container d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-2">
                                        <button 
                                            type="submit" 
                                            className="btn btn-success px-5 fw-bold"
                                            onClick={() => handleSubmit()}
                                        >
                                            ذخیره نهایی رکورد
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary"
                                            onClick={() => handleReset()}
                                        >
                                            پاکسازی فرم
                                        </button>
                                    </div>
                                    
                                    <div className="d-none d-md-block text-start">
                                        <span className="text-muted small d-block">وضعیت فرم:</span>
                                        <span className="text-success fw-bold">آماده ثبت</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default InputRecord;