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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-1/2">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/></svg>
        </div>
        <input 
          type="text" 
          className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-500" 
          placeholder="Kitap adı ara..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-full md:w-1/4">
        <select 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
        >
          <option value={0}>Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
        Toplam: {totalBooks} Kitap
      </div>
    </div>
  );
};

export default HeroSection;