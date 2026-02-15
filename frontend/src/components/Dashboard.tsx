import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Calendar, 
  Settings,
  LogOut,
  Building2
} from 'lucide-react'
import { useState } from 'react'

interface DashboardProps {
  onLogout: () => void
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'equipment', label: 'Equipment', icon: Package },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">Base OS</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <h1 className="text-xl font-semibold">
            {navItems.find((i) => i.id === activeTab)?.label || 'Dashboard'}
          </h1>
        </header>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Total Equipment</p>
                <p className="text-3xl font-bold mt-1">1,328</p>
                <p className="text-sm text-green-600 mt-2">KM Rental Catalog</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Active Bookings</p>
                <p className="text-3xl font-bold mt-1">12</p>
                <p className="text-sm text-gray-400 mt-2">This month</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Clients</p>
                <p className="text-3xl font-bold mt-1">48</p>
                <p className="text-sm text-green-600 mt-2">+3 this week</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-3xl font-bold mt-1">$24K</p>
                <p className="text-sm text-gray-400 mt-2">MTD</p>
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500">Equipment module coming in Phase 2...</p>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500">Bookings module coming in Phase 3...</p>
            </div>
          )}

          {activeTab === 'crm' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500">CRM module coming in Phase 4...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500">Settings module coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
