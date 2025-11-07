// Dashboard specific JavaScript
class DashboardManager {
    constructor() {
        this.salesChart = null;
        this.invoiceData = this.loadInvoiceData();
        this.init();
    }

    init() {
        this.initializeCharts();
        this.updateDashboardStats();
        this.loadRecentInvoices();
        this.initializeEventListeners();
    }

    initializeCharts() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        const chartData = this.generateChartData();

        this.salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Sales',
                    data: chartData.data,
                    borderColor: '#000000',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function (value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        // Update chart theme based on current theme
        this.updateChartTheme();
    }

    updateChartTheme() {
        if (!this.salesChart) return;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#fafafa' : '#171717';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        this.salesChart.options.scales.y.grid.color = gridColor;
        this.salesChart.options.scales.y.ticks.color = textColor;
        this.salesChart.options.scales.x.ticks.color = textColor;
        this.salesChart.update();
    }

    generateChartData() {
        // Generate sample data for the chart
        const timeRange = document.getElementById('timeRangeSelect')?.value || '7d';
        let days = 7;

        switch (timeRange) {
            case '1m':
                days = 30;
                break;
            case '3m':
                days = 90;
                break;
            case '1y':
                days = 365;
                break;
        }

        const labels = [];
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            if (days === 7) {
                labels.push(date.toLocaleDateString('en', { weekday: 'short' }));
            } else if (days <= 30) {
                labels.push(date.getDate().toString());
            } else {
                labels.push(date.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
            }

            // Generate random sales data
            data.push(Math.floor(Math.random() * 10000) + 1000);
        }

        return { labels, data };
    }

    updateDashboardStats() {
        const totalSales = this.invoiceData.reduce((sum, invoice) => sum + invoice.amount, 0);
        const invoicesMade = this.invoiceData.length;

        const totalSalesElement = document.getElementById('totalSales');
        const invoicesMadeElement = document.getElementById('invoicesMade');

        if (totalSalesElement) {
            totalSalesElement.textContent = window.commonManager.formatCurrency(totalSales);
        }

        if (invoicesMadeElement) {
            invoicesMadeElement.textContent = invoicesMade.toString();
        }
    }

    loadRecentInvoices() {
        const container = document.getElementById('recentInvoices');
        if (!container) return;

        if (this.invoiceData.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i data-lucide="file-text" class="no-data-icon"></i>
                    <p>No invoices created yet</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        const recentInvoices = this.invoiceData.slice(-5).reverse();
        container.innerHTML = recentInvoices.map(invoice => `
            <div class="invoice-item">
                <div class="invoice-info">
                    <div class="invoice-name">${invoice.name}</div>
                    <div class="invoice-date">${window.commonManager.formatDate(invoice.date)}</div>
                </div>
                <div class="invoice-amount">${window.commonManager.formatCurrency(invoice.amount)}</div>
            </div>
        `).join('');
    }

    loadInvoiceData() {
        // Load sample invoice data
        return JSON.parse(localStorage.getItem('invoiceData')) || [
            {
                id: 1,
                name: 'Website Design',
                date: new Date().toISOString(),
                amount: 15000,
                status: 'paid'
            },
            {
                id: 2,
                name: 'SEO Services',
                date: new Date(Date.now() - 86400000).toISOString(),
                amount: 8000,
                status: 'pending'
            }
        ];
    }

    initializeEventListeners() {
        const timeRangeSelect = document.getElementById('timeRangeSelect');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', () => {
                this.updateChartData();
            });
        }

        // Listen for theme changes
        document.addEventListener('settingsChanged', () => {
            this.updateChartTheme();
        });

        // Settings menu item
        const settingsMenuItem = document.getElementById('settingsMenuItem');
        if (settingsMenuItem) {
            settingsMenuItem.addEventListener('click', () => {
                window.location.href = 'dashboard-settings.html';
            });
        }
    }

    updateChartData() {
        if (!this.salesChart) return;

        const chartData = this.generateChartData();
        this.salesChart.data.labels = chartData.labels;
        this.salesChart.data.datasets[0].data = chartData.data;
        this.salesChart.update();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Reinitialize lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize dashboard manager
    window.dashboardManager = new DashboardManager();
});