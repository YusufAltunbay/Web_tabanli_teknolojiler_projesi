import { useEffect, useState, useRef } from "react";
import { api } from "../helper/api";
import { useLoggedInUsersContext } from "../context/LoggedInUserContext";
import { DEFAULT_AVATAR } from "../helper/avatarData";
import { toast } from "sonner";

type User = { id: number; username: string; avatar?: string; role: string };
type Message = { id: number; content: string; createdAt: string; sender: { id: number; username: string }; isRead?: boolean };

const ChatPage = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  // YENİ: Hangi kullanıcıdan kaç okunmamış mesaj var?
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Kullanıcıları ve Okunmamış Sayılarını Getir
  useEffect(() => {
    fetchUsersAndCounts();
    // 3 saniyede bir kullanıcı listesini ve sayıları güncelle
    const interval = setInterval(fetchUsersAndCounts, 3000);
    return () => clearInterval(interval);
  }, [loggedInUser]);

  // Yardımcı fonksiyon: Hem listeyi hem sayıları çeker
  const fetchUsersAndCounts = async () => {
    try {
      const [usersRes, countsRes] = await Promise.all([
        api.get("users"),
        api.get("messages/unread-per-user")
      ]);

      const allUsers = usersRes.data || [];
      // Kendimi listeden çıkar
      setUsers(allUsers.filter((u: User) => u.id !== loggedInUser?.id));
      
      // Okunmamış sayılarını state'e at
      setUnreadCounts(countsRes.data || {});
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Bir kullanıcı seçildiğinde mesajları getir ve OKUNDU yap
  useEffect(() => {
    if (!selectedUser) return;
    
    fetchMessages();

    // YENİ: Okundu olarak işaretle (API'ye istek at)
    api.patch(`messages/read/${selectedUser.id}`)
       .then(() => {
          // Frontend'deki sayıyı da sıfırla ki anında görünsün
          setUnreadCounts(prev => ({ ...prev, [selectedUser.id]: 0 }));
       })
       .catch(err => console.log("Okundu yapılamadı", err));

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = () => {
    if (!selectedUser) return;
    api.get(`messages/${selectedUser.id}`).then((res) => setMessages(res.data));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    api.post("messages", { receiverId: selectedUser.id, content: newMessage })
      .then(() => {
        setNewMessage("");
        fetchMessages();
      })
      .catch(() => toast.error("Mesaj gönderilemedi."));
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl h-[85vh]">
      <div className="flex h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* SOL: Kullanıcı Listesi */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-800">Sohbetler</h2>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {users.map((user) => {
              const unread = unreadCounts[user.id] || 0; // Okunmamış sayısı
              return (
                <div 
                  key={user.id} 
                  onClick={() => setSelectedUser(user)}
                  className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedUser?.id === user.id ? 'bg-purple-100 border border-purple-200 shadow-sm' : 'hover:bg-white hover:shadow-sm'}`}
                >
                  <div className="relative">
                    <img 
                      src={user.avatar || DEFAULT_AVATAR} 
                      alt="avatar" 
                      className="w-12 h-12 rounded-full object-cover border border-gray-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                    />
                    {/* YENİ: Yeşil Bildirim Yuvarlağı */}
                    {unread > 0 && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-pulse">
                        {unread}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-gray-800 text-sm truncate">{user.username}</p>
                      <span className="text-[10px] text-gray-500 uppercase">{user.role === 'admin' ? 'YÖN' : 'ÜYE'}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">Sohbeti görüntülemek için tıkla</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SAĞ: Mesajlaşma Alanı */}
        <div className="w-2/3 flex flex-col bg-white">
          {selectedUser ? (
            <>
              {/* Başlık */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white shadow-sm z-10">
                <img 
                  src={selectedUser.avatar || DEFAULT_AVATAR} 
                  className="w-10 h-10 rounded-full border"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                />
                <h3 className="font-bold text-gray-800">{selectedUser.username}</h3>
              </div>

              {/* Mesajlar */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 && <div className="text-center text-gray-400 mt-10">Henüz mesaj yok. İlk merhaba diyen sen ol! 👋</div>}
                
                {messages.map((msg) => {
                  const isMe = msg.sender.id === loggedInUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                        isMe 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                      }`}>
                        <p>{msg.content}</p>
                        <div className={`flex justify-end items-center gap-1 mt-1 ${isMe ? 'text-purple-100' : 'text-gray-400'}`}>
                          <span className="text-[10px]">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {/* YENİ: Mavi Tik Mantığı */}
                          {isMe && (
                            <span className="ml-1 font-bold text-xs" title={msg.isRead ? "Okundu" : "İletildi"}>
                              {msg.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Mesaj Yazma */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="Bir mesaj yaz..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition shadow-md">
                  <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <span className="text-6xl mb-4">💬</span>
              <p className="text-lg font-medium">Bir kullanıcı seç ve sohbete başla.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChatPage;