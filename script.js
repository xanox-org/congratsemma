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
        this.setupSubmenuEventListeners();
    }

    setupSubmenuEventListeners() {
        // User tasks menu command input
        const userTasksInput = document.getElementById('user-tasks-command');
        if (userTasksInput) {
            userTasksInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUserTasks();
                }
            });
        }

        // Office tasks menu command input
        const officeTasksInput = document.getElementById('office-tasks-command');
        if (officeTasksInput) {
            officeTasksInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleOfficeTasks();
                }
            });
        }

        // Programming menu command input
        const programmingInput = document.getElementById('programming-command');
        if (programmingInput) {
            programmingInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleProgramming();
                }
            });
        }
    }

    setupWrksplf() {
        // Add event listener for option input fields and Enter processing
        setTimeout(() => {
            const wrksplf = document.getElementById('wrksplf-screen');
            if (wrksplf) {
                const content = wrksplf.querySelector('.screen-content');
                
                // Add click handler for the first spool file line (legacy support)
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

                // Add Enter key handler for option inputs
                const optionInputs = document.querySelectorAll('.option-input');
                optionInputs.forEach(input => {
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            this.processWrksplf();
                        }
                    });
                });
            }
        }, 100);
    }

    handleLogin() {
        const username = document.getElementById('username').value.toUpperCase();
        const password = document.getElementById('password').value.toUpperCase();

        // Check for user 'EOU' and password 'EOU'
        if (username === 'EOU' && password === 'EOU') {
            this.showScreen('main-menu');
            // Focus on command input
            setTimeout(() => {
                document.getElementById('command-input').focus();
            }, 100);
        } else if (username === 'EOU' && password !== 'EOU') {
            // Clear password and show error for wrong password
            document.getElementById('password').value = '';
            alert('Invalid password. Please try again.');
            document.getElementById('password').focus();
        } else {
            // Clear password and show error for wrong username
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
        } else if (command === '1') {
            this.showScreen('user-tasks-screen');
            setTimeout(() => {
                document.getElementById('user-tasks-command').focus();
            }, 100);
        } else if (command === '2') {
            this.showScreen('office-tasks-screen');
            setTimeout(() => {
                document.getElementById('office-tasks-command').focus();
            }, 100);
        } else if (command === '4') {
            this.showScreen('programming-screen');
            setTimeout(() => {
                document.getElementById('programming-command').focus();
            }, 100);
        } else if (command === '5') {
            this.showError('Communications not available', 'CPF9898: Function COMMUNICATIONS is not available at this time.');
        } else if (command === '6') {
            this.showError('Access denied', 'CPF9801: Object QSYS not found or access denied.');
        } else if (command === '7') {
            this.showError('Function restricted', 'CPF9810: Library QSERVICE not found. Problem handling restricted.');
        } else if (command === '8') {
            this.showError('Menu not found', 'CPF0001: Error found in application program. Menu display function unavailable.');
        } else if (command === '9') {
            this.showError('Service unavailable', 'CPF9899: Information Assistant options are currently unavailable. Try again later.');
        } else if (command === '10') {
            this.showError('Client Access restricted', 'CPF2817: Copy command ended because of error. Client Access/400 tasks not available.');
        } else if (command === '90') {
            // Sign off - go back to login
            this.showScreen('login-screen');
            this.clearForm();
        } else {
            // Unknown command
            document.getElementById('command-input').value = '';
            this.showError('Invalid selection', 'CPF0001: Error found in application program. Invalid menu selection or command.');
        }
    }

    handleWrksplf() {
        const command = document.getElementById('wrksplf-command').value.toUpperCase().trim();
        
        if (command === '5') {
            // Display option - show first file (CONGRATSEMMA)
            this.openCongratulations();
        } else if (command === '') {
            // If no command, process the option fields
            this.processWrksplf();
        } else {
            // Clear command for other entries
            document.getElementById('wrksplf-command').value = '';
        }
    }

    processWrksplf() {
        // Get all option input values
        const congratsOption = document.getElementById('opt-congratsemma').value.toUpperCase().trim();
        const qpjoblogOption = document.getElementById('opt-qpjoblog').value.toUpperCase().trim();
        const qsysprtOption = document.getElementById('opt-qsysprt').value.toUpperCase().trim();

        // Process options in order of priority
        if (congratsOption !== '') {
            this.processSpoolFileOption('CONGRATSEMMA', congratsOption);
        } else if (qpjoblogOption !== '') {
            this.processSpoolFileOption('QPJOBLOG', qpjoblogOption);
        } else if (qsysprtOption !== '') {
            this.processSpoolFileOption('QSYSPRT', qsysprtOption);
        }
    }

    processSpoolFileOption(fileName, option) {
        // Clear all option inputs
        document.getElementById('opt-congratsemma').value = '';
        document.getElementById('opt-qpjoblog').value = '';
        document.getElementById('opt-qsysprt').value = '';

        switch (option) {
            case '5':
                // Display option
                if (fileName === 'CONGRATSEMMA') {
                    this.openCongratulations();
                } else {
                    this.showError('File not available', `CPF3203: Spooled file ${fileName} not available for display.`);
                }
                break;
            case '4':
                // Delete option
                this.showError('Delete restricted', `CPF3310: Not authorized to delete spooled file ${fileName}.`);
                break;
            case '2':
                // Change option
                this.showError('Change not allowed', `CPF3320: Spooled file ${fileName} cannot be changed.`);
                break;
            case '3':
                // Hold option
                this.showError('Hold operation failed', `CPF3330: Spooled file ${fileName} already on hold or cannot be held.`);
                break;
            case '6':
                // Release option
                this.showError('Release not available', `CPF3340: Spooled file ${fileName} cannot be released.`);
                break;
            case '7':
                // Messages option
                this.showError('No messages', `CPF3350: No messages available for spooled file ${fileName}.`);
                break;
            case '8':
                // Attributes option
                this.showError('Attributes restricted', `CPF3360: Not authorized to display attributes for ${fileName}.`);
                break;
            case '9':
                // Work with printing status
                this.showError('Status unavailable', `CPF3370: Printing status not available for ${fileName}.`);
                break;
            default:
                if (option !== '') {
                    this.showError('Invalid option', `CPF0001: Option '${option}' is not valid. Valid options are 2, 3, 4, 5, 6, 7, 8, 9.`);
                }
                break;
        }
    }

    openCongratulations() {
        this.showScreen('congratulations-screen');
    }

    showError(title, message) {
        const errorContent = document.getElementById('error-content');
        errorContent.textContent = `
                                    ${title}

${message}

Press any key to continue.

F3=Exit   F12=Cancel
        `.trim();
        
        this.showScreen('error-screen');
        
        // Add temporary key listener to return to main menu
        const handleErrorKey = (e) => {
            document.removeEventListener('keydown', handleErrorKey);
            this.showScreen('main-menu');
            setTimeout(() => {
                document.getElementById('command-input').focus();
            }, 100);
        };
        
        setTimeout(() => {
            document.addEventListener('keydown', handleErrorKey);
        }, 100);
    }

    handleUserTasks() {
        const command = document.getElementById('user-tasks-command').value.toUpperCase().trim();
        document.getElementById('user-tasks-command').value = '';
        
        if (command === '1') {
            this.showError('Access denied', 'CPF2207: Not authorized to object QSYS/CHGPWD in library QSYS.');
        } else if (command === '2') {
            this.showError('No messages', 'CPF2469: Message queue QSYSOPI for user EOU contains no messages.');
        } else if (command === '3') {
            this.showError('Queue not available', 'CPF3343: Output queue QPRINT not available.');
        } else if (command === '4') {
            this.showError('Service restricted', 'CPF9801: Object QOFFICE not found. Office Services not available.');
        } else if (command === '5') {
            this.showError('PDM unavailable', 'CPF9899: Programming Development Manager not licensed on this system.');
        } else if (command === '') {
            // Just return to previous screen if empty
            this.showScreen('main-menu');
            setTimeout(() => {
                document.getElementById('command-input').focus();
            }, 100);
        } else {
            this.showError('Invalid option', 'CPF0001: Error found in application program. Invalid selection.');
        }
    }

    handleOfficeTasks() {
        const command = document.getElementById('office-tasks-command').value.toUpperCase().trim();
        document.getElementById('office-tasks-command').value = '';
        
        if (command === '1') {
            this.showError('Document library unavailable', 'CPF9810: Library QDOC not found. Document services not available.');
        } else if (command === '2') {
            this.showError('Folder access denied', 'CPF2207: Not authorized to object QSYS/FOLDERS in library QSYS.');
        } else if (command === '3') {
            this.showError('Distribution restricted', 'CPF9899: Send distribution function not available. Contact system administrator.');
        } else if (command === '4') {
            this.showError('Calendar service down', 'CPF9898: Office calendar service is temporarily unavailable.');
        } else if (command === '5') {
            this.showError('Directory unavailable', 'CPF2817: Copy command ended because of error. Directory services not accessible.');
        } else if (command === '') {
            this.showScreen('main-menu');
            setTimeout(() => {
                document.getElementById('command-input').focus();
            }, 100);
        } else {
            this.showError('Invalid option', 'CPF0001: Error found in application program. Invalid selection.');
        }
    }

    handleProgramming() {
        const command = document.getElementById('programming-command').value.toUpperCase().trim();
        document.getElementById('programming-command').value = '';
        
        if (command === '1') {
            this.showError('SEU not available', 'CPF9899: Source Entry Utility not licensed on this system.');
        } else if (command === '2') {
            this.showError('PDM access denied', 'CPF2207: Not authorized to Programming Development Manager.');
        } else if (command === '3') {
            this.showError('Utilities restricted', 'CPF9801: Object QSYS/UTIL not found. Programming utilities not available.');
        } else if (command === '4') {
            this.showError('Compiler unavailable', 'CPF9898: Compiler services are temporarily unavailable.');
        } else if (command === '5') {
            this.showError('Runtime error', 'CPF0001: Error found in application program. Cannot execute run command.');
        } else if (command === '6') {
            this.showError('Debugger not available', 'CPF9899: System debugger not available. Contact system administrator.');
        } else if (command === '') {
            this.showScreen('main-menu');
            setTimeout(() => {
                document.getElementById('command-input').focus();
            }, 100);
        } else {
            this.showError('Invalid option', 'CPF0001: Error found in application program. Invalid selection.');
        }
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
            case 'user-tasks-screen':
            case 'office-tasks-screen':
            case 'programming-screen':
            case 'error-screen':
                this.showScreen('main-menu');
                setTimeout(() => {
                    document.getElementById('command-input').focus();
                }, 100);
                break;
            case 'congratulations-screen':
                this.showScreen('wrksplf-screen');
                setTimeout(() => {
                    document.getElementById('wrksplf-command').focus();
                }, 100);
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
            
            // Set up event listeners for the new screen
            setTimeout(() => {
                this.setupSubmenuEventListeners();
            }, 50);
        }
    }

    clearForm() {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('command-input').value = '';
        document.getElementById('wrksplf-command').value = '';
        
        // Clear submenu inputs if they exist
        const userTasksInput = document.getElementById('user-tasks-command');
        if (userTasksInput) userTasksInput.value = '';
        
        const officeTasksInput = document.getElementById('office-tasks-command');
        if (officeTasksInput) officeTasksInput.value = '';
        
        const programmingInput = document.getElementById('programming-command');
        if (programmingInput) programmingInput.value = '';
        
        // Clear option inputs if they exist
        const congratsOption = document.getElementById('opt-congratsemma');
        if (congratsOption) congratsOption.value = '';
        
        const qpjoblogOption = document.getElementById('opt-qpjoblog');
        if (qpjoblogOption) qpjoblogOption.value = '';
        
        const qsysprtOption = document.getElementById('opt-qsysprt');
        if (qsysprtOption) qsysprtOption.value = '';
        
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