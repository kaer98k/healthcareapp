'use client'

import React, { useState, useEffect } from 'react';
import WorkoutRecommendations from './WorkoutRecommendations';

const WorkoutPage: React.FC = () => {
  const [showRecommendations, setShowRecommendations] = useState(true);

  // 챌린지 탭으로 바로 이동
  useEffect(() => {
    setShowRecommendations(true);
  }, []);

  if (showRecommendations) {
    return <WorkoutRecommendations />;
  }

  return null;
};

export default WorkoutPage;
