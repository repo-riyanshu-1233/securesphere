const MAINTENANCE_MODE = true;
const SHOW_UNDER_BUILD_NOTICE = true;
const USER_EMAIL = "riyanshusinh@gmail.com ";
const USER_INSTAGRAM = "https://instagram.com/riyanshu1233";
const PORTFOLIO_WEBSITE = "https://riyanshusinhweb.onrender.com";

let peer = null;
let connections = {};
let peerUserNames = {};
let peerPermissions = {};
let currentMode = '';
let isHost = false;
let userName = '';
let roomCode = '';
let noticeTimer = null;
let canIWriteInShareIt = false;

const logLines = [
    { text: "INITIALIZING SECURE NETWORK SYSTEM...", type: "log-green" },
    { text: "ALLOCATING PRIVATE E2E ENCRYPTION...", type: "log-blue" },
    { text: "LOADING ENCRYPTION MODULES...", type: "log-blue" },
    { text: "ESTABLISHING PRIVATE SERVER...", type: "log-yellow" },
    { text: "VERIFYING YOUR SYSTEM...", type: "log-yellow" },
    { text: "CONNECTING TO SECURESPHERE SERVER...", type: "log-blue" },
    { text: "DEVELOPED BY RIYANSHUSINH.DEV.AI..", type: "log-green" },
    { text: "SYSTEM ALL NODES READY CONNECTION ESTABLISHED.", type: "log-green" }
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
    document.getElementById('terminal-screen').classList.remove('fade-out-terminal');
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('chat-screen').classList.add('hidden');

    let lineIndex = 0;
    function typeNextLine() {
        if (lineIndex >= logLines.length) {
            setTimeout(() => {
                const termScreen = document.getElementById('terminal-screen');
                termScreen.classList.add('fade-out-terminal');
                setTimeout(() => {
                    termScreen.classList.add('hidden');
                    termScreen.classList.remove('fade-out-terminal');
                    document.getElementById('dashboard-screen').classList.remove('hidden');
                    triggerUnderBuildNotice();
                }, 550);
            }, 1000);
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
                setTimeout(typeNextLine, 25);
            }
        }, 25);
    }
    typeNextLine();
}

function triggerUnderBuildNotice() {
    if (SHOW_UNDER_BUILD_NOTICE) {
        const noticeModal = document.getElementById('under-build-modal');
        if(noticeModal) {
            noticeModal.classList.remove('hidden');
            noticeTimer = setTimeout(() => { closeNoticeModal(); }, 10000);
        }
    }
}

function closeNoticeModal() {
    if(noticeTimer) clearTimeout(noticeTimer);
    const noticeModal = document.getElementById('under-build-modal');
    if(noticeModal) noticeModal.classList.add('hidden');
}

window.onload = runTerminal;

function toggleDropdown() { document.getElementById('dropdown-menu').classList.toggle('hidden'); }

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
    document.getElementById('permission-modal').classList.add('hidden');
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

function closeCustomAlert() { document.getElementById('custom-alert-modal').classList.add('hidden'); }

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
    canIWriteInShareIt = true;
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
    canIWriteInShareIt = false;
    await initializePeer();
    const hostPeerId = `ss-${currentMode}-${roomCode}`;
    const conn = peer.connect(hostPeerId, { metadata: { userName } });
    
    conn.on('open', () => {
        connections[hostPeerId] = conn;
        peerUserNames[hostPeerId] = 'Host';
        setupConnectionListeners(conn);
        setupChatUI();
    });
    
    conn.on('error', () => { showCustomAlert("Connection Failed", "Room code not found or session closed."); });
}

function handleIncomingConnection(conn) {
    const remoteUser = (conn.metadata && conn.metadata.userName) ? conn.metadata.userName : 'Peer';
    conn.on('open', () => {
        connections[conn.peer] = conn;
        peerUserNames[conn.peer] = remoteUser;
        peerPermissions[conn.peer] = (currentMode !== 'shareit'); // Auto-allow if not ShareIt mode
        
        setupConnectionListeners(conn);
        
        // Broadcast joined message to all peers & render locally
        broadcastSystemMsg(`${remoteUser} joined the chat`);
        updateUserCount();
        if(isHost && currentMode === 'shareit') updatePermissionModalUI();
    });
}

function setupConnectionListeners(conn) {
    conn.on('data', (data) => {
        if(data.type === 'chat') {
            // FIX: Render message on current device when received
            renderMessage(data.sender, data.text, false);
            // If host, forward message to other connected clients
            if(isHost) broadcastData(data, conn.peer);
        } else if(data.type === 'sys_msg') {
            renderSystemMsg(data.text);
            if(isHost) broadcastData(data, conn.peer);
        } else if(data.type === 'dissolve') {
            showCustomAlert("Chat Dissolved", "The session has been wiped by host.", [
                { text: "OK", class: "neu-primary-btn", onClick: restartSystem }
            ]);
        } else if(data.type === 'perm_update') {
            if(!isHost) {
                canIWriteInShareIt = !!data.allowed;
                applyInputPermissionState();
                renderSystemMsg(data.allowed ? "Host has granted you chat permissions." : "Host has revoked your chat permissions.");
            }
        }
    });
    
    conn.on('close', () => {
        const leavingUser = peerUserNames[conn.peer] || 'User';
        delete connections[conn.peer];
        delete peerUserNames[conn.peer];
        delete peerPermissions[conn.peer];
        
        renderSystemMsg(`${leavingUser} left the chat`);
        updateUserCount();
        if(isHost && currentMode === 'shareit') updatePermissionModalUI();
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
        if(currentMode === 'shareit') document.getElementById('permission-btn').classList.remove('hidden');
        else document.getElementById('permission-btn').classList.add('hidden');
    } else {
        document.getElementById('dissolve-btn').classList.add('hidden');
        document.getElementById('permission-btn').classList.add('hidden');
    }
    applyInputPermissionState();
    renderSystemMsg(`Joined ${currentMode.toUpperCase()} Room as ${userName}. Code: ${roomCode.toUpperCase()}`);
}

function applyInputPermissionState() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-msg-btn');
    
    if(!input || !sendBtn) return;
    
    if(currentMode === 'shareit') {
        if(isHost || canIWriteInShareIt) {
            input.disabled = false;
            sendBtn.disabled = false;
            input.placeholder = "Type a message...";
        } else {
            input.disabled = true;
            sendBtn.disabled = true;
            input.placeholder = "Only Host/Permitted users can send messages...";
        }
    } else {
        input.disabled = false;
        sendBtn.disabled = false;
        input.placeholder = "Type a message...";
    }
}

function openPermissionModal() {
    updatePermissionModalUI();
    document.getElementById('permission-modal').classList.remove('hidden');
}

function closePermissionModal() { document.getElementById('permission-modal').classList.add('hidden'); }

function updatePermissionModalUI() {
    const list = document.getElementById('user-perm-list');
    if(!list) return;
    list.innerHTML = '';
    const peerIds = Object.keys(connections);
    if(peerIds.length === 0) {
        list.innerHTML = '<div style="font-size:12px; color:#666; text-align:center; padding:10px;">No users connected yet.</div>';
        return;
    }
    let allChecked = true;
    peerIds.forEach(pId => {
        const uName = peerUserNames[pId] || 'User';
        const isAllowed = !!peerPermissions[pId];
        if(!isAllowed) allChecked = false;
        const item = document.createElement('div');
        item.className = 'user-perm-item';
        const nameSpan = document.createElement('span');
        nameSpan.innerText = uName;
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.checked = isAllowed;
        chk.onchange = (e) => toggleUserPermission(pId, e.target.checked);
        item.appendChild(nameSpan);
        item.appendChild(chk);
        list.appendChild(item);
    });
    const selectAll = document.getElementById('select-all-perm');
    if(selectAll) selectAll.checked = allChecked;
}

function toggleUserPermission(peerId, isAllowed) {
    peerPermissions[peerId] = isAllowed;
    if(connections[peerId] && connections[peerId].open) connections[peerId].send({ type: 'perm_update', allowed: isAllowed });
    updatePermissionModalUI();
}

function toggleSelectAllPermissions(isAllowed) {
    Object.keys(connections).forEach(pId => {
        peerPermissions[pId] = isAllowed;
        if(connections[pId] && connections[pId].open) connections[pId].send({ type: 'perm_update', allowed: isAllowed });
    });
    updatePermissionModalUI();
}

function handleKeyPress(e) { if(e.key === 'Enter') sendChatMessage(); }

function sendChatMessage() {
    if(currentMode === 'shareit' && !isHost && !canIWriteInShareIt) return;
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if(!text) return;
    
    const payload = { type: 'chat', sender: userName, text };
    
    // Apne screen par message render karo
    renderMessage(userName, text, true);
    
    // Sabhi connected clients/host ko bhejo
    broadcastData(payload);
    
    input.value = '';
}

function broadcastData(data, excludePeerId = null) {
    Object.keys(connections).forEach(peerId => {
        if(peerId !== excludePeerId && connections[peerId] && connections[peerId].open) {
            connections[peerId].send(data);
        }
    });
}

function renderMessage(sender, text, isMe) {
    const box = document.getElementById('chat-box');
    if(!box) return;
    
    const container = document.createElement('div');
    container.className = `msg-container ${isMe ? 'my-msg' : 'peer-msg'}`;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'msg-sender';
    nameDiv.innerText = isMe ? 'Me' : sender;

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerText = text;

    container.appendChild(nameDiv);
    container.appendChild(bubble);
    box.appendChild(container);
    box.scrollTop = box.scrollHeight;
}

// FIX: Small system notification (like 'username joined') centered in chat
function renderSystemMsg(text) {
    const box = document.getElementById('chat-box');
    if(!box) return;
    
    const div = document.createElement('div');
    div.className = 'sys-msg';
    div.innerText = text;
    
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function broadcastSystemMsg(text) {
    renderSystemMsg(text);
    broadcastData({ type: 'sys_msg', text });
}

function updateUserCount() {
    const count = Object.keys(connections).length + 1;
    const countEl = document.getElementById('active-user-count');
    if(countEl) countEl.innerText = `${count} User${count > 1 ? 's' : ''} Online`;
}

function promptDissolve() {
    showCustomAlert("Dissolve Session", "Are you sure you want to dissolve this chat? All data will be wiped.", [
        { text: "Cancel", class: "neu-secondary-btn", onClick: closeCustomAlert },
        { text: "Dissolve", class: "danger-btn", onClick: executeDissolve }
    ]);
}

function executeDissolve() {
    broadcastData({ type: 'dissolve' });
    setTimeout(() => { restartSystem(); }, 300);
}

function restartSystem() {
    if(peer) peer.destroy();
    connections = {};
    peerUserNames = {};
    peerPermissions = {};
    currentMode = '';
    isHost = false;
    userName = '';
    roomCode = '';
    canIWriteInShareIt = false;
    
    const chatBox = document.getElementById('chat-box');
    if(chatBox) chatBox.innerHTML = '';
    
    document.getElementById('dissolve-btn').classList.add('hidden');
    document.getElementById('permission-btn').classList.add('hidden');
    document.getElementById('chat-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
}
