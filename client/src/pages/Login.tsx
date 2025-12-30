import { useState } from "react";
import { api } from "../helper/api";
import Cookies from "universal-cookie";
import { useLoggedInUsersContext } from "../context/LoggedInUserContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const cookies = new Cookies();
  const { setLoggedInUser } = useLoggedInUsersContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    api.post("auth/login", { username, password })
      .then((res) => {
        cookies.set("loggedInUser", JSON.stringify(res.data), { path: '/' });
        setLoggedInUser(res.data);
        toast.success(`Tekrar hoş geldin, ${res.data.username}! 👋`);
        navigate("/");
      })
      .catch(() => toast.error("Giriş başarısız! Bilgilerinizi kontrol edin."));
  }

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-4">
      {/* Kart */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        
        {/* Başlık ve Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl">
            📚
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Giriş Yap</h2>
          <p className="text-gray-500 text-sm mt-2">Kütüphanene erişmek için bilgilerini gir.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Kullanıcı Adı */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-700"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Şifre */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </span>
            <input
              type="password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-95"
          >
            Giriş Yap
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Hesabın yok mu?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 font-bold cursor-pointer hover:underline"
            >
              Hemen Kayıt Ol
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;