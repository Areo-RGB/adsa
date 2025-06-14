import Head from 'next/head'

export default function Elo() {
  return (
    <>
      <Head>
        <title>Elo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Elo Page</h1>
        <p>This is the Elo page content.</p>
      </div>
    </>
  )
}