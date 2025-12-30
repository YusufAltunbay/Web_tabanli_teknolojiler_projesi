import { useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AVATAR_OPTIONS } from "../helper/avatarData";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if(password.length < 3) {
        toast.warning("Şifreniz çok kısa (Min: 3)");
        return;
    }

    api.post("auth/register", { username, password, role, avatar: selectedAvatar })
      .then(() => {
        toast.success("Kayıt başarılı! Aramıza hoş geldin. 🎉");
        navigate("/login");
      })
      .catch((err) => toast.error(err.response?.data?.message || "Kayıt başarısız!"));
  }

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Yeni Hesap Oluştur</h2>
          <p className="text-gray-500 text-sm mt-2">Kütüphane dünyasına katılmak için formu doldur.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Kullanıcı Adı */}
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kullanıcı Adı</label>
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Örn: kitapkurdu" />
             </div>
             {/* Şifre */}
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Şifre</label>
                <input type="password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••" />
             </div>
          </div>

          {/* Avatar Seçimi */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
             <label className="block text-xs font-bold text-gray-500 uppercase mb-3 text-center">Profil Resmi Seç</label>
             <div className="grid grid-cols-4 gap-3 justify-items-center">
                {AVATAR_OPTIONS.map((avatar, index) => (
                  <img 
                    key={index}
                    src={avatar}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-12 h-12 rounded-full cursor-pointer transition-all transform hover:scale-110 border-2 ${selectedAvatar === avatar ? 'border-purple-600 scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  />
                ))}
             </div>
             {selectedAvatar && <p className="text-center text-xs text-purple-600 mt-2 font-bold">Harika seçim! 🌟</p>}
          </div>

          {/* Rol Seçimi */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hesap Türü</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer">
              <option value="member">📚 Okuyucu (Üye)</option>
              <option value="admin">🛠️ Yönetici (Admin)</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-95">
            Kayıt Ol ve Başla 🚀
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Zaten hesabın var mı?{" "}
            <span onClick={() => navigate("/login")} className="text-purple-600 font-bold cursor-pointer hover:underline">Giriş Yap</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;