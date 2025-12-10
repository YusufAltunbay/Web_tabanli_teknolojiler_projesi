import { useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if(password.length < 3) {
        toast.warning("Şifreniz en az 3 karakter olmalıdır.");
        return;
    }

    api.post("auth/register", { username, password })
      .then(() => {
        toast.success("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        navigate("/login");
      })
      .catch((err) => toast.error(err.response?.data?.message || "Kayıt başarısız!"));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-6 py-8 lg:py-0">
      <div className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0 border border-gray-200">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            Yeni Hesap Oluştur
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                Kullanıcı Adı Seçin
              </label>
              <input
                type="text"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 outline-none transition-colors"
                placeholder="Kullanıcı adınız"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Şifre Belirleyin
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all shadow-md hover:shadow-lg"
            >
              Kayıt Ol
            </button>
            
            <p className="text-sm font-light text-gray-500 text-center">
              Zaten hesabınız var mı?{" "}
              <span 
                onClick={() => navigate("/login")}
                className="font-medium text-purple-600 hover:underline cursor-pointer"
              >
                Giriş Yapın
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;