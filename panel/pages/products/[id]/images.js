import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useUpload, fetcher, useMutation } from '../../../lib/graphql'
import { useFormik } from 'formik'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import * as Yup from 'yup'

let id = ''

const UPLOAD_BRAND_LOGO = `
    mutation uploadProductImage($id: String!, $file: Upload!) {
      panelUploadProductImage (
        id: $id,
        file: $file
      )
    }
  `

const DELETE_IMAGE = `
mutation deleteProductImage($id: String!, $url: String!) {
  panelDeleteProductImage (id: $id, url: $url)
}
`

const Upload = ({ id }) => {
  const [deleteData, deleteImage] = useMutation(DELETE_IMAGE)
  const { data, mutate } = useQuery(`
    query{
      getProductById(id:"${id}"){
        name
        slug
        images
      }
    }
  `)
  const [updatedData, uploadProductImage] = useUpload(UPLOAD_BRAND_LOGO)
  const form = useFormik({
    initialValues: {
      id: id,
      file: ''
    },
    onSubmit: async values => {
      const product = {
        ...values,
        id: id
      }

      const data = await uploadProductImage(product)
      if (data && !data.errors) {
        mutate()
        // router.push('/products')
      }
    }
  })

  const delImage = url => async () => {
    await deleteImage({ id: id, url })
    mutate()
  }

  return (
    <Layout>
      <Title>Upload de imagens do produto: {data?.getProductById?.name} </Title>
      <div className='mt-8'></div>
      {(data?.getProductById?.images === null ||
        data?.getProductById?.images.length === 0) && (
        <p className='rounded bg-white shadow py-2 px-4'>
          Nenhuma imagem enviada até o momento.
        </p>
      )}
      {data?.getProductById?.images &&
        data?.getProductById?.images.map(img => {
          return (
            <div
              key={img}
              className='p-2 m-1 border border-gray-500 rounded hover:bg-gray-400'
            >
              <img src={img} className='rounded' />
              <button
                className='bg-red-400 text-white font-bold p-2 rounded mt-1'
                onClick={delImage(img)}
              >
                Remover
              </button>
            </div>
          )
        })}
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
                <input
                  type='file'
                  name='file'
                  onChange={evt => {
                    form.setFieldValue('file', evt.currentTarget.files[0])
                  }}
                />
              </div>
              <Button>Enviar imagem</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const UploadWrapper = () => {
  const router = useRouter()
  if (router.query.id) {
    return <Upload id={router.query.id} />
  }
  return <p>Loading...</p>
}

export default UploadWrapper
