import { useEffect, useState } from "react";
import { api } from "../helper/api";
import { useLoggedInUsersContext } from "../context/LoggedInUserContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Yeni Componentler
import AdminDashboard from "../components/AdminDashboard";
import HeroSection from "../components/HeroSection";
import BookCard from "../components/BookCard";
import { EditBookModal, AddReviewModal, ReadReviewsModal } from "../components/BookModals";

// Tip Tanımları
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

const BooksPage = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favoriteBookIds, setFavoriteBookIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  // Modal Görünürlükleri
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Seçili İşlemler
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedBookTitle, setSelectedBookTitle] = useState("");
  const [bookReviews, setBookReviews] = useState<Review[]>([]);
  
  // Form Verileri
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [editTitle, setEditTitle] = useState("");
  const [editPageCount, setEditPageCount] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  // --- API ÇAĞRILARI ---
  useEffect(() => {
    fetchBooks();
    fetchCategories();
    if (loggedInUser) fetchMyFavorites();
  }, [loggedInUser]);

  const fetchBooks = () => api.get("books").then((res) => setBooks(res.data)).catch(() => toast.error("Kitaplar yüklenemedi."));
  const fetchCategories = () => api.get("categories").then((res) => setCategories(res.data)).catch(() => console.error("Kategoriler alınamadı"));
  const fetchMyFavorites = () => api.get("favorites").then((res) => { if(res.data) setFavoriteBookIds(res.data.map((fav: any) => fav.book.id)); }).catch(err => console.log(err));

  // --- HESAPLAMALAR ---
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryId === 0 || book.category?.id === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  // --- BUTON İŞLEMLERİ ---
  const toggleFavorite = (bookId: number) => {
    if (!loggedInUser) return toast.warning("Lütfen giriş yapın.");
    const isFavorited = favoriteBookIds.includes(bookId);
    api[isFavorited ? 'delete' : 'post'](isFavorited ? `favorites/${bookId}` : "favorites", { bookId })
       .then(() => { toast.info(isFavorited ? "Çıkarıldı" : "Eklendi"); setFavoriteBookIds(prev => isFavorited ? prev.filter(id => id !== bookId) : [...prev, bookId]); })
       .catch(() => toast.error("İşlem başarısız."));
  };

  const handleBorrow = (bookId: number) => {
    if (!loggedInUser) return toast.warning("Lütfen giriş yapın.");
    api.post("loans", { bookId }).then(() => { toast.success("Kitap ödünç alındı!"); fetchBooks(); }).catch((err) => toast.error(err.response?.data?.message || "Hata"));
  };

  const handleDeleteBook = (id: number) => {
    if(!confirm("Silmek istediğinize emin misiniz?")) return;
    api.delete(`books/${id}`).then(() => { toast.success("Silindi"); fetchBooks(); }).catch((err) => toast.error("Hata: " + err.response?.data?.message));
  };

  const handleDeleteReview = (id: number) => { 
    api.delete(`reviews/${id}`).then(() => { setBookReviews(prev => prev.filter(r => r.id !== id)); toast.success("Yorum silindi"); }); 
  };

  // --- MODAL AÇMA/KAPAMA ---
  const handleOpenEdit = (book: Book) => {
    setSelectedBookId(book.id); setEditTitle(book.title); setEditPageCount(String(book.pageCount)); setEditStock(String(book.stock)); setEditImageUrl(book.imageUrl || ""); setShowEditModal(true);
  };

  const handleUpdateBook = () => {
    if (!selectedBookId) return;
    api.put(`books/${selectedBookId}`, { title: editTitle, pageCount: Number(editPageCount), stock: Number(editStock), imageUrl: editImageUrl })
    .then(() => { toast.success("Güncellendi!"); setShowEditModal(false); fetchBooks(); }).catch(() => toast.error("Hata."));
  };

  const handleOpenReadModal = (bookId: number, title: string) => {
    setSelectedBookTitle(title); api.get(`reviews/book/${bookId}`).then((res) => { setBookReviews(res.data); setShowReadModal(true); });
  };

  const handleOpenRateModal = (bookId: number) => {
    setSelectedBookId(bookId); setShowAddModal(true);
  };
  
  const handleSubmitReview = () => {
    if (!selectedBookId || !comment.trim()) return toast.warning("Yorum yazın.");
    api.post("reviews", { bookId: selectedBookId, comment, rating: Number(rating) }).then(() => { toast.success("Eklendi!"); setShowAddModal(false); setComment(""); setRating(5); }).catch((err) => toast.error("Hata"));
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      
      {/* 1. Dashboard (Sadece Admin) */}
      {loggedInUser?.role === 'admin' && <AdminDashboard />}

      {/* 2. Hero Section (Arama & Filtre) */}
      <HeroSection 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        selectedCategoryId={selectedCategoryId} setSelectedCategoryId={setSelectedCategoryId}
        categories={categories} totalBooks={filteredBooks.length}
      />

      {/* 3. Kitap Listesi (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard 
            key={book.id}
            book={book}
            loggedInUser={loggedInUser}
            favoriteBookIds={favoriteBookIds}
            onToggleFavorite={toggleFavorite}
            onBorrow={handleBorrow}
            onDelete={handleDeleteBook}
            onEdit={handleOpenEdit}
            onReadReviews={handleOpenReadModal}
            onOpenRateModal={handleOpenRateModal}
          />
        ))}
        {filteredBooks.length === 0 && (
            <div className="col-span-4 text-center py-10">
                <p className="text-gray-500">Kitap bulunamadı.</p>
                <button onClick={() => {setSearchTerm(""); setSelectedCategoryId(0);}} className="text-blue-600 hover:underline">Temizle</button>
            </div>
        )}
      </div>

      {/* 4. Modallar */}
      <EditBookModal 
        show={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleUpdateBook}
        editTitle={editTitle} setEditTitle={setEditTitle}
        editPageCount={editPageCount} setEditPageCount={setEditPageCount}
        editStock={editStock} setEditStock={setEditStock}
        editImageUrl={editImageUrl} setEditImageUrl={setEditImageUrl}
      />
      <AddReviewModal 
        show={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleSubmitReview}
        rating={rating} setRating={setRating}
        comment={comment} setComment={setComment}
      />
      <ReadReviewsModal 
        show={showReadModal} onClose={() => setShowReadModal(false)}
        reviews={bookReviews} userRole={loggedInUser?.role || ""} onDeleteReview={handleDeleteReview}
      />
    </div>
  );
};

export default BooksPage;