import Head from 'next/head'
import Layout from '@/components/Layout'

export default function Home() {
  return (
    <>
      <Head>
        <title>qV</title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <Layout 
        title="AppKit" 
        activeNav="home"
        showFooter={false}
      >
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Welcome to AppKit</h1>
          <p className="text-gray-600 mb-6">Your mobile-first web application</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card card-style">
              <h4 className="font-20 mb-2">Components</h4>
              <p className="mb-3">Explore our extensive component library.</p>
              <a href="/components" className="btn btn-sm bg-highlight">View Components</a>
            </div>
            
            <div className="card card-style">
              <h4 className="font-20 mb-2">Pages</h4>
              <p className="mb-3">Browse through our page examples.</p>
              <a href="/pages" className="btn btn-sm bg-highlight">View Pages</a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}