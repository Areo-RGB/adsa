import Link from 'next/link'

interface HeaderProps {
  title?: string
  showMenu?: boolean
  showShare?: boolean
  showThemeToggle?: boolean
}

export default function Header({ 
  title = "AppKit", 
  showMenu = true, 
  showShare = true, 
  showThemeToggle = true 
}: HeaderProps) {
  return (
    <div className="header header-auto-show header-fixed header-logo-center">
      <Link href="/home" className="header-title default-link">
        {title}
      </Link>
      
      {showMenu && (
        <a href="#" data-menu="menu-main" className="header-icon header-icon-1 default-link">
          <i className="fas fa-bars"></i>
        </a>
      )}
      
      {showThemeToggle && (
        <>
          <a href="#" data-toggle-theme className="header-icon header-icon-4 show-on-theme-dark default-link">
            <i className="fas fa-sun"></i>
          </a>
          <a href="#" data-toggle-theme className="header-icon header-icon-4 show-on-theme-light default-link">
            <i className="fas fa-moon"></i>
          </a>
        </>
      )}
      
      {showShare && (
        <a href="#" data-menu="menu-share" className="header-icon header-icon-3 default-link">
          <i className="fas fa-share-alt"></i>
        </a>
      )}
    </div>
  )
}