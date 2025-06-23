import { useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";

interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
}

interface SaleItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

interface Sale {
  id: number;
  saleDate: string;
  totalValue: number;
  saleItems: SaleItem[];
}

export default function PurchaseHistory({
  customerId,
}: {
  customerId: number;
}) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await api.get<Sale[]>(
          `/api/sale/customer/${customerId}`
        );
        const sortedSales = response.data.sort(
          (a, b) =>
            new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
        );
        setSales(sortedSales);
      } catch {
        toast.error("Erro ao carregar histórico de compras.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [customerId]);

  return (
    <div className="bg-white rounded shadow p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-left text-teal-700">
        Histórico de Compras
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : sales.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma compra encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {sales.map((sale) => (
            <li key={sale.id} className="border rounded p-3">
              <p className="text-sm text-gray-700 font-medium">
                {"Compra realizada em "}
                {new Date(sale.saleDate).toLocaleDateString()}
              </p>
              <ul className="mt-2 text-sm text-gray-500">
                {sale.saleItems.map((item, idx) => (
                  <li key={idx}>
                    {item.quantity} {item.product.name} — R${" "}
                    {(item.unitPrice * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-2 text-gray-600">
                Total: R$ {sale.totalValue.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
