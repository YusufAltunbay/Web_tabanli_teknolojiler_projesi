import { useState, useEffect } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
import { useLoggedInUsersContext } from "../context/LoggedInUserContext";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { AVATAR_OPTIONS, DEFAULT_AVATAR } from "../helper/avatarData";

const ProfilePage = () => {
  const { loggedInUser, setLoggedInUser } = useLoggedInUsersContext();
  const navigate = useNavigate();
  const cookies = new Cookies();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedInUser?.avatar) {
      setSelectedAvatar(loggedInUser.avatar);
    }
  }, [loggedInUser]);

  const handleUpdate = () => {
    const updateData: any = {};

    if (password) {
        if (password.length < 3) return toast.warning("Şifre en az 3 karakter olmalı.");
        if (password !== confirmPassword) return toast.warning("Şifreler uyuşmuyor.");
        updateData.password = password;
    }

    if (selectedAvatar && selectedAvatar !== loggedInUser?.avatar) {
        updateData.avatar = selectedAvatar;
    }

    if (Object.keys(updateData).length === 0) {
        return toast.info("Herhangi bir değişiklik yapmadınız.");
    }

    setLoading(true);

    api.put("users/profile", updateData)
      .then(() => {
        toast.success("Profiliniz başarıyla güncellendi! ✨");
        setPassword("");
        setConfirmPassword("");
        
        if (loggedInUser) {
            const updatedUser = { ...loggedInUser, ...updateData };
            if(updateData.password) delete updatedUser.password;
            
            setLoggedInUser(updatedUser);
            cookies.set("loggedInUser", JSON.stringify(updatedUser), { path: '/' });
        }
      })
      .catch((err) => {
        toast.error("Hata: " + (err.response?.data?.message || "Güncelleme başarısız."));
      })
      .finally(() => setLoading(false));
  };

  if (!loggedInUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* 1. Üst Banner (Gradient) */}
        <div className="h-48 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 relative">
            <div className="absolute inset-0 bg-white/10 opacity-50 pattern-dots"></div>
        </div>

        {/* 2. Profil Başlığı ve Avatar */}
        <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6 gap-6">
                {/* Büyük Avatar */}
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                        <img 
                            src={selectedAvatar || loggedInUser.avatar || DEFAULT_AVATAR} 
                            alt="Profil" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white shadow-sm" title="Çevrimiçi"></div>
                </div>

                {/* İsim ve Rol */}
                <div className="text-center md:text-left flex-1 mb-2">
                    <h1 className="text-3xl font-extrabold text-gray-800">{loggedInUser.username}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${loggedInUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {loggedInUser.role === 'admin' ? '🛡️ Yönetici' : '📚 Kitap Kurdu'}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">ID: #{loggedInUser.id}</span>
                    </div>
                </div>

                {/* Kaydet Butonu (Masaüstü için sağda) */}
                <div className="hidden md:block">
                     <button 
                        onClick={handleUpdate}
                        disabled={loading}
                        className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* 3. Ayarlar Grid Yapısı */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Sol: Avatar Seçimi */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🖼️</span> Avatar Seçimi
                    </h3>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">Profilin için hazır avatarlardan birini seç.</p>
                        <div className="grid grid-cols-4 gap-4 justify-items-center">
                            {AVATAR_OPTIONS.map((avatar, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedAvatar(avatar)}
                                    className={`relative w-14 h-14 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none ${selectedAvatar === avatar ? 'ring-4 ring-purple-500 shadow-lg scale-110' : 'opacity-70 hover:opacity-100 hover:shadow'}`}
                                >
                                    <img src={avatar} alt="Avatar Option" className="w-full h-full object-cover rounded-full" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sağ: Şifre Değiştirme */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🔒</span> Güvenlik Ayarları
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Yeni Şifre</label>
                            <input 
                                type="password" 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Şifre Tekrar</label>
                            <input 
                                type="password" 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            * Şifreni değiştirmek istemiyorsan bu alanları boş bırakabilirsin.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Mobil için Kaydet Butonu */}
            <div className="block md:hidden mt-8">
                 <button 
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            <div className="mt-8 text-center">
                 <button onClick={() => navigate("/")} className="text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors">
                    Ana Sayfaya Dön
                 </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;