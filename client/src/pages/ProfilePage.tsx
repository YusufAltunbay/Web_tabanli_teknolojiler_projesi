import { useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
import { useLoggedInUsersContext } from "../context/LoggedInUserContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = () => {
    // 1. Doğrulamalar
    if (!password) return toast.warning("Lütfen yeni şifre girin.");
    if (password.length < 3) return toast.warning("Şifre en az 3 karakter olmalı.");
    if (password !== confirmPassword) return toast.warning("Şifreler birbiriyle uyuşmuyor.");

    setLoading(true);

    // 2. Backend'e Gönder (PUT /users/profile)
    api.put("users/profile", { password })
      .then(() => {
        toast.success("Şifreniz başarıyla güncellendi!");
        setPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        toast.error("Hata: " + (err.response?.data?.message || "Güncelleme başarısız."));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mx-auto p-4 flex justify-center mt-10">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Üst Kısım: Profil Özeti */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-purple-600 mb-2 shadow-inner">
            {loggedInUser?.username.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-white text-xl font-bold">{loggedInUser?.username}</h2>
          <span className="text-purple-100 text-sm bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
            {loggedInUser?.role === 'admin' ? 'Yönetici' : 'Üye'}
          </span>
        </div>

        {/* Form Kısmı */}
        <div className="p-6 space-y-4">
          <h3 className="text-gray-800 font-semibold border-b pb-2">Şifre Değiştir</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 outline-none transition-all"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 outline-none transition-all"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            onClick={handleUpdate}
            disabled={loading}
            className={`w-full text-white font-medium rounded-lg text-sm px-5 py-3 text-center transition-all shadow-md ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'
            }`}
          >
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </button>
          
          <div className="text-center mt-4">
             <span onClick={() => navigate("/")} className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer hover:underline">
               ← Ana Sayfaya Dön
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;