import React, { useState, useEffect, useRef } from 'react'
import './Tooltip.css'
import ReactDOM from 'react-dom'
// Trigger Component to handle both hover and click events
const Trigger = ({ children, onTrigger, trigger }) => {
  const handleMouseEnter = () => trigger.includes('hover') && onTrigger(true)
  const handleMouseLeave = () => trigger.includes('hover') && onTrigger(false)
  const handleClick = () => trigger.includes('click') && onTrigger(true)

  return React.cloneElement(children, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
  })
}

const Popup = ({ children, placement, position, visible }) => {
  //   if (!visible) return null

  const popupStyle = getPlacementStyle(position, placement)
  const popupClass = `tooltip-popup ${placement} ${visible ? 'visible' : ''}` // 動態加入 `visible` 類名

  return (
    <>
      {ReactDOM.createPortal(
        <div className={popupClass} style={popupStyle}>
          {children}
        </div>,
        document.body
      )}
    </>
  )
}

// Helper function to calculate position styles
const getPlacementStyle = (position, placement) => {
  switch (placement) {
    case 'top':
      return { top: position.top - 20, left: position.left, transform: 'translate(-50%, -100%)' }
    case 'bottom':
      return { top: position.top + 30, left: position.left, transform: 'translate(-50%, 0)' }
    case 'left':
      return { top: position.top, left: position.left - 20, transform: 'translate(-100%, -50%)' }
    case 'right':
      return { top: position.top, left: position.left + 20, transform: 'translate(0, -50%)' }
    default:
      return { top: position.top, left: position.left, transform: 'translate(-50%, -100%)' }
  }
}

// Tooltip Component with desktop and mobile handling
const Tooltip = ({ title, children, placement = 'top' }) => {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [trigger, setTrigger] = useState(['hover']) // Default to 'hover' for desktop
  const triggerRef = useRef(null)

  useEffect(() => {
    // Determine if the device is a mobile device
    const isMobile = window.innerWidth <= 768 // Adjust breakpoint as needed
    setTrigger(isMobile ? ['click'] : ['hover'])
  }, [])

  const handleVisibleChange = (v) => {
    if (v && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      // 修正位置：加上頁面的滾動距離
      setPosition({
        top: rect.top + window.scrollY, // 修正 top
        left: rect.left + window.scrollX + rect.width / 2, // 修正 left
      })
    }
    setVisible(v)
  }

  return (
    <>
      <Trigger trigger={trigger} onTrigger={(v) => handleVisibleChange(v)}>
        <div className='tooltip-wrapper' ref={triggerRef}>
          {children}
          <Popup placement={placement} position={position} visible={visible}>
            <div className='tooltip-content'>{title}</div>
          </Popup>
        </div>
      </Trigger>
    </>
  )
}

export default Tooltip
