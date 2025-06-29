# Car Order Tracker - Frontend

## Overview

This is a modern, responsive web application for tracking car orders and managing automotive dealership operations. The application provides a comprehensive multi-role dashboard system serving customers, dealers, and administrators with role-based access control and functionality.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Built with vanilla JavaScript using a custom routing system
- **Multi-Role Dashboard**: Dynamic interface adaptation based on user roles (USER, DEALER, MASTER)
- **Component-Based Structure**: Modular view system with reusable components
- **Responsive Design**: Mobile-first approach using Bootstrap 5 with dark theme

### Authentication System
- **JWT-based Authentication**: Secure token-based authentication with refresh token support
- **Role-Based Access Control**: Three-tier user system with different permissions
- **Client-Side Token Management**: Secure token storage and automatic refresh handling
- **Session Management**: Automatic logout on token expiration

### API Integration
- **RESTful API**: Full integration with Spring Boot backend
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during API operations
- **Token Refresh**: Automatic token refresh on API calls

## Key Components

### 1. Authentication Module (`assets/js/auth.js`)
- **Purpose**: Manages user authentication and authorization
- **Key Features**: JWT token management, role-based access, session handling
- **Security**: Secure token storage with automatic cleanup

### 2. API Module (`assets/js/api.js`)
- **Purpose**: Handles all backend communication
- **Key Features**: Centralized API calls, error handling, token refresh
- **Architecture**: Promise-based with automatic retry logic

### 3. Router System (`assets/js/app.js`)
- **Purpose**: Client-side routing with role-based access control
- **Key Features**: Dynamic navigation, route protection, view loading
- **Security**: Role-based route access validation

### 4. Dashboard System (`assets/js/dashboard.js`)
- **Purpose**: Role-specific dashboard management
- **Key Features**: Dynamic dashboard loading, statistics display, action buttons
- **Flexibility**: Modular design for easy role customization

### 5. Utility Functions (`assets/js/utils.js`)
- **Purpose**: Common utility functions and UI helpers
- **Key Features**: Toast notifications, loading states, data formatting
- **User Experience**: Consistent feedback and loading states

### 6. View Templates
- **Login/Signup**: User authentication forms
- **Dashboards**: Role-specific dashboards (user, dealer, master)
- **Management Views**: Cars, orders, models, options, users, dealers
- **Profile**: User profile management

## Data Flow

### Authentication Flow
1. User submits credentials through login form
2. API validates credentials and returns JWT tokens
3. Tokens stored securely in localStorage
4. User redirected to appropriate dashboard based on role
5. All subsequent API calls include JWT token in Authorization header

### Navigation Flow
1. User navigates through custom router system
2. Router validates user authentication and role permissions
3. Appropriate view loaded and rendered
4. Navigation menu updated based on user role

### API Communication Flow
1. API calls initiated through centralized API module
2. Automatic token inclusion in request headers
3. Error handling with user-friendly messages
4. Automatic token refresh on 401 responses
5. Loading states managed throughout the process

## External Dependencies

### Frontend Libraries
- **Bootstrap 5**: Responsive UI framework with dark theme support
- **Font Awesome 6.4.0**: Icon library for consistent iconography
- **Bootstrap Agent Dark Theme**: Custom dark theme for Bootstrap

### Backend Dependencies
- **Spring Boot Backend**: RESTful API server (separate repository)
- **JWT Authentication**: Token-based authentication system
- **Database**: Backend handles data persistence

## Deployment Strategy

### Frontend Deployment
- **Static File Hosting**: Can be deployed to any static hosting service
- **CDN Integration**: Uses CDN for Bootstrap and Font Awesome
- **Environment Configuration**: API base URL auto-detection for different environments

### Backend Integration
- **Development**: Configured for localhost:8000 backend
- **Production**: Automatic detection of production environment
- **Cross-Origin Requests**: Proper CORS handling for API communication

### Security Considerations
- **Token Storage**: Secure localStorage implementation
- **Route Protection**: Client-side route guards
- **Input Validation**: Form validation and sanitization
- **Error Handling**: Secure error messages without sensitive data exposure

## Changelog

Changelog:
- June 27, 2025. Initial setup
- June 27, 2025. Main page redesigned with modern Korean automotive dealer theme
- June 27, 2025. Implemented login modal and role-based dashboards
- June 27, 2025. Added car showcase with auto-carousel functionality

## Recent Changes

### OSID Branding Update (June 27, 2025)
- Updated all navigation headers and footers with OSID branding
- Changed header background to black (rgba(0,0,0,0.9))
- Replaced "프리미어" text with actual OSID logo image in navigation
- Updated footer to display "OSID" instead of "프리미어 신차 전문점"
- Applied consistent black background styling across all pages
- Unified branding between main page and car catalog page
- Added OSID logo image file (assets/images/osid-logo.png)
- Added clickable logo navigation (returns to homepage)
- Unified navigation structure across all pages (removed redundant "홈" menu item)
- Fixed login modal functionality in car catalog page
- Added demo login system to car catalog page with role-based dashboard navigation

### Main Page Redesign (June 27, 2025)
- Redesigned homepage with modern Korean automotive dealer styling
- Added hero section with car showcase and auto-rotating carousel
- Implemented transparent navigation overlay with user icon login
- Added service feature cards section and call-to-action
- Integrated demo authentication system with role-based access

### Technical Updates (June 27, 2025)
- Simplified Flask server configuration for static file serving
- Resolved port configuration issues (server running on port 5000)
- Added demo login system with localStorage persistence
- Implemented role-specific dashboard loading (USER/DEALER/MASTER)
- Created infinite loop car carousel with smooth slide transitions
- Disabled auto-carousel for better user experience
- Implemented proper left-to-right continuous sliding animation

### June 28, 2025 Updates
- **딜러 주문 생성 모달 시스템 구현:**
  - 실제 백엔드 DTO 구조에 정확히 맞춘 주문 생성 폼 (Add DTO)
  - 필수 필드: userEmail (String), option (List<Long>), modelId (Long), address (String)
  - 등록된 모델 목록 자동 로드 (GET /api/model) - 드롭다운으로 모델명/카테고리/가격 표시
  - 등록된 옵션 목록 체크박스 다중 선택 시스템 (GET /api/option)
  - 옵션 체크박스: 이름, ID, 가격, 설명 정보 표시
  - 전체 선택/해제 버튼, 실시간 선택 옵션 개수 및 총 가격 표시
  - 사용자 친화적 드롭다운 모델 선택 및 체크박스 옵션 선택 인터페이스
  - 폼 검증, 오류 처리, 성공 시 주문 목록 자동 새로고침 기능 포함
  - 다크 테마 일관성 유지한 직관적 모달 디자인
- **로컬 테스트용 정리 (June 28, 2025):**
  - 모든 데모 데이터 및 모크 데이터 제거
  - 실제 백엔드 API 연결만 유지 (localhost:8000)
  - 깔끔한 API 모듈로 중앙집중식 관리
  - 로컬 환경에서 Spring Boot 백엔드와 연동 준비
  - 불필요한 데모 로그인 버튼 제거, 실제 인증 폼만 유지
- Removed dashboard redirect system - login now maintains main page visibility
- Fixed Hero Section disappearing after login issue
- Simplified Features Section to 4 core items: 모델, 구매 상담, 신차 혜택, 전시장 찾기
- Enhanced navigation bar to show username after login with logout functionality
- Applied card design with rounded borders to both car showcase and features sections
- Added realistic car images from Unsplash for better visual presentation
- Repositioned navigation buttons outside the car showcase card for improved UX
- Updated car showcase data to match Model Entity fields (seats, category, price)
- Implemented vehicle category filtering system (전체, SUV, 세단, 쿠페, 해치백)
- Added dropdown navigation menus for 구매/이벤트 and 브랜드 sections
- Created comprehensive brand introduction page with company values, history, and awards
- Created news & updates page with featured articles, recent news, and press releases
- Updated all pages (index.html, cars.html, brand-intro.html, news.html) with consistent dropdown navigation
- Created comprehensive events page with filter tabs, event cards, and CTA section
- Redesigned news page as dashboard-style management interface with statistics and tables
- Created consultation page with 4-step process flow and professional layout
- Connected all navigation links across pages for seamless user experience
- **Navigation Consistency Update**: Unified navigation bar design across all pages to match main page styling
  - Applied transparent overlay navigation with blur effect to Master Dashboard (my-page.html)
  - Simplified Master dropdown to only show "마이페이지" and "로그아웃" options
  - Maintained consistent logo, search box, and dropdown menu styling throughout application
- **Backend API Alignment**: Aligned frontend features with actual backend API specifications
  - Removed dealer approval request section (no corresponding API endpoint)
  - Updated statistics cards: "매출 현황" and "신규 가입" marked as "기능 개발 중"
  - Modified "실시간 주문 현황" to show "기능 개발 중" status
  - Confirmed dealer management uses Master's own dealers via GET /api/masters/me
  - Removed FailedEvent deletion functionality (only retry API available)
  - Dealer management shows only Master's assigned dealers with proper role-based status
- **Fixed Model Registration with Actual Backend DTO Structure:**
  - Updated Model registration form to match actual backend Model entity
  - Corrected Model DTO fields: name, color (ModelColor enum), description, image, category (ModelCategory enum), seatCount, price
  - Removed incorrect fields: make, year, engineType, transmission, status
  - Updated API endpoints to use `/api/model` instead of `/api/masters/car-models`
  - Applied actual ModelColor enum values: RED, BLUE, WHITE, BLACK, SILVER, GRAY
  - Applied actual ModelCategory enum values: SEDAN, SUV, ELECTRIC, HYBRID
  - Form validation updated for correct data types (seatCount as String, price as Long)
- **Enhanced signup system to match exact backend DTO structures:**
  - Role selection modal: USER/DEALER/MASTER choice before signup
  - USER DTO: email, password, name, dateOfBirth, phoneNumber, address
  - DEALER DTO: email, password, name, phoneNumber, masterEmail
  - MASTER DTO: businessNumber, name, phoneNumber, email, password
  - Added proper validation patterns for phone numbers (010-xxxx-xxxx) and passwords
  - Added business number validation for Master signup (XXX-XX-XXXXX format)
- **User dropdown menu system implementation:**
  - Login state management with dropdown showing username
  - Dropdown options: 마이페이지 and 로그아웃 functionality
  - Seamless transition between login button and user dropdown
- **Master Dashboard (My Page) creation:**
  - Created comprehensive Master Dashboard based on provided design mockup
  - Features: Statistics cards, dealer approval requests, real-time orders, system logs
  - Advanced UI with glassmorphism effects and dark theme consistency
  - Integrated system management tools and quick actions
  - **Backend API Integration Ready:**
    - Structured API endpoints matching Spring Boot entity relationships
    - JWT authentication headers for secure API calls
    - Environment-aware API base URL configuration
    - Graceful error handling with connection status indicators
    - Real entity mappings: Master, Dealer, User, Order, CarModel structures
    - Ready for backend deployment with proper DTO integration
  - **Car Order Tracker Specific Master Features:**
    - Car model registration system matching backend CarModel entity
    - Dealer approval workflow with pending requests management
    - User management with role-based access (USER/DEALER/MASTER)
    - Order tracking and payment status monitoring
    - Statistics dashboard with real-time data display
    - Simplified navigation focused on core car ordering functionality
    - Integration ready for Spring Boot backend with proper API endpoints
- **Completed Option Registration System (June 28, 2025):**
  - Added Option registration modal with exact backend OptionCategory enum values
  - Implemented all 20 real OptionCategory enum options: NAVIGATION, SUNROOF, HEATED_SEATS, VENTILATED_SEATS, LEATHER_SEATS, PARKING_SENSOR, REAR_CAMERA, CRUISE_CONTROL, BLIND_SPOT_MONITOR, LANE_KEEP_ASSIST, ADAPTIVE_HEADLIGHTS, AUTO_PARKING, HEAD_UP_DISPLAY, WIRELESS_CHARGER, BOSE_SOUND_SYSTEM, AWD, SMART_KEY, POWER_TAILGATE, DASHCAM, REMOTE_START
  - Option registration form matches backend Option entity: name, description, image, category, price
  - Added Korean display names for all option categories
  - Implemented dealer management table with actual backend structure: name, branch, phoneNumber, email, role, createdAt
  - Updated dealer table headers to match backend fields (removed businessNumber, added branch)
  - Added dealer approval/rejection functionality with role-based status management
  - **Corrected ModelCategory enum to actual backend values: SEDAN, SUV, ELECTRIC, HYBRID**
  - **Added FailedEvent Management System:**
    - Implemented FailedEvent monitoring with actual backend FailedEventType enum: MY_CAR, EMAIL
    - Added failed event statistics dashboard with retry count tracking
    - Individual and bulk retry functionality for failed events
    - Event type filtering (MY_CAR vs EMAIL events)
    - Failed event deletion and cleanup tools
    - Real-time error message display with detailed logging
  - **Enhanced Dealer Management with Branch enum and Status Control:**
    - Implemented unified dealer management in single table with status filtering
    - Dealer status management: APPROVED, PENDING, REJECTED, SUSPENDED with color-coded badges
    - Added Branch enum with all Korean regions: SEOUL, BUSAN, DAEGU, INCHEON, GWANGJU, DAEJEON, ULSAN, GYEONGGI, GANGWON, CHUNGBUK, CHUNGNAM, JEONBUK, JEONNAM, GYEONGBUK, GYEONGNAM, JEJU
    - Status change modal with backend DealerRoleChangeRequestDto: {dealerEmail, role}
    - Branch change modal with backend DealerBranchChangeRequestDto: {dealerEmail, branch}
    - Single table approach with status filter dropdown for simplified management
    - Master의 소속 딜러 조회: GET /api/masters/me (Master 정보 + dealerList 포함)
    - API endpoints: PATCH /api/dealers/role, PATCH /api/dealers/branch
    - 백엔드 DealerInfoResponseDto 구조에 맞춘 데이터 매핑 (role → status)
  - All enum values now match actual Spring Boot backend implementation exactly
- **Master License Management System (June 28, 2025):**
  - Implemented First Master (1번 가입자) exclusive license control system
  - Only admin@test.com (first Master) can view, assign, and revoke licenses
  - License pool management: AVAILABLE licenses can be assigned to new Masters
  - License assignment workflow: First Master assigns licenses to new Master signups via email
  - License status tracking: AVAILABLE, ASSIGNED, EXPIRED, REVOKED states
  - License revocation: First Master can revoke licenses from other Masters
  - Access control: Non-first Masters see "라이센스 관리 권한 없음" message
  - Backend API integration: /api/license/list, /api/license/assign, /api/license/revoke
  - Email-based license assignment for new Master registration workflow
- **Dealer MyPage System (June 28, 2025):**
  - Created dedicated dealer dashboard (views/dealer-mypage.html) based on backend API structure
  - Integrated with `/api/dealers/me` endpoint for profile management
  - Profile section: name, email, phone, branch, master email, creation date, role status
  - Statistics dashboard: total sales, revenue, customers, pending orders
  - Recent orders management with status tracking (PENDING, PROCESSING, COMPLETED, CANCELLED)
  - Customer management table with contact and purchase history
  - Profile editing functionality with PUT `/api/dealers/me` integration
  - Quick actions: order management, customer management, car catalog, sales reports
  - Branch enum integration with Korean display names for all 16 regions
  - Responsive dark-themed UI matching overall application design
  - Role-based navigation with dealer-specific dropdown menu options
- **User MyPage System (June 28, 2025):**
  - Created comprehensive user dashboard (views/user-mypage.html) based on backend `/api/users/me` endpoint
  - User profile management: name, email, phone, dateOfBirth, address, creation date
  - Statistics dashboard: total orders, owned cars, pending orders, wishlist count
  - Recent orders table with model, date, status, amount, assigned dealer information
  - Personal car collection management with purchase history and ownership status
  - Profile editing functionality with PUT `/api/users/me` integration
  - Quick actions: order tracking, car management, vehicle search, wishlist management
  - Unified blue color scheme matching Master/Dealer dashboards for consistency
  - User-specific features: car ownership tracking, purchase history, wishlist functionality
  - Backend DTO alignment: UserInfoResponseDto structure with proper field mapping

## User Preferences

Preferred communication style: Simple, everyday language.
Main page design: Modern automotive dealer theme with Korean branding ("프리미어")
Authentication: Demo system with predefined roles for testing
Development approach: Follow user instructions exactly, avoid making arbitrary changes