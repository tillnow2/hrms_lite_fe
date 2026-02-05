import React from 'react'

const LoadingBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
      <div className="h-full bg-primary-600 animate-loading-bar origin-left"></div>
    </div>
  )
}

export default LoadingBar
