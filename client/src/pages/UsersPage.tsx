import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
// YENİ: Giriş yapan kullanıcıyı tanımak için context'i ekledik
import { useLoggedInUsersContext } from "../context/LoggedInUserContext";

type User = {
  id: number;
  username: string;
  role: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  // YENİ: Şu anki adminin bilgisini alıyoruz
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
    // KENDİNİ YAKMA KORUMASI:
    // Eğer işlem yapılan ID, giriş yapmış kullanıcının ID'sine eşitse durdur.
    if (loggedInUser && loggedInUser.id === id) {
        toast.warning("Kendi yetkinizi düşüremezsiniz! Başka bir yönetici bunu yapabilir.");
        return;
    }

    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    const actionText = newRole === 'admin' ? 'Yönetici' : 'Üye';

    if (!confirm(`Bu kullanıcıyı ${actionText} yapmak istediğinize emin misiniz?`)) return;

    api.put(`users/${id}/role`, { role: newRole })
      .then(() => {
        toast.success(`Kullanıcı yetkisi güncellendi: ${actionText}`);
        setUsers(users.map((u) => 
            u.id === id ? { ...u, role: newRole } : u
        ));
      })
      .catch((err) => {
        toast.error("Yetki değiştirilemedi: " + (err.response?.data?.message || "Hata"));
      });
  };

  const handleDeleteUser = (id: number) => {
    // Ekstra Güvenlik: Admin kendini silemesin
    if (loggedInUser && loggedInUser.id === id) {
        toast.error("Kendinizi silemezsiniz!");
        return;
    }

    if (!confirm("Bu kullanıcıyı ve tüm verilerini silmek istediğinize emin misiniz?")) return;

    api.delete(`users/${id}`)
      .then(() => {
        toast.success("Kullanıcı silindi.");
        setUsers(users.filter((u) => u.id !== id));
      })
      .catch((err) => toast.error("Silme başarısız: " + (err.response?.data?.message || "Hata")));
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">
        👥 Kullanıcı Yönetimi
      </h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Kullanıcı Adı</th>
              <th scope="col" className="px-6 py-3">Rol</th>
              <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                <td className="px-6 py-4 font-semibold">{user.username}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-green-100 text-green-700 border border-green-200'
                  }`}>
                    {user.role === 'admin' ? 'YÖNETİCİ' : 'ÜYE'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button
                    onClick={() => handleRoleChange(user.id, user.role)}
                    // Kendi satırıysa butonu pasif ve gri yap (Görsel ipucu)
                    disabled={loggedInUser?.id === user.id}
                    className={`font-medium text-xs px-3 py-1.5 rounded border transition ${
                        loggedInUser?.id === user.id
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' // Pasif Stil
                        : user.role === 'admin' 
                            ? 'text-orange-600 border-orange-200 hover:bg-orange-50' 
                            : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    {user.role === 'admin' ? '⬇️ Üye Yap' : '⬆️ Admin Yap'}
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={loggedInUser?.id === user.id}
                    className={`font-medium text-xs px-3 py-1.5 rounded border transition ${
                        loggedInUser?.id === user.id
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-800'
                    }`}
                  >
                    Sil 🗑️
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400 text-lg">
                    Kayıtlı kullanıcı bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;