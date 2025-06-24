export interface Book {
  id: string
  name: string
  author: string
  price: number
  oldPrice?: number
  imageUrl: string
  stockQuantity: number
}
