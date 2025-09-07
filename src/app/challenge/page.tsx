'use client'

import React, { useState, useEffect } from 'react';
import NavigationBar from '../../components/NavigationBar';
import CreateTeamModal from '../../components/modals/CreateTeamModal';
import JoinTeamModal from '../../components/modals/JoinTeamModal';
import EditTeamModal from '../../components/modals/EditTeamModal';
import { useStepTracker } from '../../hooks/useStepTracker';

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

const ChallengePage: React.FC = () => {
  const [activeView, setActiveView] = useState<'individual' | 'team'>('individual');
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showJoinTeamModal, setShowJoinTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamData | null>(null);
  const [dailySteps, setDailySteps] = useState(0);
  const [lastResetDate, setLastResetDate] = useState<string>('');
  
  // 걸음수 추적 Hook 사용
  const { stepData } = useStepTracker();
  
  // 초기 걸음수 설정 (테스트용)
  useEffect(() => {
    if (dailySteps === 0 && stepData.steps === 0) {
      setDailySteps(5500); // 테스트용 초기값
    }
  }, [dailySteps, stepData.steps]);
  
  // 일일 걸음수 관리 및 자동 리셋
  useEffect(() => {
    const today = new Date().toDateString();
    
    // 오늘 날짜가 바뀌었으면 걸음수 리셋
    if (lastResetDate !== today) {
      setDailySteps(0);
      setLastResetDate(today);
    }
    
    // 실시간 걸음수 업데이트
    if (stepData.steps > dailySteps) {
      setDailySteps(stepData.steps);
    }
    
    // 디버깅용 로그 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('Challenge Page - stepData.steps:', stepData.steps);
      console.log('Challenge Page - dailySteps:', dailySteps);
      console.log('Challenge Page - isTracking:', stepData.isTracking);
    }
  }, [stepData.steps, lastResetDate, dailySteps]);
  
  const [teams, setTeams] = useState<TeamData[]>([
    {
      id: '1',
      name: 'ㄷㄱㄷㄱ',
      description: '걸음수로 승부하는 팀입니다!',
      challengeType: 'steps',
      maxMembers: 6,
      isPrivate: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      teamCode: 'DG1234',
      members: 1,
      status: 'active',
      memberSteps: { '나': 5500 },
      totalSteps: 5500
    }
  ]);

  const handleCreateTeam = (teamData: TeamData) => {
    const teamCode = generateTeamCode();
    const newTeam: TeamData = {
      ...teamData,
      id: Date.now().toString(),
      teamCode,
      members: 1, // 팀 생성자는 자동으로 1명
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      memberSteps: { '나': Math.floor(Math.random() * 5000) + 2000 },
      totalSteps: 0
    };
    // 총 걸음수 계산
    newTeam.totalSteps = Object.values(newTeam.memberSteps || {}).reduce((sum, steps) => sum + steps, 0);
    setTeams(prev => [...prev, newTeam]);
    if (process.env.NODE_ENV === 'development') {
      console.log('새 팀 생성:', newTeam);
      console.log('최대 인원수:', newTeam.maxMembers, '현재 멤버:', newTeam.members);
    }
  };

  // 임의 사용자들을 팀에 추가하는 함수 (최대 인원수 제한 적용)
  const addRandomMembersToTeam = (teamId: string) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        // 현재 멤버 수 확인
        const currentMemberCount = team.members || 1;
        const maxMembers = team.maxMembers;
        
        // 최대 인원수에 도달했으면 추가하지 않음
        if (currentMemberCount >= maxMembers) {
          alert(`최대 인원수(${maxMembers}명)에 도달했습니다.`);
          return team;
        }
        
        // 추가할 수 있는 멤버 수 계산
        const availableSlots = maxMembers - currentMemberCount;
        const membersToAdd = Math.min(availableSlots, 2); // 최대 2명씩 추가
        
        const newMembers = [];
        for (let i = 0; i < membersToAdd; i++) {
          const names = ['김철수', '이영희', '박민수', '정수진', '최민호', '한지영', '강민지', '윤서연'];
          const randomName = names[Math.floor(Math.random() * names.length)] + (i + 1);
          newMembers.push({
            name: randomName,
            steps: Math.floor(Math.random() * 8000) + 2000
          });
        }
        
        const updatedMemberSteps = { ...team.memberSteps };
        newMembers.forEach(member => {
          updatedMemberSteps[member.name] = member.steps;
        });
        
        const totalSteps = Object.values(updatedMemberSteps).reduce((sum, steps) => sum + steps, 0);
        
        return {
          ...team,
          members: Object.keys(updatedMemberSteps).length,
          memberSteps: updatedMemberSteps,
          totalSteps: totalSteps
        };
      }
      return team;
    }));
  };

  const handleUpdateTeam = (teamData: TeamData) => {
    setTeams(prev => prev.map(team => 
      team.id === teamData.id ? { ...team, ...teamData } : team
    ));
    if (process.env.NODE_ENV === 'development') {
      console.log('팀 수정:', teamData);
    }
  };

  const handleEditTeam = (team: TeamData) => {
    setEditingTeam(team);
    setShowEditTeamModal(true);
  };

  const generateTeamCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleJoinTeam = (teamCode: string) => {
    // 팀 코드로 팀 찾기
    const targetTeam = teams.find(team => team.teamCode === teamCode);
    
    if (!targetTeam) {
      alert('존재하지 않는 팀 코드입니다.');
      return;
    }
    
    // 최대 인원수 확인
    if ((targetTeam.members || 1) >= targetTeam.maxMembers) {
      alert(`이 팀은 이미 최대 인원수(${targetTeam.maxMembers}명)에 도달했습니다.`);
      return;
    }
    
    // 팀에 참여 (새 멤버 추가)
    setTeams(prev => prev.map(team => {
      if (team.id === targetTeam.id) {
        const newMemberName = `참여자${Date.now()}`;
        const newMemberSteps = { ...team.memberSteps, [newMemberName]: Math.floor(Math.random() * 5000) + 1000 };
        const totalSteps = Object.values(newMemberSteps).reduce((sum, steps) => sum + steps, 0);
        
        return {
          ...team,
          members: (team.members || 1) + 1,
          memberSteps: newMemberSteps,
          totalSteps: totalSteps
        };
      }
      return team;
    }));
    
    alert(`팀 "${targetTeam.name}"에 성공적으로 참여했습니다!`);
    if (process.env.NODE_ENV === 'development') {
      console.log('팀 참여 완료:', teamCode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <main className="flex-1 p-3 sm:p-6 pb-32 text-white relative z-10">
        {/* 배경 장식 요소들 */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* 왼쪽 원형 장식 */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-purple-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 left-20 w-16 h-16 border border-blue-500/20 rounded-full animate-pulse delay-1000"></div>
          
          {/* 오른쪽 원형 장식 */}
          <div className="absolute top-40 right-16 w-24 h-24 border border-purple-500/20 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-60 right-8 w-12 h-12 border border-blue-500/20 rounded-full animate-pulse delay-1500"></div>
          
          {/* 작은 점들 */}
          <div className="absolute top-16 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute top-32 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-1000"></div>
          
          {/* 연결선들 */}
          <div className="absolute top-40 left-1/4 w-px h-20 bg-gradient-to-b from-purple-500/30 to-transparent"></div>
          <div className="absolute top-60 right-1/3 w-px h-16 bg-gradient-to-b from-blue-500/30 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-20">
          {/* 헤더 */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-pulse px-4">
              CHALLENGE DASHBOARD
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg px-4">건강한 경쟁으로 목표를 달성하세요!</p>
        
          {/* 뷰 전환 버튼 */}
          <div className="flex justify-center mt-6 sm:mt-8">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-1 sm:p-2 flex shadow-2xl shadow-purple-500/20">
              <button
                onClick={() => setActiveView('individual')}
                className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 font-bold text-xs sm:text-sm uppercase tracking-wider ${
                  activeView === 'individual'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50 border border-purple-400/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                개인 챌린지
              </button>
              <button
                onClick={() => setActiveView('team')}
                className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 font-bold text-xs sm:text-sm uppercase tracking-wider ${
                  activeView === 'team'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50 border border-purple-400/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                팀 대결
              </button>
            </div>
          </div>
      </div>

          {/* 개인 챌린지 뷰 */}
          {activeView === 'individual' && (
            <>
              {/* 챌린지 메인 섹션 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* 랭킹 카드 */}
                <div className="flex">
                  <div 
                    className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 w-full flex flex-col justify-center"
                  >
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">🏆</div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">랭킹</h3>
                      <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">걸음수 순위</p>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400">11위</div>
                    </div>
                  </div>
                </div>

                {/* 일일 현황 카드 */}
                <div className="flex">
                  <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 w-full flex flex-col justify-center">
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">📊</div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">일일 현황</h3>
                      <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">오늘의 활동</p>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400">
                        {dailySteps.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-300 mt-2">
                        {stepData.isTracking ? '실시간 추적 중' : '추적 대기 중'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Hook: {stepData.steps} | Daily: {dailySteps}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 팀 대결 뷰 */}
          {activeView === 'team' && (
            <div className="space-y-6 sm:space-y-8">
              {/* 팀 대결 헤더 */}
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 px-4">
                  팀 대결
                </h2>
                <p className="text-gray-400 text-sm sm:text-base md:text-lg px-4">팀원들과 함께 운동하며 건강한 경쟁을 즐기세요!</p>
              </div>

              {/* 팀 액션 카드들 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 팀 생성 카드 */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-purple-500/30">
                    <div className="text-2xl sm:text-3xl lg:text-4xl">👟</div>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">팀 생성</h3>
                  <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">새로운 팀을 만들어보세요</p>
                  <button
                    onClick={() => setShowCreateTeamModal(true)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25"
                  >
                    팀 만들기
                  </button>
                </div>

                {/* 팀 참여 카드 */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-blue-500/30">
                    <div className="text-2xl sm:text-3xl lg:text-4xl">🔗</div>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">팀 참여</h3>
                  <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">팀 코드로 참여하세요</p>
                  <button
                    onClick={() => setShowJoinTeamModal(true)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25"
                  >
                    팀 참여하기
                  </button>
                </div>
              </div>

              {/* 진행 중인 팀 대결 */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-blue-500/20">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">진행 중인 팀 대결</h3>
                <div className="space-y-4 sm:space-y-6">
                  {/* 생성된 팀들 표시 */}
                  {teams.length > 0 ? (
                    teams.map((team, index) => (
                      <div key={team.id} className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                          <h4 className="font-bold text-white text-base sm:text-lg">{team.name}</h4>
                          <div className="flex items-center space-x-2 flex-wrap">
                            <button
                              onClick={() => addRandomMembersToTeam(team.id!)}
                              disabled={(team.members || 1) >= team.maxMembers}
                              className={`transition-colors px-2 py-1 rounded text-sm ${
                                (team.members || 1) >= team.maxMembers
                                  ? 'text-gray-500 cursor-not-allowed opacity-50'
                                  : 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
                              }`}
                              title={
                                (team.members || 1) >= team.maxMembers
                                  ? `최대 인원수(${team.maxMembers}명) 도달`
                                  : '멤버 추가'
                              }
                            >
                              👥
                            </button>
                            <button
                              onClick={() => handleEditTeam(team)}
                              className="text-gray-400 hover:text-white transition-colors px-2 py-1 hover:bg-gray-700/50 rounded"
                              title="팀 수정"
                            >
                              ✏️
                            </button>
                            <span className="bg-green-900/50 text-green-300 text-xs px-2 sm:px-3 py-1 rounded-full border border-green-700">
                              {team.status === 'active' ? '진행중' : '대기중'}
                            </span>
                            <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-700">
                              {team.maxMembers}명 제한
                            </span>
                            <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-700">
                              {team.teamCode}
                            </span>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-gray-400 text-sm mb-2">{team.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-300 mb-2">
                            <span className="text-blue-400 font-semibold">멤버: {team.members || 1}/{team.maxMembers}</span>
                          </div>
                          <div className="text-sm text-gray-400 mb-2">
                            <span>기간: {team.startDate} ~ {team.endDate}</span>
                          </div>
                          {team.prize && (
                            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg p-3 mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-yellow-400 text-lg">🏆</span>
                                <div>
                                  <div className="text-yellow-300 font-semibold text-sm">승리 상품</div>
                                  <div className="text-white text-sm">{team.prize}</div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* 3대3 대결 구도 표시 */}
                          {team.teamA && team.teamB ? (
                            <div className="space-y-4 mb-3">
                              {/* 팀 A */}
                              <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-lg p-4 border border-blue-500/30">
                                <h5 className="text-sm font-semibold text-blue-300 mb-3">팀 A ({team.teamASteps?.toLocaleString()}걸음)</h5>
                                <div className="space-y-2">
                                  {team.teamA.map((member, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <span className="text-gray-300 text-sm">{member.name}</span>
                                      <span className="text-blue-400 font-semibold">{member.steps.toLocaleString()}걸음</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 팀 B */}
                              <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-lg p-4 border border-purple-500/30">
                                <h5 className="text-sm font-semibold text-purple-300 mb-3">팀 B ({team.teamBSteps?.toLocaleString()}걸음)</h5>
                                <div className="space-y-2">
                                  {team.teamB.map((member, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <span className="text-gray-300 text-sm">{member.name}</span>
                                      <span className="text-purple-400 font-semibold">{member.steps.toLocaleString()}걸음</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 대결 결과 */}
                              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-white mb-2">VS</div>
                                  <div className="flex items-center justify-center space-x-4">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-blue-400">{team.teamASteps?.toLocaleString()}</div>
                                      <div className="text-xs text-gray-400">팀 A</div>
                                    </div>
                                    <div className="text-gray-500">vs</div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-purple-400">{team.teamBSteps?.toLocaleString()}</div>
                                      <div className="text-xs text-gray-400">팀 B</div>
                                    </div>
                                  </div>
                                  <div className="mt-2 text-sm font-semibold">
                                    {team.teamASteps && team.teamBSteps ? (
                                      team.teamASteps > team.teamBSteps ? (
                                        <span className="text-blue-400">팀 A 승리! 🏆</span>
                                      ) : team.teamBSteps > team.teamASteps ? (
                                        <span className="text-purple-400">팀 B 승리! 🏆</span>
                                      ) : (
                                        <span className="text-yellow-400">무승부! 🤝</span>
                                      )
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* 개별 팀원 표시 (멤버가 6명 미만일 때) */
                            <div className="bg-gray-900/50 rounded-lg p-4 mb-3">
                              <h5 className="text-sm font-semibold text-white mb-3">팀원별 걸음수</h5>
                              <div className="space-y-2">
                                {team.memberSteps && Object.entries(team.memberSteps).map(([memberName, steps]) => (
                                  <div key={memberName} className="flex items-center justify-between">
                                    <span className="text-gray-300 text-sm">{memberName}</span>
                                    <span className="text-purple-400 font-semibold">{steps.toLocaleString()}걸음</span>
                                  </div>
                                ))}
                                <div className="border-t border-gray-700 pt-2 mt-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white font-bold">팀 총합</span>
                                    <span className="text-blue-400 font-bold text-lg">{team.totalSteps?.toLocaleString()}걸음</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
          </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{width: '25%'}}></div>
            </div>
                        <div className="text-xs text-gray-400">팀 코드: {team.teamCode}</div>
                      </div>
                    ))
                  ) : (
                    <>
                      {/* 기본 대결들 */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-white text-lg">걸음수 대결 - 1주차</h4>
                          <span className="bg-green-900/50 text-green-300 text-xs px-3 py-1 rounded-full border border-green-700">
                            진행중
                          </span>
                        </div>
                        
                        {/* 팀 A 걸음수 상세 */}
                        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                          <h5 className="text-sm font-semibold text-white mb-3">팀 A - 팀원별 걸음수</h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">김철수</span>
                              <span className="text-blue-400 font-semibold">45,420걸음</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">이영희</span>
                              <span className="text-blue-400 font-semibold">40,000걸음</span>
                            </div>
                            <div className="border-t border-gray-700 pt-2 mt-2">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-bold">팀 A 총합</span>
                                <span className="text-blue-400 font-bold text-lg">85,420걸음</span>
                              </div>
                    </div>
                  </div>
                </div>

                        {/* 팀 B 걸음수 상세 */}
                        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                          <h5 className="text-sm font-semibold text-white mb-3">팀 B - 팀원별 걸음수</h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">박민수</span>
                              <span className="text-purple-400 font-semibold">38,350걸음</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">정수진</span>
                              <span className="text-purple-400 font-semibold">40,000걸음</span>
                            </div>
                            <div className="border-t border-gray-700 pt-2 mt-2">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-bold">팀 B 총합</span>
                                <span className="text-purple-400 font-bold text-lg">78,350걸음</span>
                              </div>
                            </div>
                </div>
              </div>

                        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: '52%'}}></div>
                        </div>
                        <div className="text-xs text-gray-400">남은 시간: 3일 12시간</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

                  </div>
          )}

          {/* 랭킹 섹션 - 항상 표시 */}
          {activeView === 'individual' && (
            <div className="mt-8 mb-8 bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-purple-500/20">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white">걸음수 랭킹</h2>
              </div>

              <div className="space-y-4">
                {[
                  { rank: 1, name: '운동마스터김철수', steps: 15420, initial: '운', isTop: true },
                  { rank: 2, name: '헬스러버박영희', steps: 12850, initial: '헬', isTop: true },
                  { rank: 3, name: '요가마스터이민수', steps: 11200, initial: '요', isTop: true },
                  { rank: 4, name: '크로스핏킹정수진', steps: 9800, initial: '크', isTop: false },
                  { rank: 5, name: '다이어트성공한지영', steps: 8750, initial: '다', isTop: false },
                  { rank: 11, name: '나', steps: dailySteps || 0, initial: '나', isTop: false, isCurrent: true }
              ].map((user) => (
                <div
                  key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                      user.isCurrent 
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50' 
                        : 'bg-gray-800/50 border border-gray-700 hover:border-purple-500/30'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                      <div className={`text-2xl font-bold ${
                        user.rank === 1 ? 'text-yellow-400' :
                        user.rank === 2 ? 'text-gray-300' :
                        user.rank === 3 ? 'text-orange-400' :
                        'text-gray-400'
                      }`}>
                        {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : `#${user.rank}`}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          user.isCurrent ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-600'
                        }`}>
                          {user.initial}
                        </div>
                        <div>
                          <div className={`font-semibold ${
                            user.isCurrent ? 'text-white' : 'text-white'
                          }`}>
                            {user.name}
                            {user.isTop && <span className="ml-2 text-sm text-purple-400">🏆</span>}
                          </div>
                          <div className="text-sm text-gray-400">
                          {user.steps.toLocaleString()} 걸음
                          </div>
                        </div>
                      </div>
                    </div>
                  <div className="text-right">
                      <div className="text-xl font-bold text-white">
                      {user.steps.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">걸음</div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
          
          {/* 하단 여백 추가 */}
          <div className="h-20"></div>
        </div>
      </main>
      <NavigationBar />
      
      {/* 팀 생성 모달 */}
      <CreateTeamModal
        isOpen={showCreateTeamModal}
        onClose={() => setShowCreateTeamModal(false)}
        onCreateTeam={handleCreateTeam}
      />
      
            {/* 팀 참여 모달 */}
            <JoinTeamModal
              isOpen={showJoinTeamModal}
              onClose={() => setShowJoinTeamModal(false)}
              onJoinTeam={handleJoinTeam}
              onCreateTeamCode={generateTeamCode}
            />

            {/* 팀 수정 모달 */}
            <EditTeamModal
              isOpen={showEditTeamModal}
              onClose={() => setShowEditTeamModal(false)}
              onUpdateTeam={handleUpdateTeam}
              team={editingTeam}
            />
    </div>
  );
};

export default ChallengePage;

