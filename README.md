# Healthcare B2B 입찰 플랫폼

의료 기관과 공급업체를 연결하는 B2B 입찰 플랫폼입니다. 의료 기관(구매자)이 프로젝트를 등록하면 공급업체(판매자)가 입찰을 제출하고, 구매자가 최적의 입찰을 선택할 수 있는 투명한 시스템을 제공합니다.

## 🚀 기술 스택

### Frontend
- **Next.js 15** - React 기반 풀스택 프레임워크
- **React 19** - 사용자 인터페이스 라이브러리
- **TypeScript** - 타입 안정성을 위한 JavaScript 슈퍼셋
- **Chakra UI v3** - 모던 컴포넌트 라이브러리
- **Tailwind CSS v4** - 유틸리티 우선 CSS 프레임워크

### Backend & Database
- **Supabase** - PostgreSQL 기반 BaaS (인증, 데이터베이스, 실시간 구독)
- **Next.js API Routes** - 서버리스 API 엔드포인트

### 라이브러리
- **React Hook Form** - 폼 상태 관리
- **Zod** - 스키마 검증 및 타입 추론
- **Resend** - 이메일 전송 서비스
- **xlsx** - 엑셀 파일 생성 (입찰 비교 내보내기)
- **React Icons** - 아이콘 라이브러리

## 📋 주요 기능

### 사용자 타입
- **Type A (구매자/의료기관)**
  - 프로젝트 생성 및 관리
  - 입찰 비교 및 선택
  - 엑셀로 입찰 내역 내보내기
  
- **Type B (공급업체/판매자)**
  - 프로젝트 검색 및 조회
  - 입찰 제출 및 수정
  - 입찰 상태 추적

### 핵심 기능
- 🔐 Supabase 기반 인증 시스템
- 📊 실시간 입찰 현황 대시보드
- 📧 이메일 알림 (새 프로젝트, 입찰 제출, 선정 알림)
- 📱 반응형 디자인
- 🔒 Row Level Security를 통한 데이터 보안

## 🛠️ 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/healthcare-b2b-platform.git
cd healthcare-b2b-platform
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정 (선택사항)

#### 목업 모드 (Supabase 없이 실행)
환경 변수 설정 없이 바로 실행 가능합니다. 자동으로 목업 데이터를 사용합니다.

**테스트 계정:**
- 구매자(Type A): `buyer@example.com` / 아무 비밀번호
- 공급업체(Type B): `supplier@example.com` / 아무 비밀번호

#### 실제 Supabase 연동
`.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend 이메일 설정
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# 앱 URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 데이터베이스 설정 (Supabase 사용 시)
Supabase 대시보드의 SQL Editor에서 `supabase/schema.sql` 파일의 내용을 실행하여 테이블과 RLS 정책을 생성합니다.

### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

## 📦 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
```

### 프로덕션 서버 실행
```bash
npm run start
```

### Vercel 배포 (권장)
```bash
vercel
```

## 📁 프로젝트 구조

```
healthcare-b2b-platform/
├── app/
│   ├── api/              # API 라우트
│   ├── auth/             # 인증 페이지
│   ├── dashboard/        # 대시보드 페이지
│   │   ├── buyer/        # 구매자 전용 페이지
│   │   └── supplier/     # 공급업체 전용 페이지
│   ├── layout.tsx        # 루트 레이아웃
│   └── page.tsx          # 홈페이지
├── components/           # 재사용 가능한 컴포넌트
├── lib/                  # 유틸리티 및 설정
│   ├── supabase/        # Supabase 클라이언트
│   └── email/           # 이메일 템플릿
├── types/               # TypeScript 타입 정의
├── supabase/            # 데이터베이스 스키마
└── middleware.ts        # Next.js 미들웨어
```

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# ESLint 실행
npm run lint
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.