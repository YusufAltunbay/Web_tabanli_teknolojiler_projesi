import { useState, useEffect } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();

  // Form Verileri
  const [title, setTitle] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [stock, setStock] = useState("1");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [authorName, setAuthorName] = useState("");
  // YENİ: Resim URL State'i
  const [imageUrl, setImageUrl] = useState("");

  // Kategori Modal State
  const [categories, setCategories] = useState([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    api.get("categories")
      .then(res => setCategories(res.data))
      .catch(() => toast.error("Kategoriler yüklenemedi."));
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
      imageUrl: imageUrl // <-- YENİ: Backend'e gönderiyoruz
    })
      .then(() => {
        toast.success("Kitap başarıyla kaydedildi!");
        navigate("/");
      })
      .catch((err) => {
        toast.error("Hata: " + (err.response?.data?.message || "Başarısız."));
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Yeni Kitap Ekle</h2>

        <div className="flex flex-col gap-4">
          {/* Kitap Adı */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900">Kitap Adı *</label>
            <input type="text" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5" 
                   value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Sayfa ve Stok */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-900">Sayfa Sayısı *</label>
                <input type="number" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5" 
                       value={pageCount} onChange={(e) => setPageCount(e.target.value)} />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-900">Stok Adedi *</label>
                <input type="number" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5" 
                       value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
          </div>

          {/* Kategori Seçimi */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-900">Kategori *</label>
              <button onClick={() => setShowCatModal(true)} className="text-xs text-blue-600 hover:underline font-bold">+ Yeni Kategori</button>
            </div>
            <select className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5" 
                    value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
              <option value={0}>Seçiniz...</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Yazar Adı */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900">Yazar Adı *</label>
            <input type="text" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5" 
                   value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </div>

          {/* --- YENİ EKLENEN KISIM: RESİM URL --- */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900">Kapak Resmi URL (İsteğe Bağlı)</label>
            <input 
                type="url" 
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5" 
                placeholder="https://..."
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
            />
            <p className="text-xs text-gray-500 mt-1">Google'dan görsel bağlantısını kopyalayıp yapıştırın.</p>
          </div>

          {/* Resim Önizleme (URL girildiyse görünür) */}
          {imageUrl && (
            <div className="flex justify-center mt-2 p-2 border border-dashed border-gray-300 rounded bg-gray-50">
                <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Önizleme</p>
                    <img 
                        src={imageUrl} 
                        alt="Önizleme" 
                        className="h-32 w-auto object-cover rounded shadow-sm mx-auto"
                        onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
                    />
                </div>
            </div>
          )}
          {/* ------------------------------------- */}

          <div className="flex gap-2 mt-4">
            <button onClick={handleSubmit} className="text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 flex-1">Kaydet</button>
            <button onClick={() => navigate("/")} className="text-gray-900 bg-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5">İptal</button>
          </div>
        </div>
      </div>

      {/* Kategori Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-4">Hızlı Kategori Ekle</h3>
            <input type="text" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 mb-4" 
                   value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Örn: Bilim" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCatModal(false)} className="px-4 py-2 border rounded text-sm">İptal</button>
              <button onClick={handleAddCategory} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Ekle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBook;