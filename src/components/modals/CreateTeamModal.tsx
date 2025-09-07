'use client'

import React, { useState } from 'react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (teamData: TeamData) => void;
}

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

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onCreateTeam }) => {
  const [formData, setFormData] = useState<TeamData>({
    name: '',
    description: '',
    challengeType: 'steps',
    maxMembers: 2,
    isPrivate: false,
    startDate: '',
    endDate: '',
    prize: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 실제 구현에서는 API 호출을 여기서 수행
    await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
    
    onCreateTeam(formData);
    setIsLoading(false);
    onClose();
    
    // 폼 리셋
    setFormData({
      name: '',
      description: '',
      challengeType: 'steps',
      maxMembers: 2,
      isPrivate: false,
      startDate: '',
      endDate: '',
      prize: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-purple-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20">
        <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-gray-900/95 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-white">새 팀 만들기</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 팀 이름 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              팀 이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="팀 이름을 입력하세요"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
              required
            />
          </div>

          {/* 팀 설명 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              팀 설명
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="팀에 대한 간단한 설명을 입력하세요"
              rows={3}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 resize-none"
            />
          </div>


          {/* 팀 구성 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              팀 구성
            </label>
            <select
              name="maxMembers"
              value={formData.maxMembers}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
            >
              <option value={2}>1대1 (2명)</option>
              <option value={3}>1대1대1 (3명)</option>
              <option value={4}>2대2 (4명)</option>
              <option value={5}>2대2대1 (5명)</option>
              <option value={6}>3대3 (6명)</option>
              <option value={8}>4대4 (8명)</option>
              <option value={10}>5대5 (10명)</option>
              <option value={12}>6대6 (12명)</option>
            </select>
          </div>

          {/* 대결 기간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                시작 날짜
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                종료 날짜
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* 상품 (선택사항) */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              상품 <span className="text-gray-500 text-xs">(선택사항)</span>
            </label>
            <input
              type="text"
              name="prize"
              value={formData.prize}
              onChange={handleInputChange}
              placeholder="예: 스타벅스 기프티콘, 상금 10만원, 운동용품 등"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
            />
            <p className="text-xs text-gray-500 mt-1">
              승리 팀에게 제공할 상품을 입력하세요. 비워두면 상품 없이 진행됩니다.
            </p>
          </div>

          {/* 비공개 팀 */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleInputChange}
              className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
            />
            <label className="text-sm text-gray-300">
              비공개 팀 (초대만 가능)
            </label>
          </div>

          {/* 버튼들 */}
          <div className="flex space-x-4 pt-4 sticky bottom-0 bg-gray-900/95 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-3 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all duration-300 font-semibold border border-gray-600 text-sm sm:text-base"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold border border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  생성 중...
                </div>
              ) : (
                '팀 생성'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
