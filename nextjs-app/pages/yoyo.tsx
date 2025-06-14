import Head from 'next/head'
import Layout from '@/components/Layout'
import YoyoTest from '@/components/YoyoTest'

export default function Yoyo() {

  return (
    <>
      <Head>
        <title>YoYo Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout title="YoYo Test" activeNav="yoyo">
        <YoyoTest />
      </Layout>
    </>
  )
}