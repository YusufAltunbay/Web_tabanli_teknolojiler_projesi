// Ortak Modal Arka Planı
const ModalOverlay = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
            {children}
        </div>
    </div>
);

interface EditModalProps { show: boolean; onClose: () => void; onSave: () => void; editTitle: string; setEditTitle: (v: string) => void; editPageCount: string; setEditPageCount: (v: string) => void; editStock: string; setEditStock: (v: string) => void; editImageUrl: string; setEditImageUrl: (v: string) => void; }

export const EditBookModal = ({ show, onClose, onSave, editTitle, setEditTitle, editPageCount, setEditPageCount, editStock, setEditStock, editImageUrl, setEditImageUrl }: EditModalProps) => {
  if (!show) return null;
  return (
    <ModalOverlay onClose={onClose}>
        <div className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Kitabı Düzenle</h3>
            <div className="space-y-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase">Kitap Adı</label><input className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editTitle} onChange={e => setEditTitle(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Sayfa</label><input type="number" className="w-full border p-2 rounded-lg" value={editPageCount} onChange={e => setEditPageCount(e.target.value)} /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Stok</label><input type="number" className="w-full border p-2 rounded-lg" value={editStock} onChange={e => setEditStock(e.target.value)} /></div>
                </div>
                <div><label className="text-xs font-bold text-gray-500 uppercase">Resim URL</label><input className="w-full border p-2 rounded-lg text-sm" value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} /></div>
                <div className="flex gap-2 pt-2">
                    <button onClick={onSave} className="bg-blue-600 text-white flex-1 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">Kaydet</button>
                    <button onClick={onClose} className="bg-gray-100 text-gray-700 flex-1 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition">İptal</button>
                </div>
            </div>
        </div>
    </ModalOverlay>
  );
};

interface AddReviewProps { show: boolean; onClose: () => void; onSubmit: () => void; rating: number; setRating: (v: number) => void; comment: string; setComment: (v: string) => void; }

export const AddReviewModal = ({ show, onClose, onSubmit, rating, setRating, comment, setComment }: AddReviewProps) => {
  if (!show) return null;
  return (
    <ModalOverlay onClose={onClose}>
        <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Puanla ve Yorumla</h3>
            <p className="text-sm text-gray-500 mb-4">Bu kitap hakkındaki düşüncelerin neler?</p>
            
            <div className="flex justify-center gap-2 text-3xl mb-4">
                {[1, 2, 3, 4, 5].map(s => <span key={s} onClick={() => setRating(s)} className={`cursor-pointer transition-transform hover:scale-125 ${s <= rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>)}
            </div>
            
            <textarea className="w-full border bg-gray-50 p-3 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 outline-none text-sm" rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Buraya bir şeyler yaz..."></textarea>
            
            <div className="flex gap-2">
                <button onClick={onSubmit} className="bg-purple-600 text-white flex-1 py-2.5 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg">Gönder</button>
                <button onClick={onClose} className="bg-gray-100 text-gray-600 flex-1 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition">Vazgeç</button>
            </div>
        </div>
    </ModalOverlay>
  );
};

interface ReadReviewsProps { show: boolean; onClose: () => void; reviews: any[]; userRole: string; onDeleteReview: (id: number) => void; }

export const ReadReviewsModal = ({ show, onClose, reviews, userRole, onDeleteReview }: ReadReviewsProps) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 border-b pb-2">
            <h3 className="text-xl font-bold text-gray-800">Yorumlar ({reviews.length})</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        <div className="space-y-4">
            {reviews.map(r => (
            <div key={r.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">{r.user?.username.charAt(0).toUpperCase()}</div>
                        <span className="font-bold text-sm text-gray-800">{r.user?.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}</span>
                        {userRole === 'admin' && <button onClick={() => onDeleteReview(r.id)} className="text-red-400 hover:text-red-600 text-xs border border-red-200 px-2 py-0.5 rounded-full bg-white">Sil</button>}
                    </div>
                </div>
                <p className="text-sm text-gray-600 pl-10">{r.comment}</p>
            </div>
            ))}
            {reviews.length === 0 && (
                <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                    <span className="text-4xl mb-2">💬</span>
                    <p>Henüz yorum yapılmamış.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};