import { NumericFormat } from 'react-number-format'
import { useFormikContext } from 'formik'

type NumericFieldProps = {
  name: string
  label?: string
}

const NumericField = ({ name, ...rest }: NumericFieldProps) => {
  const { setFieldValue, values, handleBlur } = useFormikContext<any>()

  const handleValueChange = (valuesObj: any) => {
    const { floatValue } = valuesObj
    setFieldValue(name, floatValue ?? 0)
  }

  return (
    <NumericFormat
      {...rest}
      name={name}
      value={values[name]}
      className="form-control text-end"
      thousandSeparator=","
      allowLeadingZeros
      onValueChange={handleValueChange}
      onBlur={handleBlur}
    />
  )
}

export default NumericField
