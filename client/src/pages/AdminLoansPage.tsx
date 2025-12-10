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
    api.get("loans")
      .then((res) => setLoans(res.data))
      .catch(() => toast.error("Ödünç listesi alınamadı. Yetkiniz olmayabilir."));
  };

  const handleReturnBook = (loanId: number) => {
    if (!confirm("Kitap fiziksel olarak iade alındı mı? Stok artırılacaktır.")) return;

    api.delete(`loans/${loanId}`)
      .then(() => {
        toast.success("İade işlemi başarılı, stok güncellendi.");
        setLoans(loans.filter((l) => l.id !== loanId));
      })
      .catch(() => toast.error("İade işlemi başarısız."));
  };

  // Kalan günü hesaplayan yardımcı fonksiyon
  const calculateDaysLeft = (returnDateString: string) => {
    const returnDate = new Date(returnDateString);
    const today = new Date();
    // Milisaniye farkını güne çevir
    const diffTime = returnDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-4">
        📋 Ödünç & İade Takibi
      </h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-orange-100">
            <tr>
              <th className="px-6 py-3">Kullanıcı</th>
              <th className="px-6 py-3">Kitap</th>
              <th className="px-6 py-3">Veriliş Tarihi</th>
              <th className="px-6 py-3">Son Teslim</th>
              <th className="px-6 py-3">Durum</th>
              <th className="px-6 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const daysLeft = calculateDaysLeft(loan.returnDate);
              return (
                <tr key={loan.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{loan.user?.username}</td>
                  <td className="px-6 py-4">{loan.book?.title}</td>
                  <td className="px-6 py-4">{new Date(loan.borrowDate).toLocaleDateString("tr-TR")}</td>
                  <td className="px-6 py-4">{new Date(loan.returnDate).toLocaleDateString("tr-TR")}</td>
                  <td className="px-6 py-4">
                    {daysLeft < 0 ? (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {Math.abs(daysLeft)} gün gecikti!
                      </span>
                    ) : (
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${daysLeft < 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {daysLeft} gün kaldı
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleReturnBook(loan.id)}
                      className="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-xs px-3 py-2"
                    >
                      İade Al
                    </button>
                  </td>
                </tr>
              );
            })}
            {loans.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">Aktif ödünç kaydı bulunmuyor.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLoansPage;