import { ErrorMessage } from 'formik';

type FieldErrorProps = {
  name: string;
};

export const FieldError = ({ name }: FieldErrorProps) => (
  <ErrorMessage
    name={name}
    component="div"
    className="text-danger small mt-1"
  />
);


