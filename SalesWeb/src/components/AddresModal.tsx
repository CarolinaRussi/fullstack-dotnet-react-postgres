import { Formik, Form } from "formik";
import * as Yup from "yup";
import AddressForm from "./AddressForm";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { api } from "../services/api";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onAddressSaved: () => void;
}

const validationSchema = Yup.object({
  street: Yup.string().required("Rua obrigatória"),
  number: Yup.string().required("Número obrigatório"),
  city: Yup.string().required("Cidade obrigatória"),
  state: Yup.string().required("Estado obrigatório"),
  zipCode: Yup.string().required("CEP obrigatório"),
});

export default function AddressModal({
  isOpen,
  onClose,
  userId,
  onAddressSaved,
}: AddressModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  if (!userId) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-teal-800">
          Informe seu endereço
        </h2>

        <Formik
          initialValues={{
            street: "",
            number: "",
            city: "",
            state: "",
            zipCode: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const data = { customerId: userId, ...values };
              await api.post(`/api/address`, data);
              toast.success("Endereço salvo com sucesso");
              onAddressSaved();
              onClose();
            } catch {
              toast.error("Erro ao salvar endereço");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <AddressForm />
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
