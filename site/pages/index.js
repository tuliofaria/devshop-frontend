import Seo from '../components/Seo'
import Layout from '../components/Layout'
import { fetcher, useQuery } from '../lib/graphql'
import { gql } from 'graphql-request'
import Brands from '../components/Home/Brands'
import { useCart } from '../lib/CartContext'

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

const Index = ({ brands, categories }) => {
  const cart = useCart()
  return (
    <>
      <Layout categories={categories}>
        <Seo />
        <h1>DevShop</h1>
        <pre>{JSON.stringify(cart, null, 2)}</pre>
        <button
          onClick={() =>
            cart.removeFromCart({ id: '2bcd0543-5e00-4c04-987a-f4737221a188' })
          }
        >
          Count!
        </button>
        <Brands brands={brands} />
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
export default Index
