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
    // Mevcut avatarı seçili hale getir
    if (loggedInUser?.avatar) {
      setSelectedAvatar(loggedInUser.avatar);
    }
  }, [loggedInUser]);

  const handleUpdate = () => {
    const updateData: any = {};

    // Şifre kontrolü
    if (password) {
        if (password.length < 3) return toast.warning("Şifre en az 3 karakter olmalı.");
        if (password !== confirmPassword) return toast.warning("Şifreler uyuşmuyor.");
        updateData.password = password;
    }

    // Avatar kontrolü (Değişiklik varsa gönder)
    if (selectedAvatar && selectedAvatar !== loggedInUser?.avatar) {
        updateData.avatar = selectedAvatar;
    }

    if (Object.keys(updateData).length === 0) {
        return toast.info("Herhangi bir değişiklik yapmadınız.");
    }

    setLoading(true);

    api.put("users/profile", updateData)
      .then(() => {
        toast.success("Profiliniz güncellendi!");
        setPassword("");
        setConfirmPassword("");
        
        // Context ve Cookie güncelleme (Anlık değişim için)
        if (loggedInUser) {
            const updatedUser = { ...loggedInUser, ...updateData };
            // backend'den tam user objesi dönüyor olabilir ama biz elimizdekini güncelleyelim
            if(updateData.password) delete updatedUser.password; // şifreyi context'te tutmayız
            
            setLoggedInUser(updatedUser);
            cookies.set("loggedInUser", JSON.stringify(updatedUser), { path: '/' });
        }
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
          <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg border-4 border-white overflow-hidden">
             {/* Avatar varsa göster, yoksa baş harf */}
             <img 
               src={selectedAvatar || loggedInUser?.avatar || DEFAULT_AVATAR} 
               alt="Avatar" 
               className="w-full h-full object-cover"
             />
          </div>
          <h2 className="text-white text-xl font-bold">{loggedInUser?.username}</h2>
          <span className="text-purple-100 text-sm bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
            {loggedInUser?.role === 'admin' ? 'Yönetici' : 'Üye'}
          </span>
        </div>

        {/* Form Kısmı */}
        <div className="p-6 space-y-4">
          
          {/* AVATAR DEĞİŞTİRME */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Avatarını Değiştir</label>
            <div className="grid grid-cols-4 gap-2 justify-items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                {AVATAR_OPTIONS.map((avatar, idx) => (
                    <img 
                        key={idx}
                        src={avatar}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 ${selectedAvatar === avatar ? 'border-purple-600 scale-110 shadow' : 'border-transparent'}`}
                    />
                ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          <h3 className="text-gray-800 font-semibold">Şifre Değiştir (İsteğe Bağlı)</h3>
          
          <div>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 text-sm focus:border-purple-500 outline-none"
              placeholder="Yeni Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 text-sm focus:border-purple-500 outline-none"
              placeholder="Yeni Şifre (Tekrar)"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            onClick={handleUpdate}
            disabled={loading}
            className={`w-full text-white font-medium rounded-lg text-sm px-5 py-3 text-center transition-all shadow-md ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Güncelleniyor...' : 'Profili Güncelle'}
          </button>
          
          <div className="text-center mt-2">
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