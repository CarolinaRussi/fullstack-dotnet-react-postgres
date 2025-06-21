import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface Product {
  id?: number;
  code: string;
  name: string;
  price: number;
  imageUrl?: string;
  size?: string;
}

interface ModalProductProps {
  product: Product | null;
  onClose: () => void;
  onSave: (productData: Product) => void;
}

const validationSchema = Yup.object({
  code: Yup.string().required("Código é obrigatório"),
  name: Yup.string().required("Nome é obrigatório"),
  price: Yup.number()
    .typeError("Preço deve ser um número")
    .positive("Preço deve ser maior que zero")
    .required("Preço é obrigatório"),
  imageUrl: Yup.string().url("Deve ser uma URL válida").nullable(),
  size: Yup.string().nullable(),
});

export default function ModalProduct({
  product,
  onClose,
  onSave,
}: ModalProductProps) {
  useEffect(() => {
    document.body.style.overflow = product ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (product === null) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-teal-800">
          {product?.id ? "Editar Produto" : "Novo Produto"}
        </h2>

        <Formik
          initialValues={{
            code: product?.code ?? "",
            name: product?.name ?? "",
            price: product?.price ?? 0,
            imageUrl: product?.imageUrl ?? "",
            size: product?.size ?? "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            onSave({
              ...values,
              id: product?.id,
            });
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="code" className="block font-medium mb-1">
                  Código
                </label>
                <Field
                  name="code"
                  id="code"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <ErrorMessage
                  name="code"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  Nome
                </label>
                <Field
                  name="name"
                  id="name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label htmlFor="price" className="block font-medium mb-1">
                  Preço
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-600">
                    R$
                  </span>
                  <Field
                    name="price"
                    id="price"
                    type="number"
                    step="0.01"
                    className="w-full border border-gray-300 rounded pl-10 pr-3 py-2"
                  />
                </div>
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="block font-medium mb-1">
                  URL da imagem
                </label>
                <Field
                  name="imageUrl"
                  id="imageUrl"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <ErrorMessage
                  name="imageUrl"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label htmlFor="size" className="block font-medium mb-1">
                  Tamanho
                </label>
                <Field
                  name="size"
                  id="size"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <ErrorMessage
                  name="size"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded bg-teal-700 text-white hover:bg-teal-800 transition"
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
