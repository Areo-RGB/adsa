import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/styles/bootstrap.css" />
        <link rel="stylesheet" href="/styles/style.css" />
        <link rel="stylesheet" href="/styles/custom.css" />
        <link rel="stylesheet" href="/styles/highlights/highlight_blue.css" />
        <link rel="stylesheet" href="/fonts/css/fontawesome-all.min.css" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
      </Head>
      <body className="theme-light" data-highlight="highlight-blue">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}