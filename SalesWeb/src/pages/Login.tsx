import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
};

export default function Login() {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().required("E-mail é obrigatório"),
    password: Yup.string().required("Senha é obrigatória"),
  });

  const { login } = useAuth();

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await api.post("/api/auth/login", values);
      const { token } = response.data;

      const decoded = jwtDecode<JwtPayload>(token);
      const userId = decoded.sub;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      login(token);
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error("E-mail ou senha inválidos. Erro: " + error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">E-mail</label>
              <Field
                name="email"
                type="text"
                className="mt-1 w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Senha</label>
              <Field
                name="password"
                type="password"
                className="mt-1 w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 cursor-pointer"
            >
              Entrar
            </button>
          </Form>
        </Formik>
        <h3 className="mt-6 text-center text-sm text-gray-600">
          Não tem conta ainda?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-teal-600 hover:underline cursor-pointer"
          >
            Registre-se aqui
          </button>
        </h3>
      </div>
    </div>
  );
}
