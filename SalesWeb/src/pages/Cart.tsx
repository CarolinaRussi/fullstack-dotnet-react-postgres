import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { toast } from "react-toastify";
import AddressModal from "../components/AddresModal";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  size?: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userName");
  const [customers, setCustomers] = useState<{ id: number; name: string }[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);


  const navigate = useNavigate();

  useEffect(() => {
    console.log(userType)
  if (userType === "Admin") {
    api.get("/api/customer")
      .then((res) => setCustomers(res.data))
      .catch(() => toast.error("Erro ao carregar clientes"));
  }
}, []);


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
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQuantity = (productId: number, delta: number) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (!updatedCart.find((i) => i.productId === productId)) {
      toast.info("Item removido do carrinho.");
    }

    window.dispatchEvent(new Event("storage"));
  };

  const handleFinishPurchase = async () => {
    if (!hasAddress && userType !== "Admin") {
      setShowAddressModal(true);
      return;
    }

    const finalCustomerId =
      userType === "Admin" ? selectedCustomerId : Number(userId);

    if (!finalCustomerId) {
      toast.error("Selecione um cliente.");
      return;
    }

    try {
      await api.post("/api/sale", {
        customerId: finalCustomerId,
        saleItems: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      });

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage"));
      navigate("/");
      toast.success("Compra realizada com sucesso!");
    } catch {
      toast.error("Erro ao finalizar a compra.");
    }
  };

  if (cartItems.length === 0)
    return (
      <p className="text-center mt-10 text-teal-700">
        Seu carrinho está vazio.
      </p>
    );

  return (
    <>
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded p-8">
        <h2 className="text-2xl font-bold mb-6 text-teal-700 text-center">
          Carrinho
        </h2>

        {userType === "Admin" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecione o cliente:
            </label>
            <select
              value={selectedCustomerId ?? ""}
              onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecione um cliente</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <h3 className="font-semibold text-teal-700">{item.name}</h3>
                <p className="text-sm text-gray-600">Tamanho: {item.size}</p>
                <p className="text-sm text-gray-600">
                  Preço: R$ {item.price.toFixed(2)}
                </p>

                <div className="flex items-center gap-3 mt-1">
                  <button
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="text-white bg-teal-700 w-6 h-6 flex items-center justify-center rounded hover:bg-teal-800"
                  >
                    –
                  </button>

                  <span className="text-sm">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="text-white bg-teal-700 w-6 h-6 flex items-center justify-center rounded hover:bg-teal-800"
                  >
                    +
                  </button>
                </div>

                <p className="text-sm font-semibold text-teal-800 mt-1">
                  Total: R$ {(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-2xl text-teal-800 font-bold mt-6 text-center">
          Total geral: R$ {total.toFixed(2)}
        </p>

        <button
          onClick={handleFinishPurchase}
          className="mt-6 w-full bg-teal-700 text-white py-2 px-6 rounded hover:bg-teal-800"
        >
          Finalizar Compra
        </button>
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
