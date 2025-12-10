import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Favorite = {
  id: number;
  book: { id: number; title: string; category?: { name: string } };
};

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    api.get("favorites")
      .then((res) => setFavorites(res.data))
      .catch(() => toast.error("Favoriler yüklenemedi."));
  };

  const handleRemove = (id: number) => {
    api.delete(`favorites/${id}`)
      .then(() => {
        toast.success("Favorilerden kaldırıldı.");
        setFavorites(favorites.filter(f => f.id !== id));
      })
      .catch(() => toast.error("İşlem başarısız."));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-red-500 pl-4">
        ❤️ Favori Kitaplarım
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((fav) => (
          <div key={fav.id} className="bg-white p-4 rounded shadow border flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{fav.book.title}</h3>
              <p className="text-sm text-gray-500">Kütüphane Kaydı #{fav.book.id}</p>
            </div>
            <div className="flex gap-2">
               {/* Detay sayfasına gitmek istersen link verebilirsin, şimdilik sadece silme */}
              <button 
                onClick={() => handleRemove(fav.id)}
                className="text-red-600 hover:bg-red-50 p-2 rounded text-sm font-medium"
              >
                Kaldır ✕
              </button>
            </div>
          </div>
        ))}
        {favorites.length === 0 && <p className="text-gray-500">Henüz favori kitap eklemediniz.</p>}
      </div>
    </div>
  );
};

export default FavoritesPage;