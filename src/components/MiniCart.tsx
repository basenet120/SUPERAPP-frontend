import { useCart } from '../contexts/CartContext.tsx';

interface MiniCartProps {
  onClick?: () => void;
}

export function MiniCart({ onClick }: MiniCartProps) {
  const { totalItems, totalPrice } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      <span className="hidden sm:inline text-sm font-medium">Quote</span>
      {totalItems > 0 && (
        <>
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
          <span className="hidden md:inline text-sm text-gray-500">
            (${totalPrice.toFixed(0)})
          </span>
        </>
      )}
    </button>
  );
}
