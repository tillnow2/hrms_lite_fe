import React from 'react'
import { Inbox } from 'lucide-react'

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center">
        <Icon className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState
