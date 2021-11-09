import { createContext, useContext, useEffect, useState } from 'react'

export const CartContext = createContext({})

/*
  const cart = {
    items: {
      idUUID: {
        quantity: 10,
        subTotal: 10,
        ...
      }
    },
    addToCart: (id, data) => 10,
    removeFromCart: (id) => 10,
    size: 0,
    subTotal: 10
  }
*/

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState({})
  useEffect(() => {
    const loadedCart = localStorage.getItem('cart')
    if (loadedCart) {
      setItems(JSON.parse(loadedCart))
    }
  }, [])
  const cartTotal = () => {
    return Object.keys(items).reduce((prev, productId) => {
      const productPrice = items[productId].product.price
      const qtd = items[productId].qtd

      const subTotal = Object.keys(qtd).reduce((prevSubTotal, variation) => {
        const price = qtd[variation].variation.price
          ? qtd[variation].variation.price
          : productPrice
        return prevSubTotal + qtd[variation].qtd * price
      }, 0)
      return prev + subTotal
    }, 0)
  }
  const addToCart = (product, selectedVariation) => {
    const variation = selectedVariation[0]
    const variationId = variation.optionName1 + variation.optionName2

    setItems(current => {
      const newCart = { ...current }
      if (current[product.id]) {
        if (current[product.id].qtd[variationId]) {
          // produto existe carrinho, variacao existe carrinho
          current[product.id].qtd[variationId].qtd++
        } else {
          // produto existe carrinho, variacao nao existe
          current[product.id].qtd = {
            ...current[product.id].qtd,
            [variationId]: {
              variation,
              qtd: 1
            }
          }
        }
      } else {
        newCart[product.id] = {
          product,
          qtd: {
            [variationId]: {
              variation,
              qtd: 1
            }
          }
        }
      }

      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }
  const removeFromCart = product => {
    const id = product.id
    setItems(current => {
      const { [id]: etc, ...newCart } = current
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }
  const removeVariationFromCart = (product, productVariation) => {
    setItems(current => {
      let newCart = { ...current }
      if (Object.keys(newCart[product].qtd).length === 1) {
        // caso 1 variacao, remove produto
        const { [product]: etc, ...newCartWithoutProduct } = current
        newCart = newCartWithoutProduct
      } else {
        const { [productVariation]: etc, ...newQtd } = newCart[product].qtd
        newCart[product].qtd = newQtd
      }
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }
  const changeQtd = (product, productVariation, increment) => {
    setItems(current => {
      const newCart = { ...current }
      const newQtd = newCart[product].qtd[productVariation].qtd + increment

      newCart[product] = {
        ...newCart[product],
        qtd: {
          ...newCart[product].qtd,
          [productVariation]: {
            ...newCart[product].qtd[productVariation],
            qtd: newQtd
          }
        }
      }

      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }
  const size = Object.keys(items).length
  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        removeVariationFromCart,
        changeQtd,
        size,
        cartTotal: cartTotal()
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const cart = useContext(CartContext)
  return cart
}
