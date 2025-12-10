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
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    api.post("auth/login", { username, password })
      .then((res) => {
        cookies.set("loggedInUser", JSON.stringify(res.data), { path: '/' });
        setLoggedInUser(res.data);
        toast.success("Tekrar hoş geldiniz!");
        navigate("/");
      })
      .catch(() => toast.error("Giriş başarısız! Kullanıcı adı veya şifre yanlış."));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-6 py-8 lg:py-0">
      <div className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0 border border-gray-200">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            Hesabınıza Giriş Yapın
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 outline-none transition-colors"
                placeholder="Örn: ahmet123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all shadow-md hover:shadow-lg"
            >
              Giriş Yap
            </button>
            
            <p className="text-sm font-light text-gray-500 text-center">
              Henüz bir hesabınız yok mu?{" "}
              <span 
                onClick={() => navigate("/register")}
                className="font-medium text-blue-600 hover:underline cursor-pointer"
              >
                Kayıt Olun
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;