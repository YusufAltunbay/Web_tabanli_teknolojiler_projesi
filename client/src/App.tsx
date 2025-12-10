import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { LoggedInUserContextProvider } from "./context/LoggedInUserContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BooksPage from "./pages/BooksPage";
import AddBook from "./pages/AddBook";
import UsersPage from "./pages/UsersPage";
import AdminLoansPage from "./pages/AdminLoansPage";
import UserLoansPage from "./pages/UserLoansPage";
import FavoritesPage from "./pages/FavoritesPage"; // <-- Import Edildi
import ProfilePage from "./pages/ProfilePage";
import MyNavbar from "./components/MyNavbar";

function App() {
  return (
    <LoggedInUserContextProvider>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <MyNavbar />
        
        <div className="container mx-auto px-4">
          <Routes>
            {/* Ana Sayfa */}
            <Route path="/" element={<BooksPage />} />
            
            {/* Auth Sayfaları */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Sayfaları */}
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/admin-loans" element={<AdminLoansPage />} />

            {/* Üye Sayfaları */}
            <Route path="/my-loans" element={<UserLoansPage />} />
            <Route path="/favorites" element={<FavoritesPage />} /> {/* <-- EKLENDİ */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Hatalı Linkler İçin Yönlendirme */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LoggedInUserContextProvider>
  );
}

export default App;