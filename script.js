const MAINTENANCE_MODE = false;
const SHOW_UNDER_BUILD_NOTICE = true;

const USER_EMAIL = "your-email@example.com";
const USER_INSTAGRAM = "https://instagram.com/your_username";
const PORTFOLIO_WEBSITE = "https://your-portfolio-website.com";

let peer = null;
let connections = {};
let currentMode = '';
let isHost = false;
let userName = '';
let roomCode = '';
let noticeTimer = null;

const logLines = [
    { text: "INITIALIZING SECURE MESH SYSTEM...", type: "log-green" },
    { text: "ALLOCATING VIRTUAL MEMORY SPACES...", type: "log-blue" },
    { text: "LOADING SHA-256 ENCRYPTION MODULES...", type: "log-blue" },
    { text: "ESTABLISHING RTC PEER DISCOVERY SOCKETS...", type: "log-yellow" },
    { text: "VERIFYING P2P PROTOCOLS & HANDSHAKES...", type: "log-yellow" },
    { text: "CONNECTING TO SIGNALING RELAY SERVER...", type: "log-blue" },
    { text: "ZERO LOG MEMORY BUFFER LOADED...", type: "log-green" },
    { text: "SYSTEM ALL REAL-TIME NODES READY.", type: "log-green" }
];

function runTerminal() {
    if (MAINTENANCE_MODE) {
        document.getElementById('maintenance-screen').classList.remove('hidden');
        document.getElementById('terminal-screen').classList.add('hidden');
        document.getElementById('dashboard-screen').classList.add('hidden');
        return;
    }

    const logBox = document.getElementById('terminal-logs');
    logBox.innerHTML = '';
    document.getElementById('terminal-screen').classList.remove('hidden');
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('chat-screen').classList.add('hidden');

    let lineIndex = 0;
    function typeNextLine() {
        if (lineIndex >= logLines.length) {
            setTimeout(() => {
                document.getElementById('terminal-screen').classList.add('hidden');
                document.getElementById('dashboard-screen').classList.remove('hidden');
                triggerUnderBuildNotice();
            }, 1200);
            return;
        }
        const currentLine = logLines[lineIndex];
        const div = document.createElement('div');
        div.className = currentLine.type;
        logBox.appendChild(div);

        let charIndex = 0;
        const fullText = `> ${currentLine.text}`;
        const timer = setInterval(() => {
            div.innerText = fullText.slice(0, charIndex);
            logBox.scrollTop = logBox.scrollHeight;
            charIndex++;
            if (charIndex > fullText.length) {
                clearInterval(timer);
                lineIndex++;
                setTimeout(typeNextLine, 650);
            }
        }, 35);
    }
    typeNextLine();
}

function triggerUnderBuildNotice() {
    if (SHOW_UNDER_BUILD_NOTICE) {
        const noticeModal = document.getElementById('under-build-modal');
        noticeModal.classList.remove('hidden');

        noticeTimer = setTimeout(() => {
            closeNoticeModal();
        }, 10000);
    }
}

function closeNoticeModal() {
    if(noticeTimer) clearTimeout(noticeTimer);
    document.getElementById('under-build-modal').classList.add('hidden');
}

window.onload = runTerminal;

function toggleDropdown() {
    const menu = document.getElementById('dropdown-menu');
    menu.classList.toggle('hidden');
}

function showModeSelection() {
    document.getElementById('mode-modal').classList.remove('hidden');
    document.getElementById('dropdown-menu').classList.add('hidden');
}

function openRoomForm(mode) {
    currentMode = mode;
    document.getElementById('mode-modal').classList.add('hidden');
    document.getElementById('form-modal').classList.remove('hidden');
    document.getElementById('form-title').innerText = `${mode.toUpperCase()} SETUP`;
    toggleFormMode('create');
}

function toggleFormMode(action) {
    const createTab = document.getElementById('tab-create');
    const joinTab = document.getElementById('tab-join');

    if(action === 'create') {
        createTab.classList.add('active');
        joinTab.classList.remove('active');
        document.getElementById('create-sec').classList.remove('hidden');
        document.getElementById('join-sec').classList.add('hidden');
    } else {
        joinTab.classList.add('active');
        createTab.classList.remove('active');
        document.getElementById('create-sec').classList.add('hidden');
        document.getElementById('join-sec').classList.remove('hidden');
    }
}

function closeModals() {
    document.getElementById('mode-modal').classList.add('hidden');
    document.getElementById('form-modal').classList.add('hidden');
    document.getElementById('info-modal').classList.add('hidden');
}

function openInfoModal(type) {
    document.getElementById('dropdown-menu').classList.add('hidden');
    const modal = document.getElementById('info-modal');
    modal.classList.remove('hidden');

    const title = document.getElementById('info-title');
    const body = document.getElementById('info-body');
    
    if(type === 'about') {
        title.innerText = "About SecureSphere";
        body.innerText = "SecureSphere is an end-to-end peer-to-peer secure messaging portal using WebRTC memory mesh.";
    } else if(type === 'help') {
        title.innerText = "Help & Support";
        body.innerHTML = `Create or join using a 4-char room code.<br><br>Have questions or feedback? Mail us at:<br><a class="link-btn" href="mailto:${USER_EMAIL}">${USER_EMAIL}</a>`;
    } else if(type === 'contact') {
        title.innerText = "Contact Us";
        body.innerHTML = `Designed and Developed by <strong>Riyanshu</strong>.<br><br>
        📧 Email: <a class="link-btn" href="mailto:${USER_EMAIL}">${USER_EMAIL}</a><br><br>
        📸 Instagram: <a class="link-btn" href="${USER_INSTAGRAM}" target="_blank">View Profile ↗</a>`;
    }
}

function openOtherProjects() {
    document.getElementById('dropdown-menu').classList.add('hidden');
    window.open(PORTFOLIO_WEBSITE, '_blank');
}

function closeInfoModal() { document.getElementById('info-modal').classList.add('hidden'); }

function showCustomAlert(title, message, buttons = []) {
    const modal = document.getElementById('custom-alert-modal');
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-desc').innerText = message;
    
    const actionsContainer = document.getElementById('alert-actions');
    actionsContainer.innerHTML = '';

    if(buttons.length === 0) {
        buttons = [{ text: "OK", class: "neu-primary-btn", onClick: closeCustomAlert }];
    }

    buttons.forEach(btn => {
        const b = document.createElement('button');
        b.innerText = btn.text;
        b.className = btn.class || 'neu-secondary-btn';
        b.onclick = () => {
            closeCustomAlert();
            if(btn.onClick) btn.onClick();
        };
        actionsContainer.appendChild(b);
    });

    modal.classList.remove('hidden');
}

function closeCustomAlert() {
    document.getElementById('custom-alert-modal').classList.add('hidden');
}

function initializePeer(customId = null) {
    return new Promise((resolve) => {
        peer = customId ? new Peer(customId) : new Peer();
        peer.on('open', (id) => resolve(id));
        peer.on('connection', handleIncomingConnection);
    });
}

async function handleCreateRoom() {
    userName = document.getElementById('user-name-input').value.trim() || 'Host';
    const inputCode = document.getElementById('custom-code-input').value.trim().toLowerCase();
    
    roomCode = inputCode.length === 4 ? inputCode : Math.random().toString(36).substring(2, 6);
    
    isHost = true;
    await initializePeer(`ss-${currentMode}-${roomCode}`);
    setupChatUI();
}

async function handleJoinRoom() {
    userName = document.getElementById('user-name-input').value.trim() || 'Guest';
    roomCode = document.getElementById('join-code-input').value.trim().toLowerCase();
    
    if(!roomCode || roomCode.length !== 4) {
        showCustomAlert("Invalid Code", "Please enter a valid 4-character Room Code.");
        return;
    }
    
    isHost = false;
    await initializePeer();
    
    const hostPeerId = `ss-${currentMode}-${roomCode}`;
    const conn = peer.connect(hostPeerId, { metadata: { userName } });
    
    conn.on('open', () => {
        connections[hostPeerId] = conn;
        setupConnectionListeners(conn);
        setupChatUI();
    });

    conn.on('error', () => {
        showCustomAlert("Connection Failed", "Room code not found or session closed.");
    });
}

function handleIncomingConnection(conn) {
    const remoteUser = conn.metadata ? conn.metadata.userName : 'Peer';
    
    conn.on('open', () => {
        connections[conn.peer] = conn;
        setupConnectionListeners(conn);
        broadcastSystemMsg(`${remoteUser} joined the chat`);
        updateUserCount();
    });
}

function setupConnectionListeners(conn) {
    conn.on('data', (data) => {
        if(data.type === 'chat') {
            renderMessage(data.sender, data.text, false);
            if(isHost) broadcastData(data, conn.peer);
        } else if(data.type === 'dissolve') {
            showCustomAlert("Chat Dissolved", "The session has been wiped by host.", [
                { text: "OK", class: "neu-primary-btn", onClick: restartSystem }
            ]);
        }
    });

    conn.on('close', () => {
        delete connections[conn.peer];
        updateUserCount();
    });
}

function setupChatUI() {
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('form-modal').classList.add('hidden');
    document.getElementById('chat-screen').classList.remove('hidden');

    document.getElementById('header-room-title').innerText = `Code: ${roomCode.toUpperCase()}`;
    updateUserCount();

    if(isHost) {
        document.getElementById('dissolve-btn').classList.remove('hidden');
    }

    renderSystemMsg(`Joined ${currentMode.toUpperCase()} Room as ${userName}. Code: ${roomCode.toUpperCase()}`);
}

function handleKeyPress(e) { if(e.key === 'Enter') sendChatMessage(); }

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if(!text) return;

    const payload = { type: 'chat', sender: userName, text };
    renderMessage('Me', text, true);
    broadcastData(payload);
    input.value = '';
}

function broadcastData(data, excludePeerId = null) {
    Object.keys(connections).forEach(peerId => {
        if(peerId !== excludePeerId && connections[peerId].open) {
            connections[peerId].send(data);
        }
    });
}

function renderMessage(sender, text, isMe) {
    const box = document.getElementById('chat-box');
    const msgEl = document.createElement('div');
    msgEl.className = `msg ${isMe ? 'my-msg' : 'peer-msg'} fade-item delay-1`;
    
    if(!isMe) {
        const senderDiv = document.createElement('div');
        senderDiv.className = 'msg-sender';
        senderDiv.innerText = sender;
        msgEl.appendChild(senderDiv);
    }

    msgEl.appendChild(document.createTextNode(text));
    box.appendChild(msgEl);
    box.scrollTop = box.scrollHeight;
}

function renderSystemMsg(text) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = 'msg sys-msg fade-item delay-1';
    div.innerText = text;
    box.appendChild(div);
}

function broadcastSystemMsg(text) {
    renderSystemMsg(text);
    broadcastData({ type: 'chat', sender: 'SYSTEM', text });
}

function updateUserCount() {
    const count = Object.keys(connections).length + 1;
    document.getElementById('active-user-count').innerText = `${count} User${count > 1 ? 's' : ''} Online`;
}

function promptDissolve() {
    showCustomAlert("Dissolve Session", "Are you sure you want to dissolve this chat? All data will be wiped.", [
        { text: "Cancel", class: "neu-secondary-btn", onClick: closeCustomAlert },
        { text: "Dissolve", class: "danger-btn", onClick: executeDissolve }
    ]);
}

function executeDissolve() {
    broadcastData({ type: 'dissolve' });
    setTimeout(() => {
        restartSystem();
    }, 300);
}

function restartSystem() {
    if(peer) peer.destroy();
    connections = {};
    currentMode = '';
    isHost = false;
    userName = '';
    roomCode = '';
    document.getElementById('chat-box').innerHTML = '';
    document.getElementById('dissolve-btn').classList.add('hidden');
    runTerminal();
}
