import Link from 'next/link'

export default function MainMenu() {
  const menuItems = [
    { href: "/home", icon: "fa-heart", gradient: "gradient-red", label: "Home" },
    { href: "/homepages", icon: "fa-home", gradient: "gradient-green", label: "Homepages" },
    { href: "/components", icon: "fa-cog", gradient: "gradient-blue", label: "Components" },
    { href: "/pages", icon: "fa-file", gradient: "gradient-brown", label: "Pages" },
    { href: "/projects", icon: "fa-camera", gradient: "gradient-magenta", label: "Media" },
    { href: "/contact", icon: "fa-envelope", gradient: "gradient-teal", label: "Contact" }
  ]

  const settingsItems = [
    { href: "#", icon: "fa-brush", gradient: "gradient-highlight", label: "Highlights", dataMenu: "menu-colors" },
    { href: "#", icon: "fa-moon", gradient: "gradient-dark", label: "Dark Mode", dataToggleTheme: true },
    { href: "#", icon: "fa-share-alt", gradient: "gradient-red", label: "Share", dataMenu: "menu-share" }
  ]

  return (
    <div className="menu menu-box-left" data-menu-load="menu-main" data-menu-width="280" data-menu-active="nav-welcome">
      <div className="menu-title menu-title-s">
        <span>Navigation</span>
        <a href="#" className="close-menu">
          <i className="fa fa-times"></i>
        </a>
      </div>
      
      {/* Header Card */}
      <div className="card rounded-0 bg-6" data-card-height="150">
        <div className="card-top">
          <a href="#" className="close-menu float-end me-2 text-center mt-3 icon-40 notch-clear">
            <i className="fa fa-times color-white"></i>
          </a>
        </div>
        <div className="card-bottom">
          <h1 className="color-white ps-3 mb-n1 font-28">AppKit</h1>
          <p className="mb-2 ps-3 font-12 color-white opacity-50">Welcome to the Future</p>
        </div>
        <div className="card-overlay bg-gradient"></div>
      </div>
      
      <div className="mt-4"></div>
      
      {/* Library Section */}
      <h6 className="menu-divider">Library</h6>
      <div className="list-group list-custom-small list-menu">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} id={`nav-${item.label.toLowerCase()}`}>
            <i className={`fa ${item.icon} ${item.gradient} color-white`}></i>
            <span>{item.label}</span>
            <i className="fa fa-angle-right"></i>
          </Link>
        ))}
      </div>
      
      {/* Settings Section */}
      <h6 className="menu-divider mt-4">Settings</h6>
      <div className="list-group list-custom-small list-menu">
        {settingsItems.map((item, index) => (
          <a 
            key={index} 
            href={item.href}
            {...(item.dataMenu && { 'data-menu': item.dataMenu })}
            {...(item.dataToggleTheme && { 'data-toggle-theme': true })}
          >
            <i className={`fa ${item.icon} ${item.gradient} color-white`}></i>
            <span>{item.label}</span>
            <i className="fa fa-angle-right"></i>
          </a>
        ))}
      </div>
    </div>
  )
}