const PLACEHOLDER_IMAGE = "https://placehold.co/300x450?text=Resim+Yok";

// Tip tanımlarını props ile alıyoruz
interface BookCardProps {
  book: any;
  loggedInUser: any;
  favoriteBookIds: number[];
  onToggleFavorite: (id: number) => void;
  onBorrow: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (book: any) => void;
  onReadReviews: (id: number, title: string) => void;
  onOpenRateModal: (id: number) => void;
}

const BookCard = ({ book, loggedInUser, favoriteBookIds, onToggleFavorite, onBorrow, onDelete, onEdit, onReadReviews, onOpenRateModal }: BookCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl transition-shadow h-full">
      {/* Resim */}
      <div className="h-[400px] bg-gray-200 relative group overflow-hidden">
        <img 
          src={book.imageUrl || PLACEHOLDER_IMAGE} 
          alt={book.title} 
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" 
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
        />
        <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full shadow-md ${book.stock > 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {book.stock > 0 ? `${book.stock} Stok` : 'Tükendi'}
        </div>
      </div>

      {/* İçerik */}
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
            {book.authors?.map((auth: any) => <span key={auth.id} className="text-gray-700 text-xs italic">✍️ {auth.name}</span>)}
          </div>
        </div>
      </div>

      {/* Butonlar */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex flex-col gap-2">
        <button onClick={() => onReadReviews(book.id, book.title)} className="text-gray-600 hover:text-blue-600 text-sm font-medium w-full text-center border-b pb-2">
          💬 Yorumları Gör
        </button>
        <div className="flex gap-2 mt-1 justify-center">
          {loggedInUser?.role === 'admin' ? (
            <>
              <button onClick={() => onEdit(book)} className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium py-1.5 px-3 rounded text-sm transition">Düzenle</button>
              <button onClick={() => onDelete(book.id)} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1.5 px-3 rounded text-sm transition">Sil</button>
            </>
          ) : (
            <>
              <button onClick={() => onBorrow(book.id)} disabled={book.stock <= 0} className={`flex-1 font-medium py-1.5 px-3 rounded text-sm transition ${book.stock > 0 ? 'bg-green-100 hover:bg-green-200 text-green-700' : 'bg-gray-200 text-gray-400'}`}>{book.stock > 0 ? 'Ödünç Al' : 'Tükendi'}</button>
              <button onClick={() => onOpenRateModal(book.id)} className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-1.5 px-3 rounded text-sm transition">⭐ Puanla</button>
              <button onClick={() => onToggleFavorite(book.id)} className={`py-1.5 px-3 rounded text-lg transition border ${favoriteBookIds.includes(book.id) ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-white text-gray-400 border-gray-300 hover:text-red-500 hover:border-red-300'}`}>{favoriteBookIds.includes(book.id) ? "❤️" : "🤍"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;