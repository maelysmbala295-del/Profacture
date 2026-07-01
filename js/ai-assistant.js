// ===================================
// ProFacture - Assistant IA
// ===================================

(function() {
    // Vérifier si l'assistant doit s'afficher (nouveau user ou première visite)
    const session = JSON.parse(localStorage.getItem('pf_session') || '{}');
    if (!session.email) return;

    const assistantKey = 'pf_assistant_seen_' + session.email;
    const isNewUser = !localStorage.getItem(assistantKey);
    const factures = JSON.parse(localStorage.getItem('pf_factures') || '[]');
    const devis = JSON.parse(localStorage.getItem('pf_devis') || '[]');
    const clients = JSON.parse(localStorage.getItem('pf_clients') || '[]');

    // Messages de l'assistant IA
    const AI_KNOWLEDGE = {
        "bonjour": "Bonjour ! Je suis votre assistant ProFacture. Je peux vous aider à créer des factures, des devis, gérer vos clients et bien plus encore. Que souhaitez-vous faire ?",
        "aide": "Voici ce que je peux faire pour vous :\n• Créer une facture ou un devis\n• Gérer vos clients\n• Expliquer comment fonctionne le QR code\n• Générer un PDF\n• Naviguer dans l'application",
        "facture": "Pour créer une facture : allez dans **Factures** → cliquez sur **Nouvelle Facture** → remplissez le formulaire → cliquez **Enregistrer**. La facture sera automatiquement sauvegardée avec un QR code unique !",
        "devis": "Pour créer un devis : allez dans **Devis** → cliquez sur **Nouveau Devis** → remplissez les informations → cliquez **Enregistrer**. Le devis sera disponible pour conversion en facture.",
        "client": "Pour ajouter un client : allez dans **Clients** → cliquez sur **Nouveau Client** → remplissez les informations. Ce client sera ensuite disponible lors de la création de factures et devis.",
        "qr": "Le QR code est généré automatiquement pour chaque document. En cas de perte, votre client peut venir à l'entreprise, vous entrez son nom + type de document + numéro, et le QR code réapparaît pour qu'il le scanne !",
        "pdf": "Pour générer un PDF : ouvrez la liste des Factures ou Devis → trouvez votre document → cliquez sur le bouton **PDF** (icône de téléchargement). Le PDF sera téléchargé avec le QR code inclus.",
        "connexion": "Pour se connecter, utilisez votre email et mot de passe créés lors de l'inscription. Si vous avez oublié vos identifiants, créez un nouveau compte.",
        "statistiques": "Le tableau de bord affiche vos statistiques : nombre de factures, devis, clients, et chiffre d'affaires total. Tout est calculé en temps réel !",
        "default": "Je ne suis pas sûr de comprendre. Essayez de demander : 'créer une facture', 'ajouter un client', 'générer PDF', ou 'comment fonctionne le QR code'."
    };

    function getAIResponse(message) {
        const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello')) return AI_KNOWLEDGE['bonjour'];
        if (msg.includes('facture')) return AI_KNOWLEDGE['facture'];
        if (msg.includes('devis')) return AI_KNOWLEDGE['devis'];
        if (msg.includes('client')) return AI_KNOWLEDGE['client'];
        if (msg.includes('qr') || msg.includes('code') || msg.includes('perte')) return AI_KNOWLEDGE['qr'];
        if (msg.includes('pdf') || msg.includes('telecharger') || msg.includes('imprimer')) return AI_KNOWLEDGE['pdf'];
        if (msg.includes('connexion') || msg.includes('connecter') || msg.includes('compte')) return AI_KNOWLEDGE['connexion'];
        if (msg.includes('stat') || msg.includes('tableau') || msg.includes('dashboard')) return AI_KNOWLEDGE['statistiques'];
        if (msg.includes('aide') || msg.includes('help') || msg.includes('comment')) return AI_KNOWLEDGE['aide'];
        // Stats live
        if (msg.includes('combien') || msg.includes('nombre')) {
            return `Actuellement dans votre compte :\n• ${factures.length} facture(s)\n• ${devis.length} devis\n• ${clients.length} client(s)`;
        }
        return AI_KNOWLEDGE['default'];
    }

    // Créer l'interface de l'assistant
    function createAssistantUI() {
        const css = `
        #pf-assistant { position:fixed; bottom:24px; right:24px; z-index:9999; font-family:'Segoe UI',system-ui,sans-serif; }
        #pf-assistant-btn {
            width:60px; height:60px; border-radius:50%;
            background:linear-gradient(135deg,#667eea,#764ba2);
            border:none; color:white; font-size:26px;
            cursor:pointer; box-shadow:0 4px 20px rgba(102,126,234,0.5);
            display:flex; align-items:center; justify-content:center;
            transition:all 0.3s; position:relative;
        }
        #pf-assistant-btn:hover { transform:scale(1.1); box-shadow:0 8px 30px rgba(102,126,234,0.6); }
        #pf-assistant-btn .notif-dot {
            position:absolute; top:2px; right:2px;
            width:14px; height:14px; border-radius:50%;
            background:#ff5722; border:2px solid white;
            animation:pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.3)} }
        #pf-chat-box {
            position:absolute; bottom:70px; right:0;
            width:340px; background:white; border-radius:20px;
            box-shadow:0 20px 60px rgba(0,0,0,0.2);
            display:none; flex-direction:column;
            max-height:480px; overflow:hidden;
            animation:chatOpen 0.3s cubic-bezier(.22,.68,0,1.2);
        }
        @keyframes chatOpen { from{opacity:0;transform:scale(0.8) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        #pf-chat-box.open { display:flex; }
        .chat-head {
            background:linear-gradient(135deg,#667eea,#764ba2);
            padding:14px 18px; border-radius:20px 20px 0 0;
            display:flex; align-items:center; justify-content:space-between;
        }
        .chat-head-left { display:flex; align-items:center; gap:10px; }
        .ai-avatar {
            width:36px; height:36px; border-radius:50%;
            background:rgba(255,255,255,0.25);
            display:flex; align-items:center; justify-content:center;
            font-size:18px;
        }
        .chat-head h4 { color:white; font-size:15px; font-weight:700; margin:0; }
        .chat-head p { color:rgba(255,255,255,0.75); font-size:11px; margin:0; }
        .chat-close-btn { background:none; border:none; color:rgba(255,255,255,0.8); font-size:20px; cursor:pointer; padding:2px; }
        .chat-close-btn:hover { color:white; }
        .chat-messages { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px; min-height:200px; max-height:300px; }
        .msg { max-width:85%; padding:10px 13px; border-radius:14px; font-size:13px; line-height:1.5; animation:msgIn 0.25s ease; }
        @keyframes msgIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .msg-ai { background:#f0f2ff; color:#333; align-self:flex-start; border-radius:4px 14px 14px 14px; }
        .msg-user { background:linear-gradient(135deg,#667eea,#764ba2); color:white; align-self:flex-end; border-radius:14px 14px 4px 14px; }
        .msg-ai strong { color:#667eea; }
        .chat-suggestions { padding:0 12px 10px; display:flex; flex-wrap:wrap; gap:6px; }
        .sug-btn { background:#f0f2ff; border:1px solid #d4d8f8; color:#667eea; border-radius:20px; padding:5px 11px; font-size:11px; font-weight:600; cursor:pointer; transition:all 0.2s; }
        .sug-btn:hover { background:#667eea; color:white; border-color:#667eea; }
        .chat-input-area { display:flex; gap:8px; padding:12px 14px; border-top:1px solid #f0f0f0; }
        .chat-input { flex:1; border:2px solid #e8e8f0; border-radius:10px; padding:9px 12px; font-size:13px; outline:none; transition:border 0.2s; }
        .chat-input:focus { border-color:#667eea; }
        .chat-send-btn { background:linear-gradient(135deg,#667eea,#764ba2); border:none; border-radius:10px; color:white; padding:0 14px; cursor:pointer; font-size:16px; transition:all 0.2s; }
        .chat-send-btn:hover { transform:scale(1.05); }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        const html = `
        <div id="pf-assistant">
            <div id="pf-chat-box">
                <div class="chat-head">
                    <div class="chat-head-left">
                        <div class="ai-avatar">🤖</div>
                        <div><h4>Assistant ProFacture</h4><p>🟢 En ligne • Réponse immédiate</p></div>
                    </div>
                    <button class="chat-close-btn" onclick="window.pfToggleChat()">✕</button>
                </div>
                <div class="chat-messages" id="pfChatMessages"></div>
                <div class="chat-suggestions" id="pfSuggestions">
                    <button class="sug-btn" onclick="window.pfSendSuggestion('Créer une facture')">📄 Créer une facture</button>
                    <button class="sug-btn" onclick="window.pfSendSuggestion('Comment fonctionne le QR code')">📱 QR Code</button>
                    <button class="sug-btn" onclick="window.pfSendSuggestion('Générer un PDF')">⬇️ PDF</button>
                    <button class="sug-btn" onclick="window.pfSendSuggestion('Voir mes statistiques')">📊 Stats</button>
                </div>
                <div class="chat-input-area">
                    <input class="chat-input" id="pfChatInput" type="text" placeholder="Posez votre question..." maxlength="200">
                    <button class="chat-send-btn" onclick="window.pfSendMessage()">➤</button>
                </div>
            </div>
            <button id="pf-assistant-btn" onclick="window.pfToggleChat()">
                🤖<div class="notif-dot"></div>
            </button>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);

        // Écouter Entrée
        document.getElementById('pfChatInput').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') window.pfSendMessage();
        });

        // Message de bienvenue
        setTimeout(() => {
            const welcomeMsg = isNewUser
                ? `Bienvenue sur ProFacture, **${session.fullName || 'utilisateur'}** ! 👋\n\nJe suis votre assistant IA. Je suis là pour vous guider dans l'utilisation de la plateforme. Cliquez sur une suggestion ou posez-moi une question !`
                : `Bonjour **${session.fullName || ''}** ! Comment puis-je vous aider aujourd'hui ?`;
            addMessage(welcomeMsg, 'ai');
            if (isNewUser) localStorage.setItem(assistantKey, '1');
        }, 500);
    }

    function addMessage(text, from) {
        const box = document.getElementById('pfChatMessages');
        if (!box) return;
        const div = document.createElement('div');
        div.className = 'msg msg-' + from;
        // Convertir **bold** en <strong>
        div.innerHTML = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
    }

    window.pfToggleChat = function() {
        const box = document.getElementById('pf-chat-box');
        const notif = document.querySelector('#pf-assistant-btn .notif-dot');
        box.classList.toggle('open');
        if (notif) notif.style.display = 'none';
    };

    window.pfSendMessage = function() {
        const input = document.getElementById('pfChatInput');
        const msg = (input.value || '').trim();
        if (!msg) return;
        addMessage(msg, 'user');
        input.value = '';
        // Masquer les suggestions après le premier message
        document.getElementById('pfSuggestions').style.display = 'none';
        setTimeout(() => {
            const response = getAIResponse(msg);
            addMessage(response, 'ai');
        }, 600);
    };

    window.pfSendSuggestion = function(text) {
        addMessage(text, 'user');
        document.getElementById('pfSuggestions').style.display = 'none';
        setTimeout(() => {
            const response = getAIResponse(text);
            addMessage(response, 'ai');
        }, 600);
    };

    // Auto-ouvrir pour les nouveaux utilisateurs
    if (isNewUser) {
        setTimeout(() => {
            const box = document.getElementById('pf-chat-box');
            if (box) box.classList.add('open');
        }, 1500);
    }

    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createAssistantUI);
    } else {
        createAssistantUI();
    }
})();
