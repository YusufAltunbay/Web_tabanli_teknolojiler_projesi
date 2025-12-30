import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Favorite = {
  id: number;
  book: { id: number; title: string; category?: { name: string }; imageUrl?: string };
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
         <span className="text-4xl">❤️</span>
         <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Favori Kitaplarım</h1>
            <p className="text-gray-500">Beğendiğin ve okumak istediğin kitaplar burada.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((fav) => (
          <div key={fav.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex">
             {/* Sol taraf: Resim (varsa) veya İkon */}
             <div className="w-1/3 bg-gray-100 flex items-center justify-center">
                {fav.book.imageUrl ? (
                    <img src={fav.book.imageUrl} alt={fav.book.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-4xl">📚</span>
                )}
             </div>

             {/* Sağ taraf: Bilgi */}
             <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                   <h3 className="font-bold text-lg text-gray-800 line-clamp-2" title={fav.book.title}>{fav.book.title}</h3>
                   <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-2 inline-block">
                     {fav.book.category?.name || "Genel"}
                   </span>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <button onClick={() => handleRemove(fav.id)} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 transition">
                    💔 Kaldır
                  </button>
                  <button onClick={() => navigate("/")} className="text-blue-600 hover:text-blue-800 text-sm font-bold">
                    İncele →
                  </button>
                </div>
             </div>
          </div>
        ))}
        
        {favorites.length === 0 && (
            <div className="col-span-3 text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-6xl mb-4">😿</p>
                <p className="text-xl font-bold text-gray-700">Listeniz henüz boş.</p>
                <p className="text-gray-500 mb-6">Beğendiğiniz kitapları kalp ikonuna tıklayarak ekleyebilirsiniz.</p>
                <button onClick={() => navigate("/")} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-700 transition">
                    Kitapları Keşfet
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;