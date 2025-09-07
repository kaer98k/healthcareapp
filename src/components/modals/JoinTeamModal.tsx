import React, { useState } from 'react';
import { X } from 'lucide-react';

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinTeam: (teamCode: string) => void;
  onCreateTeamCode: () => string;
}

const JoinTeamModal: React.FC<JoinTeamModalProps> = ({ isOpen, onClose, onJoinTeam, onCreateTeamCode }) => {
  const [teamCode, setTeamCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamCode.trim()) {
      alert('팀 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    // 실제 구현에서는 API 호출을 여기서 수행
    await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
    
    onJoinTeam(teamCode.trim());
    setIsLoading(false);
    onClose();
    
    // 폼 리셋
    setTeamCode('');
  };

  const handleClose = () => {
    setTeamCode('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-purple-500/20">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">팀 참여하기</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 팀 코드 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              팀 참여 코드
            </label>
            <input
              type="text"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
              placeholder="팀 코드를 입력하세요 (예: ABC123)"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 text-center font-mono text-lg tracking-wider"
              required
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              팀장으로부터 받은 6자리 코드를 입력하세요
            </p>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !teamCode.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
            >
              {isLoading ? '참여 중...' : '팀 참여하기'}
            </button>
          </div>
        </form>

        {/* 도움말 */}
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="text-blue-400 text-lg">💡</div>
            <div className="text-sm text-blue-200">
              <p className="font-semibold mb-1">팀 참여 방법</p>
              <ul className="space-y-1 text-xs text-blue-300">
                <li>• 팀장으로부터 받은 6자리 코드를 입력하세요</li>
                <li>• 코드는 대소문자를 구분하지 않습니다</li>
                <li>• 팀이 가득 찬 경우 참여할 수 없습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTeamModal;