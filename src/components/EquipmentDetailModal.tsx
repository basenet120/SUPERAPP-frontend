import { useState, useEffect } from 'react';
import { getEquipmentById, generateDescription, type Equipment } from '../api';
import { useCart } from '../contexts/CartContext.tsx';

interface EquipmentDetailModalProps {
  equipmentId: string | null;
  onClose: () => void;
}

export function EquipmentDetailModal({ equipmentId, onClose }: EquipmentDetailModalProps) {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (equipmentId) {
      loadEquipment();
    }
  }, [equipmentId]);

  async function loadEquipment() {
    if (!equipmentId) return;
    setLoading(true);
    try {
      const data = await getEquipmentById(equipmentId);
      setEquipment(data);
      setQuantity(1);
      setAdded(false);
    } catch (err) {
      console.error('Failed to load equipment:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToQuote = () => {
    if (!equipment) return;
    
    addItem({
      id: equipment.id,
      sku: equipment.sku,
      name: equipment.name,
      category: equipment.category,
      retail_price: equipment.retail_price,
      image_url: equipment.image_url,
      availability: 'in-house',
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const formatPrice = (price: number | null): string => {
    if (!price) return 'Call for pricing';
    return `$${price.toFixed(2)}/day`;
  };

  const getDescription = (item: Equipment): string => {
    if (item.description && item.description.length > 10) {
      return item.description;
    }
    return generateDescription(item.name, item.category);
  };

  if (!equipmentId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : equipment ? (
          <>
            {/* Header with Image */}
            <div className="relative h-64 bg-gray-100">
              {equipment.image_url ? (
                <img 
                  src={equipment.image_url} 
                  alt={equipment.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Category Badge */}
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                {equipment.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
              {/* Title & SKU */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{equipment.name}</h2>
                <p className="text-sm text-gray-500">SKU: {equipment.sku}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-blue-600">{formatPrice(equipment.retail_price)}</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{getDescription(equipment)}</p>
              </div>

              {/* Specs */}
              {equipment.specs && Object.keys(equipment.specs).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Specifications</h3>
                  <dl className="grid grid-cols-2 gap-4">
                    {Object.entries(equipment.specs).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm text-gray-500">{key}</dt>
                        <dd className="text-sm font-medium text-gray-900">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Add to Quote */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToQuote}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    added 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {added ? '✓ Added to Quote' : `Add ${quantity} to Quote`}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
