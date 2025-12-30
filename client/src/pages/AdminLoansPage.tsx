import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";

type Loan = {
  id: number;
  borrowDate: string;
  returnDate: string;
  book: { title: string; id: number };
  user: { username: string };
};

const AdminLoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = () => {
    api.get("loans").then((res) => setLoans(res.data)).catch(() => toast.error("Veri alınamadı."));
  };

  const handleReturnBook = (loanId: number) => {
    if (!confirm("Kitap iade alındı mı?")) return;
    api.delete(`loans/${loanId}`)
      .then(() => {
        toast.success("İade başarılı, stok güncellendi. ✅");
        setLoans(loans.filter((l) => l.id !== loanId));
      })
      .catch(() => toast.error("Hata oluştu."));
  };

  const calculateDaysLeft = (returnDateString: string) => {
    const diff = new Date(returnDateString).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)); 
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
             Ödünç & İade Takibi
           </h1>
           <p className="text-gray-500 mt-1">Hangi kitap kimde, ne zaman dönmeli?</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-orange-500 to-red-500">
              <tr>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">Kitap</th>
                <th className="px-6 py-4">Alış Tarihi</th>
                <th className="px-6 py-4">Teslim Tarihi</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loans.map((loan) => {
                const daysLeft = calculateDaysLeft(loan.returnDate);
                return (
                  <tr key={loan.id} className="hover:bg-orange-50 transition">
                    <td className="px-6 py-4 font-bold text-gray-800">{loan.user?.username}</td>
                    <td className="px-6 py-4 font-medium">{loan.book?.title}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(loan.borrowDate).toLocaleDateString("tr-TR")}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(loan.returnDate).toLocaleDateString("tr-TR")}</td>
                    <td className="px-6 py-4">
                      {daysLeft < 0 ? (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200 animate-pulse">
                          🚨 {Math.abs(daysLeft)} gün gecikti
                        </span>
                      ) : (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${daysLeft < 3 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                          ⏳ {daysLeft} gün kaldı
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleReturnBook(loan.id)}
                        className="text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-lg text-xs px-4 py-2 shadow-md transition transform active:scale-95"
                      >
                        İade Al
                      </button>
                    </td>
                  </tr>
                );
              })}
              {loans.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Aktif ödünç kaydı yok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLoansPage;