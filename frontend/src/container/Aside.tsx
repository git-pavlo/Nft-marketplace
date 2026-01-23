import { Search, SlidersHorizontal } from 'lucide-react';

interface AsideProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCollection: string;
  onCollectionChange: (value: string) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  sortBy: 'price' | 'recent';
  onSortChange: (value: 'price' | 'recent') => void;
}

const collections = ['All', 'Artwork', 'Portrait', 'Animal', 'Other'];

export function Aside({
  searchTerm,
  onSearchChange,
  selectedCollection,
  onCollectionChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortChange,
}: AsideProps) {
  return (
    <aside className="w-72 bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 sticky top-32 h-fit">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg text-purple-400">Filters</h3>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Token name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Collection */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Collection</label>
        <select
          value={selectedCollection}
          onChange={(e) => onCollectionChange(e.target.value)}
          className="w-full px-4 py-2 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
        >
          {collections.map((collection) => (
            <option key={collection} value={collection}>
              {collection}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Price Range (ETH)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="Min"
            step="0.1"
            className="w-full px-3 py-2 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Max"
            step="0.1"
            className="w-full px-3 py-2 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Sort By</label>
        <div className="flex gap-2">
          <button
            onClick={() => onSortChange('price')}
            className={`flex-1 px-3 py-2 rounded-lg transition-all ${
              sortBy === 'price'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900/50 border border-purple-500/30 hover:border-purple-500/50'
            }`}
          >
            Price
          </button>
          <button
            onClick={() => onSortChange('recent')}
            className={`flex-1 px-3 py-2 rounded-lg transition-all ${
              sortBy === 'recent'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900/50 border border-purple-500/30 hover:border-purple-500/50'
            }`}
          >
            Recent
          </button>
        </div>
      </div>
    </aside>
  );
}
