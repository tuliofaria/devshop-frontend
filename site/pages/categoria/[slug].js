import { gql } from 'graphql-request'
import { fetcher } from '../../lib/graphql'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { priceFormat } from '../../lib/priceUtils'

const GET_ALL_PRODUCTS_BY_CATEGORY = gql`
  query getAllProductsByCategory($slug: String!) {
    products: getAllProductsByCategory(categorySlug: $slug) {
      id
      name
      slug
      price
      images
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

const Categoria = ({ products, categories }) => {
  return (
    <Layout categories={categories}>
      <h1>Categoria</h1>
      <section className='text-gray-600 body-font'>
        <div className='container px-5 py-24 mx-auto'>
          <div className='flex flex-wrap -m-4'>
            {products.map(product => {
              return (
                <div className='lg:w-1/4 md:w-1/2 p-4 w-full'>
                  <a className='block relative h-48 rounded overflow-hidden'>
                    {product.images && product.images.length > 0 && (
                      <img
                        alt='ecommerce '
                        className='object-cover object-center w-full h-full block'
                        src={product.images[0]}
                      />
                    )}
                    {(!product.images || product.images.length === 0) && (
                      <img src='https://dummyimage.com/420x260' />
                    )}
                  </a>
                  <div className='mt-4'>
                    <h3 className='text-gray-500 text-xs tracking-widest title-font mb-1'>
                      CATEGORY
                    </h3>
                    <h2 className='text-gray-900 title-font text-lg font-medium'>
                      <Link href={`/product/${product.slug}`}>
                        <a>{product.name}</a>
                      </Link>
                    </h2>
                    <p className='mt-1'>{priceFormat(product.price)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </Layout>
  )
}
export async function getServerSideProps(context) {
  const { products } = await fetcher(GET_ALL_PRODUCTS_BY_CATEGORY, {
    slug: context.query.slug
  })
  const { categories } = await fetcher(GET_ALL_CATEGORIES)
  return {
    props: {
      products,
      categories
    }
  }
}
export default Categoria
