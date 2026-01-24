import { NumericFormat } from 'react-number-format'
import type { FieldProps} from 'formik'
import { Field } from 'formik'

type NumericFieldProps = {
  name: string
  label?: string
}

const NumericField = ({ name, ...rest }: NumericFieldProps) => {
  return (
    <Field name={name}>
      {({ field }: FieldProps<any>) => (
        <NumericFormat
          {...field}
          {...rest}
          className="form-control text-end"
          thousandSeparator=","
          allowLeadingZeros
        />
      )}
    </Field>
  )
}

export default NumericField
