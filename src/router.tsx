import React from 'react'
import { BrowserRouter as BR } from 'react-router-dom'

export const BrowserRouter: React.FC = ({ children }) => {
  return (
    <BR>
      <React.Suspense fallback={<div>loading....</div>}>
        {children}
      </React.Suspense>
    </BR>
  )
}
