'use client'

import React, { useState, useEffect } from 'react';

interface TeamData {
  id?: string;
  name: string;
  description: string;
  challengeType: string;
  maxMembers: number;
  isPrivate: boolean;
  startDate: string;
  endDate: string;
  teamCode?: string;
  members?: number;
  status?: 'active' | 'pending' | 'completed';
  memberSteps?: { [memberName: string]: number };
  totalSteps?: number;
  teamA?: { name: string; steps: number }[];
  teamB?: { name: string; steps: number }[];
  teamASteps?: number;
  teamBSteps?: number;
  prize?: string;
}

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTeam: (teamData: TeamData) => void;
  team: TeamData | null;
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({
  isOpen,
  onClose,
  onUpdateTeam,
  team
}) => {
  const [formData, setFormData] = useState<TeamData>({
    name: '',
    description: '',
    challengeType: 'steps',
    maxMembers: 4,
    isPrivate: false,
    prize: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description,
        challengeType: team.challengeType,
        maxMembers: team.maxMembers,
        isPrivate: team.isPrivate,
        prize: team.prize || '',
        startDate: team.startDate || '',
        endDate: team.endDate || ''
      });
    }
  }, [team]);
