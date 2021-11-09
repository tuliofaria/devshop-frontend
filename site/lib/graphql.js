import { request } from 'graphql-request'
import useSWR from 'swr'

export const fetcher = (query, variables = {}) =>
  request(process.env.NEXT_PUBLIC_API, query, variables)

export const useQuery = query => {
  return useSWR(query, fetcher)
}
