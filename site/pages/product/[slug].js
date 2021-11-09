import { gql } from 'graphql-request'
import { fetcher } from '../../lib/graphql'
import Layout from '../../components/Layout'
import { useState } from 'react'
import { useCart } from '../../lib/CartContext'

const GET_PRODUCT_BY_SLUG = gql`
  query getProductBySlug($slug: String!) {
    product: getProductBySlug(slug: $slug) {
      id
      name
      slug
      price
      images
      description
      optionNames
      variations {
        optionName1
        optionName2
        sku
        price
        weight
        stock
      }
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

const Brand = ({ product, categories }) => {
  const cart = useCart()
  const [currentImage, setCurrentImage] = useState(0)
  const [variation1, setVariation1] = useState('')
  const [variation2, setVariation2] = useState('')
  const setImage = index => () => {
    setCurrentImage(index)
  }
  const possibleValues1 = [
    ...new Set(product.variations.map(pv => pv.optionName1))
  ]
  const possibleValues2 = [
    ...new Set(product.variations.map(pv => pv.optionName2))
  ]
  const onChangeVariation1 = evt => {
    setVariation1(evt.target.value)
  }
  const onChangeVariation2 = evt => {
    setVariation2(evt.target.value)
  }

  const validVariations1 = product.variations
    .filter(item => item.optionName2 === variation2)
    .map(pv => pv.optionName1)

  const validVariations2 = product.variations
    .filter(item => item.optionName1 === variation1)
    .map(pv => pv.optionName2)

  const isVariation1Disable = value => {
    return !(variation2 === '' || validVariations1.indexOf(value) >= 0)
  }
  const isVariation2Disable = value => {
    return !(variation1 === '' || validVariations2.indexOf(value) >= 0)
  }

  const selectedVariation = product.variations
    .filter(item => item.optionName1 === variation1)
    .filter(item => item.optionName2 === variation2)

  const selectedPrice =
    selectedVariation && selectedVariation[0] && selectedVariation[0].price
      ? selectedVariation[0].price
      : product.price

  return (
    <Layout categories={categories}>
      <h1>Brand</h1>

      <pre>selectedVariation {JSON.stringify(selectedVariation, null, 2)}</pre>

      <section className='text-gray-600 body-font overflow-hidden'>
        <div className='container px-5 py-24 mx-auto'>
          <div className='lg:w-4/5 mx-auto flex flex-wrap'>
            <div className='lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded'>
              <div>
                {product.images && product.images.length > 0 && (
                  <img
                    alt='ecommerce '
                    className='w-full lg:h-auto h-64 object-cover object-center rounded'
                    src={product.images[currentImage]}
                  />
                )}
                {(!product.images || product.images.length === 0) && (
                  <img
                    className='w-full lg:h-auto h-64 object-cover object-center rounded'
                    src='https://dummyimage.com/420x260'
                  />
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div>
                  {product.images.map((img, index) => (
                    <img
                      onClick={setImage(index)}
                      src={img}
                      className={`transition-all cursor-pointer inline-block w-32 m-1 ${
                        index === currentImage
                          ? 'border-gray-600 border-2 p-2'
                          : 'p-4'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className='lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0'>
              <h2 className='text-sm title-font text-gray-500 tracking-widest'>
                BRAND NAME
              </h2>
              <h1 className='text-gray-900 text-3xl title-font font-medium mb-1'>
                {product.name}
              </h1>
              <div className='flex mb-4'>
                <span className='flex items-center'>
                  <svg
                    fill='currentColor'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    stroke-width='2'
                    className='w-4 h-4 text-indigo-500'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'></path>
                  </svg>
                  <svg
                    fill='currentColor'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    stroke-width='2'
                    className='w-4 h-4 text-indigo-500'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'></path>
                  </svg>
                  <svg
                    fill='currentColor'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    stroke-width='2'
                    className='w-4 h-4 text-indigo-500'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'></path>
                  </svg>
                  <svg
                    fill='currentColor'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    stroke-width='2'
                    className='w-4 h-4 text-indigo-500'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'></path>
                  </svg>
                  <svg
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    stroke-width='2'
                    className='w-4 h-4 text-indigo-500'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'></path>
                  </svg>
                  <span className='text-gray-600 ml-3'>4 Reviews</span>
                </span>
                <span className='flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s'>
                  <a className='text-gray-500'>
                    <svg
                      fill='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      stroke-width='2'
                      className='w-5 h-5'
                      viewBox='0 0 24 24'
                    >
                      <path d='M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z'></path>
                    </svg>
                  </a>
                  <a className='text-gray-500'>
                    <svg
                      fill='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      stroke-width='2'
                      className='w-5 h-5'
                      viewBox='0 0 24 24'
                    >
                      <path d='M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z'></path>
                    </svg>
                  </a>
                  <a className='text-gray-500'>
                    <svg
                      fill='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      stroke-width='2'
                      className='w-5 h-5'
                      viewBox='0 0 24 24'
                    >
                      <path d='M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z'></path>
                    </svg>
                  </a>
                </span>
              </div>
              <p className='leading-relaxed'>
                {product.description}{' '}
                {/* <pre>{JSON.stringify(product, null, 2)}</pre>*/}
              </p>
              <div className='flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5'>
                <div className='flex items-center'>
                  <span className='mr-3'>{product.optionNames[0]}</span>
                  <div className='relative'>
                    <select
                      onChange={onChangeVariation1}
                      className='rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10'
                    >
                      <option value=''>{product.optionNames[0]} </option>
                      {possibleValues1.map(pv => (
                        <option key={pv} disabled={isVariation1Disable(pv)}>
                          {pv} {isVariation1Disable(pv) && ' (indisponível)'}
                        </option>
                      ))}
                    </select>
                    <span className='absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center'>
                      <svg
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        stroke-width='2'
                        className='w-4 h-4'
                        viewBox='0 0 24 24'
                      >
                        <path d='M6 9l6 6 6-6'></path>
                      </svg>
                    </span>
                  </div>
                </div>
                <div className='flex ml-6 items-center'>
                  <span className='mr-3'>{product.optionNames[1]}</span>
                  <div className='relative'>
                    <select
                      onChange={onChangeVariation2}
                      className='rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10'
                    >
                      <option value=''>{product.optionNames[1]} </option>
                      {possibleValues2.map(pv => (
                        <option key={pv} disabled={isVariation2Disable(pv)}>
                          {pv} {isVariation2Disable(pv) && ' (indisponível)'}
                        </option>
                      ))}
                    </select>
                    <span className='absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center'>
                      <svg
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        stroke-width='2'
                        className='w-4 h-4'
                        viewBox='0 0 24 24'
                      >
                        <path d='M6 9l6 6 6-6'></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex'>
                <span className='title-font font-medium text-2xl text-gray-900'>
                  R$ {selectedPrice.toFixed(2)}
                </span>
                <button
                  onClick={() => cart.addToCart(product, selectedVariation)}
                  className='flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded'
                >
                  Adicionar no carrinho
                </button>
                <button className='rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4'>
                  <svg
                    fill='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    stroke-width='2'
                    className='w-5 h-5'
                    viewBox='0 0 24 24'
                  >
                    <path d='M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z'></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
export async function getServerSideProps(context) {
  const { product } = await fetcher(GET_PRODUCT_BY_SLUG, {
    slug: context.query.slug
  })
  const { categories } = await fetcher(GET_ALL_CATEGORIES)
  return {
    props: {
      product,
      categories
    }
  }
}
export default Brand
