import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation, fetcher } from '../../../lib/graphql'
import { useFormik } from 'formik'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import * as Yup from 'yup'

let id = ''

const UPDATE_USER = `
    mutation updateUser($id: String!, $name: String!, $email: String!, $role: String!) {
      panelUpdateUser (input: {
        id: $id,
        name: $name,
        email: $email,
        role: $role
      }) {
        id
        name
        email
      }
    }
  `
const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres.')
    .required('Por favor, informe um nome.'),
  email: Yup.string()
    .email()
    .min(3, 'Por favor, informe pelo menos um email com 3 caracteres.')
    .required('Por favor, informe email.')
    .test(
      'is-unique',
      'Por favor, utilize outro email. Este já está em uso por outro usuário.',
      async value => {
        const ret = await fetcher(
          JSON.stringify({
            query: `
                query{
                  panelGetUserByEmail(email:"${value}"){
                    id
                  }
                }
              `
          })
        )
        if (ret.errors) {
          return true
        }
        if (ret.data.panelGetUserByEmail.id === id) {
          return true
        }
        return false
      }
    )
})

const Edit = () => {
  const router = useRouter()
  id = router.query.id
  const { data } = useQuery(`
    query{
      panelGetUserById(id:"${router.query.id}"){
        name
        email
        role
      }
    }
  `)
  const [updatedData, updateUser] = useMutation(UPDATE_USER)
  const form = useFormik({
    initialValues: {
      name: '',
      email: '',
      role: ''
    },
    onSubmit: async values => {
      const category = {
        ...values,
        id: router.query.id
      }

      const data = await updateUser(category)
      if (data && !data.errors) {
        router.push('/users')
      }
    },
    validationSchema: UserSchema
  })
  // passou os dados pro form
  useEffect(() => {
    if (data && data.panelGetUserById) {
      form.setFieldValue('name', data.panelGetUserById.name)
      form.setFieldValue('email', data.panelGetUserById.email)
      form.setFieldValue('role', data.panelGetUserById.role)
    }
  }, [data])
  return (
    <Layout>
      <Title>Editar usuário</Title>
      <div className='mt-8'></div>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full shadow bg-white p-12 overflow-hidden sm:rounded-lg border-b border-gray-200'>
            {updatedData && !!updatedData.errors && (
              <p className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative'>
                Ocorreu um erro ao salvar os dados.
              </p>
            )}
            <form onSubmit={form.handleSubmit}>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <Input
                  label='Nome'
                  placeholder='Preencha com o nome'
                  value={form.values.name}
                  onChange={form.handleChange}
                  name='name'
                  errorMessage={form.errors.name}
                />

                <Input
                  label='Email'
                  placeholder='Preencha com o email'
                  value={form.values.email}
                  onChange={form.handleChange}
                  name='email'
                  errorMessage={form.errors.email}
                />
                <Input
                  label='Role'
                  placeholder='Preencha com o role'
                  value={form.values.role}
                  onChange={form.handleChange}
                  name='role'
                  errorMessage={form.errors.role}
                />
              </div>
              <Button>Salvar usuário</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Edit
