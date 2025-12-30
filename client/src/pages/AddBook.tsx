import { useState, useEffect } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [stock, setStock] = useState("1");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [authorName, setAuthorName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [categories, setCategories] = useState([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    api.get("categories").then(res => setCategories(res.data)).catch(() => toast.error("Kategoriler yüklenemedi."));
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return toast.warning("Boş olamaz");
    api.post("categories", { name: newCatName })
      .then(() => {
        toast.success("Kategori eklendi!");
        setNewCatName("");
        setShowCatModal(false);
        fetchCategories();
      });
  };

  const handleSubmit = () => {
    if (!title || !pageCount || !stock || categoryId === 0 || !authorName) {
      toast.warning("Lütfen tüm zorunlu alanları doldurunuz.");
      return;
    }

    api.post("books", {
      title,
      pageCount: Number(pageCount),
      categoryId: Number(categoryId),
      authorName: authorName,
      stock: Number(stock),
      imageUrl: imageUrl
    })
      .then(() => {
        toast.success("Kitap kütüphaneye eklendi! 📚");
        navigate("/");
      })
      .catch((err) => toast.error("Hata: " + err.response?.data?.message));
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center mb-8">
           <h2 className="text-3xl font-extrabold text-gray-800">Yeni Kitap Ekle</h2>
           <p className="text-gray-500 mt-2">Kütüphane koleksiyonunu genişlet.</p>
        </div>

        <div className="space-y-5">
          {/* Kitap Adı */}
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">Kitap Adı</label>
            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition" 
                   placeholder="Örn: Sefiller" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Yazar ve Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">Yazar Adı</label>
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition" 
                       placeholder="Örn: Victor Hugo" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
             </div>
             <div>
                <div className="flex justify-between items-center mb-2">
                   <label className="text-sm font-bold text-gray-700">Kategori</label>
                   <button onClick={() => setShowCatModal(true)} className="text-xs text-purple-600 hover:underline font-bold">+ Yeni Ekle</button>
                </div>
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer" 
                        value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
                  <option value={0}>Kategori Seçiniz...</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
             </div>
          </div>

          {/* Sayfa ve Stok */}
          <div className="grid grid-cols-2 gap-5">
            <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">Sayfa Sayısı</label>
                <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" 
                       value={pageCount} onChange={(e) => setPageCount(e.target.value)} />
            </div>
            <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">Stok Adedi</label>
                <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" 
                       value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
          </div>

          {/* Resim URL */}
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">Kapak Resmi URL <span className="text-gray-400 font-normal">(İsteğe Bağlı)</span></label>
            <input 
                type="url" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" 
                placeholder="https://..."
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
            />
          </div>

          {/* Önizleme */}
          {imageUrl && (
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <img src={imageUrl} alt="Önizleme" className="h-20 w-14 object-cover rounded shadow-md" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                <div>
                    <p className="text-sm font-bold text-purple-800">Görsel Önizlemesi</p>
                    <p className="text-xs text-purple-600">Kitap kapağı bu şekilde görünecek.</p>
                </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transform transition hover:scale-[1.02]">Kaydet</button>
            <button onClick={() => navigate("/")} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition">İptal</button>
          </div>
        </div>
      </div>

      {/* Kategori Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Hızlı Kategori Ekle</h3>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 outline-none" 
                   value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Örn: Bilim Kurgu" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCatModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Vazgeç</button>
              <button onClick={handleAddCategory} className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">Ekle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBook;