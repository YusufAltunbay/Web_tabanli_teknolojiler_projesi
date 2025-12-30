const PLACEHOLDER_IMAGE = "https://placehold.co/300x450?text=Resim+Yok";

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
    <div className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
      
      {/* Resim Alanı */}
      <div className="h-[320px] bg-gray-100 relative overflow-hidden">
        <img 
          src={book.imageUrl || PLACEHOLDER_IMAGE} 
          alt={book.title} 
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" 
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Stok Rozeti */}
        <div className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg z-10 backdrop-blur-md ${book.stock > 0 ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {book.stock > 0 ? `${book.stock} Stok` : 'Tükendi'}
        </div>

        {/* Favori Butonu (Resim Üzerinde) */}
        {loggedInUser?.role !== 'admin' && (
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(book.id); }}
                className={`absolute top-3 left-3 p-2 rounded-full shadow-lg backdrop-blur-sm transition-transform active:scale-90 ${favoriteBookIds.includes(book.id) ? 'bg-white/90 text-red-500' : 'bg-black/30 text-white hover:bg-white hover:text-red-500'}`}
            >
                {favoriteBookIds.includes(book.id) ? "❤️" : "🤍"}
            </button>
        )}
      </div>

      {/* İçerik */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{book.category?.name}</span>
          </div>
          <h5 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors" title={book.title}>{book.title}</h5>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
             <span>📄 {book.pageCount} Sayfa</span>
             <span>•</span>
             <span className="truncate max-w-[120px]">✍️ {book.authors?.map((a: any) => a.name).join(", ")}</span>
          </div>
        </div>

        {/* Aksiyon Alanı */}
        <div className="space-y-2 mt-2">
            <button onClick={() => onReadReviews(book.id, book.title)} className="w-full text-xs font-semibold text-gray-500 hover:text-blue-600 py-1 border-b border-transparent hover:border-blue-200 transition-colors">
                💬 Yorumları İncele
            </button>

            <div className="flex gap-2">
            {loggedInUser?.role === 'admin' ? (
                <>
                <button onClick={() => onEdit(book)} className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-bold py-2 px-3 rounded-lg text-xs transition">Düzenle</button>
                <button onClick={() => onDelete(book.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-3 rounded-lg text-xs transition">Sil</button>
                </>
            ) : (
                <>
                <button 
                    onClick={() => onBorrow(book.id)} 
                    disabled={book.stock <= 0} 
                    className={`flex-1 font-bold py-2.5 px-3 rounded-lg text-xs shadow-sm transition transform active:scale-95 ${book.stock > 0 ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                    {book.stock > 0 ? 'Ödünç Al' : 'Tükendi'}
                </button>
                <button onClick={() => onOpenRateModal(book.id)} className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-2 px-3 rounded-lg text-lg transition">⭐</button>
                </>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;