import { Field, ErrorMessage } from "formik";

export default function AddressForm() {
  return (
    <>
      <hr className="my-6" />
      <h3 className="text-lg font-semibold text-teal-600 mb-4">Endereço</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Rua</label>
          <Field name="street" className="w-full border rounded px-3 py-2" />
          <ErrorMessage
            name="street"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm">Número</label>
          <Field name="number" className="w-full border rounded px-3 py-2" />
          <ErrorMessage
            name="number"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm">Cidade</label>
          <Field name="city" className="w-full border rounded px-3 py-2" />
          <ErrorMessage
            name="city"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm">Estado</label>
          <Field name="state" className="w-full border rounded px-3 py-2" />
          <ErrorMessage
            name="state"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm">CEP</label>
          <Field name="zipCode" className="w-full border rounded px-3 py-2" />
          <ErrorMessage
            name="zipCode"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
      </div>
    </>
  );
}
