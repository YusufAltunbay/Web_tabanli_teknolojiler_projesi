import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";

type User = {
  id: number;
  username: string;
  role: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get("users")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Kullanıcı listesi alınamadı (Yetkiniz yok)."));
  };

  const handleDeleteUser = (id: number) => {
    if (!confirm("Bu kullanıcıyı ve tüm verilerini silmek istediğinize emin misiniz?")) return;

    api.delete(`users/${id}`)
      .then(() => {
        toast.success("Kullanıcı silindi.");
        // Listeden çıkar
        setUsers(users.filter((u) => u.id !== id));
      })
      .catch((err) => toast.error("Silme başarısız: " + (err.response?.data?.message || "Hata")));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
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
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="font-medium text-red-600 hover:underline hover:text-red-800"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4">Kullanıcı bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;