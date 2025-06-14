import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>AppKit Mobile</title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <div>
        <div id="preloader">
          <div className="spinner-border color-highlight" role="status"></div>
        </div>

        <div id="page">
          <div id="footer-bar" className="footer-bar-6">
            <a href="/components"><i className="fa fa-layer-group"></i><span>Features</span></a>
            <a href="/pages" className="active-nav"><i className="fa fa-file"></i><span>Pages</span></a>
            <Link href="/home" className="circle-nav"><i className="fa fa-home"></i><span>Home</span></Link>
            <a href="/projects"><i className="fa fa-camera"></i><span>Projects</span></a>
            <a href="/menu"><i className="fa fa-bars"></i><span>Menu</span></a>
          </div>

          <div className="page-content pb-0">
            <div className="card mb-0 rounded-0" data-card-height="cover-full">
              <div className="card-center">
                <div className="d-flex justify-content-center">
                  <div className="align-self-center me-4">
                    <h1 className="color-white font-38 text-center">AppKit</h1>
                    <p className="text-center color-white font-15 opacity-50">Ultimate Mobile Kit</p>
                  </div>
                  <div className="align-self-center border-left border-highlight ps-5">
                    <Link href="/home" className="font-25 font-700 color-white d-block mb-4 scale-box">Home</Link>
                    <a href="#" className="font-16 opacity-60 color-white d-block my-4">Features</a>
                    <a href="#" className="font-16 opacity-60 color-white d-block my-4">Pages</a>
                    <a href="#" className="font-16 opacity-60 color-white d-block my-4">Store</a>
                    <a href="#" className="font-16 opacity-60 color-white d-block my-4">News</a>
                    <a href="#" className="font-16 opacity-60 color-white d-block my-4">Media</a>
                    <a href="#" className="font-16 opacity-60 color-white d-block mt-4">Contact</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}