import React from 'react'
import { AlertCircle, CheckCircle, X } from 'lucide-react'

const Alert = ({ type = 'info', message, onClose }) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const icons = {
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />,
  }

  return (
    <div className={`border rounded-lg p-4 flex items-start ${styles[type]} mb-4`}>
      <div className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-3 hover:opacity-70 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default Alert
