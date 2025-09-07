// Accelerometer 타입 정의
interface Accelerometer {
  addEventListener: (event: string, handler: () => void) => void;
  start: () => void;
  stop: () => void;
  x: number;
  y: number;
  z: number;
}

import { useState, useEffect, useRef, useCallback } from 'react';

// Accelerometer 타입 정의
interface Accelerometer {
  addEventListener: (event: string, handler: () => void) => void;
  start: () => void;
  stop: () => void;
  x: number;
  y: number;
  z: number;
}

interface StepData {
  steps: number;
  distance: number;
  isTracking: boolean;
  error: string | null;
  currentPosition: {
    latitude: number;
    longitude: number;
  } | null;
}

export const useStepTracker = () => {
  const [stepData, setStepData] = useState<StepData>({
    steps: 0,
    distance: 0,
    isTracking: false,
    error: null,
    currentPosition: null
  });

  const lastPositionRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const AccelerometerRef = useRef<Accelerometer | null>(null);| null>(null);
  const watchIdRef = useRef<number | null>(null);


  // 두 지점 간 거리 계산 (Haversine formula)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // 위치 업데이트 처리
  const handleLocationUpdate = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords;
    
    setStepData(prev => ({
      ...prev,
      currentPosition: { latitude, longitude },
      error: null
    }));

    if (lastPositionRef.current) {
      const distance = calculateDistance(
        lastPositionRef.current.latitude,
        lastPositionRef.current.longitude,
        latitude,
        longitude
      );
      
      // 이동 거리 기반 걸음수 추정 (1km당 약 1400걸음)
      const estimatedSteps = Math.round(distance * 1000 / 0.7);
      
      setStepData(prev => ({
        ...prev,
        steps: prev.steps + estimatedSteps,
        distance: prev.distance + distance
      }));
    }
    
    lastPositionRef.current = { latitude, longitude };
  }, [calculateDistance]);

  // 가속도계를 통한 걸음 감지
  const handleAccelerometerReading = useCallback(() => {
    if (AccelerometerRef.current) {
      const { x, y, z } = AccelerometerRef.current;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      
      // 임계값을 넘으면 걸음으로 인식
      if (magnitude > 1.2) {
        setStepData(prev => ({
          ...prev,
          steps: prev.steps + 1
        }));
      }
    }
  }, []);

  // 추적 시작
  const startTracking = useCallback(async () => {
    try {
      setStepData(prev => ({ ...prev, error: null, isTracking: true }));

      // 위치 권한 확인
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported');
      }

      // 위치 추적 시작
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      watchIdRef.current = navigator.geolocation.watchPosition(
        handleLocationUpdate,
        (error) => {
          console.error('Location error:', error);
          setStepData(prev => ({
            ...prev,
            error: `위치 오류: ${error.message}`,
            isTracking: false
          }));
        },
        options
      );

      // 가속도계 시작 (지원하는 경우)
      if ('Accelerometer' in window) {
        try {
          AccelerometerRef.current = new Accelerometer({ frequency: 60 });
          AccelerometerRef.current.addEventListener('reading', handleAccelerometerReading);
          AccelerometerRef.current.start();
        } catch (error) {
          console.warn('Accelerometer not available:', error);
        }
      }

    } catch (error: Accelerometer) {
      setStepData(prev => ({
        ...prev,
        error: `추적 시작 실패: ${error.message}`,
        isTracking: false
      }));
    }
  }, [handleLocationUpdate, handleAccelerometerReading]);

  // 추적 중지
  const stopTracking = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (AccelerometerRef.current) {
      AccelerometerRef.current.stop();
      AccelerometerRef.current = null;
    }
    
    setStepData(prev => ({ ...prev, isTracking: false }));
  }, []);

  // 리셋
  const resetSteps = useCallback(() => {
    setStepData(prev => ({
      ...prev,
      steps: 0,
      distance: 0
    }));
    lastPositionRef.current = null;
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    stepData,
    startTracking,
    stopTracking,
    resetSteps
  };
};

