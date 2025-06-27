import { CartItem } from './CartItem'

export interface CartItemProps {
  item: CartItem
  toggleSelectItem: (id: string) => void
  changeQuantity: (id: string, delta: number) => void
}
