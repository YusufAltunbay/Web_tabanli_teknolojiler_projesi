import { useEffect, useState } from "react";
import { api } from "../helper/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeLoans: 0,
    totalStock: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 3 farklı yerden veriyi aynı anda çekiyoruz
      const [booksRes, usersRes, loansRes] = await Promise.all([
        api.get("books"),
        api.get("users"),
        api.get("loans")
      ]);

      const books = booksRes.data;
      const users = usersRes.data;
      const loans = loansRes.data;

      // Hesaplamalar
      const totalBooks = books.length;
      // Toplam stok miktarını hesapla (tüm kitapların stoklarını topla)
      const totalStock = books.reduce((acc: number, book: any) => acc + book.stock, 0);
      const totalUsers = users.length;
      // Sadece iade tarihi OLMAYAN (hala okunuyor olan) kitapları say
      const activeLoans = loans.filter((loan: any) => !loan.returnDate).length;

      setStats({ totalBooks, totalUsers, activeLoans, totalStock });
      setLoading(false);
    } catch (error) {
      console.error("İstatistik hatası", error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">İstatistikler yükleniyor...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* KART 1: Toplam Kitap */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">Toplam Kitap Çeşidi</p>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalBooks}</h3>
        </div>
        <div className="text-3xl">📚</div>
      </div>

      {/* KART 2: Toplam Stok */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">Raftaki Toplam Stok</p>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalStock}</h3>
        </div>
        <div className="text-3xl">📦</div>
      </div>

      {/* KART 3: Aktif Okuyucular */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">Şu An Okunan</p>
          <h3 className="text-2xl font-bold text-gray-800">{stats.activeLoans}</h3>
          <p className="text-xs text-yellow-600">Kitap üyelerde</p>
        </div>
        <div className="text-3xl">📖</div>
      </div>

      {/* KART 4: Toplam Üye */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">Kayıtlı Üye</p>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
        </div>
        <div className="text-3xl">👥</div>
      </div>

    </div>
  );
};

export default AdminDashboard;