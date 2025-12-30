import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
import { useLoggedInUsersContext } from "../context/LoggedInUserContext";
import { DEFAULT_AVATAR } from "../helper/avatarData";

type User = {
  id: number;
  username: string;
  role: string;
  avatar?: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { loggedInUser } = useLoggedInUsersContext();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get("users")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Kullanıcı listesi alınamadı."));
  };

  const handleRoleChange = (id: number, currentRole: string) => {
    if (loggedInUser && loggedInUser.id === id) {
        toast.warning("Kendi yetkinizi değiştiremezsiniz.");
        return;
    }

    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    const actionText = newRole === 'admin' ? 'Yönetici' : 'Üye';

    if (!confirm(`Bu kullanıcıyı ${actionText} yapmak istediğinize emin misiniz?`)) return;

    api.put(`users/${id}/role`, { role: newRole })
      .then(() => {
        toast.success(`Yetki güncellendi: ${actionText}`);
        setUsers(users.map((u) => u.id === id ? { ...u, role: newRole } : u));
      })
      .catch((err) => toast.error("Hata: " + err.response?.data?.message));
  };

  const handleDeleteUser = (id: number) => {
    if (loggedInUser && loggedInUser.id === id) {
        toast.error("Kendinizi silemezsiniz!");
        return;
    }
    if (!confirm("Kullanıcıyı silmek istediğinize emin misiniz?")) return;

    api.delete(`users/${id}`)
      .then(() => {
        toast.success("Kullanıcı silindi.");
        setUsers(users.filter((u) => u.id !== id));
      })
      .catch((err) => toast.error("Silme başarısız."));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
             Kullanıcı Yönetimi
           </h1>
           <p className="text-gray-500 mt-1">Sistemdeki tüm üyeleri buradan yönetebilirsiniz.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold shadow-sm">
           Toplam: {users.length} Üye
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-purple-600">
              <tr>
                <th className="px-6 py-4">Avatar</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Kullanıcı Adı</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-purple-50 transition duration-150">
                  <td className="px-6 py-4">
                     <img 
                        src={user.avatar || DEFAULT_AVATAR} 
                        alt={user.username} 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                     />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-500">#{user.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{user.username}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {user.role === 'admin' ? '🛡️ YÖNETİCİ' : '👤 ÜYE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleRoleChange(user.id, user.role)}
                        disabled={loggedInUser?.id === user.id}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium shadow-sm active:scale-95 ${
                            loggedInUser?.id === user.id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : user.role === 'admin' 
                                ? 'bg-white border-orange-200 text-orange-600 hover:bg-orange-50' 
                                : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {user.role === 'admin' ? '⬇️ Üye Yap' : '⬆️ Admin Yap'}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={loggedInUser?.id === user.id}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium shadow-sm active:scale-95 ${
                            loggedInUser?.id === user.id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-red-200 text-red-600 hover:bg-red-50'
                        }`}
                      >
                        🗑️ Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Kayıt bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;