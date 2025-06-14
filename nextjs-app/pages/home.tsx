import Head from 'next/head'
import Link from 'next/link'

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

      <div>
        <div id="preloader">
          <div className="spinner-border color-highlight" role="status"></div>
        </div>

        <div id="page">
          <div className="header header-auto-show header-fixed header-logo-center">
            <Link href="/home" className="header-title default-link">AppKit</Link>
            <a href="#" data-menu="menu-main" className="header-icon header-icon-1 default-link">
              <i className="fas fa-bars"></i>
            </a>
            <a href="#" data-toggle-theme className="header-icon header-icon-4 show-on-theme-dark default-link">
              <i className="fas fa-sun"></i>
            </a>
            <a href="#" data-toggle-theme className="header-icon header-icon-4 show-on-theme-light default-link">
              <i className="fas fa-moon"></i>
            </a>
            <a href="#" data-menu="menu-share" className="header-icon header-icon-3 default-link">
              <i className="fas fa-share-alt"></i>
            </a>
          </div>

          <div className="page-content">
            {/* Page content will go here */}
          </div>
        </div>
      </div>
    </>
  )
}