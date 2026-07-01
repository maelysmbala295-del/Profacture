// ===================================
// ProFacture - Script principal
// Données stockées dans localStorage
// Plateforme neutre - aucune donnée fictive
// ===================================

// ===================================================
// Protection de session
// ===================================================
(function checkSession() {
    const publicPages = ['index.html', 'login.html', 'signup.html', ''];
    const page = window.location.pathname.split('/').pop();
    if (!publicPages.includes(page)) {
        if (!localStorage.getItem('pf_session')) {
            window.location.href = '../index.html';
        }
    }
})();

// ===================================================
// Gestion des données (localStorage)
// ===================================================
const DB = {
    // Clients
    getClients() { return JSON.parse(localStorage.getItem('pf_clients') || '[]'); },
    saveClients(data) { localStorage.setItem('pf_clients', JSON.stringify(data)); },
    addClient(client) {
        const clients = this.getClients();
        client.id = 'C' + Date.now();
        clients.push(client);
        this.saveClients(clients);
        return client;
    },
    updateClient(id, data) {
        const clients = this.getClients();
        const idx = clients.findIndex(c => c.id === id);
        if (idx !== -1) { clients[idx] = { ...clients[idx], ...data }; this.saveClients(clients); }
    },
    deleteClient(id) {
        const clients = this.getClients().filter(c => c.id !== id);
        this.saveClients(clients);
    },

    // Factures
    getFactures() { return JSON.parse(localStorage.getItem('pf_factures') || '[]'); },
    saveFactures(data) { localStorage.setItem('pf_factures', JSON.stringify(data)); },
    addFacture(f) {
        const factures = this.getFactures();
        const num = factures.length + 1;
        f.id = 'F' + Date.now();
        f.numero = 'FAC-' + String(num).padStart(3, '0');
        factures.push(f);
        this.saveFactures(factures);
        return f;
    },
    updateFacture(id, data) {
        const factures = this.getFactures();
        const idx = factures.findIndex(f => f.id === id);
        if (idx !== -1) { factures[idx] = { ...factures[idx], ...data }; this.saveFactures(factures); }
    },
    deleteFacture(id) {
        const factures = this.getFactures().filter(f => f.id !== id);
        this.saveFactures(factures);
    },

    // Devis
    getDevis() { return JSON.parse(localStorage.getItem('pf_devis') || '[]'); },
    saveDevis(data) { localStorage.setItem('pf_devis', JSON.stringify(data)); },
    addDevis(d) {
        const devis = this.getDevis();
        const num = devis.length + 1;
        d.id = 'D' + Date.now();
        d.numero = 'DEV-' + String(num).padStart(3, '0');
        devis.push(d);
        this.saveDevis(devis);
        return d;
    },
    updateDevis(id, data) {
        const devis = this.getDevis();
        const idx = devis.findIndex(d => d.id === id);
        if (idx !== -1) { devis[idx] = { ...devis[idx], ...data }; this.saveDevis(devis); }
    },
    deleteDevis(id) {
        const devis = this.getDevis().filter(d => d.id !== id);
        this.saveDevis(devis);
    },
};

// ===================================================
// Utilitaires
// ===================================================
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

function formatDate(isoDate) {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    return d.toLocaleDateString('fr-FR');
}

function getSession() {
    return JSON.parse(localStorage.getItem('pf_session') || '{}');
}

function logout() {
    localStorage.removeItem('pf_session');
    window.location.href = '../index.html';
}

// ===================================================
// Initialisation commune (navbar user info + logout)
// ===================================================
document.addEventListener('DOMContentLoaded', function () {
    // Afficher nom utilisateur dans la navbar
    const session = getSession();
    const userNameEl = document.getElementById('navUserName');
    if (userNameEl && session.fullName) {
        userNameEl.textContent = session.fullName;
    }

    // Déconnexion
    document.querySelectorAll('.btn-logout').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
});

console.log('ProFacture v4 - Chargé');
