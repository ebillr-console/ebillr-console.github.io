// Dashboard Settings JavaScript - Updated with Scroll Lock & Better Modals
class DashboardSettings {
    constructor() {
        this.state = {
            scrollPosition: 0,
            currentCountry: 'IN',
            currentTimeFormat: '12h',
            currentDateFormat: 'DD/MM/YY',
            pendingDelete: null,
            activeDropdown: null,
            isOnline: true,
            connectivityCheckInterval: null,
            timeUpdateInterval: null,
            currentDateTime: new Date() // Store current date time
        };

        this.init();
    }

    init() {
        this.initThemeButtons();
        this.createRadioDropdownModals();
        this.initCustomDropdowns();
        this.initTimeDateDisplay();
        this.initInvoiceFields();
        this.initActionButtons();
        this.initModals();
        this.initCheckboxes();
        this.initConnectivityCheck();
    }

    // Initialize connectivity checking
    initConnectivityCheck() {
        // Set up continuous checking every minute
        this.state.connectivityCheckInterval = setInterval(() => {
            this.checkConnectivity();
        }, 60000);

        // Listen for online/offline events
        window.addEventListener('online', () => this.handleConnectivityChange(true));
        window.addEventListener('offline', () => this.handleConnectivityChange(false));
    }

    // Check connectivity
    async checkConnectivity() {
        try {
            const response = await fetch('https://httpbin.org/status/200', {
                method: 'HEAD',
                cache: 'no-cache'
            });
            this.handleConnectivityChange(response.ok);
        } catch (error) {
            this.handleConnectivityChange(false);
        }
    }

    // Handle connectivity state changes
    handleConnectivityChange(isOnline) {
        if (this.state.isOnline === isOnline) return;

        this.state.isOnline = isOnline;

        if (isOnline) {
            this.handleOnline();
        } else {
            this.handleOffline();
        }
    }

    // Handle online state
    handleOnline() {
        this.removeOfflineUI();
        this.fetchRealTimeData(); // Fetch fresh data when coming online
    }

    // Handle offline state
    handleOffline() {
        this.showOfflineUI();
    }

    // Show offline UI
    showOfflineUI() {
        const liveDataContainer = document.getElementById('liveDataContainer');
        if (!liveDataContainer) return;

        const offlineHTML = `
            <div class="offline-state">
                <div class="offline-content">
                    <img src="assets/icons/wifi-off.svg" class="offline-icon" alt="Offline">
                    <div class="offline-text">Please Connect To Internet!</div>
                </div>
            </div>
        `;
        liveDataContainer.innerHTML = offlineHTML;
    }

    // Remove offline UI
    removeOfflineUI() {
        const liveDataContainer = document.getElementById('liveDataContainer');
        const offlineState = liveDataContainer?.querySelector('.offline-state');

        if (offlineState) {
            this.updateLiveDataDisplay();
        }
    }

    // Update live data display
    updateLiveDataDisplay() {
        const liveDataContainer = document.getElementById('liveDataContainer');
        if (liveDataContainer) {
            liveDataContainer.innerHTML = `
                <!-- Region -->
                <div class="live-data-item">
                    <div class="live-data-icon-container">
                        <img src="assets/icons/map-pin-house.svg" class="live-data-icon" alt="Region">
                    </div>
                    <div class="live-data-content">
                        <div class="live-data-value" id="regionValue">India</div>
                    </div>
                </div>

                <!-- Currency -->
                <div class="live-data-item">
                    <div class="live-data-icon-container">
                        <img src="assets/icons/indian-rupee.svg" class="live-data-icon" id="currencyIcon" alt="Currency">
                    </div>
                    <div class="live-data-content">
                        <div class="live-data-value" id="currencyValue">INR</div>
                    </div>
                </div>

                <!-- Date -->
                <div class="live-data-item">
                    <div class="live-data-icon-container">
                        <img src="assets/icons/calendar-days.svg" class="live-data-icon" alt="Date">
                    </div>
                    <div class="live-data-content">
                        <div class="live-data-value" id="dateValue">--/--/--</div>
                    </div>
                </div>

                <!-- Time -->
                <div class="live-data-item">
                    <div class="live-data-icon-container">
                        <img src="assets/icons/clock-12.svg" class="live-data-icon" id="clockIcon" alt="Time">
                    </div>
                    <div class="live-data-content">
                        <div class="live-data-value" id="timeValue">--:--</div>
                    </div>
                </div>
            `;

            // Fetch fresh data
            this.fetchRealTimeData();
        }
    }

    // Fetch real time data
    async fetchRealTimeData() {
        if (!this.state.isOnline) return;

        try {
            // Use a simple time API that works globally
            const response = await fetch('https://worldtimeapi.org/api/ip');
            if (!response.ok) throw new Error('API failed');

            const data = await response.json();
            this.state.currentDateTime = new Date(data.datetime);
            this.updateRealTimeData();

        } catch (error) {
            // Fallback to local time with timezone adjustment
            this.updateWithLocalTime();
        }
    }

    // Update with local time considering timezone
    updateWithLocalTime() {
        const now = new Date();
        const timezoneOffset = this.state.currentCountry === 'US' ? -5 * 60 : 5.5 * 60; // Convert hours to minutes
        const countryTime = new Date(now.getTime() + (timezoneOffset + now.getTimezoneOffset()) * 60000);

        this.state.currentDateTime = countryTime;
        this.updateRealTimeData();
    }

    // Update real time data display
    updateRealTimeData() {
        const dateValue = document.getElementById('dateValue');
        const timeValue = document.getElementById('timeValue');

        if (dateValue) dateValue.textContent = this.formatDate(this.state.currentDateTime, this.state.currentDateFormat);
        if (timeValue) timeValue.textContent = this.formatTime(this.state.currentDateTime, this.state.currentTimeFormat);

        // Update clock icon based on actual time
        this.updateClockIcon(this.state.currentDateTime);
    }

    // Update time every minute for live updates
    startLiveTimeUpdates() {
        if (this.state.timeUpdateInterval) {
            clearInterval(this.state.timeUpdateInterval);
        }

        this.state.timeUpdateInterval = setInterval(() => {
            if (this.state.isOnline) {
                // Increment time by 1 minute
                this.state.currentDateTime = new Date(this.state.currentDateTime.getTime() + 60000);
                this.updateRealTimeData();
            }
        }, 60000); // Update every minute
    }

    createRadioDropdownModals() {
        const dropdowns = document.querySelectorAll('.custom-dropdown');

        dropdowns.forEach(dropdown => {
            const options = dropdown.querySelectorAll('.custom-dropdown-option');
            const headerText = dropdown.querySelector('.custom-dropdown-selected');

            // Get appropriate title based on dropdown type
            let title = 'Select Option';
            if (dropdown.id === 'countryDropdown') {
                title = 'Choose Your Country';
            } else if (dropdown.id === 'dateFormatDropdown') {
                title = 'Choose Date Format';
            } else if (dropdown.id === 'timeFormatDropdown') {
                title = 'Choose Time Format';
            }

            // Create radio options container
            const radioOptions = document.createElement('div');
            radioOptions.className = 'dropdown-radio-options';
            radioOptions.innerHTML = `
                <div class="dropdown-radio-content">
                    <h3 class="dropdown-radio-title">${title}</h3>
                    <div class="dropdown-radio-list" id="radioList-${dropdown.id}"></div>
                    <div class="dropdown-radio-actions">
                        <button class="dropdown-cancel-btn" onclick="window.dashboardSettings.cancelRadioSelection('${dropdown.id}')">Cancel</button>
                        <button class="dropdown-confirm-btn" onclick="window.dashboardSettings.confirmRadioSelection('${dropdown.id}')">Confirm</button>
                    </div>
                </div>
            `;

            document.body.appendChild(radioOptions);

            // Populate radio options
            const radioList = document.getElementById(`radioList-${dropdown.id}`);
            options.forEach(option => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;
                const isSelected = headerText.textContent === text;

                const radioOption = document.createElement('div');
                radioOption.className = `radio-option ${isSelected ? 'selected' : ''}`;
                radioOption.innerHTML = `
                    <input type="radio" class="radio-input" name="${dropdown.id}" value="${value}" ${isSelected ? 'checked' : ''}>
                    <span class="radio-custom"></span>
                    <span class="radio-label">${text}</span>
                `;

                radioOption.addEventListener('click', function () {
                    // Deselect all options
                    radioList.querySelectorAll('.radio-option').forEach(opt => {
                        opt.classList.remove('selected');
                        opt.querySelector('.radio-input').checked = false;
                    });

                    // Select this option
                    this.classList.add('selected');
                    this.querySelector('.radio-input').checked = true;
                });

                radioList.appendChild(radioOption);
            });
        });
    }

    initThemeButtons() {
        const lightThemeButton = document.getElementById('lightThemeButton');
        const darkThemeButton = document.getElementById('darkThemeButton');

        if (!lightThemeButton || !darkThemeButton) return;

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        if (currentTheme === 'light') {
            lightThemeButton.classList.add('active');
            darkThemeButton.classList.remove('active');
        } else {
            darkThemeButton.classList.add('active');
            lightThemeButton.classList.remove('active');
        }

        lightThemeButton.addEventListener('click', () => {
            this.setTheme('light');
            lightThemeButton.classList.add('active');
            darkThemeButton.classList.remove('active');
        });

        darkThemeButton.addEventListener('click', () => {
            this.setTheme('dark');
            darkThemeButton.classList.add('active');
            lightThemeButton.classList.remove('active');
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update theme icons visibility
        this.updateThemeIcons(theme);
    }

    // Update theme icons based on current theme
    updateThemeIcons(theme) {
        const lightThemeButton = document.getElementById('lightThemeButton');
        const darkThemeButton = document.getElementById('darkThemeButton');

        if (lightThemeButton && darkThemeButton) {
            const lightIcon = lightThemeButton.querySelector('.theme-icon');
            const darkIcon = darkThemeButton.querySelector('.theme-icon');

            if (theme === 'light') {
                // Light mode: sun should be visible, moon should use filter
                if (lightIcon) lightIcon.style.filter = 'none';
                if (darkIcon) darkIcon.style.filter = 'var(--svg-filter)';
            } else {
                // Dark mode: moon should be visible, sun should use filter
                if (lightIcon) lightIcon.style.filter = 'var(--svg-filter)';
                if (darkIcon) darkIcon.style.filter = 'none';
            }
        }
    }

    initCustomDropdowns() {
        const dropdowns = document.querySelectorAll('.custom-dropdown');

        dropdowns.forEach(dropdown => {
            const header = dropdown.querySelector('.custom-dropdown-header');
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showRadioDropdown(dropdown);
            });
        });

        document.addEventListener('click', () => {
            this.closeAllRadioDropdowns();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllRadioDropdowns();
            }
        });
    }

    showRadioDropdown(dropdown) {
        this.closeAllRadioDropdowns();

        // Save current scroll position BEFORE opening modal
        this.state.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        this.state.activeDropdown = dropdown.id;

        const radioOptions = document.querySelector(`#radioList-${dropdown.id}`)?.closest('.dropdown-radio-options');
        if (radioOptions) {
            radioOptions.classList.add('active');

            // Apply scroll lock WITHOUT moving the page
            document.body.classList.add('dropdown-modal-open');
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${this.state.scrollPosition}px`;
        }
    }

    closeAllRadioDropdowns() {
        document.querySelectorAll('.dropdown-radio-options').forEach(modal => {
            modal.classList.remove('active');
        });

        // Restore scroll position and remove scroll lock
        document.body.classList.remove('dropdown-modal-open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        if (this.state.scrollPosition > 0) {
            window.scrollTo(0, this.state.scrollPosition);
        }

        this.state.activeDropdown = null;
    }

    cancelRadioSelection(dropdownId) {
        this.closeAllRadioDropdowns();
    }

    confirmRadioSelection(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        const radioOptions = document.querySelector(`#radioList-${dropdownId}`)?.closest('.dropdown-radio-options');
        const selectedRadio = radioOptions?.querySelector('.radio-option.selected');

        if (selectedRadio) {
            const value = selectedRadio.querySelector('.radio-input').value;
            const text = selectedRadio.querySelector('.radio-label').textContent;

            const headerText = dropdown.querySelector('.custom-dropdown-selected');
            headerText.textContent = text;

            const selectElement = dropdown.parentElement.querySelector('.styled-select');
            if (selectElement) {
                selectElement.value = value;
                selectElement.dispatchEvent(new Event('change'));
            }

            this.handleDropdownChange(dropdownId, value);
        }

        this.closeAllRadioDropdowns();
    }

    handleDropdownChange(dropdownId, value) {
        switch (dropdownId) {
            case 'countryDropdown':
                this.handleCountryChange(value);
                break;
            case 'dateFormatDropdown':
                this.handleDateFormatChange(value);
                break;
            case 'timeFormatDropdown':
                this.handleTimeFormatChange(value);
                break;
        }
    }

    handleCountryChange(countryCode) {
        const loadingOverlay = document.getElementById('regionLoadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        this.state.currentCountry = countryCode;

        setTimeout(() => {
            this.updateRegionData(countryCode);
            this.fetchRealTimeData(); // Fetch new time data for the country
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
        }, 1500);
    }

    updateRegionData(countryCode) {
        const regionValue = document.getElementById('regionValue');
        const currencyValue = document.getElementById('currencyValue');
        const currencyIcon = document.getElementById('currencyIcon');
        const currencyDisplay = document.getElementById('currencyDisplay');

        if (countryCode === 'US') {
            if (regionValue) regionValue.textContent = 'United States';
            if (currencyValue) currencyValue.textContent = 'USD';
            if (currencyDisplay) currencyDisplay.textContent = 'USD - US Dollar ($)';
            if (currencyIcon) currencyIcon.src = 'assets/icons/american-dollar.svg';
        } else {
            if (regionValue) regionValue.textContent = 'India';
            if (currencyValue) currencyValue.textContent = 'INR';
            if (currencyDisplay) currencyDisplay.textContent = 'INR - Indian Rupee (₹)';
            if (currencyIcon) currencyIcon.src = 'assets/icons/indian-rupee.svg';
        }
    }

    updateClockIcon(dateTime) {
        const clockIcon = document.getElementById('clockIcon');
        if (!clockIcon) return;

        let hours = dateTime.getHours();
        let twelveHour = hours % 12 || 12;

        clockIcon.src = `assets/icons/clock-${twelveHour}.svg`;
    }

    handleDateFormatChange(format) {
        const loadingOverlay = document.getElementById('regionLoadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        this.state.currentDateFormat = format;

        setTimeout(() => {
            this.updateRealTimeData(); // Just update display with current time
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
        }, 1000);
    }

    handleTimeFormatChange(format) {
        const loadingOverlay = document.getElementById('regionLoadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        this.state.currentTimeFormat = format;

        setTimeout(() => {
            this.updateRealTimeData(); // Just update display with current time
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
        }, 1000);
    }

    initTimeDateDisplay() {
        const loadingOverlay = document.getElementById('regionLoadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        // Show loading for 2 seconds minimum
        setTimeout(() => {
            this.fetchRealTimeData().finally(() => {
                // Start live time updates after initial fetch
                this.startLiveTimeUpdates();
                if (loadingOverlay) loadingOverlay.classList.add('hidden');
            });
        }, 2000);
    }

    formatDate(date, format) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const shortYear = year.toString().slice(-2);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const formats = {
            'DD-MM-YYYY': `${day}-${month}-${year}`,
            'DD/MM/YY': `${day}/${month}/${shortYear}`,
            'DD/MM/YYYY': `${day}/${month}/${year}`,
            'DD MMM YYYY': `${day} ${monthNames[date.getMonth()]} ${year}`
        };

        return formats[format] || formats['DD/MM/YY'];
    }

    formatTime(date, format) {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        if (format === '12h') {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours}:${minutes} ${ampm}`;
        } else {
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        }
    }

    initInvoiceFields() {
        const addCustomFieldBtn = document.getElementById('addCustomField');
        const customFieldInput = document.getElementById('customFieldInputInline');

        if (!addCustomFieldBtn || !customFieldInput) return;

        customFieldInput.addEventListener('input', () => {
            addCustomFieldBtn.disabled = !customFieldInput.value.trim();
        });

        addCustomFieldBtn.addEventListener('click', () => {
            const fieldName = customFieldInput.value.trim();
            if (fieldName) {
                this.addCustomField(fieldName);
                customFieldInput.value = '';
                addCustomFieldBtn.disabled = true;
            }
        });

        customFieldInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !addCustomFieldBtn.disabled) {
                addCustomFieldBtn.click();
            }
        });

        this.initExistingFieldListeners();
    }

    initExistingFieldListeners() {
        document.querySelectorAll('.delete-existing-field').forEach(button => {
            button.addEventListener('click', () => {
                const fieldId = button.getAttribute('data-field');
                const fieldLabel = button.closest('.field-option').querySelector('.field-label').textContent;
                this.showDeleteConfirmation(fieldId, fieldLabel, false);
            });
        });

        document.querySelectorAll('.field-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                console.log('Checkbox changed:', checkbox.id, checkbox.checked);
            });
        });
    }

    addCustomField(fieldName) {
        const existingFields = document.querySelectorAll('.field-label');
        for (let field of existingFields) {
            if (field.textContent.toLowerCase() === fieldName.toLowerCase()) {
                this.showDuplicateFieldModal();
                return;
            }
        }

        const invoiceList = document.querySelector('.invoice-list');
        const addFieldSection = document.querySelector('.add-custom-field');

        if (!invoiceList || !addFieldSection) return;

        const fieldId = `custom-${fieldName.replace(/\s+/g, '-').toLowerCase()}`;

        const fieldOption = document.createElement('div');
        fieldOption.className = 'field-option custom-field-option';
        fieldOption.innerHTML = `
            <span class="field-label">${fieldName}</span>
            <div class="field-controls">
                <label class="custom-checkbox">
                    <input type="checkbox" class="field-checkbox" id="${fieldId}" checked>
                    <span class="checkmark"></span>
                </label>
                <button class="delete-custom-field" data-field="${fieldId}">
                    <img src="assets/icons/trash.svg" class="w-4 h-4 field-icon" alt="Delete">
                </button>
            </div>
        `;

        invoiceList.insertBefore(fieldOption, addFieldSection);

        const deleteButton = fieldOption.querySelector('.delete-custom-field');
        deleteButton.addEventListener('click', () => {
            const fieldLabel = fieldOption.querySelector('.field-label').textContent;
            this.showDeleteConfirmation(fieldId, fieldLabel, true);
        });

        const checkbox = fieldOption.querySelector('.field-checkbox');
        checkbox.addEventListener('change', () => {
            console.log('Custom checkbox changed:', checkbox.id, checkbox.checked);
        });
    }

    initModals() {
        const cancelDelete = document.getElementById('cancelDelete');
        const confirmDelete = document.getElementById('confirmDelete');
        const confirmDuplicate = document.getElementById('confirmDuplicate');

        if (cancelDelete) cancelDelete.addEventListener('click', () => this.hideDeleteConfirmationModal());
        if (confirmDelete) confirmDelete.addEventListener('click', () => this.handleConfirmDelete());
        if (confirmDuplicate) confirmDuplicate.addEventListener('click', () => this.hideDuplicateFieldModal());

        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', () => {
                this.hideDeleteConfirmationModal();
                this.hideDuplicateFieldModal();
            });
        });
    }

    showDeleteConfirmation(fieldId, fieldLabel, isCustom) {
        this.state.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        const deleteModal = document.getElementById('deleteConfirmationModal');
        const confirmButton = document.getElementById('confirmDelete');
        const messageElement = deleteModal?.querySelector('.delete-confirmation-message');

        if (messageElement) messageElement.textContent = `Are you sure you want to delete "${fieldLabel}"?`;
        if (confirmButton) {
            confirmButton.setAttribute('data-field-id', fieldId);
            confirmButton.setAttribute('data-is-custom', isCustom);
        }

        if (deleteModal) {
            deleteModal.classList.add('active');
            document.body.classList.add('modal-open');

            document.body.style.top = `-${this.state.scrollPosition}px`;
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';

            this.state.pendingDelete = { fieldId, isCustom };
        }
    }

    handleConfirmDelete() {
        const confirmButton = document.getElementById('confirmDelete');
        if (!confirmButton || !this.state.pendingDelete) return;

        const { fieldId, isCustom } = this.state.pendingDelete;

        confirmButton.innerHTML = 'Deleting...';
        confirmButton.disabled = true;

        setTimeout(() => {
            if (isCustom) {
                const fieldElement = document.querySelector(`[data-field="${fieldId}"]`);
                fieldElement?.closest('.field-option')?.remove();
            } else {
                const checkbox = document.getElementById(fieldId);
                if (checkbox) checkbox.checked = false;
            }

            confirmButton.innerHTML = 'Delete';
            confirmButton.disabled = false;
            this.hideDeleteConfirmationModal();
            this.state.pendingDelete = null;
        }, 500);
    }

    hideDeleteConfirmationModal() {
        const deleteModal = document.getElementById('deleteConfirmationModal');
        if (deleteModal) deleteModal.classList.remove('active');
        document.body.classList.remove('modal-open');

        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, this.state.scrollPosition);
    }

    showDuplicateFieldModal() {
        this.state.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        const duplicateModal = document.getElementById('duplicateFieldModal');
        if (duplicateModal) {
            duplicateModal.classList.add('active');
            document.body.classList.add('modal-open');

            document.body.style.top = `-${this.state.scrollPosition}px`;
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }
    }

    hideDuplicateFieldModal() {
        const duplicateModal = document.getElementById('duplicateFieldModal');
        if (duplicateModal) duplicateModal.classList.remove('active');
        document.body.classList.remove('modal-open');

        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, this.state.scrollPosition);
    }

    closeAllModals() {
        this.hideDeleteConfirmationModal();
        this.hideDuplicateFieldModal();
        this.closeAllRadioDropdowns();
    }

    initActionButtons() {
        const saveButton = document.getElementById('saveSettings');
        const cancelButton = document.getElementById('cancelSettings');
        const logoutButton = document.getElementById('logoutBtn');

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                alert('Settings saved successfully!');
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                    window.location.href = 'dashboard.html';
                }
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to log out?')) {
                    window.location.href = 'index.html';
                }
            });
        }
    }

    initCheckboxes() {
        const checkboxes = document.querySelectorAll('.field-checkbox');
        checkboxes.forEach(checkbox => {
            const parentLabel = checkbox.closest('.custom-checkbox');
            if (parentLabel) {
                parentLabel.style.display = 'flex';
                parentLabel.style.alignItems = 'center';
                parentLabel.style.justifyContent = 'center';
            }

            // Set default checked state for required fields
            if (checkbox.id === 'fieldName' || checkbox.id === 'fieldPrice') {
                checkbox.checked = true;
            }
        });
    }

    // Clean up interval when needed
    destroy() {
        if (this.state.connectivityCheckInterval) {
            clearInterval(this.state.connectivityCheckInterval);
        }
        if (this.state.timeUpdateInterval) {
            clearInterval(this.state.timeUpdateInterval);
        }
        window.removeEventListener('online', () => this.handleConnectivityChange(true));
        window.removeEventListener('offline', () => this.handleConnectivityChange(false));
    }
}

// Initialize dashboard settings
document.addEventListener('DOMContentLoaded', function () {
    window.dashboardSettings = new DashboardSettings();
});