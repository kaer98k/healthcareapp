import React from 'react'

export const ConfigDebugger: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-md">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">설정 디버깅</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <span className="font-medium text-gray-700">Supabase URL:</span>
          <div className="text-gray-600 break-all">
            {supabaseUrl ? (
              <span className="text-green-600">✓ 설정됨</span>
            ) : (
              <span className="text-red-600">✗ 설정되지 않음</span>
            )}
          </div>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Supabase Anon Key:</span>
          <div className="text-gray-600">
            {supabaseAnonKey ? (
              <span className="text-green-600">✓ 설정됨</span>
            ) : (
              <span className="text-red-600">✗ 설정되지 않음</span>
            )}
          </div>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">현재 URL:</span>
          <div className="text-gray-600 break-all">
            {window.location.href}
          </div>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Origin:</span>
          <div className="text-gray-600 break-all">
            {window.location.origin}
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t">
        <button
          onClick={() => {
            console.log('Supabase URL:', supabaseUrl)
            console.log('Supabase Anon Key:', supabaseAnonKey)
            console.log('Current URL:', window.location.href)
            console.log('Origin:', window.location.origin)
          }}
          className="text-xs text-indigo-600 hover:text-indigo-500"
        >
          콘솔에 출력
        </button>
      </div>
    </div>
  )
}
