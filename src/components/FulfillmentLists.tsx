import { useState, useEffect } from 'react';

interface FulfillmentListsProps {
  quoteId: string;
}

interface FulfillmentItem {
  equipmentId: string;
  sku: string;
  name: string;
  quantity: number;
  storageLocation?: string;
  serialNumbers?: string[];
}

interface FulfillmentData {
  basePullList: FulfillmentItem[];
  partnerOrderList: FulfillmentItem[];
  summary: {
    baseItems: number;
    partnerItems: number;
    totalItems: number;
  };
}

export function FulfillmentLists({ quoteId }: FulfillmentListsProps) {
  const [fulfillment, setFulfillment] = useState<FulfillmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFulfillmentLists();
  }, [quoteId]);

  async function loadFulfillmentLists() {
    try {
      // First get the quote details
      const quoteResponse = await fetch(`http://localhost:3001/api/quotes/${quoteId}`);
      if (!quoteResponse.ok) throw new Error('Failed to load quote');
      const quoteData = await quoteResponse.json();

      // Then generate fulfillment lists
      const items = quoteData.data.items.map((item: any) => ({
        equipmentId: item.equipment_id,
        sku: item.sku,
        name: item.name,
        quantity: item.quantity
      }));

      const fulfillResponse = await fetch('http://localhost:3001/api/inventory/fulfillment-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      if (!fulfillResponse.ok) throw new Error('Failed to generate fulfillment lists');
      const fulfillData = await fulfillResponse.json();
      setFulfillment(fulfillData.data);
    } catch (err) {
      setError('Failed to load fulfillment lists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !fulfillment) {
    return (
      <div className="text-red-600 text-sm py-4">
        {error || 'Failed to load fulfillment lists'}
      </div>
    );
  }

  const { basePullList, partnerOrderList, summary } = fulfillment;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Fulfillment Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{summary.baseItems}</p>
            <p className="text-sm text-gray-600">From Base Inventory</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600">{summary.partnerItems}</p>
            <p className="text-sm text-gray-600">From KM Rental</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{summary.totalItems}</p>
            <p className="text-sm text-gray-600">Total Items</p>
          </div>
        </div>
      </div>

      {/* Base Pull List */}
      {basePullList.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Base Pull List
            <span className="text-sm font-normal text-blue-700">({basePullList.length} items)</span>
          </h3>
          <div className="space-y-2">
            {basePullList.map((item, idx) => (
              <div key={idx} className="bg-white rounded p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  {item.storageLocation && (
                    <p className="text-sm text-blue-600">Location: {item.storageLocation}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">× {item.quantity}</p>
                  {item.serialNumbers && item.serialNumbers.length > 0 && (
                    <p className="text-xs text-gray-500">S/N: {item.serialNumbers.join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-blue-800">Pulled from inventory</span>
            </label>
          </div>
        </div>
      )}

      {/* Partner Order List */}
      {partnerOrderList.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            KM Rental Order List
            <span className="text-sm font-normal text-gray-600">({partnerOrderList.length} items)</span>
          </h3>
          <div className="space-y-2">
            {partnerOrderList.map((item, idx) => (
              <div key={idx} className="bg-white rounded p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                </div>
                <p className="text-lg font-bold text-gray-900">× {item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Order placed with KM Rental</span>
            </label>
          </div>
        </div>
      )}

      {/* Print Button */}
      <div className="flex justify-end">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Fulfillment Lists
        </button>
      </div>
    </div>
  );
}
