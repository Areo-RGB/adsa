import { useTheme } from '@/hooks/useTheme'

export default function ColorMenu() {
  const { highlightColor, changeHighlightColor } = useTheme()

  const colorOptions = [
    { name: 'blue', label: 'Blue', gradient: 'gradient-blue' },
    { name: 'red', label: 'Red', gradient: 'gradient-red' },
    { name: 'orange', label: 'Orange', gradient: 'gradient-orange' },
    { name: 'green', label: 'Green', gradient: 'gradient-green' },
    { name: 'yellow', label: 'Yellow', gradient: 'gradient-yellow' },
    { name: 'magenta', label: 'Magenta', gradient: 'gradient-magenta' },
    { name: 'teal', label: 'Teal', gradient: 'gradient-teal' },
    { name: 'brown', label: 'Brown', gradient: 'gradient-brown' },
    { name: 'dark', label: 'Dark', gradient: 'gradient-dark' },
    { name: 'night', label: 'Night', gradient: 'gradient-night' }
  ]

  const handleColorChange = (colorName: string) => {
    changeHighlightColor(colorName as 'blue' | 'red' | 'orange' | 'green' | 'yellow' | 'magenta' | 'teal' | 'brown' | 'dark' | 'night')
  }

  return (
    <div className="menu menu-box-bottom menu-box-detached rounded-m" data-menu-load="menu-colors" data-menu-height="480">
      <div className="menu-title">
        <p className="color-highlight font-600">Choose your Favorite</p>
        <h1>Highlight</h1>
        <a href="#" className="close-menu">
          <i className="fa fa-times-circle"></i>
        </a>
      </div>
      <div className="divider divider-margins mt-3 mb-2"></div>
      <div className="content mt-0 ms-0 me-0">
        <div className="row mb-0">
          <div className="col-6">
            <div className="list-group list-custom-small list-menu">
              {colorOptions.slice(0, 5).map((color) => (
                <a 
                  key={color.name}
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    handleColorChange(color.name)
                  }}
                  className={highlightColor === color.name ? 'selected' : ''}
                >
                  <i className={`${color.gradient} color-white`}></i>
                  <span>{color.label}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="col-6">
            <div className="list-group list-custom-small list-menu">
              {colorOptions.slice(5).map((color) => (
                <a 
                  key={color.name}
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    handleColorChange(color.name)
                  }}
                  className={highlightColor === color.name ? 'selected' : ''}
                >
                  <i className={`${color.gradient} color-white`}></i>
                  <span>{color.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}