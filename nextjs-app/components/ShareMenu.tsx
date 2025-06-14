export default function ShareMenu() {
  const shareItems = [
    { platform: "facebook", icon: "fab fa-facebook-f", label: "Facebook", bg: "bg-facebook" },
    { platform: "twitter", icon: "fab fa-twitter", label: "Twitter", bg: "bg-twitter" },
    { platform: "linkedin", icon: "fab fa-linkedin-in", label: "LinkedIn", bg: "bg-linkedin" },
    { platform: "whatsapp", icon: "fab fa-whatsapp", label: "WhatsApp", bg: "bg-whatsapp" },
    { platform: "mail", icon: "fa fa-envelope", label: "Email", bg: "bg-mail" }
  ]

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = document.title
    
    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      mail: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="menu menu-box-bottom menu-box-detached rounded-m" data-menu-load="menu-share" data-menu-height="420" data-menu-effect="menu-over">
      <div className="menu-title">
        <p className="color-highlight">Tap a link to</p>
        <h1>Share</h1>
        <a href="#" className="close-menu">
          <i className="fa fa-times-circle"></i>
        </a>
      </div>
      <div className="divider divider-margins mt-3 mb-0"></div>
      <div className="content mt-0">
        <div className="list-group list-custom-small list-icon-0">
          {shareItems.map((item, index) => (
            <a 
              key={index}
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                handleShare(item.platform)
              }}
              className={`${index === shareItems.length - 1 ? 'border-0' : ''}`}
            >
              <i className={`${item.icon} font-12 ${item.bg} color-white shadow-l rounded-s`}></i>
              <span>{item.label}</span>
              <i className="fa fa-angle-right pr-1"></i>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}