import { useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface Customer {
  id: number;
  name: string;
  email: string;
  document: string;
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    api
      .get("/api/customer")
      .then((res) => setCustomers(res.data))
      .catch(() => toast.error("Erro ao carregar clientes"));
  }, []);

  useEffect(() => {
  console.log("Clientes atualizados:", customers);
}, [customers]);

  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: "Tem certeza?",
      text: "Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#a12323",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/customer/${id}`);
        setCustomers(customers.filter((c) => c.id !== id));
        MySwal.fire("Deletado!", "Cliente excluído com sucesso.", "success");
      } catch {
        MySwal.fire("Erro", "Não foi possível excluir o cliente.", "error");
      }
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-teal-800 mb-6">Lista de Clientes</h1>

      {customers.length === 0 ? (
        <p className="text-gray-500">Nenhum cliente encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {customers
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((customer) => (
              <li
                key={customer.id}
                className="flex justify-between items-center bg-white shadow-md rounded-lg p-4"
              >
                <div>
                  <p className="text-lg font-semibold text-teal-700">{customer.name}</p>
                  <p className="text-sm text-gray-600">CPF: {customer.document}</p>
                  <p className="text-sm text-gray-600">Email: {customer.email}</p>
                </div>

                <button
                  onClick={() => handleDelete(customer.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Excluir
                </button>
              </li>
            ))}
        </ul>
      )}

      <div className="flex justify-center mt-6 gap-3">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-teal-600 text-white disabled:bg-teal-500"
        >
          Anterior
        </button>
        <span className="flex items-center">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-teal-600 text-white disabled:bg-teal-500"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
