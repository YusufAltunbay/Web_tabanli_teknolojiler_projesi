import { useNavigate, useLocation } from "react-router-dom";
import { useLoggedInUsersContext } from "../context/LoggedInUserContext";
import Cookies from "universal-cookie";
// YENİ: Varsayılan avatar importu
import { DEFAULT_AVATAR } from "../helper/avatarData";

const MyNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedInUser, setLoggedInUser } = useLoggedInUsersContext();
  const cookies = new Cookies();

  const handleLogout = () => {
    cookies.remove("loggedInUser", { path: '/' });
    setLoggedInUser(null);
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path 
      ? "text-blue-700 font-bold" 
      : "text-gray-700 hover:text-blue-700";
  };

  return (
    <nav className="bg-white border-gray-200 px-4 py-3 rounded-b-lg shadow-md mb-6">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        
        {/* SOL: Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <span className="self-center text-xl font-semibold whitespace-nowrap text-purple-700">
            📚 Kütüphane Yönetim Sistemi
          </span>
        </div>

        {/* SAĞ: Kullanıcı ve Çıkış */}
        <div className="flex items-center md:order-2 gap-3">
          {loggedInUser ? (
            <>
              {/* YENİ: Avatar ve İsim Alanı */}
              <div 
                className="hidden md:flex items-center mr-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition"
                onClick={() => navigate("/profile")}
                title="Profil Ayarları"
              >
                <img 
                  className="w-9 h-9 rounded-full border border-gray-300 object-cover mr-2" 
                  src={loggedInUser.avatar || DEFAULT_AVATAR} 
                  alt="Avatar"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                />
                <div className="text-sm font-medium text-gray-600 leading-tight">
                  <div>Hoş geldin, <span className="text-black font-bold">{loggedInUser.username}</span></div>
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 border border-gray-200">
                    {loggedInUser.role === 'admin' ? 'YÖNETİCİ' : 'ÜYE'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mr-2">
                Giriş Yap
              </button>
              <button onClick={() => navigate("/register")} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2">
                Kayıt Ol
              </button>
            </>
          )}
        </div>

        {/* ORTA: Linkler */}
        <div className="hidden w-full md:block md:w-auto md:order-1">
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium items-center">
            
            <li>
              <button onClick={() => navigate("/")} className={`block py-2 pr-4 pl-3 ${isActive("/")}`}>
                Ana Sayfa
              </button>
            </li>
            
            {loggedInUser?.role === 'admin' && (
              <>
                <li><button onClick={() => navigate("/add-book")} className={`block py-2 pr-4 pl-3 ${isActive("/add-book")}`}>+ Kitap Ekle</button></li>
                <li><button onClick={() => navigate("/admin-loans")} className={`block py-2 pr-4 pl-3 ${isActive("/admin-loans")}`}>📋 Ödünç Takip</button></li>
                <li><button onClick={() => navigate("/users")} className={`block py-2 pr-4 pl-3 ${isActive("/users")}`}>👥 Kullanıcılar</button></li>
              </>
            )}

            {loggedInUser && loggedInUser.role !== 'admin' && (
              <>
                <li><button onClick={() => navigate("/my-loans")} className={`block py-2 pr-4 pl-3 ${isActive("/my-loans")}`}>📖 Kitaplarım</button></li>
                <li><button onClick={() => navigate("/favorites")} className={`block py-2 pr-4 pl-3 ${isActive("/favorites")}`}>❤️ Favorilerim</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;