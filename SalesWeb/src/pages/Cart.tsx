import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";
import AddressModal from "../components/AddresModal";

interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  imageUrl?: string;
  size?: string;
}

export default function Cart() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      api
        .get(`/api/customer/${userId}`)
        .then((res) => {
          const address = res.data.addresses[0];
          setHasAddress(!!address?.zipCode);
        })
        .catch(() => setHasAddress(false));
    }
  }, [userId]);

  useEffect(() => {
    if (id) {
      api
        .get<Product>(`/api/product/${id}`)
        .then((res) => setProduct(res.data))
        .catch(() => toast.error("Erro ao carregar produto"));
    }
  }, [id]);

  if (!product)
    return (
      <p className="text-center mt-10 text-teal-700">Carregando produto...</p>
    );

  const total = quantity * product.price;

  const handleFinishPurchase = async () => {
    if (!hasAddress) {
      setShowAddressModal(true);
      return;
    }
    if (!userId) {
      toast.error("Você precisa estar logado.");
      return;
    }
    try {
      await api.post("/api/sale", {
        customerId: Number(userId),
        saleItems: [
          {
            productId: product.id,
            quantity: quantity,
            unitPrice: product.price,
          },
        ],
      });
      navigate("/");
      toast.success("Compra realizada com sucesso!");
    } catch {
      toast.error("Erro ao finalizar a compra.");
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded p-8">
        <h2 className="text-2xl font-bold mb-6 text-teal-700 text-center">
          Carrinho
        </h2>

        <div className="flex flex-col items-center gap-4">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-80 h-80 object-cover rounded-2xl"
            />
          )}
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-600">Tamanho: {product.size}</p>
          <p className="text-sm text-gray-600">
            Preço: R$ {product.price.toFixed(2)}
          </p>

          <div className="flex items-center gap-2">
            <label>Quantidade:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1"
            />
          </div>

          <p className="text-xl text-teal-800 font-semibold">
            Total: R$ {total.toFixed(2)}
          </p>

          <button
            onClick={handleFinishPurchase}
            className="mt-4 bg-teal-700 text-white py-2 px-6 rounded hover:bg-teal-800"
          >
            Finalizar Compra
          </button>
        </div>
      </div>

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        userId={userId}
        onAddressSaved={() => setHasAddress(true)}
      />
    </>
  );
}
