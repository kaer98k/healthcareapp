import React from 'react';
import { useStepTracker } from '@/hooks/useStepTracker';
import { Play, Square, RotateCcw, MapPin, Activity, Target, Zap } from 'lucide-react';

export const StepTracker: React.FC = () => {
  const { stepData, startTracking, stopTracking, resetSteps } = useStepTracker();

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border-cyan-500/30 rounded-lg p-6 shadow-lg shadow-cyan-500/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-cyan-200 flex items-center">
          <Activity className="w-6 h-6 mr-2" />
          실시간 걸음수 추적
        </h2>
        <div className="flex gap-2">
          {!stepData.isTracking ? (
            <button
              onClick={startTracking}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-lg shadow-cyan-500/25"
            >
              <Play className="w-4 h-4 mr-2" />
              추적 시작
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-lg shadow-red-500/25"
            >
              <Square className="w-4 h-4 mr-2" />
              추적 중지
            </button>
          )}
          <button
            onClick={resetSteps}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            리셋
          </button>
        </div>
      </div>

      {/* 걸음수 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-cyan-200">{stepData.steps.toLocaleString()}</div>
          <div className="text-sm text-cyan-300">걸음수</div>
        </div>
        
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-200">{stepData.distance.toFixed(2)}</div>
          <div className="text-sm text-purple-300">거리 (km)</div>
        </div>
        
        <div className="bg-pink-500/20 border border-pink-500/30 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-pink-200">
            {stepData.isTracking ? '추적 중' : '대기 중'}
          </div>
          <div className="text-sm text-pink-300">상태</div>
        </div>
      </div>

      {/* 현재 위치 표시 */}
      {stepData.currentPosition && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">
              현재 위치: {stepData.currentPosition.latitude.toFixed(6)}, {stepData.currentPosition.longitude.toFixed(6)}
            </span>
          </div>
        </div>
      )}

      {/* 오류 메시지 */}
      {stepData.error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
          <div className="text-red-300 text-sm">{stepData.error}</div>
        </div>
      )}

      {/* 사용 안내 */}
      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-blue-200 font-medium mb-2 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          사용 안내
        </h3>
        <ul className="text-blue-300 text-sm space-y-1">
          <li className="flex items-start">
            <Zap className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
            추적 시작 시 위치 권한을 허용해주세요
          </li>
          <li className="flex items-start">
            <Zap className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
            정확한 측정을 위해 스마트폰을 주머니나 손에 들고 걸어주세요
          </li>
          <li className="flex items-start">
            <Zap className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
            GPS와 센서를 사용하므로 배터리 소모가 있을 수 있습니다
          </li>
        </ul>
      </div>
    </div>
  );
};

