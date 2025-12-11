import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { LoggedInUserContextProvider } from "./context/LoggedInUserContext";

// Sayfa Importları
import Login from "./pages/Login";
import Register from "./pages/Register";
import BooksPage from "./pages/BooksPage";
import AddBook from "./pages/AddBook";
import UsersPage from "./pages/UsersPage";         // <-- Admin: Kullanıcılar
import AdminLoansPage from "./pages/AdminLoansPage"; // <-- Admin: Ödünç Takip
import UserLoansPage from "./pages/UserLoansPage";   // <-- Üye: Kitaplarım
import FavoritesPage from "./pages/FavoritesPage";   // <-- Üye: Favoriler
import ProfilePage from "./pages/ProfilePage";       // <-- Herkes: Profil
import MyNavbar from "./components/MyNavbar";

function App() {
  return (
    <LoggedInUserContextProvider>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <MyNavbar />
        
        <div className="container mx-auto px-4">
          <Routes>
            {/* Ana Sayfa (Herkes) */}
            <Route path="/" element={<BooksPage />} />
            
            {/* Giriş / Kayıt */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* --- ADMIN SAYFALARI --- */}
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/users" element={<UsersPage />} />           {/* <-- EKLENDİ */}
            <Route path="/admin-loans" element={<AdminLoansPage />} /> {/* <-- EKLENDİ */}

            {/* --- ÜYE SAYFALARI --- */}
            <Route path="/my-loans" element={<UserLoansPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            
            {/* --- ORTAK SAYFALAR --- */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Hatalı Linkler */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LoggedInUserContextProvider>
  );
}

export default App;