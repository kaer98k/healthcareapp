// 한국 주요 도시 및 지역 주소 데이터
export interface LocalAddress {
  id: string
  city: string
  district: string
  address: string
  zipCode: string
  category: 'residential' | 'commercial' | 'mixed' | 'gym' | 'fitness'
  type?: '헬스장' | '요가원' | '필라테스' | '크로스핏' | '태권도' | '복싱' | '수영장' | '테니스장' | '골프장' | '등산로'
  name?: string
  phone?: string
  rating?: number
  facilities?: string[]
}

export const localAddresses: LocalAddress[] = [
  // 서울특별시
  {
    id: 'seoul-1',
    city: '서울특별시',
    district: '강남구',
    address: '강남대로 123',
    zipCode: '06123',
    category: 'commercial'
  },
  {
    id: 'seoul-2',
    city: '서울특별시',
    district: '강남구',
    address: '테헤란로 456',
    zipCode: '06124',
    category: 'commercial'
  },
  {
    id: 'seoul-3',
    city: '서울특별시',
    district: '강남구',
    address: '역삼동 789번지',
    zipCode: '06125',
    category: 'residential'
  },
  {
    id: 'seoul-4',
    city: '서울특별시',
    district: '서초구',
    address: '서초대로 321',
    zipCode: '06601',
    category: 'commercial'
  },
  {
    id: 'seoul-5',
    city: '서울특별시',
    district: '서초구',
    address: '반포대로 654',
    zipCode: '06602',
    category: 'mixed'
  },
  {
    id: 'seoul-6',
    city: '서울특별시',
    district: '마포구',
    address: '홍대입구역 1번 출구',
    zipCode: '04039',
    category: 'commercial'
  },
  {
    id: 'seoul-7',
    city: '서울특별시',
    district: '마포구',
    address: '합정동 123번지',
    zipCode: '04040',
    category: 'residential'
  },
  {
    id: 'seoul-8',
    city: '서울특별시',
    district: '종로구',
    address: '종로 1길',
    zipCode: '03154',
    category: 'commercial'
  },
  {
    id: 'seoul-9',
    city: '서울특별시',
    district: '종로구',
    address: '인사동 12번지',
    zipCode: '03155',
    category: 'commercial'
  },
  {
    id: 'seoul-10',
    city: '서울특별시',
    district: '중구',
    address: '명동길 45',
    zipCode: '04521',
    category: 'commercial'
  },

  // 부산광역시
  {
    id: 'busan-1',
    city: '부산광역시',
    district: '해운대구',
    address: '해운대해변로 264',
    zipCode: '48094',
    category: 'commercial'
  },
  {
    id: 'busan-2',
    city: '부산광역시',
    district: '해운대구',
    address: '중동 1234번지',
    zipCode: '48095',
    category: 'residential'
  },
  {
    id: 'busan-3',
    city: '부산광역시',
    district: '서구',
    address: '부산진구 567번지',
    zipCode: '48789',
    category: 'mixed'
  },

  // 대구광역시
  {
    id: 'daegu-1',
    city: '대구광역시',
    district: '중구',
    address: '동성로 123',
    zipCode: '41908',
    category: 'commercial'
  },
  {
    id: 'daegu-2',
    city: '대구광역시',
    district: '수성구',
    address: '범어동 456번지',
    zipCode: '41909',
    category: 'residential'
  },

  // 인천광역시
  {
    id: 'incheon-1',
    city: '인천광역시',
    district: '연수구',
    address: '송도동 789번지',
    zipCode: '22001',
    category: 'mixed'
  },
  {
    id: 'incheon-2',
    city: '인천광역시',
    district: '중구',
    address: '중앙동 321번지',
    zipCode: '22002',
    category: 'commercial'
  },

  // 광주광역시
  {
    id: 'gwangju-1',
    city: '광주광역시',
    district: '서구',
    address: '치평동 654번지',
    zipCode: '61962',
    category: 'residential'
  },

  // 대전광역시
  {
    id: 'daejeon-1',
    city: '대전광역시',
    district: '유성구',
    address: '대학로 99',
    zipCode: '34134',
    category: 'mixed'
  },

  // 울산광역시
  {
    id: 'ulsan-1',
    city: '울산광역시',
    district: '남구',
    address: '삼산동 123번지',
    zipCode: '44776',
    category: 'residential'
  },

  // 경기도
  {
    id: 'gyeonggi-1',
    city: '경기도',
    district: '성남시',
    address: '분당구 정자동 123번지',
    zipCode: '13561',
    category: 'mixed'
  },
  {
    id: 'gyeonggi-2',
    city: '경기도',
    district: '성남시',
    address: '수정구 수진동 456번지',
    zipCode: '13120',
    category: 'residential'
  },
  {
    id: 'gyeonggi-3',
    city: '경기도',
    district: '고양시',
    address: '일산동구 백석동 789번지',
    zipCode: '10301',
    category: 'residential'
  },
  {
    id: 'gyeonggi-4',
    city: '경기도',
    district: '용인시',
    address: '기흥구 구갈동 321번지',
    zipCode: '16942',
    category: 'mixed'
  },
  {
    id: 'gyeonggi-5',
    city: '경기도',
    district: '수원시',
    address: '영통구 원천동 654번지',
    zipCode: '16489',
    category: 'residential'
  },

  // 강원도
  {
    id: 'gangwon-1',
    city: '강원도',
    district: '춘천시',
    address: '신북읍 123번지',
    zipCode: '24239',
    category: 'residential'
  },
  {
    id: 'gangwon-2',
    city: '강원도',
    district: '강릉시',
    address: '주문진읍 456번지',
    zipCode: '25457',
    category: 'mixed'
  },

  // 충청북도
  {
    id: 'chungbuk-1',
    city: '충청북도',
    district: '청주시',
    address: '상당구 789번지',
    zipCode: '28501',
    category: 'mixed'
  },

  // 충청남도
  {
    id: 'chungnam-1',
    city: '충청남도',
    district: '천안시',
    address: '동남구 321번지',
    zipCode: '31132',
    category: 'residential'
  },

  // 전라북도
  {
    id: 'jeonbuk-1',
    city: '전라북도',
    district: '전주시',
    address: '완산구 654번지',
    zipCode: '54941',
    category: 'mixed'
  },

  // 전라남도
  {
    id: 'jeonnam-1',
    city: '전라남도',
    district: '여수시',
    address: '여천동 123번지',
    zipCode: '59701',
    category: 'commercial'
  },

  // 경상북도
  {
    id: 'gyeongbuk-1',
    city: '경상북도',
    district: '포항시',
    address: '남구 456번지',
    zipCode: '37554',
    category: 'mixed'
  },

  // 경상남도
  {
    id: 'gyeongnam-1',
    city: '경상남도',
    district: '창원시',
    address: '의창구 789번지',
    zipCode: '51515',
    category: 'residential'
  },

  // 제주특별자치도
  {
    id: 'jeju-1',
    city: '제주특별자치도',
    district: '제주시',
    address: '연동 321번지',
    zipCode: '63127',
    category: 'mixed'
  },
  {
    id: 'jeju-2',
    city: '제주특별자치도',
    district: '서귀포시',
    address: '중문동 654번지',
    zipCode: '63547',
    category: 'commercial'
  },

  // 헬스장 및 운동시설 데이터 추가
  {
    id: 'gym-seoul-1',
    city: '서울특별시',
    district: '강남구',
    address: '테헤란로 123번길 45',
    zipCode: '06123',
    category: 'gym',
    type: '헬스장',
    name: '강남 피트니스 센터',
    phone: '02-1234-5678',
    rating: 4.8,
    facilities: ['웨이트 머신', '카디오 머신', '수영장', '사우나', '프리미엄 락커룸']
  },
  {
    id: 'gym-seoul-2',
    city: '서울특별시',
    district: '강남구',
    address: '역삼동 456번길 78',
    zipCode: '06124',
    category: 'gym',
    type: '크로스핏',
    name: '강남 크로스핏',
    phone: '02-2345-6789',
    rating: 4.9,
    facilities: ['크로스핏 장비', '웨이트', '카디오', '그룹 레슨']
  },
  {
    id: 'gym-seoul-3',
    city: '서울특별시',
    district: '서초구',
    address: '서초대로 789번길 12',
    zipCode: '06601',
    category: 'gym',
    type: '요가원',
    name: '서초 요가 스튜디오',
    phone: '02-3456-7890',
    rating: 4.7,
    facilities: ['요가 매트', '명상실', '프리미엄 락커룸', '샤워시설']
  },
  {
    id: 'gym-seoul-4',
    city: '서울특별시',
    district: '마포구',
    address: '홍대입구역 1번출구 앞',
    zipCode: '04039',
    category: 'gym',
    type: '헬스장',
    name: '홍대 피트니스',
    phone: '02-4567-8901',
    rating: 4.5,
    facilities: ['웨이트 머신', '카디오 머신', '그룹 레슨', '개인 트레이닝']
  },
  {
    id: 'gym-busan-1',
    city: '부산광역시',
    district: '해운대구',
    address: '해운대해변로 456번길 23',
    zipCode: '48094',
    category: 'gym',
    type: '헬스장',
    name: '해운대 피트니스',
    phone: '051-1234-5678',
    rating: 4.6,
    facilities: ['웨이트 머신', '카디오 머신', '수영장', '사우나', '바다 전망']
  },
  {
    id: 'gym-busan-2',
    city: '부산광역시',
    district: '해운대구',
    address: '중동 789번길 45',
    zipCode: '48095',
    category: 'gym',
    type: '수영장',
    name: '해운대 수영장',
    phone: '051-2345-6789',
    rating: 4.4,
    facilities: ['25m 수영장', '어린이 풀', '사우나', '수영 강습']
  },
  {
    id: 'gym-daegu-1',
    city: '대구광역시',
    district: '중구',
    address: '동성로 456번길 78',
    zipCode: '41908',
    category: 'gym',
    type: '헬스장',
    name: '대구 중앙 피트니스',
    phone: '053-1234-5678',
    rating: 4.5,
    facilities: ['웨이트 머신', '카디오 머신', '그룹 레슨', '개인 트레이닝']
  },
  {
    id: 'gym-incheon-1',
    city: '인천광역시',
    district: '연수구',
    address: '송도동 123번길 90',
    zipCode: '22001',
    category: 'gym',
    type: '필라테스',
    name: '송도 필라테스',
    phone: '032-1234-5678',
    rating: 4.8,
    facilities: ['필라테스 장비', '그룹 레슨', '개인 레슨', '프리미엄 락커룸']
  },
  {
    id: 'gym-gwangju-1',
    city: '광주광역시',
    district: '서구',
    address: '치평동 456번길 12',
    zipCode: '61962',
    category: 'gym',
    type: '태권도',
    name: '광주 태권도장',
    phone: '062-1234-5678',
    rating: 4.7,
    facilities: ['태권도 도장', '격파 연습장', '체력 단련실', '아동/성인 반']
  },
  {
    id: 'gym-daejeon-1',
    city: '대전광역시',
    district: '유성구',
    address: '대학로 123번길 45',
    zipCode: '34134',
    category: 'gym',
    type: '헬스장',
    name: '대전 유성 피트니스',
    phone: '042-1234-5678',
    rating: 4.6,
    facilities: ['웨이트 머신', '카디오 머신', '수영장', '사우나', '골프 연습장']
  },
  {
    id: 'gym-ulsan-1',
    city: '울산광역시',
    district: '남구',
    address: '삼산동 789번길 67',
    zipCode: '44776',
    category: 'gym',
    type: '복싱',
    name: '울산 복싱장',
    phone: '052-1234-5678',
    rating: 4.5,
    facilities: ['복싱 링', '샌드백', '스피드백', '체력 단련실', '그룹 레슨']
  },
  {
    id: 'gym-gyeonggi-1',
    city: '경기도',
    district: '성남시',
    address: '분당구 정자동 456번길 89',
    zipCode: '13561',
    category: 'gym',
    type: '헬스장',
    name: '분당 프리미엄 피트니스',
    phone: '031-1234-5678',
    rating: 4.9,
    facilities: ['웨이트 머신', '카디오 머신', '수영장', '사우나', '골프 연습장', '테니스장']
  },
  {
    id: 'gym-gyeonggi-2',
    city: '경기도',
    district: '고양시',
    address: '일산동구 백석동 123번길 45',
    zipCode: '10301',
    category: 'gym',
    type: '요가원',
    name: '일산 요가 스튜디오',
    phone: '031-2345-6789',
    rating: 4.7,
    facilities: ['요가 매트', '명상실', '프리미엄 락커룸', '샤워시설', '카페']
  },
  {
    id: 'gym-gangwon-1',
    city: '강원도',
    district: '춘천시',
    address: '신북읍 456번길 78',
    zipCode: '24239',
    category: 'gym',
    type: '등산로',
    name: '춘천 등산로',
    phone: '033-1234-5678',
    rating: 4.8,
    facilities: ['등산로', '휴식 공간', '전망대', '주차장', '화장실']
  },
  {
    id: 'gym-chungbuk-1',
    city: '충청북도',
    district: '청주시',
    address: '상당구 789번길 12',
    zipCode: '28501',
    category: 'gym',
    type: '테니스장',
    name: '청주 테니스장',
    phone: '043-1234-5678',
    rating: 4.6,
    facilities: ['테니스 코트', '연습장', '체력 단련실', '프로샵', '카페']
  },
  {
    id: 'gym-chungnam-1',
    city: '충청남도',
    district: '천안시',
    address: '동남구 321번길 67',
    zipCode: '31132',
    category: 'gym',
    type: '골프장',
    name: '천안 골프장',
    phone: '041-1234-5678',
    rating: 4.7,
    facilities: ['18홀 골프장', '골프 연습장', '프로샵', '레스토랑', '숙박시설']
  }
]

// 도시별로 그룹화된 주소 데이터
export const groupedAddresses = localAddresses.reduce((acc, address) => {
  if (!acc[address.city]) {
    acc[address.city] = []
  }
  acc[address.city].push(address)
  return acc
}, {} as Record<string, LocalAddress[]>)

// 도시 목록
export const cities = Object.keys(groupedAddresses).sort()

// 카테고리별 주소 필터링
export const filterAddressesByCategory = (category: LocalAddress['category']) => {
  return localAddresses.filter(address => address.category === category)
}

// 검색어로 주소 검색
export const searchAddresses = (query: string): LocalAddress[] => {
  const lowerQuery = query.toLowerCase()
  return localAddresses.filter(address => 
    address.city.toLowerCase().includes(lowerQuery) ||
    address.district.toLowerCase().includes(lowerQuery) ||
    address.address.toLowerCase().includes(lowerQuery)
  )
}
