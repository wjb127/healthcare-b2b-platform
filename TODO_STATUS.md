# 헬스케어 B2B 플랫폼 구현 상태 체크리스트

## 1. 사용자 관리 (User Management)
- [x] 회원가입 폼 구현 (`app/auth/signup/page.tsx`, `components/auth/SignUpForm.tsx`)
- [x] 로그인/데모 로그인 구현 (`app/auth/login/page.tsx`, `components/auth/LoginForm.tsx`, `contexts/AuthContext.tsx`)
- [x] 역할 구분 및 대시보드 라우팅 (A/B에 따라 리디렉션) (`contexts/AuthContext.tsx`, `components/layout/DashboardLayout.tsx`)
- [x] 기본 프로필 필드 및 업데이트 인터페이스 (`contexts/AuthContext.tsx`의 `updateProfile`)
- [ ] 이메일 인증 실제 처리(데모 메시지/리디렉션만 존재) (`app/auth/verify-email/page.tsx`)

## 2. 비딩 요청 (Bidding Request)
- [x] 프로젝트 등록 폼 (제목/설명/예산/마감일) (`app/dashboard/buyer/projects/new/page.tsx`)
- [x] 프로젝트 목록/통계 대시보드 (`app/dashboard/buyer/page.tsx`)
- [ ] 요청서 파일 업로드 (미구현)
- [ ] 분야/지역/필요조건 필드 (미구현: 현재 title/description/budget/deadline만)
- [ ] 마감 자동 상태 전환/검증 로직 (미구현: 수동 상태값)

## 3. 비딩 응찰 (Bidding Proposal)
- [x] 요청서 열람 및 응찰 제출 (금액/기간/제안) (`app/dashboard/supplier/projects/[id]/page.tsx` → `useData().createBid`)
- [x] 응찰 내역 대시보드/상태 표시 (`app/dashboard/supplier/page.tsx`)
- [ ] 동일 프로젝트 중복 응찰 방지 서버 검증 (프론트에서만 확인)
- [ ] 프로젝트 상태에 따른 응찰 제한의 강제성(프론트 검증만 존재)

## 4. 비교 기능 (Comparison Feature)
- [x] A 사용자가 B의 응찰 조건(금액/기간/코멘트) 비교/열람 (`app/dashboard/buyer/projects/[id]/page.tsx`)
- [x] 입찰 목록 비교 표 (업체/금액/기간/코멘트/상태) (`app/dashboard/buyer/projects/[id]/page.tsx`)
- [x] 엑셀 다운로드 기능 (xlsx) (`app/dashboard/buyer/projects/[id]/page.tsx`)
- [ ] 가중치/정렬/필터 등 고급 비교(미구현)

## 5. 알림 (Notifications)
- [ ] 요청/응찰 시 이메일 발송 API 라우트 (미구현: `app/api/email/route.ts` 부재)
- [ ] 실제 발송 연동 및 트리거 (미구현: `backup-supabase/email/resend.ts`만 존재, 사용처 없음)

## 6. 인프라/상태 관리
- [x] 데모 상태 저장/조회 컨텍스트 (`contexts/DataContext.tsx`)
- [x] 인증 데모 컨텍스트/리디렉션/로컬스토리지 세션 (`contexts/AuthContext.tsx`)
- [x] 전역 Provider 적용 (`app/providers.tsx`, `app/layout.tsx`)

---
권장 후속 작업
- 사용자 관리: 실제 인증/이메일 인증 연동(Supabase/Auth0/NextAuth 등), 비밀번호 정책/재설정 플로우 추가
- 비딩 요청: 파일 업로드(Storage/S3) + 메타데이터(분야/지역/필요조건) 스키마 확장, 마감일 기반 자동 상태 전환 크론/웹훅
- 비딩 응찰: 서버 측 중복 제출 방지/권한 검증, 마감 이후 차단 백엔드 로직, 입찰 수정/철회 플로우
- 비교 기능: 정렬/필터/하이라이트, 가중치 점수화(금액/기간/평가항목), PDF/CSV 내보내기
- 알림: `app/api/email/route.ts` 구현 후 프로젝트 생성/응찰 제출 시 트리거, Resend/SES 설정 값 주입 및 시크릿 관리
- 데이터 지속화: 현재 메모리 컨텍스트 → DB(Supabase/Postgres) 마이그레이션 및 API 레이어 추가
