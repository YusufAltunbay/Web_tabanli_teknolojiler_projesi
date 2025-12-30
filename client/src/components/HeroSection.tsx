type Category = { id: number; name: string };

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategoryId: number;
  setSelectedCategoryId: (val: number) => void;
  categories: Category[];
  totalBooks: number;
}

const HeroSection = ({ searchTerm, setSearchTerm, selectedCategoryId, setSelectedCategoryId, categories, totalBooks }: HeroSectionProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-3xl shadow-2xl mb-10 text-white relative overflow-hidden">
      {/* Arka plan dekorasyonu */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-pink-500 opacity-10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
        
        {/* Başlık ve Sayaç */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight">Kütüphaneyi Keşfet</h2>
          <p className="text-purple-100 mt-1 opacity-90">Toplam {totalBooks} kitap seni bekliyor.</p>
        </div>

        {/* Arama ve Filtre */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Arama */}
          <div className="relative group w-full md:w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/></svg>
            </div>
            <input 
              type="text" 
              className="block w-full p-3.5 pl-12 text-sm text-gray-900 border-none rounded-xl bg-white/95 focus:bg-white shadow-lg focus:ring-4 focus:ring-purple-300/30 outline-none transition-all placeholder-gray-400" 
              placeholder="Kitap, yazar ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Kategori Seçim */}
          <div className="relative w-full md:w-48">
            <select 
              className="block w-full p-3.5 pl-4 text-sm text-gray-800 border-none rounded-xl bg-white/95 focus:bg-white shadow-lg focus:ring-4 focus:ring-blue-300/30 outline-none cursor-pointer appearance-none transition-all"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
            >
              <option value={0}>📚 Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
               ▼
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;