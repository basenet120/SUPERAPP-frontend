import { useState, useEffect } from 'react';
import { getEquipment, type Equipment, type Pagination } from '../api';
import { useCart } from '../contexts/CartContext.tsx';
import { useEquipmentFilter } from '../contexts/EquipmentFilterContext.tsx';
import { EquipmentDetailModal } from './EquipmentDetailModal.tsx';

export function EquipmentList() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  
  const { addItem } = useCart();
  const { selectedCategory, searchQuery } = useEquipmentFilter();
  
  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 25,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const handleAddToQuote = (item: Equipment) => {
    addItem({
      id: item.id,
      sku: item.sku,
      name: item.name,
      category: item.category,
      retail_price: item.retail_price,
      image_url: item.image_url,
      availability: 'in-house',
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  useEffect(() => {
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
    loadEquipment(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadEquipment(pagination.page);
  }, [pagination.page]);

  async function loadEquipment(page: number) {
    setLoading(true);
    setError(null);
    try {
      const response = await getEquipment(
        selectedCategory || undefined,
        searchQuery || undefined,
        page,
        25
      );
      setEquipment(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to load equipment. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }));
    }
  }

  function formatPrice(price: number | null): string {
    if (!price) return 'Call for pricing';
    return `$${price.toFixed(2)}/day`;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Equipment Rental</h1>
        <p className="text-gray-600">
          Showing {pagination.totalCount} items
          {selectedCategory && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Equipment Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedEquipmentId(item.id)}
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100 relative">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {item.category}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" title={item.name}>
                  {item.name}
                </h3>
                <div className="mb-3">
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(item.retail_price)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToQuote(item);
                  }}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                    addedId === item.id
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {addedId === item.id ? '✓ Added!' : 'Add to Quote'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(pagination.page - 1)}
            disabled={!pagination.hasPrev}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium ${
                    pageNum === pagination.page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => goToPage(pagination.page + 1)}
            disabled={!pagination.hasNext}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && equipment.length === 0 && !error && (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No equipment found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Equipment Detail Modal */}
      <EquipmentDetailModal
        equipmentId={selectedEquipmentId}
        onClose={() => setSelectedEquipmentId(null)}
      />
    </div>
  );
}
