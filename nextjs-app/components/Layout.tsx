import { ReactNode } from 'react'
import Header from './Header'
import FooterBar from './FooterBar'
import MainMenu from './MainMenu'
import ShareMenu from './ShareMenu'
import ColorMenu from './ColorMenu'

interface LayoutProps {
  children: ReactNode
  title?: string
  showHeader?: boolean
  showFooter?: boolean
  activeNav?: string
  headerProps?: {
    showMenu?: boolean
    showShare?: boolean
    showThemeToggle?: boolean
  }
}

export default function Layout({ 
  children, 
  title,
  showHeader = true,
  showFooter = true,
  activeNav,
  headerProps = {}
}: LayoutProps) {
  return (
    <div id="page">
      {/* Header */}
      {showHeader && <Header title={title} {...headerProps} />}

      {/* Footer Navigation */}
      {showFooter && <FooterBar activeNav={activeNav} />}

      {/* Main Content */}
      <div className="page-content">
        {children}
      </div>

      {/* Menus */}
      <MainMenu />
      <ShareMenu />
      <ColorMenu />
    </div>
  )
}