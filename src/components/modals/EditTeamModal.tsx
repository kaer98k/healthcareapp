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
        prize: team.prize || ''
      });
    }
  }, [team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description) {
      onUpdateTeam({
        ...formData,
        id: team?.id,
        teamCode: team?.teamCode,
        members: team?.members,
        status: team?.status
      });
      onClose();
    }
  };

  if (!isOpen || !team) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20">
        <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-gray-900/95 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-white">팀 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl sm:text-2xl p-1"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">팀 이름</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
              placeholder="팀 이름을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">팀 설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 resize-none"
              rows={3}
              placeholder="팀에 대한 설명을 입력하세요"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">최대 멤버 수</label>
            <select
              value={formData.maxMembers}
              onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
            >
              <option value={2}>2명</option>
              <option value={3}>3명</option>
              <option value={4}>4명</option>
              <option value={5}>5명</option>
              <option value={6}>6명</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              상품 <span className="text-gray-500 text-xs">(선택사항)</span>
            </label>
            <input
              type="text"
              value={formData.prize}
              onChange={(e) => setFormData({...formData, prize: e.target.value})}
              placeholder="예: 스타벅스 기프티콘, 상금 10만원, 운동용품 등"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
            />
            <p className="text-xs text-gray-500 mt-1">
              승리 팀에게 제공할 상품을 입력하세요. 비워두면 상품 없이 진행됩니다.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => setFormData({...formData, isPrivate: e.target.checked})}
              className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
            />
            <label htmlFor="isPrivate" className="text-sm text-gray-300">
              비공개 팀 (팀 코드로만 참여 가능)
            </label>
          </div>

          <div className="flex space-x-4 pt-4 sticky bottom-0 bg-gray-900/95 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-700">
            <button
              type="submit"
              className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold text-sm sm:text-base"
            >
              팀 수정
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-3 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all duration-300 font-semibold border border-gray-600 text-sm sm:text-base"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeamModal;
