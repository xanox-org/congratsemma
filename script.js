class IBMi5250Terminal {
    constructor() {
        this.currentScreen = 'login-screen';
        this.init();
    }

    init() {
        // Focus on username field on load
        document.getElementById('username').focus();
        
        // Add event listeners
        this.setupEventListeners();
        
        // Show login screen initially
        this.showScreen('login-screen');
    }

    setupEventListeners() {
        // Login screen
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                passwordInput.focus();
            }
        });

        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });

        // Main menu command input
        const commandInput = document.getElementById('command-input');
        commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleMainMenuCommand();
            }
        });

        // WRKSPLF screen command input
        const wrksplf = document.getElementById('wrksplf-command');
        wrksplf.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleWrksplf();
            }
        });

        // Global function key handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F3' || (e.key === 'F3' && e.altKey)) {
                e.preventDefault();
                this.handleF3();
            } else if (e.key === 'F12' || (e.key === 'F12' && e.altKey)) {
                e.preventDefault();
                this.handleF12();
            }
        });

        // Handle option selection in WRKSPLF (option 5 = Display)
        this.setupWrksplf();
    }

    setupWrksplf() {
        // Add click handler for the first spool file line
        setTimeout(() => {
            const wrksplf = document.getElementById('wrksplf-screen');
            if (wrksplf) {
                const content = wrksplf.querySelector('.screen-content');
                content.addEventListener('click', (e) => {
                    // Check if click is on the CONGRATSEMMA line
                    const rect = content.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const lineHeight = 19.6; // Approximate line height
                    const lineNumber = Math.floor(y / lineHeight);
                    
                    // Line 9 is approximately where the CONGRATSEMMA entry is
                    if (lineNumber >= 8 && lineNumber <= 10) {
                        this.openCongratulations();
                    }
                });
            }
        }, 100);
    }

    handleLogin() {
        const username = document.getElementById('username').value.toUpperCase();
        const password = document.getElementById('password').value;

        // Check for user 'EOU'
        if (username === 'EOU') {
            this.showScreen('main-menu');
            // Focus on command input
            setTimeout(() => {
                document.getElementById('command-input').focus();
            }, 100);
        } else {
            // Clear password and show error (simplified)
            document.getElementById('password').value = '';
            alert('User not found. Please use EOU as username.');
            document.getElementById('username').focus();
        }
    }

    handleMainMenuCommand() {
        const command = document.getElementById('command-input').value.toUpperCase().trim();
        
        if (command === 'WRKSPLF' || command === '3') {
            this.showScreen('wrksplf-screen');
            setTimeout(() => {
                document.getElementById('wrksplf-command').focus();
            }, 100);
        } else if (command === '90') {
            // Sign off - go back to login
            this.showScreen('login-screen');
            this.clearForm();
        } else {
            // Unknown command
            document.getElementById('command-input').value = '';
            // In a real system, this would show an error message
        }
    }

    handleWrksplf() {
        const command = document.getElementById('wrksplf-command').value.toUpperCase().trim();
        
        if (command === '5') {
            // Display option - show first file (CONGRATSEMMA)
            this.openCongratulations();
        } else {
            // Clear command
            document.getElementById('wrksplf-command').value = '';
        }
    }

    openCongratulations() {
        this.showScreen('congratulations-screen');
    }

    handleF3() {
        // F3 = Exit - behavior depends on current screen
        switch (this.currentScreen) {
            case 'login-screen':
                // Exit application (in real system)
                break;
            case 'main-menu':
                this.showScreen('login-screen');
                this.clearForm();
                break;
            case 'wrksplf-screen':
                this.showScreen('main-menu');
                document.getElementById('command-input').focus();
                break;
            case 'congratulations-screen':
                this.showScreen('wrksplf-screen');
                document.getElementById('wrksplf-command').focus();
                break;
        }
    }

    handleF12() {
        // F12 = Cancel - similar to F3 but different context
        this.handleF3();
    }

    showScreen(screenId) {
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    }

    clearForm() {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('command-input').value = '';
        document.getElementById('wrksplf-command').value = '';
        
        setTimeout(() => {
            document.getElementById('username').focus();
        }, 100);
    }
}

// Initialize the terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IBMi5250Terminal();
});

// Add some IBM i 5250 specific behaviors
document.addEventListener('keydown', (e) => {
    // Prevent default browser shortcuts that might interfere
    if (e.key.startsWith('F') && e.key.length <= 3) {
        e.preventDefault();
    }
    
    // Convert lowercase to uppercase in terminal inputs
    if (e.target.classList.contains('terminal-input') && e.key.length === 1) {
        setTimeout(() => {
            e.target.value = e.target.value.toUpperCase();
        }, 0);
    }
});