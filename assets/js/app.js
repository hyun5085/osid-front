// Main application controller for Car Order Tracker

const app = {
    // Application state
    currentView: null,
    
    // Router for handling navigation
    router: {
        routes: {
            'login': { 
                view: 'views/login.html', 
                requireAuth: false,
                allowedRoles: []
            },
            'signup': { 
                view: 'views/signup.html', 
                requireAuth: false,
                allowedRoles: []
            },
            'dashboard': { 
                view: null, // Handled by dashboard.js
                requireAuth: true,
                allowedRoles: ['USER', 'DEALER', 'MASTER']
            },
            'profile': { 
                view: 'views/profile.html', 
                requireAuth: true,
                allowedRoles: ['USER', 'DEALER', 'MASTER']
            },
            'orders': { 
                view: 'views/orders.html', 
                requireAuth: true,
                allowedRoles: ['USER', 'DEALER', 'MASTER']
            },
            'cars': { 
                view: 'views/cars.html', 
                requireAuth: true,
                allowedRoles: ['USER']
            },
            'models': { 
                view: 'views/models.html', 
                requireAuth: true,
                allowedRoles: ['MASTER']
            },
            'options': { 
                view: 'views/options.html', 
                requireAuth: true,
                allowedRoles: ['MASTER']
            },
            'dealers': { 
                view: 'views/dealers.html', 
                requireAuth: true,
                allowedRoles: ['MASTER']
            },
            'users': { 
                view: 'views/users.html', 
                requireAuth: true,
                allowedRoles: ['MASTER']
            }
        },

        // Navigate to a specific route
        async navigate(route, params = {}) {
            const routeConfig = this.routes[route];
            
            if (!routeConfig) {
                console.error('Route not found:', route);
                utils.showToast('Page not found', 'error');
                return;
            }

            // Check authentication requirements
            if (routeConfig.requireAuth && !auth.requireAuth()) {
                return;
            }

            // Check role requirements
            if (routeConfig.allowedRoles.length > 0 && !auth.requireRole(routeConfig.allowedRoles)) {
                return;
            }

            // Update URL
            const url = new URL(window.location);
            url.searchParams.set('page', route);
            Object.keys(params).forEach(key => {
                url.searchParams.set(key, params[key]);
            });
            window.history.pushState({ route, params }, '', url);

            // Load the view
            await this.loadView(route, params);
        },

        // Load view content
        async loadView(route, params = {}) {
            const routeConfig = this.routes[route];
            app.currentView = route;

            try {
                if (route === 'dashboard') {
                    // Special handling for dashboard
                    await dashboard.init();
                } else {
                    // Load HTML view
                    const html = await utils.loadHTML(routeConfig.view);
                    document.getElementById('mainContent').innerHTML = html;
                    
                    // Initialize view-specific functionality
                    await app.initializeView(route, params);
                }

                // Update navigation
                app.updateNavigation();
                
            } catch (error) {
                console.error('Error loading view:', error);
                utils.showToast('Error loading page', 'error');
            }
        },

        // Handle browser back/forward
        handlePopState(event) {
            if (event.state && event.state.route) {
                this.loadView(event.state.route, event.state.params || {});
            } else {
                // Default route
                const urlParams = new URLSearchParams(window.location.search);
                const page = urlParams.get('page') || (auth.isAuthenticated() ? 'dashboard' : 'login');
                this.navigate(page);
            }
        }
    },

    // Initialize the application
    async init() {
        // Initialize authentication
        auth.init();

        // Setup popstate handler
        window.addEventListener('popstate', (event) => {
            this.router.handlePopState(event);
        });

        // Determine initial route
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        
        if (page && this.router.routes[page]) {
            await this.router.navigate(page);
        } else if (auth.isAuthenticated()) {
            await this.router.navigate('dashboard');
        } else {
            await this.router.navigate('login');
        }
    },

    // Initialize view-specific functionality
    async initializeView(view, params = {}) {
        switch (view) {
            case 'login':
                this.initLoginView();
                break;
            case 'signup':
                this.initSignupView();
                break;
            case 'profile':
                await this.initProfileView();
                break;
            case 'orders':
                await this.initOrdersView(params);
                break;
            case 'cars':
                await this.initCarsView(params);
                break;
            case 'models':
                await this.initModelsView(params);
                break;
            case 'options':
                await this.initOptionsView(params);
                break;
            case 'dealers':
                await this.initDealersView(params);
                break;
            case 'users':
                await this.initUsersView(params);
                break;
        }
    },

    // Initialize login view
    initLoginView() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(loginForm);
                const credentials = {
                    email: formData.get('email'),
                    password: formData.get('password')
                };

                const success = await auth.login(credentials);
                if (success) {
                    this.router.navigate('dashboard');
                }
            });
        }

        // Setup signup link
        const signupLink = document.getElementById('signupLink');
        if (signupLink) {
            signupLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.router.navigate('signup');
            });
        }
    },

    // Initialize signup view
    initSignupView() {
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(signupForm);
                const userData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    phone: formData.get('phone')
                };

                const userType = formData.get('userType');

                try {
                    let response;
                    switch (userType) {
                        case 'USER':
                            response = await api.users.signup(userData);
                            break;
                        case 'DEALER':
                            response = await api.dealers.signup({
                                ...userData,
                                branch: formData.get('branch') || ''
                            });
                            break;
                        case 'MASTER':
                            response = await api.masters.signup(userData);
                            break;
                        default:
                            throw new Error('Invalid user type');
                    }

                    if (response) {
                        utils.showToast('Account created successfully! Please login.', 'success');
                        this.router.navigate('login');
                    }
                } catch (error) {
                    console.error('Signup error:', error);
                    utils.showToast('Failed to create account. Please try again.', 'error');
                }
            });
        }

        // Setup login link
        const loginLink = document.getElementById('loginLink');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.router.navigate('login');
            });
        }

        // Handle user type change
        const userTypeSelect = document.getElementById('userType');
        const dealerFields = document.getElementById('dealerFields');
        if (userTypeSelect && dealerFields) {
            userTypeSelect.addEventListener('change', () => {
                dealerFields.style.display = userTypeSelect.value === 'DEALER' ? 'block' : 'none';
            });
        }
    },

    // Initialize profile view
    async initProfileView() {
        try {
            const userRole = auth.getUserRole();
            let profileData;

            switch (userRole) {
                case 'USER':
                    profileData = await api.users.getProfile();
                    break;
                case 'DEALER':
                    profileData = await api.dealers.getProfile();
                    break;
                case 'MASTER':
                    profileData = await api.masters.getProfile();
                    break;
            }

            if (profileData && profileData.data) {
                this.populateProfileForm(profileData.data);
            }

            // Setup form submission
            const profileForm = document.getElementById('profileForm');
            if (profileForm) {
                profileForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.handleProfileUpdate(e.target);
                });
            }

        } catch (error) {
            console.error('Error loading profile:', error);
            utils.showToast('Error loading profile data', 'error');
        }
    },

    // Populate profile form with data
    populateProfileForm(data) {
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (field && data[key] !== null && data[key] !== undefined) {
                field.value = data[key];
            }
        });
    },

    // Handle profile update
    async handleProfileUpdate(form) {
        try {
            const formData = new FormData(form);
            const updateData = {};
            
            for (const [key, value] of formData.entries()) {
                updateData[key] = value;
            }

            const userRole = auth.getUserRole();
            let response;

            switch (userRole) {
                case 'USER':
                    response = await api.users.updateProfile(updateData);
                    break;
                case 'DEALER':
                    response = await api.dealers.updateProfile(updateData);
                    break;
                case 'MASTER':
                    response = await api.masters.updateProfile(updateData);
                    break;
            }

            if (response) {
                utils.showToast('Profile updated successfully!', 'success');
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            utils.showToast('Error updating profile', 'error');
        }
    },

    // Initialize orders view
    async initOrdersView(params) {
        // Implementation will depend on the specific orders functionality needed
        console.log('Initializing orders view with params:', params);
    },

    // Initialize cars view
    async initCarsView(params) {
        // Implementation for user's car management
        console.log('Initializing cars view with params:', params);
    },

    // Initialize models view
    async initModelsView(params) {
        // Implementation for master's model management
        console.log('Initializing models view with params:', params);
    },

    // Initialize options view
    async initOptionsView(params) {
        // Implementation for master's option management
        console.log('Initializing options view with params:', params);
    },

    // Initialize dealers view
    async initDealersView(params) {
        // Implementation for master's dealer management
        console.log('Initializing dealers view with params:', params);
    },

    // Initialize users view
    async initUsersView(params) {
        // Implementation for master's user management
        console.log('Initializing users view with params:', params);
    },

    // Update navigation based on current user and view
    updateNavigation() {
        const navbar = document.getElementById('mainNavbar');
        const navItems = document.getElementById('mainNavItems');

        if (!auth.isAuthenticated()) {
            navbar.style.display = 'none';
            return;
        }

        navbar.style.display = 'block';
        const userRole = auth.getUserRole();

        // Clear existing nav items
        navItems.innerHTML = '';

        // Common navigation items
        const commonNavItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
            { id: 'orders', label: 'Orders', icon: 'fas fa-clipboard-list' }
        ];

        // Role-specific navigation items
        const roleNavItems = {
            'USER': [
                { id: 'cars', label: 'My Cars', icon: 'fas fa-car' }
            ],
            'DEALER': [],
            'MASTER': [
                { id: 'models', label: 'Models', icon: 'fas fa-cogs' },
                { id: 'options', label: 'Options', icon: 'fas fa-sliders-h' },
                { id: 'dealers', label: 'Dealers', icon: 'fas fa-store' },
                { id: 'users', label: 'Users', icon: 'fas fa-users' }
            ]
        };

        // Combine navigation items
        const allNavItems = [...commonNavItems, ...(roleNavItems[userRole] || [])];

        // Generate navigation HTML
        const navHTML = allNavItems.map(item => `
            <li class="nav-item">
                <a class="nav-link ${this.currentView === item.id ? 'active' : ''}" 
                   href="#" onclick="app.router.navigate('${item.id}')">
                    <i class="${item.icon} me-1"></i>${item.label}
                </a>
            </li>
        `).join('');

        navItems.innerHTML = navHTML;
    }
};
