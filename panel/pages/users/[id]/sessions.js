import Link from 'next/link'
import React from 'react'
import Button from '../../../components/Button'
import Layout from '../../../components/Layout'
import Table from '../../../components/Table'
import Title from '../../../components/Title'
import Alert from '../../../components/Alert'
import { useMutation, useQuery } from '../../../lib/graphql'
import { useRouter } from 'next/router'
import { formatDistance, subDays } from 'date-fns'
import { pt, ptBR } from 'date-fns/locale'

const INVALIDATE_USER_SESSION = `
mutation panelInvalidateUserSession($id: String!) {
  panelInvalidateUserSession (id: $id)
}
`

const Sessions = () => {
  const router = useRouter()
  const { data, mutate } = useQuery(`
  query{
    panelGetAllUserSessions(id:"${router.query.id}"){
      id
      userAgent
      lastUsedAt
      active
    }
  }
`)
  const [deleteData, deleteUser] = useMutation(INVALIDATE_USER_SESSION)
  const remove = id => async () => {
    await deleteUser({ id })
    mutate()
  }
  return (
    <Layout>
      <Title>Gerenciar sessões de usuário</Title>
      <div className='mt-8'></div>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          {data &&
            data.panelGetAllUserSessions &&
            data.panelGetAllUserSessions.length === 0 && (
              <Alert>
                <p>Este usuário ainda não autenticou-se.</p>
              </Alert>
            )}
          {data &&
            data.panelGetAllUserSessions &&
            data.panelGetAllUserSessions.length > 0 && (
              <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'>
                <Table>
                  <Table.Head>
                    <Table.Th>Sessões</Table.Th>
                    <Table.Th>Usado</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Head>

                  <Table.Body>
                    {data &&
                      data.panelGetAllUserSessions &&
                      data.panelGetAllUserSessions.map(item => {
                        return (
                          <Table.Tr key={item.id}>
                            <Table.Td>
                              <div className='flex items-center'>
                                <div>
                                  <div className='text-sm leading-5 font-medium text-gray-900'>
                                    {item.id}
                                  </div>
                                  <div className='text-sm leading-5 text-gray-500'>
                                    {item.userAgent}
                                  </div>
                                </div>
                              </div>
                            </Table.Td>
                            <Table.Td>
                              {formatDistance(
                                new Date(item.lastUsedAt),
                                new Date(),
                                {
                                  locale: ptBR
                                }
                              )}{' '}
                              atrás
                            </Table.Td>

                            <Table.Td>
                              {item.active && (
                                <a
                                  href='#'
                                  className='text-indigo-600 hover:text-indigo-900'
                                  onClick={remove(item.id)}
                                >
                                  Remove
                                </a>
                              )}
                              {!item.active && <span>Inativa</span>}
                            </Table.Td>
                          </Table.Tr>
                        )
                      })}
                  </Table.Body>
                </Table>
              </div>
            )}
        </div>
      </div>
    </Layout>
  )
}
export default Sessions
