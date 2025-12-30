interface EditModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editTitle: string; setEditTitle: (v: string) => void;
  editPageCount: string; setEditPageCount: (v: string) => void;
  editStock: string; setEditStock: (v: string) => void;
  editImageUrl: string; setEditImageUrl: (v: string) => void;
}

export const EditBookModal = ({ show, onClose, onSave, editTitle, setEditTitle, editPageCount, setEditPageCount, editStock, setEditStock, editImageUrl, setEditImageUrl }: EditModalProps) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-3">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Kitabı Düzenle</h3>
        <div><label className="text-sm font-bold">Kitap Adı</label><input className="w-full border p-2 rounded" value={editTitle} onChange={e => setEditTitle(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className="text-sm font-medium">Sayfa</label><input type="number" className="w-full border p-2 rounded" value={editPageCount} onChange={e => setEditPageCount(e.target.value)} /></div>
          <div><label className="text-sm font-medium">Stok</label><input type="number" className="w-full border p-2 rounded" value={editStock} onChange={e => setEditStock(e.target.value)} /></div>
        </div>
        <div><label className="text-sm font-medium">Resim URL</label><input className="w-full border p-2 rounded text-sm" value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} /></div>
        <div className="flex gap-2 mt-4">
          <button onClick={onSave} className="bg-blue-600 text-white flex-1 py-2 rounded hover:bg-blue-700">Kaydet</button>
          <button onClick={onClose} className="bg-gray-200 flex-1 py-2 rounded hover:bg-gray-300">İptal</button>
        </div>
      </div>
    </div>
  );
};

interface AddReviewProps {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  rating: number; setRating: (v: number) => void;
  comment: string; setComment: (v: string) => void;
}

export const AddReviewModal = ({ show, onClose, onSubmit, rating, setRating, comment, setComment }: AddReviewProps) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h3 className="font-bold mb-4">Puanla</h3>
        <div className="flex gap-2 text-2xl mb-4">{[1, 2, 3, 4, 5].map(s => <span key={s} onClick={() => setRating(s)} className={`cursor-pointer ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>)}</div>
        <textarea className="w-full border p-2 mb-4" rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Yorum..."></textarea>
        <div className="flex gap-2">
          <button onClick={onSubmit} className="bg-blue-600 text-white flex-1 py-2 rounded">Gönder</button>
          <button onClick={onClose} className="bg-gray-200 flex-1 py-2 rounded">İptal</button>
        </div>
      </div>
    </div>
  );
};

interface ReadReviewsProps {
  show: boolean;
  onClose: () => void;
  reviews: any[];
  userRole: string;
  onDeleteReview: (id: number) => void;
}

export const ReadReviewsModal = ({ show, onClose, reviews, userRole, onDeleteReview }: ReadReviewsProps) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between mb-4"><h3 className="font-bold">Yorumlar</h3><button onClick={onClose}>✕</button></div>
        {reviews.map(r => (
          <div key={r.id} className="border-b pb-2 mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{r.user?.username}</span>
              <div className="flex gap-2 items-center">
                <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}</span>
                {userRole === 'admin' && <button onClick={() => onDeleteReview(r.id)} className="text-red-500 text-xs border px-1 rounded hover:bg-red-50">Sil</button>}
              </div>
            </div>
            <p className="text-sm text-gray-600">{r.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500 text-center">Yorum yok.</p>}
      </div>
    </div>
  );
};