import { useState } from 'react'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard'
import { EquipmentList } from './components/EquipmentList'
import { MiniCart } from './components/MiniCart'
import { CartDrawer } from './components/CartDrawer'
import { QuoteBuilder } from './components/QuoteBuilder'
import { InventoryManager } from './components/InventoryManager'

type Page = 'dashboard' | 'equipment' | 'quote' | 'inventory'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [cartOpen, setCartOpen] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Login onLogin={() => setIsAuthenticated(true)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">Base OS</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentPage === 'dashboard'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('equipment')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentPage === 'equipment'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Equipment
                </button>
                <button
                  onClick={() => setCurrentPage('inventory')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentPage === 'inventory'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Inventory
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MiniCart onClick={() => setCartOpen(true)} />
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {currentPage === 'dashboard' && <Dashboard onLogout={() => setIsAuthenticated(false)} />}
      {currentPage === 'equipment' && <EquipmentList />}
      {currentPage === 'inventory' && <InventoryManager />}
      {currentPage === 'quote' && (
        <QuoteBuilder 
          onBack={() => setCurrentPage('equipment')} 
          onSubmit={() => setCurrentPage('dashboard')} 
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        onContinue={() => setCurrentPage('quote')}
      />
    </div>
  )
}

export default App
