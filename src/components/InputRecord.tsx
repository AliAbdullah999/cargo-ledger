import { Formik } from 'formik'
import Purchase from './Purchase'
import type { Money, Weight } from '../domain/types'

const initialPurchaseValue: Money = {
    amount: 0,
    currency: 'IRR',
}

const initialNetWeight: Weight = {
    value: 0,
    unit: 'kg',
}

function InputRecord() {
    return (
        <Formik
            initialValues={{
                // purchase
                purchaseNote: '',
                purchaseValue: 0,
                productType: '',
                sellerName: '',
                sellerType: '',
                newProductType: '',
                newSellerType: '',
            }}
            onSubmit={() => { }}
        >
            <Purchase
                purchaseValue={initialPurchaseValue}
                netWeight={initialNetWeight}
            />
        </Formik>
    )
}

export default InputRecord
