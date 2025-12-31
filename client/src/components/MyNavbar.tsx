import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoggedInUsersContext } from "../context/LoggedInUserContext";
import Cookies from "universal-cookie";
import { DEFAULT_AVATAR } from "../helper/avatarData";
import { api } from "../helper/api"; // API import etmeyi unutma

const MyNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedInUser, setLoggedInUser } = useLoggedInUsersContext();
  const cookies = new Cookies();
  
  // YENİ: Okunmamış mesaj sayısı state'i
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    cookies.remove("loggedInUser", { path: '/' });
    setLoggedInUser(null);
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path 
      ? "bg-purple-100 text-purple-700 font-bold shadow-sm" 
      : "text-gray-600 hover:bg-gray-50 hover:text-purple-600";
  };

  // YENİ: Her 5 saniyede bir okunmamış mesaj sayısını kontrol et
  useEffect(() => {
    if (!loggedInUser) return;

    const fetchUnread = () => {
      api.get("messages/unread-total")
         .then(res => setUnreadCount(res.data))
         .catch(err => console.log(err));
    };

    fetchUnread(); // İlk açılışta çek
    const interval = setInterval(fetchUnread, 5000); // 5 saniyede bir yenile
    return () => clearInterval(interval);
  }, [loggedInUser]);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-sm transition-all duration-300">
      <div className="container flex flex-wrap justify-between items-center mx-auto max-w-7xl">
        
        {/* SOL: Logo (Gradient Efektli) */}
        <div className="flex items-center cursor-pointer group" onClick={() => navigate("/")}>
          <span className="text-3xl mr-2 transform group-hover:scale-110 transition-transform duration-300">📚</span>
          <span className="self-center text-xl font-extrabold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
            Kütüphanem
          </span>
        </div>

        {/* ORTA: Linkler (Desktop) */}
        <div className="hidden md:flex items-center space-x-1">
            <button onClick={() => navigate("/")} className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive("/")}`}>
                Ana Sayfa
            </button>
            
            {loggedInUser?.role === 'admin' && (
              <>
                <button onClick={() => navigate("/add-book")} className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive("/add-book")}`}>+ Kitap Ekle</button>
                <button onClick={() => navigate("/admin-loans")} className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive("/admin-loans")}`}>📋 Ödünç Takip</button>
                <button onClick={() => navigate("/users")} className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive("/users")}`}>👥 Kullanıcılar</button>
              </>
            )}

            {loggedInUser && loggedInUser.role !== 'admin' && (
              <>
                <button onClick={() => navigate("/my-loans")} className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive("/my-loans")}`}>📖 Kitaplarım</button>
                <button onClick={() => navigate("/favorites")} className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive("/favorites")}`}>❤️ Favorilerim</button>
              </>
            )}

            {/* SOHBET BUTONU VE BADGE (GÜNCELLENDİ) */}
            {loggedInUser && (
              <button onClick={() => navigate("/chat")} className={`relative px-4 py-2 rounded-full text-sm transition-all duration-200 flex items-center gap-1 ${isActive("/chat")}`}>
                 💬 Sohbet
                 {unreadCount > 0 && (
                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-pulse">
                     {unreadCount}
                   </span>
                 )}
              </button>
            )}
        </div>

        {/* SAĞ: Kullanıcı ve Çıkış */}
        <div className="flex items-center gap-3">
          {loggedInUser ? (
            <div className="flex items-center gap-3 pl-2">
              <div 
                className="hidden md:flex items-center gap-3 pr-4 pl-1 py-1 rounded-full border border-gray-200 bg-white hover:shadow-md cursor-pointer transition-all duration-200 group"
                onClick={() => navigate("/profile")}
                title="Profil Ayarları"
              >
                <img 
                  className="w-8 h-8 rounded-full object-cover border border-purple-200 group-hover:scale-105 transition-transform" 
                  src={loggedInUser.avatar || DEFAULT_AVATAR} 
                  alt="Avatar"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                />
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700 leading-none">{loggedInUser.username}</span>
                    <span className="text-[9px] font-bold text-purple-500 uppercase tracking-wider leading-none mt-0.5">
                        {loggedInUser.role === 'admin' ? 'Yönetici' : 'Üye'}
                    </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 p-2 rounded-full transition-colors"
                title="Çıkış Yap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => navigate("/login")} className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors">
                Giriş Yap
              </button>
              <button onClick={() => navigate("/register")} className="bg-purple-600 text-white hover:bg-purple-700 font-medium rounded-full text-sm px-5 py-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Kayıt Ol
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default MyNavbar;