// API communication layer for Car Order Tracker
const api = {
    baseURL: `https://13.124.64.18:8080`,

    // Default headers
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (includeAuth) {
            const token = auth.getToken();
            console.log('API 호출 시 토큰:', token);
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    },


    // Generic request method
    async request(endpoint, options = {}) {
        try {
            if (typeof utils !== 'undefined') utils.showLoading();
            
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                ...options,
                mode: 'cors',              // ← 여기
                credentials: 'include',    // ← 여기 (쿠키·세션 없더라도 CORS 모드 활성화)
                headers: {
                    ...this.getHeaders(options.includeAuth !== false),
                    ...options.headers
                }
            };

            const response = await fetch(url, config);
            
            // Handle token refresh if access token expired
            if (response.status === 401 && auth.getRefreshToken()) {
                const refreshSuccess = await auth.refreshAccessToken();
                if (refreshSuccess) {
                    // Retry the original request with new token
                    config.headers['Authorization'] = `Bearer ${auth.getToken()}`;
                    const retryResponse = await fetch(url, config);
                    return await this.handleResponse(retryResponse);
                } else {
                    auth.logout();
                    return null;
                }
            }

            return await this.handleResponse(response);
        } catch (error) {
            console.error('API request failed:', error);
            if (typeof utils !== 'undefined') utils.showToast('네트워크 오류가 발생했습니다.', 'error');
            throw error;
        } finally {
            if (typeof utils !== 'undefined') utils.hideLoading();
        }
    },



    // Handle API response
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            
            if (!response.ok) {
                const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
                utils.showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }
            
            return data;
        } else {
            if (!response.ok) {
                const errorText = await response.text();
                const errorMessage = errorText || `HTTP error! status: ${response.status}`;
                utils.showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }
            
            return await response.text();
        }
    },

    // Authentication endpoints
    auth: {
        login: (credentials) => api.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
            includeAuth: false
        }),

        logout: () => api.request('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Refresh-Token': auth.getRefreshToken()
            }
        }),

        refreshToken: () => api.request('/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Refresh-Token': auth.getRefreshToken()
            },
            includeAuth: false
        })
    },

    // User management
    users: {
        signup: (userData) => api.request('/api/users/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
            includeAuth: false
        }),

        getProfile: () => api.request('/api/users/me'),

        updateProfile: (userData) => api.request('/api/users/me', {
            method: 'PUT',
            body: JSON.stringify(userData)
        }),

        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return api.request(`/api/users${queryString ? '?' + queryString : ''}`);
        },

        getById: (id) => api.request(`/api/users/${id}`),

        update: (id, userData) => api.request(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        }),

        delete: (id) => api.request(`/api/users/${id}`, {
            method: 'DELETE'
        })
    },

    // Dealer management
    dealers: {
        signup: (dealerData) => api.request('/api/dealers/signup', {
            method: 'POST',
            body: JSON.stringify(dealerData),
            includeAuth: false
        }),

        getProfile: () => api.request('/api/dealers/me'),

        updateProfile: (dealerData) => api.request('/api/dealers/me', {
            method: 'PUT',
            body: JSON.stringify(dealerData)
        }),

        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return api.request(`/api/dealers${queryString ? '?' + queryString : ''}`);
        },

        getById: (id) => api.request(`/api/dealers/${id}`),

        update: (id, dealerData) => api.request(`/api/dealers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dealerData)
        }),

        updateRole: (id, role) => api.request(`/api/dealers/role`, {
            method: 'PATCH',
            body: JSON.stringify({ dealerId: id, role })
        }),

        updateBranch: (id, branch) => api.request(`/api/dealers/branch`, {
            method: 'PATCH',
            body: JSON.stringify({ dealerId: id, branch })
        }),

        delete: (id) => api.request(`/api/dealers/${id}`, {
            method: 'DELETE'
        })
    },

    // Master management
    masters: {
        signup: (masterData) => api.request('/api/masters/signup', {
            method: 'POST',
            body: JSON.stringify(masterData),
            includeAuth: false
        }),

        getProfile: () => api.request('/api/masters/me'),

        updateProfile: (masterData) => api.request('/api/masters/me', {
            method: 'PUT',
            body: JSON.stringify(masterData)
        }),

        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return api.request(`/api/masters${queryString ? '?' + queryString : ''}`);
        }
    },

    // Car model management
    models: {
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return api.request(`/api/model${queryString ? '?' + queryString : ''}`);
        },

        getById: (id) => api.request(`/api/model/${id}`),

        create: (modelData) => api.request('/api/model', {
            method: 'POST',
            body: JSON.stringify(modelData)
        }),

        update: (id, modelData) => api.request(`/api/model/${id}`, {
            method: 'PUT',
            body: JSON.stringify(modelData)
        }),

        delete: (id) => api.request(`/api/model/${id}`, {
            method: 'DELETE'
        })
    },

    // Option management
    options: {
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return api.request(`/api/option${queryString ? '?' + queryString : ''}`);
        },

        getById: (id) => api.request(`/api/option/${id}`),

        create: (optionData) => api.request('/api/option', {
            method: 'POST',
            body: JSON.stringify(optionData)
        }),

        update: (id, optionData) => api.request(`/api/option/${id}`, {
            method: 'PUT',
            body: JSON.stringify(optionData)
        }),

        delete: (id) => api.request(`/api/option/${id}`, {
            method: 'DELETE'
        })
    },

    // My Car management (for users)
    myCars: {
        getAll: () => api.request('/api/myCar'),

        getById: (id) => api.request(`/api/myCar/${id}`),

        create: (carData) => api.request('/api/myCar', {
            method: 'POST',
            body: JSON.stringify(carData)
        }),

        update: (id, carData) => api.request(`/api/myCar/${id}`, {
            method: 'PUT',
            body: JSON.stringify(carData)
        }),

        delete: (id) => api.request(`/api/myCar/${id}`, {
            method: 'DELETE'
        })
    },

    // Order management (assuming this endpoint exists based on the system)
    orders: {
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return api.request(`/api/orders${queryString ? '?' + queryString : ''}`);
        },

        getById: (id) => api.request(`/api/orders/${id}`),

        create: (orderData) => api.request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        }),

        update: (id, orderData) => api.request(`/api/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(orderData)
        }),

        updateStatus: (id, status) => api.request(`/api/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),

        delete: (id) => api.request(`/api/orders/${id}`, {
            method: 'DELETE'
        })
    },

    // ML Prediction endpoint
    mlPredict: (data) => api.request('/api/my-ml-predict', {
        method: 'POST',
        body: JSON.stringify(data),
        includeAuth: false
    })
};
