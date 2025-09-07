'use client'

import React, { useState } from 'react';

interface DailyStats {
  steps: number;
  calories: number;
}

interface Team {
  id: string;
  name: string;
  members: string[];
}

interface Match {
  id: string;
  teamA: string;
  teamB: string;
  startDate: string;
  endDate: string;
  teamAScore: number;
  teamBScore: number;
}

const WorkoutRecommendations: React.FC = () => {
  // 기본 상태 관리
  const [selectedTab, setSelectedTab] = useState<'daily' | 'ranking' | 'fun' | 'team'>('daily');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  
  // 기본 데이터 상태
  const [dailyStats, setDailyStats] = useState<DailyStats>({ steps: 8500, calories: 425 });
  const [weeklySteps, setWeeklySteps] = useState<number[]>([8500, 9200, 7800, 10500, 8900, 7600, 8200]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  
  // 폼 상태
  const [newTeamName, setNewTeamName] = useState('');
  const [newMemberInput, setNewMemberInput] = useState('');
  const [newTeamMembers, setNewTeamMembers] = useState<string[]>([]);
  const [selectedTeamAId, setSelectedTeamAId] = useState('');
  const [selectedTeamBId, setSelectedTeamBId] = useState('');
  const [matchStartDate, setMatchStartDate] = useState('');
  const [matchEndDate, setMatchEndDate] = useState('');

  // 기본 핸들러 함수들
  const handleCreateTeam = () => {
    if (newTeamName.trim() && newTeamMembers.length > 0) {
      const newTeam: Team = {
        id: Date.now().toString(),
        name: newTeamName,
        members: newTeamMembers
      };
      setTeams([...teams, newTeam]);
      setNewTeamName('');
      setNewTeamMembers([]);
      setShowCreateTeam(false);
    }
  };

  const handleAddMember = () => {
    if (newMemberInput.trim() && newTeamMembers.length < 10) {
      setNewTeamMembers([...newTeamMembers, newMemberInput.trim()]);
      setNewMemberInput('');
    }
  };

  const handleRemoveMember = (name: string) => {
    setNewTeamMembers(newTeamMembers.filter(member => member !== name));
  };

  const handleCreateMatch = () => {
    if (selectedTeamAId && selectedTeamBId && matchStartDate && matchEndDate) {
      const newMatch: Match = {
        id: Date.now().toString(),
        teamA: selectedTeamAId,
        teamB: selectedTeamBId,
        startDate: matchStartDate,
        endDate: matchEndDate,
        teamAScore: 0,
        teamBScore: 0
      };
      setMatches([...matches, newMatch]);
      setSelectedTeamAId('');
      setSelectedTeamBId('');
      setMatchStartDate('');
      setMatchEndDate('');
      setShowCreateMatch(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-10 rounded-3xl blur-3xl transform scale-150"></div>
          
          <div className="relative">
            <div className="inline-flex items-center space-x-4 mb-4">
              <div className="text-6xl animate-bounce">🏆</div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                챌린지
              </h1>
              <div className="text-6xl animate-pulse">🔥</div>
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-text-primary">매일의 참여로 건강한 습관을 만들어보세요!</p>
              <p className="text-lg text-text-secondary">열정을 불태우고 목표를 달성하세요! 💪</p>
            </div>
            
            <div className="flex justify-center space-x-4 mt-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                🚀 도전하세요!
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse" style={{animationDelay: '0.5s'}}>
                💪 포기하지 마세요!
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse" style={{animationDelay: '1s'}}>
                🎯 목표를 향해!
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex justify-center mb-12">
          <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-2 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1">
              {[
                { 
                  id: 'daily', 
                  label: '일일 현황', 
                  icon: '📊',
                  description: '오늘의 활동 현황',
                  color: 'from-blue-500 to-cyan-500'
                },
                { 
                  id: 'ranking', 
                  label: '랭킹', 
                  icon: '🏆',
                  description: '걸음수 순위',
                  color: 'from-purple-500 to-pink-500'
                },
                { 
                  id: 'fun', 
                  label: '신박 챌린지', 
                  icon: '🎪',
                  description: '엉뚱한 도전',
                  color: 'from-yellow-500 to-orange-500'
                },
                { 
                  id: 'team', 
                  label: '팀 대결', 
                  icon: '👥',
                  description: '팀워크로 승리',
                  color: 'from-red-500 to-pink-500'
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`relative group transition-all duration-300 ease-out ${
                    selectedTab === tab.id
                      ? 'transform scale-105'
                      : 'hover:scale-102'
                  }`}
                >
                  {selectedTab === tab.id && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl shadow-lg transform transition-all duration-300`} />
                  )}
                  
                  <div className={`relative px-6 py-4 rounded-xl transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                  }`}>
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`text-3xl transition-all duration-300 ${
                        selectedTab === tab.id
                          ? 'transform scale-110'
                          : 'group-hover:scale-110'
                      }`}>
                        {tab.icon}
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg">{tab.label}</div>
                        <div className="text-xs opacity-75">{tab.description}</div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 탭 내용 */}
        {selectedTab === 'daily' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">일일 현황</h2>
              <p>오늘의 걸음 수: {dailyStats.steps.toLocaleString()}보</p>
              <p>소모 칼로리: {dailyStats.calories} kcal</p>
            </div>
          </div>
        )}

        {selectedTab === 'ranking' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">랭킹</h2>
              <p>걸음 수 랭킹이 여기에 표시됩니다.</p>
            </div>
          </div>
        )}

        {selectedTab === 'fun' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">신박 챌린지</h2>
              <p className="text-text-secondary">신박 챌린지 기능이 제거되었습니다.</p>
            </div>
          </div>
        )}

        {selectedTab === 'team' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">팀 대결</h2>
              <p>팀 대결 정보가 여기에 표시됩니다.</p>
            </div>
          </div>
        )}
      </div>

      {/* 팀 만들기 모달 */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">새로운 팀 만들기 (최대 10명)</h3>
              <button className="text-2xl" onClick={() => setShowCreateTeam(false)}>✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">팀 이름</label>
                <input value={newTeamName} onChange={e => setNewTeamName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="예) 번개팀" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">구성원 추가 (최대 10명)</label>
                <div className="flex gap-2">
                  <input value={newMemberInput} onChange={e => setNewMemberInput(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" placeholder="이름 입력 후 추가" />
                  <button onClick={handleAddMember} className="px-3 py-2 bg-accent-green text-white rounded-lg">추가</button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {newTeamMembers.map(name => (
                    <span key={name} className="px-2 py-1 bg-gray-100 rounded-lg text-sm">
                      {name}
                      <button onClick={() => handleRemoveMember(name)} className="ml-1 text-gray-500 hover:text-gray-700">✕</button>
                    </span>
                  ))}
                </div>
                <div className="mt-1 text-xs text-gray-500">현재 {newTeamMembers.length}명 / 최대 10명</div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCreateTeam(false)} className="px-4 py-2 border rounded-lg">취소</button>
                <button onClick={handleCreateTeam} className="px-3 py-2 bg-accent-blue text-white rounded-lg">팀 생성</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 대결 만들기 모달 */}
      {showCreateMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">대결 만들기 (최대 10명 vs 10명)</h3>
              <button className="text-2xl" onClick={() => setShowCreateMatch(false)}>✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">팀 A</label>
                  <select value={selectedTeamAId} onChange={e => setSelectedTeamAId(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                    <option value="">선택하세요</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.members.length}명)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">팀 B</label>
                  <select value={selectedTeamBId} onChange={e => setSelectedTeamBId(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                    <option value="">선택하세요</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.members.length}명)</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">시작일</label>
                  <input type="date" value={matchStartDate} onChange={e => setMatchStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">종료일</label>
                  <input type="date" value={matchEndDate} onChange={e => setMatchEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCreateMatch(false)} className="px-4 py-2 border rounded-lg">취소</button>
                <button onClick={handleCreateMatch} className="px-3 py-2 bg-accent-green text-white rounded-lg">대결 생성</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkoutRecommendations;
