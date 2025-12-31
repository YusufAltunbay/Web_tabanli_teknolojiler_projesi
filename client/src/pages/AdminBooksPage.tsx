import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";
import { EditBookModal } from "../components/BookModals";

type Author = { id: number; name: string };
type Category = { id: number; name: string };
type Book = {
  id: number;
  title: string;
  pageCount: number;
  stock: number;
  imageUrl?: string;
  category: Category;
  authors: Author[];
};

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPageCount, setEditPageCount] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    api.get("books")
      .then((res) => setBooks(res.data))
      .catch(() => toast.error("Kitap listesi alınamadı."));
  };

  const handleDelete = (id: number) => {
    if (!confirm("Bu kitabı ve tüm geçmişini silmek istediğinize emin misiniz?")) return;
    api.delete(`books/${id}`)
      .then(() => {
        toast.success("Kitap silindi.");
        setBooks(books.filter((b) => b.id !== id));
      })
      .catch(() => toast.error("Silme işlemi başarısız."));
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
    .catch(() => toast.error("Güncelleme hatası."));
  };

  // Arama Filtresi
  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.authors.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      
      {/* Başlık ve Arama */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
             📚 Kitap Envanteri
           </h1>
           <p className="text-gray-500 text-sm mt-1">Tüm kitapların detaylı listesi ve yönetimi.</p>
        </div>
        
        <div className="relative w-full md:w-80">
            <input 
                type="text" 
                placeholder="Kitap adı veya yazar ara..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-purple-600 to-indigo-600">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Kapak</th>
                <th className="px-6 py-4">Kitap Adı</th>
                <th className="px-6 py-4">Yazar</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4 text-center">Stok</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-purple-50 transition duration-150">
                  <td className="px-6 py-4 text-gray-500 font-mono">#{book.id}</td>
                  <td className="px-6 py-4">
                    <img 
                        src={book.imageUrl || "https://placehold.co/50x75?text=..."} 
                        className="w-10 h-14 object-cover rounded shadow-sm border border-gray-200"
                        alt="cover"
                    />
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">{book.title}</td>
                  <td className="px-6 py-4 text-gray-600">{book.authors.map(a => a.name).join(", ")}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold border border-blue-100">
                        {book.category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${book.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {book.stock} Adet
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEdit(book)} className="text-yellow-600 hover:bg-yellow-50 p-2 rounded-lg transition" title="Düzenle">
                            ✏️
                        </button>
                        <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition" title="Sil">
                            🗑️
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                 <tr><td colSpan={7} className="text-center py-8 text-gray-400">Kitap bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Düzenleme Modalı */}
      <EditBookModal 
        show={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleUpdateBook}
        editTitle={editTitle} setEditTitle={setEditTitle}
        editPageCount={editPageCount} setEditPageCount={setEditPageCount}
        editStock={editStock} setEditStock={setEditStock}
        editImageUrl={editImageUrl} setEditImageUrl={setEditImageUrl}
      />
    </div>
  );
};

export default AdminBooksPage;