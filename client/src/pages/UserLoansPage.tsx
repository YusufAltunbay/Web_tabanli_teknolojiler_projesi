import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";

type Loan = {
  id: number;
  borrowDate: string;
  returnDate: string;
  book: { title: string; id: number };
};

const UserLoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    fetchMyLoans();
  }, []);

  const fetchMyLoans = () => {
    // Backend'de yeni açtığımız endpoint'e istek atıyoruz
    api.get("loans/my-loans")
      .then((res) => setLoans(res.data))
      .catch(() => toast.error("Bilgileriniz yüklenemedi."));
  };

  const calculateDaysLeft = (returnDateString: string) => {
    const returnDate = new Date(returnDateString);
    const today = new Date();
    const diffTime = returnDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-4">
        📚 Kitaplarım & İade Durumu
      </h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-blue-100">
            <tr>
              <th className="px-6 py-3">Kitap Adı</th>
              <th className="px-6 py-3">Alış Tarihi</th>
              <th className="px-6 py-3">Son İade Tarihi</th>
              <th className="px-6 py-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const daysLeft = calculateDaysLeft(loan.returnDate);
              return (
                <tr key={loan.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{loan.book?.title}</td>
                  <td className="px-6 py-4">{new Date(loan.borrowDate).toLocaleDateString("tr-TR")}</td>
                  <td className="px-6 py-4 font-medium">{new Date(loan.returnDate).toLocaleDateString("tr-TR")}</td>
                  <td className="px-6 py-4">
                    {daysLeft < 0 ? (
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        ⚠️ {Math.abs(daysLeft)} gün gecikti!
                      </span>
                    ) : (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${daysLeft < 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {daysLeft} gün kaldı
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {loans.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  <p className="text-gray-500 mb-2">Henüz ödünç aldığınız bir kitap yok.</p>
                  <a href="/" className="text-blue-600 hover:underline">Hemen kitaplara göz atın!</a>
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