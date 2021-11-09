import { gql } from 'graphql-request'
import { fetcher } from '../../lib/graphql'
import Layout from '../../components/Layout'

const GET_ALL_PRODUCTS_BY_BRAND = gql`
  query getAllProductsByBrand($slug: String!) {
    products: getAllProductsByBrand(brandSlug: $slug) {
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

const Brand = ({ products, categories }) => {
  return (
    <Layout categories={categories}>
      <h1>Brand</h1>
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
                      {product.name}
                    </h2>
                    <p className='mt-1'>R$ {product.price.toFixed(2)}</p>
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
  const { products } = await fetcher(GET_ALL_PRODUCTS_BY_BRAND, {
    slug: context.query.slug
  })
  console.log(products)
  const { categories } = await fetcher(GET_ALL_CATEGORIES)
  return {
    props: {
      products,
      categories
    }
  }
}
export default Brand
