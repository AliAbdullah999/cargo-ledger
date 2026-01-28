import { Formik } from 'formik';
import type { Currency, WeightUnit } from '../domain/types';
import Purchase from '../features/purchase/PurchaseForm';

// configuration (app-level / feature-level config)
const currency: Currency = 'IRR';
const weightUnit: WeightUnit = 'ton';

function InputRecord() {
    return (
        <Formik
            initialValues={{
                purchaseNote: '',
                purchaseValue: 0,
                netWeight: 0,
                productType: '',
                sellerName: '',
                sellerType: '',
                newProductType: '',
                newSellerType: '',
            }}
            onSubmit={() => {}}
        >
            {/* Pass configuration via props */}
            <Purchase currency={currency} weightUnit={weightUnit} />
        </Formik>
    );
}

export default InputRecord;
