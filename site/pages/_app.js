import 'tailwindcss/tailwind.css'
import { CartProvider } from '../lib/CartContext'

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  )
}

export default MyApp
