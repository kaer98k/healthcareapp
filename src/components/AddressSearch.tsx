import React, { useState, useEffect } from 'react'

interface AddressSearchProps {
  onAddressSelect: (address: string, zipCode: string) => void
  placeholder?: string
}

export const AddressSearch: React.FC<AddressSearchProps> = ({ 
  onAddressSelect, 
  placeholder = "주소를 검색하세요" 
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // 카카오 주소 검색 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    script.onload = () => setIsScriptLoaded(true)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // 주소 검색 실행
  const handleAddressSearch = () => {
    if (!isScriptLoaded) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    setIsSearching(true)

    // @ts-ignore - 카카오 주소 검색 API
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        setIsSearching(false)
        
        // 선택된 주소 정보
        const fullAddress = data.address
        const zipCode = data.zonecode
        
        // 상세주소 입력 받기
        const detailAddress = prompt('상세주소를 입력해주세요 (건물명, 동/호수 등):')
        
        if (detailAddress) {
          const completeAddress = `${fullAddress} ${detailAddress}`
          onAddressSelect(completeAddress, zipCode)
          setSearchValue(completeAddress)
        } else {
          onAddressSelect(fullAddress, zipCode)
          setSearchValue(fullAddress)
        }
      },
      onclose: () => {
        setIsSearching(false)
      }
    }).open()
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        주소
      </label>
      <div className="flex space-x-2">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          readOnly
        />
        <button
          type="button"
          onClick={handleAddressSearch}
          disabled={isSearching || !isScriptLoaded}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? '검색 중...' : '주소 검색'}
        </button>
      </div>
      {!isScriptLoaded && (
        <p className="text-xs text-gray-500">주소 검색 서비스를 불러오는 중입니다...</p>
      )}
    </div>
  )
}
