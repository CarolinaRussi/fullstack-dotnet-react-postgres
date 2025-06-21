import { useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ModalProduct from "../components/ModalProduct";
import type { AxiosError } from "axios";

const MySwal = withReactContent(Swal);

interface Product {
  id?: number;
  code: string;
  name: string;
  price: number;
  imageUrl?: string;
  size?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productModal, setProductModal] = useState<Product | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    api
      .get("/api/product")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Erro ao carregar produtos"));
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#a12323",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/product/${id}`);
        setProducts(products.filter((p) => p.id !== id));
        MySwal.fire("Deletado!", "Produto excluído com sucesso.", "success");
      } catch {
        MySwal.fire("Erro", "Não foi possível excluir o produto.", "error");
      }
    }
  };

  const handleSave = async (productData: Product) => {
    try {
      if (productData.id) {
        await api.put(`/api/product/${productData.id}`, productData);
        setProducts(
          products.map((p) => (p.id === productData.id ? productData : p))
        );
        toast.success("Produto atualizado com sucesso");
      } else {
        const res = await api.post("/api/product", productData);
        setProducts([...products, res.data]);
        toast.success("Produto criado com sucesso");
      }
      setProductModal(null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log(err);
      const message = err.response?.data?.message || "Erro ao salvar produto";
      toast.error(message);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-teal-800">Lista de Produtos</h1>
        <button
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
          onClick={() =>
            setProductModal({
              code: "",
              name: "",
              price: 0,
              imageUrl: "",
              size: "",
            })
          }
          type="button"
        >
          Novo Produto
        </button>
      </div>

      <ul className="space-y-4">
        {products
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h2 className="text-lg font-semibold text-teal-700">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Código: {product.code}
                  </p>
                  {product.size && (
                    <p className="text-sm text-gray-600">
                      Tamanho: {product.size}
                    </p>
                  )}
                  <p className="text-teal-800 font-bold mt-1">
                    R$ {product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setProductModal(product)}
                  className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
                  type="button"
                >
                  Editar
                </button>
                <button
                  onClick={() =>
                    product.id !== undefined && handleDelete(product.id)
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  type="button"
                  disabled={product.id === undefined}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
      </ul>

      <div className="flex justify-center mt-6 gap-3">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-teal-600 text-white disabled:bg-teal-500 cursor-pointer"
        >
          Anterior
        </button>
        <span className="flex items-center">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-teal-600 text-white disabled:bg-teal-500 cursor-pointer"
        >
          Próxima
        </button>
      </div>

      <ModalProduct
        product={productModal}
        onClose={() => setProductModal(null)}
        onSave={handleSave}
      />
    </div>
  );
}
