import React from 'react'

interface AddressDisplayProps {
  address: string
  zipCode?: string
  className?: string
}

export const AddressDisplay: React.FC<AddressDisplayProps> = ({ 
  address, 
  zipCode, 
  className = "" 
}) => {
  if (!address) {
    return (
      <div className={`text-gray-500 italic ${className}`}>
        주소가 입력되지 않았습니다.
      </div>
    )
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {zipCode && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">우편번호:</span> {zipCode}
        </div>
      )}
      <div className="text-gray-900">
        <span className="font-medium">주소:</span> {address}
      </div>
    </div>
  )
}
