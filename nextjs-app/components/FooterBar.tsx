import Link from 'next/link'

interface FooterBarProps {
  activeNav?: string
}

export default function FooterBar({ activeNav }: FooterBarProps) {
  const navItems = [
    { href: "/components", icon: "fa-layer-group", label: "Features" },
    { href: "/pages", icon: "fa-file", label: "Pages" },
    { href: "/home", icon: "fa-home", label: "Home", isCircle: true },
    { href: "/projects", icon: "fa-camera", label: "Projects" },
    { href: "/menu", icon: "fa-bars", label: "Menu" }
  ]

  return (
    <div id="footer-bar" className="footer-bar-6">
      {navItems.map((item, index) => (
        <Link 
          key={index}
          href={item.href} 
          className={`${item.isCircle ? 'circle-nav' : ''} ${activeNav === item.label.toLowerCase() ? 'active-nav' : ''}`}
        >
          <i className={`fa ${item.icon}`}></i>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  )
}