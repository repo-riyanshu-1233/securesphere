document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const terminalScreen = document.getElementById('terminal-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const noticeModal = document.getElementById('notice-modal');
    const setupModal = document.getElementById('setup-modal');
    const infoModal = document.getElementById('info-modal');
    const chatScreen = document.getElementById('chat-screen');
    const userSelectModal = document.getElementById('user-select-modal');

    const openNoticeBtn = document.getElementById('open-notice-btn');
    const proceedToSetupBtn = document.getElementById('proceed-to-setup-btn');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    const closeNoticeBtn = document.getElementById('close-notice-btn');
    const closeSetupBtn = document.getElementById('close-setup-btn');
    const closeInfoBtn = document.getElementById('close-info-btn');
    const closeUserSelectBtn = document.getElementById('close-user-select-btn');

    const createRoomBtn = document.getElementById('create-room-btn');
    const joinRoomBtn = document.getElementById('join-room-btn');
    const exitChatBtn = document.getElementById('exit-chat-btn');
    const dissolveChatBtn = document.getElementById('dissolve-chat-btn');
    const sendMsgBtn = document.getElementById('send-msg-btn');
    const broadcastSelectBtn = document.getElementById('broadcast-select-btn');

    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatRoomTitle = document.getElementById('chat-room-title');
    const chatRoomType = document.getElementById('chat-room-type');
    const userList = document.getElementById('user-list');

    let selectedMode = 'group';
    let currentRecipient = 'All';
    let mockUsers = ['User_Alpha', 'User_Beta', 'User_Cyber'];

    // 1. TERMINAL BOOT ANIMATION WITH FADE OUT
    setTimeout(() => {
        terminalScreen.classList.add('fade-out');
        setTimeout(() => {
            terminalScreen.classList.add('hidden');
            terminalScreen.classList.remove('fade-out');
            dashboardScreen.classList.remove('hidden');
            dashboardScreen.classList.add('fade-in');
        }, 600);
    }, 2200);

    // MENU TOGGLE
    menuToggleBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
    });

    // OPEN SETUP VIA NOTICE
    openNoticeBtn.addEventListener('click', () => {
        noticeModal.classList.remove('hidden');
    });

    proceedToSetupBtn.addEventListener('click', () => {
        noticeModal.classList.add('hidden');
        setupModal.classList.remove('hidden');
    });

    // CLOSE MODALS
    closeNoticeBtn.addEventListener('click', () => noticeModal.classList.add('hidden'));
    closeSetupBtn.addEventListener('click', () => setupModal.classList.add('hidden'));
    closeInfoBtn.addEventListener('click', () => infoModal.classList.add('hidden'));
    closeUserSelectBtn.addEventListener('click', () => userSelectModal.classList.add('hidden'));

    // TAB SELECTION (GROUP / PRIVATE / BROADCAST)
    const tabs = document.querySelectorAll('.neu-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            selectedMode = e.target.getAttribute('data-type');
        });
    });

    // START CHAT ROOM
    function startChatSession(action) {
        const username = document.getElementById('user-name-input').value.trim() || 'Anonymous';
        const code = document.getElementById('room-code-input').value.trim() || Math.floor(1000 + Math.random() * 9000);

        setupModal.classList.add('hidden');
        dashboardScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');

        chatRoomTitle.textContent = `Room: #${code}`;
        chatRoomType.textContent = `${selectedMode.toUpperCase()} MODE (${username})`;

        // Show Broadcast "+" button if broadcast mode
        if (selectedMode === 'broadcast') {
            broadcastSelectBtn.classList.remove('hidden');
        } else {
            broadcastSelectBtn.classList.add('hidden');
        }

        // Add System Join Msg
        chatMessages.innerHTML = `<div class="msg sys-msg">Encrypted session started in ${selectedMode} mode.</div>`;
    }

    createRoomBtn.addEventListener('click', () => startChatSession('create'));
    joinRoomBtn.addEventListener('click', () => startChatSession('join'));

    // SEND MESSAGE
    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg my-msg';
        
        if (selectedMode === 'broadcast' && currentRecipient !== 'All') {
            msgDiv.textContent = `[To ${currentRecipient}]: ${text}`;
        } else {
            msgDiv.textContent = text;
        }

        chatMessages.appendChild(msgDiv);
        messageInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendMsgBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // BROADCAST SELECT RECIPIENT (+)
    broadcastSelectBtn.addEventListener('click', () => {
        userList.innerHTML = '';
        mockUsers.forEach(u => {
            const item = document.createElement('div');
            item.className = 'user-item';
            item.textContent = u;
            item.addEventListener('click', () => {
                currentRecipient = u;
                alert(`Direct target set to: ${u}`);
                userSelectModal.classList.add('hidden');
            });
            userList.appendChild(item);
        });
        userSelectModal.classList.remove('hidden');
    });

    // EXIT CHAT (NO TERMINAL - DIRECT DASHBOARD)
    exitChatBtn.addEventListener('click', () => {
        chatScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
    });

    // DISSOLVE CHAT (RESET EVERYTHING BACK TO TERMINAL BOOT)
    dissolveChatBtn.addEventListener('click', () => {
        chatScreen.classList.add('hidden');
        dashboardScreen.classList.add('hidden');
        terminalScreen.classList.remove('hidden');

        // Re-trigger Terminal Sequence
        setTimeout(() => {
            terminalScreen.classList.add('fade-out');
            setTimeout(() => {
                terminalScreen.classList.add('hidden');
                terminalScreen.classList.remove('fade-out');
                dashboardScreen.classList.remove('hidden');
            }, 600);
        }, 1800);
    });

    // DROPDOWN NAV INFO
    const showInfo = (title, text) => {
        document.getElementById('info-title').textContent = title;
        document.getElementById('info-body').textContent = text;
        dropdownMenu.classList.add('hidden');
        infoModal.classList.remove('hidden');
    };

    document.getElementById('nav-about').addEventListener('click', () => showInfo('About SecureSphere', 'SecureSphere is a lightweight, zero-log, end-to-end encrypted messaging interface designed for peer-to-peer confidentiality.'));
    document.getElementById('nav-help').addEventListener('click', () => showInfo('Help & Usage', '1. Click Start Chatting.\n2. Choose Chat Mode.\n3. Enter Room Code & Join.\n4. Dissolve destroys the active session context immediately.'));
    document.getElementById('nav-contact').addEventListener('click', () => showInfo('Contact Us', 'Support Email: support@securesphere.io\nInstagram: @securesphere.official'));
    document.getElementById('nav-projects').addEventListener('click', () => showInfo('Other Projects', 'Explore our suite of security-first utilities at https://securesphere.io/ecosystem'));
});
