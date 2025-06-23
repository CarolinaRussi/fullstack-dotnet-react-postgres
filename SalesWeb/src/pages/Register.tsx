import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { cpf } from "cpf-cnpj-validator";

export default function Register() {
  const navigate = useNavigate();

  const initialValues = {
    document: "",
    name: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    userType: "",
  };

  const validationSchema = Yup.object({
    document: Yup.string()
      .required("CPF é obrigatório")
      .matches(/^\d+$/, "CPF deve conter apenas números")
      .test("is-valid-cpf", "CPF inválido", (value) =>
        value ? cpf.isValid(value) : false
      ),
    name: Yup.string().required("Nome é obrigatório"),
    email: Yup.string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    telephone: Yup.string()
      .required("Telefone é obrigatório")
      .matches(/^\d+$/, "Telefone deve conter apenas números")
      .min(10, "Telefone deve ter pelo menos 10 dígitos")
      .max(11, "Telefone deve ter no máximo 11 dígitos"),
    password: Yup.string()
      .required("Senha é obrigatória")
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .matches(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .matches(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .matches(/\d/, "Senha deve conter pelo menos um número")
      .matches(/[@$!%*?&]/, "Senha deve conter pelo menos um símbolo"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "As senhas não coincidem")
      .required("Confirmação de senha é obrigatória"),
    userType: Yup.string()
      .oneOf(["admin", "customer"], "Tipo de usuário inválido")
      .required("Tipo de usuário é obrigatório"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const { document, name, email, telephone, password, userType } = values;

      const dataToSend = {
        document,
        name,
        email,
        telephone,
        password,
        userType,
      };

      await api.post("/api/customer", dataToSend);
      toast.success("Registro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      const message = err.response?.data?.error
        ? err.response.data.error
        : "Erro ao registrar. Verifique os dados. Erro: " + error;

      toast.error(message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-700">
          Criar Conta
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
                className="w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="document"
                component="div"
                className="text-red-500 text-sm"
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
              <label className="block text-sm">E-mail</label>
              <Field
                name="email"
                type="email"
                className="w-full border rounded px-3 py-2"
              />
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
              <label className="block text-sm">Tipo de Usuário</label>
              <Field
                as="select"
                name="userType"
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Selecione o tipo</option>
                <option value="admin">Administrador</option>
                <option value="customer">Cliente</option>
              </Field>
              <ErrorMessage
                name="userType"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm">Senha</label>
              <Field
                name="password"
                type="password"
                className="w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm">Confirmar Senha</label>
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
            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-2 rounded hover:bg-teal-800 cursor-pointer"
            >
              Registrar
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
