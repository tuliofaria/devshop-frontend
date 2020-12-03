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
    mutation updateUser($id: String!, $passwd: String!) {
      panelChangeUserPass (input: {
        id: $id,
        passwd: $passwd
      })
    }
  `
const UserSchema = Yup.object().shape({
  passwd: Yup.string()
    .min(6, 'Por favor, informe pelo menos uma senha com 6 caracteres.')
    .required('Por favor, informe uma senha.')
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
      passwd: ''
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
  return (
    <Layout>
      <Title>
        Editar senha:{' '}
        {data && data.panelGetUserById && data.panelGetUserById.name}
      </Title>
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
                  label='Nova senha'
                  placeholder='Preencha com a senha'
                  value={form.values.passwd}
                  onChange={form.handleChange}
                  name='passwd'
                  errorMessage={form.errors.passwd}
                />
              </div>
              <Button>Salvar nova senha</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Edit
