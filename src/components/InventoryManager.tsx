import { useState, useEffect } from 'react';
import { getEquipment } from '../api';
import type { Equipment } from '../api';

interface InventoryItem {
  id: string;
  catalog_id: string;
  quantity_owned: number;
  quantity_available: number;
  storage_location: string | null;
  serial_numbers: string[];
  purchase_price: number | null;
  equipment?: Equipment;
}

export function InventoryManager() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    quantityOwned: 0,
    storageLocation: '',
    serialNumbers: '',
    purchasePrice: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Load equipment
      const equipResponse = await getEquipment(undefined, undefined, 1, 100);
      setEquipment(equipResponse.data);

      // Load inventory
      const invResponse = await fetch('http://localhost:3001/api/inventory');
      if (invResponse.ok) {
        const invData = await invResponse.json();
        setInventory(invData.data);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }

  const getInventoryForEquipment = (catalogId: string) => {
    return inventory.find(inv => inv.catalog_id === catalogId);
  };

  const startEditing = (item: Equipment) => {
    const inv = getInventoryForEquipment(item.id);
    setEditingId(item.id);
    setEditForm({
      quantityOwned: inv?.quantity_owned || 0,
      storageLocation: inv?.storage_location || '',
      serialNumbers: inv?.serial_numbers?.join(', ') || '',
      purchasePrice: inv?.purchase_price?.toString() || ''
    });
  };

  const saveInventory = async (catalogId: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalogId,
          quantityOwned: parseInt(editForm.quantityOwned.toString()) || 0,
          storageLocation: editForm.storageLocation,
          serialNumbers: editForm.serialNumbers.split(',').map(s => s.trim()).filter(Boolean),
          purchasePrice: parseFloat(editForm.purchasePrice) || null
        })
      });

      if (response.ok) {
        await loadData();
        setEditingId(null);
      }
    } catch (err) {
      console.error('Failed to save inventory:', err);
    }
  };

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">In-House Inventory</h1>
        <p className="text-gray-600">Mark which equipment you own. Everything else comes from partner rental.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total SKUs</p>
          <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">In-House Items</p>
          <p className="text-2xl font-bold text-blue-600">{inventory.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Partner Items</p>
          <p className="text-2xl font-bold text-gray-600">{equipment.length - inventory.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search equipment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Equipment List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Owned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEquipment.map((item) => {
                const inv = getInventoryForEquipment(item.id);
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className={inv ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.sku}</td>
                    <td className="px-6 py-4">
                      {inv ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          In-House
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          Partner
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.quantityOwned}
                          onChange={(e) => setEditForm({ ...editForm, quantityOwned: parseInt(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 border rounded"
                          min="0"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{inv?.quantity_owned || 0}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.storageLocation}
                          onChange={(e) => setEditForm({ ...editForm, storageLocation: e.target.value })}
                          className="w-32 px-2 py-1 border rounded"
                          placeholder="e.g. Shelf A3"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{inv?.storage_location || '-'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveInventory(item.id)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:text-gray-800 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(item)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {inv ? 'Edit' : 'Add to Inventory'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
