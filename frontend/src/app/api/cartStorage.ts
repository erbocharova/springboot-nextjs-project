export type CartItemsMap = Record<string, number>;

/**
 * Загружает cartItems из localStorage в формате { id: quantity }
 */
export function loadCartItems(): CartItemsMap {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem('cartItems');
  if (!stored) return {};
  try {
    const parsed = JSON.parse(stored);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Сохраняет cartItems в localStorage в формате { id: quantity }
 */
export function saveCartItems(cartItems: CartItemsMap): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
