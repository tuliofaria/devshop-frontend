import Link from 'next/link'
import React from 'react'
import Button from '../../components/Button'
import Layout from '../../components/Layout'
import Table from '../../components/Table'
import Title from '../../components/Title'
import Alert from '../../components/Alert'
import { useMutation, useQuery } from '../../lib/graphql'

const DELETE_USER = `
mutation deleteUser($id: String!) {
  panelDeleteUser (id: $id)
}
`

const GET_ALL_USERS = `
    query {
      panelGetAllUsers{
        id
        name
        email
      }
    }
  `

const Index = () => {
  const { data, mutate } = useQuery(GET_ALL_USERS)
  const [deleteData, deleteUser] = useMutation(DELETE_USER)
  const remove = id => async () => {
    await deleteUser({ id })
    mutate()
  }
  return (
    <Layout>
      <Title>Gerenciar usuários</Title>
      <div className='mt-8'></div>
      <div>
        <Button.Link href='/users/create'>Criar usuário</Button.Link>
      </div>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          {data && data.panelGetAllUsers && data.panelGetAllUsers.length === 0 && (
            <Alert>
              <p>Nenhum usuário criado até o momento.</p>
            </Alert>
          )}
          {data && data.panelGetAllUsers && data.panelGetAllUsers.length > 0 && (
            <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'>
              <Table>
                <Table.Head>
                  <Table.Th>Usuários</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Head>

                <Table.Body>
                  {data &&
                    data.panelGetAllUsers &&
                    data.panelGetAllUsers.map(item => {
                      return (
                        <Table.Tr key={item.id}>
                          <Table.Td>
                            <div className='flex items-center'>
                              <div>
                                <div className='text-sm leading-5 font-medium text-gray-900'>
                                  {item.name}
                                </div>
                                <div className='text-sm leading-5 text-gray-500'>
                                  {item.email}
                                </div>
                              </div>
                            </div>
                          </Table.Td>

                          <Table.Td>
                            <Link href={`/users/${item.id}/sessions`}>
                              <a className='text-indigo-600 hover:text-indigo-900'>
                                Sessões
                              </a>
                            </Link>{' '}
                            |{' '}
                            <Link href={`/users/${item.id}/passwd`}>
                              <a className='text-indigo-600 hover:text-indigo-900'>
                                Alterar senha
                              </a>
                            </Link>{' '}
                            |{' '}
                            <Link href={`/users/${item.id}/edit`}>
                              <a className='text-indigo-600 hover:text-indigo-900'>
                                Edit
                              </a>
                            </Link>{' '}
                            |{' '}
                            <a
                              href='#'
                              className='text-indigo-600 hover:text-indigo-900'
                              onClick={remove(item.id)}
                            >
                              Remove
                            </a>
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
export default Index
