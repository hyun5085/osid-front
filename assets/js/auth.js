// Authentication management for Car Order Tracker

const auth = {
    // Token storage keys
    ACCESS_TOKEN_KEY: 'car_tracker_access_token',
    REFRESH_TOKEN_KEY: 'car_tracker_refresh_token',
    USER_DATA_KEY: 'car_tracker_user_data',

    // Get access token from localStorage
    getToken() {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    },

    // Get refresh token from localStorage
    getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    },

    // Get user data from localStorage
    getUserData() {
        const userData = localStorage.getItem(this.USER_DATA_KEY);
        return userData ? JSON.parse(userData) : null;
    },

    // Store tokens and user data
    setAuthData(accessToken, refreshToken, userData = null) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        
        if (userData) {
            localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
        }

        // ✅ 추가 저장 dfafdsafsdafsafasfsad
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);
    },

    // Clear all auth data
    clearAuthData() {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_DATA_KEY);
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },

    // Get user role from token or stored data
    getUserRole() {
        const userData = this.getUserData();
        if (userData && userData.role) {
            return userData.role;
        }

        // Try to extract from JWT token
        const token = this.getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.role;
            } catch (error) {
                console.error('Error parsing JWT token:', error);
            }
        }

        return null;
    },

    // Get user ID
    getUserId() {
        const userData = this.getUserData();
        if (userData && userData.id) {
            return userData.id;
        }

        // Try to extract from JWT token
        const token = this.getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.id;
            } catch (error) {
                console.error('Error parsing JWT token:', error);
            }
        }

        return null;
    },

    // Get user email
    getUserEmail() {
        const userData = this.getUserData();
        if (userData && userData.email) {
            return userData.email;
        }

        // Try to extract from JWT token
        const token = this.getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.sub; // Subject is typically the email
            } catch (error) {
                console.error('Error parsing JWT token:', error);
            }
        }

        return null;
    },

    // Get user name
    getUserName() {
        const userData = this.getUserData();
        if (userData && userData.name) {
            return userData.name;

        }

        // Try to extract from JWT token
        const token = this.getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.name){
                    return payload.name;
                }
            } catch (error) {
                console.error('Error parsing JWT token:', error);
            }
        }

        return 'User';
    },

    // Login function
    async login(credentials) {
        try {
            const response = await api.auth.login(credentials);
            console.log('login response:', response);

            if (response && response.data) {
                const { accessToken, refreshToken } = response.data;
                console.log('accessToken:', accessToken);
                console.log('refreshToken:', refreshToken);

                if (!accessToken || !refreshToken) {
                    console.error('로그인 응답에 토큰이 없습니다!');
                    return false;
                }

                // ─────────────── 수정된 디코딩 로직 ───────────────
                // 1) base64url → 표준 base64
                const base64Url = accessToken.split('.')[1];
                const base64    = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                // 2) atob로 디코딩 → Latin-1 바이너리 문자열
                const binary    = atob(base64);
                // 3) 바이트 배열로 변환
                const bytes     = Uint8Array.from(binary, ch => ch.charCodeAt(0));
                // 4) UTF-8로 디코딩
                const utf8json  = new TextDecoder('utf-8').decode(bytes);
                // 5) JSON 파싱
                const payload   = JSON.parse(utf8json);
                console.log('▶️ decoded payload.name:', payload.name);
                // ──────────────────────────────────────────────────


                const userData = {
                    id: payload.id,
                    email: payload.sub,
                    name: payload.name,
                    role: payload.role
                };

                this.setAuthData(accessToken, refreshToken, userData);
                localStorage.setItem('isLoggedIn', 'true');
                // 저장됐는지 확인
                console.log('localStorage access token:', localStorage.getItem(this.ACCESS_TOKEN_KEY));

                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            utils.showToast('Login failed. Please check your credentials.', 'error');
            return false;
        }
    },


    // Logout function
    async logout() {
        try {
            // Call logout API if refresh token exists
            if (this.getRefreshToken()) {
                await api.auth.logout();
            }
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Clear local storage regardless of API call result
            this.clearAuthData();
            utils.showToast('Logged out successfully', 'info');
            
            // Redirect to login page
            app.router.navigate('login');
        }
    },

    // Refresh access token
    async refreshAccessToken() {
        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                return false;
            }

            const response = await api.auth.refreshToken();
            
            if (response && response.data) {
                const newAccessToken = response.data;
                
                // Update access token in localStorage
                localStorage.setItem(this.ACCESS_TOKEN_KEY, newAccessToken);
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            // If refresh fails, logout user
            this.logout();
            return false;
        }
    },

    // Check if token is expired
    isTokenExpired(token = null) {
        const tokenToCheck = token || this.getToken();
        if (!tokenToCheck) return true;

        try {
            const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    },

    // Auto-refresh token before expiration
    setupTokenRefresh() {
        const token = this.getToken();
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();
            const timeUntilExpiration = expirationTime - currentTime;
            
            // Refresh token 2 minutes before expiration
            const refreshTime = Math.max(timeUntilExpiration - (2 * 60 * 1000), 0);
            
            if (refreshTime > 0) {
                setTimeout(async () => {
                    const success = await this.refreshAccessToken();
                    if (success) {
                        // Setup next refresh
                        this.setupTokenRefresh();
                    }
                }, refreshTime);
            }
        } catch (error) {
            console.error('Error setting up token refresh:', error);
        }
    },

    // Initialize authentication
    init() {
        // Setup token refresh if user is logged in
        if (this.isAuthenticated() && !this.isTokenExpired()) {
            this.setupTokenRefresh();
        } else if (this.isAuthenticated() && this.isTokenExpired()) {
            // Try to refresh expired token
            this.refreshAccessToken().then(success => {
                if (success) {
                    this.setupTokenRefresh();
                } else {
                    this.logout();
                }
            });
        }
    },

    // Check if user has specific role
    hasRole(role) {
        const userRole = this.getUserRole();
        return userRole === role;
    },

    // Check if user has any of the specified roles
    hasAnyRole(roles) {
        const userRole = this.getUserRole();
        return roles.includes(userRole);
    },

    // Route guard for authentication
    requireAuth() {
        if (!this.isAuthenticated()) {
            app.router.navigate('login');
            return false;
        }
        return true;
    },

    // Route guard for specific roles
    requireRole(requiredRoles) {
        if (!this.requireAuth()) {
            return false;
        }

        const userRole = this.getUserRole();
        const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
        
        if (!rolesArray.includes(userRole)) {
            utils.showToast('Access denied. Insufficient permissions.', 'error');
            app.router.navigate('dashboard');
            return false;
        }

        return true;
    }
};

// 페이지 로드 시 자동 실행
(function() {
    // 0) 유효한 토큰이 아니면 무조건 초기화 (이 라인이 가장 먼저 와야 합니다)
    if (!auth.isAuthenticated() || auth.isTokenExpired()) {
        auth.clearAuthData();
    }

    // 1) 토큰이 있으면 자동 갱신 타이머 세팅
    auth.init();

    // 2) 로그인 상태 재계산 (토큰 있고 만료 안됐을 때만 true)
    const isLoggedIn = auth.isAuthenticated() && !auth.isTokenExpired();

    // 3) 로그인 버튼과 드롭다운 토글
    document.getElementById('loginBtn')?.classList.toggle('d-none', isLoggedIn);
    const dd = document.getElementById('userDropdownSection');
    if (dd) {
        dd.classList.toggle('d-none', !isLoggedIn);
        if (isLoggedIn) {
            document.getElementById('userDisplayName').textContent = auth.getUserName();
        }
    }

    // 4) 로그아웃 메뉴 클릭 시
    document.querySelector('#userDropdownSection .dropdown-item[href="#"]')?.addEventListener('click', e => {
        e.preventDefault();
        if (confirm('로그아웃 하시겠습니까?')) {
            auth.clearAuthData();
            location.reload();
        }
    });

    // 5) 마이페이지 버튼 클릭 시
    document.querySelector('#userDropdownSection a[onclick^="openMyPage"]')?.addEventListener('click', e => {
        e.preventDefault();
        const role = auth.getUserRole();
        const map = {
            USER: 'views/user-mypage.html',
            DEALER: 'views/dealer-mypage.html',
            MASTER: 'views/my-page.html'
        };
        if (map[role]) {
            window.location.href = map[role];
        } else {
            alert('로그인이 필요합니다.');
        }
    });
})();

