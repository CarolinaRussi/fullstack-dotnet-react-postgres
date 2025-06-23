import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import AddressForm from "../components/AddressForm";
import PurchaseHistory from "../components/PurchaseHistory";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";

interface Address {
  id?: number;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  customerId?: number;
}

interface User {
  id: number;
  document: string;
  name: string;
  email: string;
  telephone: string;
  addresses: Address[];
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("Usuário não está logado.");
          return;
        }
        const response = await api.get<User>(`/api/customer/${userId}`);
        setUser(response.data);
      } catch {
        toast.error("Erro ao carregar dados do usuário.");
      }
    };

    fetchUser();
  }, []);

  if (!user)
    return <p className="text-center mt-10 text-teal-700">Carregando...</p>;

  const initialValues = {
    name: user.name,
    email: user.email,
    telephone: user.telephone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    street: user.addresses[0]?.street || "",
    number: user.addresses[0]?.number || "",
    city: user.addresses[0]?.city || "",
    state: user.addresses[0]?.state || "",
    zipCode: user.addresses[0]?.zipCode || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Nome é obrigatório"),
    email: Yup.string().email("Email inválido").required("Email é obrigatório"),
    telephone: Yup.string().required("Telefone é obrigatório"),

    currentPassword: Yup.string().test(
      "require-current-password-if-fields-changed",
      "Informe a senha atual para alterar dados",
      function (value) {
        const { name, email, telephone, newPassword } = this.parent;

        const dadosForamAlterados =
          name !== user?.name ||
          email !== user?.email ||
          telephone !== user?.telephone ||
          !!newPassword;

        if (dadosForamAlterados) {
          return !!value?.trim();
        }

        return true;
      }
    ),

    newPassword: Yup.string()
      .notRequired()
      .trim()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .matches(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .matches(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .matches(/\d/, "Senha deve conter pelo menos um número")
      .matches(/[@$!%*?&]/, "Senha deve conter pelo menos um símbolo"),

    confirmPassword: Yup.string().when("newPassword", {
      is: (val: string) => !!val,
      then: (schema) =>
        schema
          .oneOf([Yup.ref("newPassword")], "As senhas não coincidem")
          .required("Confirme a nova senha"),
      otherwise: (schema) => schema.notRequired(),
    }),

    street: Yup.string().test(
      "address-required",
      "Preencha todos os campos do endereço se preencher algum",
      function (value) {
        const { number, city, state, zipCode } = this.parent;
        const anyFilled = [value, number, city, state, zipCode].some(
          (v) => v && v.trim() !== ""
        );

        if (anyFilled) {
          return (
            value?.trim() &&
            number?.trim() &&
            city?.trim() &&
            state?.trim() &&
            zipCode?.trim()
          );
        }
        return true;
      }
    ),

    number: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipCode: Yup.string(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await api.put(`/api/customer/${user.id}`, {
        name: values.name,
        email: values.email,
        telephone: values.telephone,
        currentPassword: values.currentPassword || null,
        newPassword: values.newPassword || null,
      });

      if (user.addresses[0]) {
        await api.put(`/api/address/${user.addresses[0].id}`, {
          street: values.street,
          number: values.number,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          customerId: user.id,
        });
      } else {
        await api.post("/api/address", {
          street: values.street,
          number: values.number,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          customerId: user.id,
        });
      }

      toast.success("Perfil atualizado com sucesso.");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 401) {
        toast.error("Senha atual incorreta.");
      } else {
        toast.error("Erro ao atualizar o perfil.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white shadow-md rounded p-8">
        <h2 className="text-2xl font-bold mb-6 text-left text-teal-700">
          Perfil do Usuário
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-sm">CPF</label>
              <Field
                name="document"
                value={user.document}
                disabled
                className="w-full border bg-gray-100 rounded px-3 py-2 cursor-not-allowed text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm">Nome</label>
              <Field name="name" className="w-full border rounded px-3 py-2" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm">Email</label>
              <Field name="email" className="w-full border rounded px-3 py-2" />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm">Telefone</label>
              <Field
                name="telephone"
                className="w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="telephone"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm">Senha atual</label>
              <Field
                name="currentPassword"
                type="password"
                className="w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="currentPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm">Nova senha</label>
              <Field
                name="newPassword"
                type="password"
                className="w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm">Confirmar nova senha</label>
              <Field
                name="confirmPassword"
                type="password"
                className="w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <AddressForm />

            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-2 rounded hover:bg-teal-800"
            >
              Salvar Alterações
            </button>
          </Form>
        </Formik>
      </div>

      <PurchaseHistory customerId={user.id} />
    </div>
  );
}
