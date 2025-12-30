import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Loan = {
  id: number;
  borrowDate: string;
  returnDate: string;
  book: { title: string; id: number };
};

const UserLoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("loans/my-loans").then((res) => setLoans(res.data)).catch(() => toast.error("Veri alınamadı."));
  }, []);

  const calculateDaysLeft = (returnDateString: string) => {
    const diff = new Date(returnDateString).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)); 
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
         <span className="text-4xl">📖</span>
         <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Kitaplarım</h1>
            <p className="text-gray-500">Okumakta olduğun kitapların durumunu buradan takip et.</p>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-gradient-to-r from-blue-500 to-cyan-500">
            <tr>
              <th className="px-6 py-4">Kitap Adı</th>
              <th className="px-6 py-4">Alış Tarihi</th>
              <th className="px-6 py-4">Son Teslim</th>
              <th className="px-6 py-4 text-center">Kalan Süre</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loans.map((loan) => {
              const daysLeft = calculateDaysLeft(loan.returnDate);
              return (
                <tr key={loan.id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-800 text-lg">{loan.book?.title}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(loan.borrowDate).toLocaleDateString("tr-TR")}</td>
                  <td className="px-6 py-4 font-medium text-gray-700">{new Date(loan.returnDate).toLocaleDateString("tr-TR")}</td>
                  <td className="px-6 py-4 text-center">
                    {daysLeft < 0 ? (
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-4 py-1.5 rounded-full border border-red-200">
                         {Math.abs(daysLeft)} gün geçti!
                      </span>
                    ) : (
                      <span className={`text-xs font-bold px-4 py-1.5 rounded-full border ${daysLeft < 5 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                        {daysLeft} gün kaldı
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {loans.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-10">
                   <p className="text-gray-500 text-lg mb-4">Şu an okuduğun bir kitap yok.</p>
                   <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">Kitap Seçmeye Git</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserLoansPage;