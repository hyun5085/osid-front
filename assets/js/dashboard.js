// Dashboard functionality for Car Order Tracker

const dashboard = {
    // Initialize dashboard based on user role
    async init() {
        const userRole = auth.getUserRole();
        const userName = auth.getUserName();
        
        // Update user display name in navbar
        const userDisplayName = document.getElementById('userDisplayName');
        if (userDisplayName) {
            userDisplayName.textContent = userName;
        }

        // Load appropriate dashboard
        switch (userRole) {
            case 'USER':
                await this.loadUserDashboard();
                break;
            case 'DEALER':
                await this.loadDealerDashboard();
                break;
            case 'MASTER':
                await this.loadMasterDashboard();
                break;
            default:
                utils.showToast('Unknown user role', 'error');
                auth.logout();
        }
    },

    // Load user dashboard
    async loadUserDashboard() {
        try {
            const html = await utils.loadHTML('views/dashboard-user.html');
            document.getElementById('mainContent').innerHTML = html;
            
            // Load user-specific data
            await this.loadUserStats();
            await this.loadUserOrders();
            await this.loadUserCars();
        } catch (error) {
            console.error('Error loading user dashboard:', error);
            utils.showToast('Error loading dashboard', 'error');
        }
    },

    // Load dealer dashboard
    async loadDealerDashboard() {
        try {
            const html = await utils.loadHTML('views/dashboard-dealer.html');
            document.getElementById('mainContent').innerHTML = html;
            
            // Load dealer-specific data
            await this.loadDealerStats();
            await this.loadDealerOrders();
        } catch (error) {
            console.error('Error loading dealer dashboard:', error);
            utils.showToast('Error loading dashboard', 'error');
        }
    },

    // Load master dashboard
    async loadMasterDashboard() {
        try {
            const html = await utils.loadHTML('views/dashboard-master.html');
            document.getElementById('mainContent').innerHTML = html;
            
            // Load master-specific data
            await this.loadMasterStats();
            await this.loadSystemOverview();
        } catch (error) {
            console.error('Error loading master dashboard:', error);
            utils.showToast('Error loading dashboard', 'error');
        }
    },

    // Load user statistics
    async loadUserStats() {
        try {
            const [orders, cars] = await Promise.all([
                api.orders.getAll({ userId: auth.getUserId() }),
                api.myCars.getAll()
            ]);

            // Update stats cards
            document.getElementById('totalOrders').textContent = orders.data?.length || 0;
            document.getElementById('totalCars').textContent = cars.data?.length || 0;
            
            const pendingOrders = orders.data?.filter(order => order.status === 'PENDING').length || 0;
            document.getElementById('pendingOrders').textContent = pendingOrders;
            
            const completedOrders = orders.data?.filter(order => order.status === 'COMPLETED').length || 0;
            document.getElementById('completedOrders').textContent = completedOrders;
            
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    },

    // Load dealer statistics
    async loadDealerStats() {
        try {
            const orders = await api.orders.getAll({ dealerId: auth.getUserId() });
            
            document.getElementById('totalOrders').textContent = orders.data?.length || 0;
            
            const pendingOrders = orders.data?.filter(order => order.status === 'PENDING').length || 0;
            document.getElementById('pendingOrders').textContent = pendingOrders;
            
            const completedOrders = orders.data?.filter(order => order.status === 'COMPLETED').length || 0;
            document.getElementById('completedOrders').textContent = completedOrders;
            
            // Calculate total revenue
            const totalRevenue = orders.data?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
            document.getElementById('totalRevenue').textContent = utils.formatCurrency(totalRevenue);
            
        } catch (error) {
            console.error('Error loading dealer stats:', error);
        }
    },

    // Load master statistics
    async loadMasterStats() {
        try {
            const [users, dealers, models, orders] = await Promise.all([
                api.users.getAll(),
                api.dealers.getAll(),
                api.models.getAll(),
                api.orders.getAll()
            ]);

            document.getElementById('totalUsers').textContent = users.data?.length || 0;
            document.getElementById('totalDealers').textContent = dealers.data?.length || 0;
            document.getElementById('totalModels').textContent = models.data?.length || 0;
            document.getElementById('totalOrders').textContent = orders.data?.length || 0;
            
        } catch (error) {
            console.error('Error loading master stats:', error);
        }
    },

    // Load user orders
    async loadUserOrders() {
        try {
            const response = await api.orders.getAll({ userId: auth.getUserId(), limit: 5 });
            const orders = response.data || [];
            
            const container = document.getElementById('recentOrders');
            if (!container) return;

            if (orders.length === 0) {
                container.innerHTML = '<p class="text-muted">No recent orders found.</p>';
                return;
            }

            const ordersHTML = orders.map(order => `
                <div class="d-flex justify-content-between align-items-center border-bottom py-3">
                    <div>
                        <h6 class="mb-1">Order #${order.id}</h6>
                        <small class="text-muted">${utils.formatDate(order.createdAt)}</small>
                    </div>
                    <div class="text-end">
                        ${utils.getStatusBadge(order.status)}
                        <div class="small text-muted mt-1">${utils.formatCurrency(order.totalAmount)}</div>
                    </div>
                </div>
            `).join('');

            container.innerHTML = ordersHTML;
        } catch (error) {
            console.error('Error loading user orders:', error);
        }
    },

    // Load user cars
    async loadUserCars() {
        try {
            const response = await api.myCars.getAll();
            const cars = response.data || [];
            
            const container = document.getElementById('myCars');
            if (!container) return;

            if (cars.length === 0) {
                container.innerHTML = '<p class="text-muted">No cars registered yet.</p>';
                return;
            }

            const carsHTML = cars.map(car => `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h6 class="card-title">${car.make} ${car.model}</h6>
                            <p class="card-text text-muted">${car.year} • ${car.color}</p>
                            ${utils.getStatusBadge(car.status)}
                        </div>
                    </div>
                </div>
            `).join('');

            container.innerHTML = carsHTML;
        } catch (error) {
            console.error('Error loading user cars:', error);
        }
    },

    // Load dealer orders
    async loadDealerOrders() {
        try {
            const response = await api.orders.getAll({ dealerId: auth.getUserId(), limit: 10 });
            const orders = response.data || [];
            
            const container = document.getElementById('dealerOrders');
            if (!container) return;

            if (orders.length === 0) {
                container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No orders found.</td></tr>';
                return;
            }

            const ordersHTML = orders.map(order => `
                <tr>
                    <td>#${order.id}</td>
                    <td>${order.customerName || 'N/A'}</td>
                    <td>${order.carModel || 'N/A'}</td>
                    <td>${utils.getStatusBadge(order.status)}</td>
                    <td>${utils.formatCurrency(order.totalAmount)}</td>
                </tr>
            `).join('');

            container.innerHTML = ordersHTML;
        } catch (error) {
            console.error('Error loading dealer orders:', error);
        }
    },

    // Load system overview for master
    async loadSystemOverview() {
        try {
            const response = await api.orders.getAll({ limit: 10 });
            const orders = response.data || [];
            
            const container = document.getElementById('systemOrders');
            if (!container) return;

            if (orders.length === 0) {
                container.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No orders found.</td></tr>';
                return;
            }

            const ordersHTML = orders.map(order => `
                <tr>
                    <td>#${order.id}</td>
                    <td>${order.customerName || 'N/A'}</td>
                    <td>${order.dealerName || 'N/A'}</td>
                    <td>${order.carModel || 'N/A'}</td>
                    <td>${utils.getStatusBadge(order.status)}</td>
                    <td>${utils.formatDate(order.createdAt)}</td>
                </tr>
            `).join('');

            container.innerHTML = ordersHTML;
        } catch (error) {
            console.error('Error loading system overview:', error);
        }
    },

    // Quick actions for different roles
    setupQuickActions() {
        const userRole = auth.getUserRole();
        
        // Setup role-specific quick actions
        if (userRole === 'USER') {
            this.setupUserQuickActions();
        } else if (userRole === 'DEALER') {
            this.setupDealerQuickActions();
        } else if (userRole === 'MASTER') {
            this.setupMasterQuickActions();
        }
    },

    // User quick actions
    setupUserQuickActions() {
        // Add event listeners for user-specific actions
        const newOrderBtn = document.getElementById('newOrderBtn');
        if (newOrderBtn) {
            newOrderBtn.addEventListener('click', () => {
                app.router.navigate('orders', { action: 'create' });
            });
        }

        const addCarBtn = document.getElementById('addCarBtn');
        if (addCarBtn) {
            addCarBtn.addEventListener('click', () => {
                app.router.navigate('cars', { action: 'create' });
            });
        }
    },

    // Dealer quick actions
    setupDealerQuickActions() {
        // Add event listeners for dealer-specific actions
        const manageOrdersBtn = document.getElementById('manageOrdersBtn');
        if (manageOrdersBtn) {
            manageOrdersBtn.addEventListener('click', () => {
                app.router.navigate('orders');
            });
        }
    },

    // Master quick actions
    setupMasterQuickActions() {
        // Add event listeners for master-specific actions
        const manageUsersBtn = document.getElementById('manageUsersBtn');
        if (manageUsersBtn) {
            manageUsersBtn.addEventListener('click', () => {
                app.router.navigate('users');
            });
        }

        const manageDealersBtn = document.getElementById('manageDealersBtn');
        if (manageDealersBtn) {
            manageDealersBtn.addEventListener('click', () => {
                app.router.navigate('dealers');
            });
        }

        const manageModelsBtn = document.getElementById('manageModelsBtn');
        if (manageModelsBtn) {
            manageModelsBtn.addEventListener('click', () => {
                app.router.navigate('models');
            });
        }
    }
};
