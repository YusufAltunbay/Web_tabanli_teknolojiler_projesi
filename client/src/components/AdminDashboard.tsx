import { useEffect, useState } from "react";
import { api } from "../helper/api";

// Modern SVG İkonlar (Görünüm için)
const Icons = {
  Books: () => <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.747 0-3.332.477-4.5 1.253" /></svg>,
  Stock: () => <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Loans: () => <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Users: () => <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
};

const AdminDashboard = () => {
  // SENİN ORİJİNAL STATE YAPIN
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

  // SENİN ORİJİNAL VERİ ÇEKME MANTIĞIN
  const fetchStats = async () => {
    try {
      const [booksRes, usersRes, loansRes] = await Promise.all([
        api.get("books"),
        api.get("users"),
        api.get("loans")
      ]);

      // Veriler null gelirse boş dizi kabul et
      const books = booksRes.data || [];
      const users = usersRes.data || [];
      const loans = loansRes.data || [];

      // --- HESAPLAMALAR ---
      const totalBooks = books.length;
      
      // Stok hesaplama (Number() ekledim ki string gelirse patlamasın)
      const totalStock = books.reduce((acc: number, book: any) => acc + (Number(book.stock) || 0), 0);
      
      const totalUsers = users.length;
      
      // Orijinal dosyanda olduğu gibi direkt length alıyoruz
      const activeLoans = Array.isArray(loans) ? loans.length : 0;

      setStats({
        totalBooks,
        totalUsers,
        activeLoans,
        totalStock
      });
      
      setLoading(false);

    } catch (error) {
      console.error("İstatistik hatası:", error);
      setLoading(false);
    }
  };

  // Yükleniyor durumunda modern iskelet görünüm
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-pulse">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 bg-gray-200 rounded-2xl shadow-sm"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
        {/* Başlık */}
        <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                Yönetici Paneli
            </h2>
            <p className="text-gray-500 mt-1">Kütüphanenin anlık durumu.</p>
        </div>

        {/* Kartlar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
            {/* Kart 1: Kitap Çeşidi (Mor) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-sm font-bold opacity-80 uppercase tracking-wider">Kitap Çeşidi</p>
                        <h3 className="text-4xl font-extrabold mt-2">{stats.totalBooks}</h3>
                        <p className="text-xs mt-2 bg-white/20 inline-block px-2 py-1 rounded backdrop-blur-sm">Farklı Başlık</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                        <Icons.Books />
                    </div>
                </div>
            </div>

            {/* Kart 2: Toplam Stok (Mavi) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-sm font-bold opacity-80 uppercase tracking-wider">Toplam Stok</p>
                        <h3 className="text-4xl font-extrabold mt-2">{stats.totalStock}</h3>
                        <p className="text-xs mt-2 bg-white/20 inline-block px-2 py-1 rounded backdrop-blur-sm">Raftaki Adet</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                        <Icons.Stock />
                    </div>
                </div>
            </div>

            {/* Kart 3: Şu An Okunan (Turuncu) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-sm font-bold opacity-80 uppercase tracking-wider">Okunan Kitap</p>
                        <h3 className="text-4xl font-extrabold mt-2">{stats.activeLoans}</h3>
                        <p className="text-xs mt-2 bg-white/20 inline-block px-2 py-1 rounded backdrop-blur-sm">Şu an üyelerde</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                        <Icons.Loans />
                    </div>
                </div>
            </div>

            {/* Kart 4: Toplam Üye (Yeşil) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-teal-500 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-sm font-bold opacity-80 uppercase tracking-wider">Kayıtlı Üye</p>
                        <h3 className="text-4xl font-extrabold mt-2">{stats.totalUsers}</h3>
                        <p className="text-xs mt-2 bg-white/20 inline-block px-2 py-1 rounded backdrop-blur-sm">Aktif Kullanıcı</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                        <Icons.Users />
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default AdminDashboard;