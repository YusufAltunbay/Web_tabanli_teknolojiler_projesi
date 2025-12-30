import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { useLoggedInUsersContext } from "../context/LoggedInUserContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Author = { id: number; name: string };
type Category = { id: number; name: string };
type Review = { id: number; comment: string; rating: number; user: { username: string } };
type Book = {
  id: number;
  title: string;
  pageCount: number;
  stock: number;
  imageUrl?: string;
  category: Category;
  authors: Author[];
};

// Resim yoksa gösterilecek varsayılan görsel (Daha hızlı ve güvenilir servis)
const PLACEHOLDER_IMAGE = "https://placehold.co/300x450?text=Resim+Yok";

const BooksPage = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  const navigate = useNavigate();
  
  // Ana Veriler
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Favori kitapların ID'lerini tutan liste
  const [favoriteBookIds, setFavoriteBookIds] = useState<number[]>([]);

  // Filtreleme State'leri
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  // Modallar
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Seçili Veriler
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedBookTitle, setSelectedBookTitle] = useState("");
  const [bookReviews, setBookReviews] = useState<Review[]>([]);
  
  // Form Verileri (Yorum)
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  // Form Verileri (Kitap Düzenleme)
  const [editTitle, setEditTitle] = useState("");
  const [editPageCount, setEditPageCount] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    if (loggedInUser) {
        fetchMyFavorites();
    }
  }, [loggedInUser]);

  const fetchBooks = () => {
    api.get("books")
      .then((res) => setBooks(res.data))
      .catch(() => toast.error("Kitaplar yüklenemedi."));
  };

  const fetchCategories = () => {
    api.get("categories")
      .then((res) => setCategories(res.data))
      .catch(() => console.error("Kategoriler alınamadı"));
  };

  const fetchMyFavorites = () => {
    api.get("favorites").then((res) => {
        const ids = res.data.map((fav: any) => fav.book.id);
        setFavoriteBookIds(ids);
    });
  };

  const toggleFavorite = (bookId: number) => {
    if (!loggedInUser) return toast.warning("Lütfen giriş yapın.");

    const isFavorited = favoriteBookIds.includes(bookId);

    if (isFavorited) {
        api.delete(`favorites/${bookId}`)
           .then(() => {
               toast.info("Favorilerden çıkarıldı.");
               setFavoriteBookIds(prev => prev.filter(id => id !== bookId));
           })
           .catch(() => toast.error("İşlem başarısız."));
    } else {
        api.post("favorites", { bookId })
           .then(() => {
               toast.success("Favorilere eklendi! ❤️");
               setFavoriteBookIds(prev => [...prev, bookId]);
           })
           .catch(() => toast.error("İşlem başarısız."));
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryId === 0 || book.category?.id === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  // --- İŞLEMLER ---

  const handleBorrow = (bookId: number) => {
    if (!loggedInUser) return toast.warning("Lütfen giriş yapın.");
    api.post("loans", { bookId })
      .then(() => { toast.success("Kitap ödünç alındı!"); fetchBooks(); })
      .catch((err) => toast.error(err.response?.data?.message || "Hata oluştu"));
  };

  const handleDeleteBook = (id: number) => {
    if(!confirm("Silmek istediğinize emin misiniz?")) return;
    api.delete(`books/${id}`)
      .then(() => { toast.success("Silindi"); fetchBooks(); })
      .catch((err) => toast.error("Silinemedi: " + err.response?.data?.message));
  };

  const handleOpenEdit = (book: Book) => {
    setSelectedBookId(book.id);
    setEditTitle(book.title);
    setEditPageCount(String(book.pageCount));
    setEditStock(String(book.stock));
    setEditImageUrl(book.imageUrl || ""); 
    setShowEditModal(true);
  };

  const handleUpdateBook = () => {
    if (!selectedBookId) return;
    api.put(`books/${selectedBookId}`, {
      title: editTitle,
      pageCount: Number(editPageCount),
      stock: Number(editStock),
      imageUrl: editImageUrl 
    })
    .then(() => {
      toast.success("Kitap güncellendi!");
      setShowEditModal(false);
      fetchBooks();
    })
    .catch((err) => toast.error("Güncelleme başarısız."));
  };

  const handleOpenReadModal = (bookId: number, title: string) => {
    setSelectedBookTitle(title);
    api.get(`reviews/book/${bookId}`).then((res) => { setBookReviews(res.data); setShowReadModal(true); });
  };
  
  const handleSubmitReview = () => {
    if (!selectedBookId) return;
    if (!comment.trim()) { toast.warning("Lütfen yorum yazın."); return; }

    api.post("reviews", { bookId: selectedBookId, comment, rating: Number(rating) })
      .then(() => { 
          toast.success("Yorum eklendi!"); 
          setShowAddModal(false);
          setComment("");
          setRating(5);
      })
      .catch((err) => toast.error("Hata: " + err.response?.data?.message));
  };

  const handleDeleteReview = (id: number) => {
    api.delete(`reviews/${id}`).then(() => { setBookReviews(prev => prev.filter(r => r.id !== id)); toast.success("Yorum silindi"); });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      
      {/* Arama ve Filtreleme */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input 
                type="text" 
                className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-500" 
                placeholder="Kitap adı ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="w-full md:w-1/4">
            <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
            >
                <option value={0}>Tüm Kategoriler</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>
        <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
            Toplam: {filteredBooks.length} Kitap
        </div>
      </div>

      {/* Kitap Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl transition-shadow h-full">
            
            {/* --- RESİM ALANI (NETFLIX TARZI: UZUN VE TAM OTURAN) --- */}
            <div className="h-[400px] bg-gray-200 relative group overflow-hidden">
                <img 
                    src={book.imageUrl || PLACEHOLDER_IMAGE} 
                    alt={book.title} 
                    // GÜNCELLENDİ: object-top ile resmin üst kısmını koruyoruz
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    
                    onError={(e) => { 
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Sonsuz döngü kırıcı
                        target.src = PLACEHOLDER_IMAGE; 
                    }}
                />
                <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full shadow-md ${book.stock > 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {book.stock > 0 ? `${book.stock} Stok` : 'Tükendi'}
                </div>
            </div>
            {/* --------------------------------------------------- */}

            {/* İçerik Alanı */}
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                    <h5 className="text-lg font-bold text-gray-900 line-clamp-2 h-14" title={book.title}>{book.title}</h5>
                </div>
                <div className="mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{book.category?.name}</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">📄 {book.pageCount} Sayfa</p>
                <div className="flex flex-wrap gap-1 mt-2">
                    {book.authors?.map((auth) => (
                    <span key={auth.id} className="text-gray-700 text-xs italic">✍️ {auth.name}</span>
                    ))}
                </div>
              </div>
            </div>

            {/* Butonlar Alanı */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex flex-col gap-2">
              <button onClick={() => handleOpenReadModal(book.id, book.title)} className="text-gray-600 hover:text-blue-600 text-sm font-medium w-full text-center border-b pb-2">
                💬 Yorumları Gör
              </button>

              <div className="flex gap-2 mt-1 justify-center">
                {loggedInUser?.role === 'admin' ? (
                  <>
                    <button onClick={() => handleOpenEdit(book)} className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium py-1.5 px-3 rounded text-sm transition">
                      Düzenle
                    </button>
                    <button onClick={() => handleDeleteBook(book.id)} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1.5 px-3 rounded text-sm transition">
                      Sil
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                        onClick={() => handleBorrow(book.id)} 
                        disabled={book.stock <= 0} 
                        className={`flex-1 font-medium py-1.5 px-3 rounded text-sm transition ${book.stock > 0 ? 'bg-green-100 hover:bg-green-200 text-green-700' : 'bg-gray-200 text-gray-400'}`}
                    >
                      {book.stock > 0 ? 'Ödünç Al' : 'Tükendi'}
                    </button>
                    
                    <button 
                        onClick={() => { setSelectedBookId(book.id); setShowAddModal(true); }} 
                        className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-1.5 px-3 rounded text-sm transition"
                    >
                        ⭐ Puanla
                    </button>

                    <button 
                        onClick={() => toggleFavorite(book.id)}
                        className={`py-1.5 px-3 rounded text-lg transition border ${
                            favoriteBookIds.includes(book.id) 
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                                : 'bg-white text-gray-400 border-gray-300 hover:text-red-500 hover:border-red-300' 
                        }`}
                        title={favoriteBookIds.includes(book.id) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                    >
                        {favoriteBookIds.includes(book.id) ? "❤️" : "🤍"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredBooks.length === 0 && (
            <div className="col-span-4 text-center py-10">
                <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun kitap bulunamadı.</p>
                <button onClick={() => {setSearchTerm(""); setSelectedCategoryId(0);}} className="text-blue-600 hover:underline mt-2">
                    Filtreleri Temizle
                </button>
            </div>
        )}
      </div>

      {/* --- MODALLAR --- */}
      
      {/* Kitap Güncelleme Modalı */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-3">
             <h3 className="text-lg font-bold mb-4 text-gray-800">Kitabı Düzenle</h3>
             <div><label className="text-sm font-bold">Kitap Adı</label><input type="text" className="w-full border p-2 rounded" value={editTitle} onChange={e => setEditTitle(e.target.value)} /></div>
             <div className="grid grid-cols-2 gap-2">
                 <div><label className="text-sm font-medium">Sayfa</label><input type="number" className="w-full border p-2 rounded" value={editPageCount} onChange={e => setEditPageCount(e.target.value)} /></div>
                 <div><label className="text-sm font-medium">Stok</label><input type="number" className="w-full border p-2 rounded" value={editStock} onChange={e => setEditStock(e.target.value)} /></div>
             </div>
             
             <div>
                <label className="text-sm font-medium">Resim URL</label>
                <input type="text" className="w-full border p-2 rounded text-sm" value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} placeholder="https://..." />
             </div>

             <div className="flex gap-2 mt-4">
                 <button onClick={handleUpdateBook} className="bg-blue-600 text-white px-4 py-2 rounded flex-1 hover:bg-blue-700">Kaydet</button>
                 <button onClick={() => setShowEditModal(false)} className="bg-gray-200 px-4 py-2 rounded text-gray-700 hover:bg-gray-300">İptal</button>
             </div>
          </div>
        </div>
      )}

      {/* Puan Verme Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
           <div className="bg-white p-6 rounded-lg w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4">Puanla</h3>
              <div className="flex gap-2 text-2xl mb-4">
                {[1,2,3,4,5].map(s => <span key={s} onClick={()=>setRating(s)} className={s<=rating?"text-yellow-400":"text-gray-300"}>★</span>)}
              </div>
              <textarea className="w-full border p-2 mb-4" rows={3} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Yorum..."></textarea>
              <div className="flex gap-2">
                  <button onClick={handleSubmitReview} className="bg-blue-600 text-white px-4 py-2 rounded flex-1">Gönder</button>
                  <button onClick={()=>setShowAddModal(false)} className="bg-gray-200 px-4 py-2 rounded">İptal</button>
              </div>
           </div>
        </div>
      )}

      {/* Yorum Okuma Modalı */}
      {showReadModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={()=>setShowReadModal(false)}>
             <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
                <div className="flex justify-between mb-4"><h3 className="font-bold">Yorumlar</h3><button onClick={()=>setShowReadModal(false)}>✕</button></div>
                {bookReviews.map(r => (
                    <div key={r.id} className="border-b pb-2 mb-2">
                        <div className="flex justify-between">
                            <span className="font-bold">{r.user?.username}</span>
                            <div className="flex gap-2">
                                <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
                                {loggedInUser?.role === 'admin' && <button onClick={()=>handleDeleteReview(r.id)} className="text-red-500 text-xs border px-1 rounded hover:bg-red-50">Sil</button>}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">{r.comment}</p>
                    </div>
                ))}
                {bookReviews.length === 0 && <p className="text-gray-500 text-center">Yorum yok.</p>}
             </div>
         </div>
      )}

    </div>
  );
};

export default BooksPage;