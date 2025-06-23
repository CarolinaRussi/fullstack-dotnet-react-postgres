import { useEffect, useState } from "react";
import { api } from "../services/api";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";
import { FaCartPlus } from "react-icons/fa";
import { toast } from "react-toastify";

interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  imageUrl?: string;
  size?: string;
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  size?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    api.get("/api/product").then((res) => setProducts(res.data));
  }, []);

  const handleClickProduct = (product: Product) => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "info",
        title: "Atenção",
        text: "Você precisa se registrar para realizar a compra.",
        confirmButtonColor: "#0d9488",
      });
      return;
    }

    const storedCart = localStorage.getItem("cart");
    const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
        size: product.size,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <button
            onClick={() => handleClickProduct(product)}
            className="absolute top-2 right-2 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition cursor-pointer"
          >
            <FaCartPlus size={20} />
          </button>

          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-bold text-teal-800">{product.name}</h3>
            <p className="text-sm text-gray-600">Código: {product.code}</p>
            {product.size && (
              <p className="text-sm text-gray-600">Tamanho: {product.size}</p>
            )}
            <p className="text-teal-700 font-semibold mt-2">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
