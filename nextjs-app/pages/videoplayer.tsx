import Head from 'next/head'
import Layout from '@/components/Layout'

export default function VideoPlayer() {
  return (
    <>
      <Head>
        <title>Video Player</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout title="Video Player" activeNav="videoplayer">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Video Player</h1>
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <p>Video player component will go here</p>
          </div>
        </div>
      </Layout>
    </>
  )
}