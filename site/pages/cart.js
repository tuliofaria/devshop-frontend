import Seo from '../components/Seo'
import Layout from '../components/Layout'
import { fetcher, useQuery } from '../lib/graphql'
import { gql } from 'graphql-request'
import Brands from '../components/Home/Brands'
import { useCart } from '../lib/CartContext'
import { priceFormat } from '../lib/priceUtils'

const GET_ALL_BRANDS = gql`
  query {
    brands: getAllBrands {
      id
      name
      slug
      logo
    }
  }
`
const GET_ALL_CATEGORIES = gql`
  query {
    categories: getAllCategories {
      id
      name
      slug
    }
  }
`

const Cart = ({ brands, categories }) => {
  const cart = useCart()
  return (
    <>
      <Layout categories={categories}>
        <Seo />
        <h1 className='font-bold text-3xl'>DevShop - Carrinho</h1>
        {cart.size > 0 && (
          <div className='flex justify-center my-6'>
            <div className='flex flex-col w-full p-8 text-gray-800 bg-white shadow-lg pin-r pin-y md:w-4/5 lg:w-4/5'>
              <div className='flex-1'>
                <table className='w-full text-sm lg:text-base' cellSpacing='0'>
                  <thead>
                    <tr className='h-12 uppercase'>
                      <th className='hidden md:table-cell'></th>
                      <th className='text-left'>Produto</th>
                      <th className='lg:text-right text-left pl-5 lg:pl-0'>
                        <span className='lg:hidden' title='Quantity'>
                          Qtd
                        </span>
                        <span className='hidden lg:inline'>Quantidade</span>
                      </th>
                      <th className='hidden text-right md:table-cell'>
                        Preço unit.
                      </th>
                      <th className='text-right'>Preço total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(cart.items).map(itemKey => {
                      const product = cart.items[itemKey].product
                      const qtd = cart.items[itemKey].qtd
                      return Object.keys(qtd).map(key => {
                        return (
                          <tr key={key}>
                            <td className='hidden pb-4 md:table-cell'>
                              <a href='#'>
                                <img
                                  src={product.images[0]}
                                  className='w-20 rounded'
                                  alt='Thumbnail'
                                />
                              </a>
                            </td>
                            <td>
                              <p className='md:ml-4'>
                                <span className='font-bold'>
                                  {product.name}
                                </span>
                                <br />
                                {product.optionNames[0]}
                                {': '}
                                {qtd[key].variation.optionName1}
                                {' / '}
                                {product.optionNames[1]}
                                {': '}
                                {qtd[key].variation.optionName2}
                              </p>

                              <button
                                onClick={() =>
                                  // cart.removeFromCart({ id: product.id })
                                  cart.removeVariationFromCart(product.id, key)
                                }
                                type='button'
                                className='text-gray-700 md:ml-4 bg-red-100 px-2 py-1 rounded text-xs shadow'
                              >
                                Remover item
                              </button>
                            </td>
                            <td className='justify-center md:justify-end md:flex mt-6'>
                              <div className='w-20 h-10'>
                                <div className='relative flex flex-row w-full h-8'>
                                  <button
                                    disabled={qtd[key].qtd < 1}
                                    onClick={() =>
                                      cart.changeQtd(product.id, key, -1)
                                    }
                                    className='bg-gray-600 py-2 px-4 rounded rounded-r-none  font-bold text-white'
                                  >
                                    -
                                  </button>
                                  <span className='w-full font-semibold text-center text-gray-700 bg-gray-200 outline-none focus:outline-none hover:text-black focus:text-black px-4'>
                                    {qtd[key].qtd}
                                  </span>
                                  <button
                                    onClick={() =>
                                      cart.changeQtd(product.id, key, 1)
                                    }
                                    className='bg-gray-600 py-2 px-4 rounded rounded-l-none font-bold text-white'
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className='hidden text-right md:table-cell'>
                              <span className='text-sm lg:text-base font-medium'>
                                {priceFormat(qtd[key].variation.price)}
                              </span>
                            </td>
                            <td className='text-right'>
                              <span className='text-sm lg:text-base font-medium'>
                                {priceFormat(
                                  qtd[key].variation.price * qtd[key].qtd
                                )}
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    })}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Total: {priceFormat(cart.cartTotal)}</td>
                    </tr>
                  </tbody>
                </table>
                <hr className='pb-6 mt-6' />
                <a href='#'>
                  <button className='flex justify-center w-full px-10 py-3 mt-6 font-medium text-white uppercase bg-gray-800 rounded-full shadow item-center hover:bg-gray-700 focus:shadow-outline focus:outline-none'>
                    <svg
                      aria-hidden='true'
                      data-prefix='far'
                      data-icon='credit-card'
                      className='w-8'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 576 512'
                    >
                      <path
                        fill='currentColor'
                        d='M527.9 32H48.1C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48.1 48h479.8c26.6 0 48.1-21.5 48.1-48V80c0-26.5-21.5-48-48.1-48zM54.1 80h467.8c3.3 0 6 2.7 6 6v42H48.1V86c0-3.3 2.7-6 6-6zm467.8 352H54.1c-3.3 0-6-2.7-6-6V256h479.8v170c0 3.3-2.7 6-6 6zM192 332v40c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12zm192 0v40c0 6.6-5.4 12-12 12H236c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12z'
                      />
                    </svg>
                    <span className='ml-2 mt-5px'>Fechar pedido</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
        {cart.size === 0 && (
          <div className='rounded border w-full py-8 m-4 text-center opacity-50'>
            <svg
              className='mx-auto w-48 feather feather-image'
              viewBox='0 -31 512.00026 512'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='m164.960938 300.003906h.023437c.019531 0 .039063-.003906.058594-.003906h271.957031c6.695312 0 12.582031-4.441406 14.421875-10.878906l60-210c1.292969-4.527344.386719-9.394532-2.445313-13.152344-2.835937-3.757812-7.269531-5.96875-11.976562-5.96875h-366.632812l-10.722657-48.253906c-1.527343-6.863282-7.613281-11.746094-14.644531-11.746094h-90c-8.285156 0-15 6.714844-15 15s6.714844 15 15 15h77.96875c1.898438 8.550781 51.3125 230.917969 54.15625 243.710938-15.941406 6.929687-27.125 22.824218-27.125 41.289062 0 24.8125 20.1875 45 45 45h272c8.285156 0 15-6.714844 15-15s-6.714844-15-15-15h-272c-8.269531 0-15-6.730469-15-15 0-8.257812 6.707031-14.976562 14.960938-14.996094zm312.152343-210.003906-51.429687 180h-248.652344l-40-180zm0 0' />
              <path d='m150 405c0 24.8125 20.1875 45 45 45s45-20.1875 45-45-20.1875-45-45-45-45 20.1875-45 45zm45-15c8.269531 0 15 6.730469 15 15s-6.730469 15-15 15-15-6.730469-15-15 6.730469-15 15-15zm0 0' />
              <path d='m362 405c0 24.8125 20.1875 45 45 45s45-20.1875 45-45-20.1875-45-45-45-45 20.1875-45 45zm45-15c8.269531 0 15 6.730469 15 15s-6.730469 15-15 15-15-6.730469-15-15 6.730469-15 15-15zm0 0' />
            </svg>

            <div className='py-4'>Carrinho vazio</div>
          </div>
        )}

        {/*<pre>{JSON.stringify(cart, null, 2)}</pre> */}
      </Layout>
    </>
  )
}
export async function getServerSideProps(context) {
  const { brands } = await fetcher(GET_ALL_BRANDS)
  const { categories } = await fetcher(GET_ALL_CATEGORIES)
  return {
    props: {
      brands,
      categories
    }
  }
}
export default Cart
