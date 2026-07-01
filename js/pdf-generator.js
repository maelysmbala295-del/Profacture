// ===================================
// ProFacture v5 - Générateur PDF
// ===================================

/**
 * PDF FACTURE
 */
function generateFacturePDF(facture) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const session = JSON.parse(localStorage.getItem('pf_session') || '{}');

    const primary = [102, 126, 234];
    const purple  = [118, 75, 162];
    const dark    = [26, 26, 46];
    const grey    = [100, 100, 100];

    // En-tête
    doc.setFillColor(...primary);
    doc.rect(0, 0, 210, 42, 'F');
    doc.setFillColor(...purple);
    doc.triangle(140, 0, 210, 0, 210, 42, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28); doc.setFont(undefined, 'bold');
    doc.text('FACTURE', 14, 26);

    const num = facture.numero || facture.number || 'FAC-000';
    doc.setFontSize(9); doc.setFont(undefined, 'normal');
    doc.text('N : ' + num, 145, 14);
    doc.text('Date : ' + fmtDate(facture.date), 145, 21);
    doc.text('Statut : ' + (facture.statut || 'En attente'), 145, 28);
    doc.text('Emis le : ' + new Date().toLocaleDateString('fr-FR'), 145, 35);

    // Entreprise
    doc.setTextColor(...dark);
    doc.setFontSize(11); doc.setFont(undefined, 'bold');
    doc.text(session.companyName || 'ProFacture', 14, 56);
    doc.setFontSize(9); doc.setFont(undefined, 'normal');
    doc.setTextColor(...grey);
    if (session.email) doc.text('Email : ' + session.email, 14, 63);

    // Client
    doc.setFillColor(245, 247, 255);
    doc.roundedRect(115, 48, 80, 32, 4, 4, 'F');
    doc.setDrawColor(...primary); doc.setLineWidth(0.4);
    doc.roundedRect(115, 48, 80, 32, 4, 4, 'S');
    doc.setTextColor(...dark); doc.setFontSize(9); doc.setFont(undefined, 'bold');
    doc.text('Facture a :', 120, 56);
    doc.setFont(undefined, 'normal');
    const clientName = facture.clientName || facture.client || '';
    doc.text(clientName, 120, 63);
    if (facture.clientEmail) doc.text(facture.clientEmail, 120, 69);
    if (facture.clientPhone) doc.text(facture.clientPhone, 120, 75);

    // Séparateur
    doc.setDrawColor(...primary); doc.setLineWidth(0.6);
    doc.line(14, 86, 196, 86);

    // Tableau articles
    const items = facture.items && facture.items.length > 0
        ? facture.items
        : [{ description: facture.description || 'Prestation', quantity: 1, unitPrice: facture.montant || facture.amount || 0 }];

    const tableBody = items.map(function(item) {
        const qty   = Number(item.quantity  || 1);
        const price = Number(item.unitPrice || 0);
        return [ item.description || '-', String(qty), fmtMoney(price), fmtMoney(qty * price) ];
    });

    doc.autoTable({
        startY: 90,
        head: [['Description', 'Qte', 'Prix unitaire', 'Total']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: primary, textColor: [255,255,255], fontStyle: 'bold', fontSize: 10, cellPadding: 4 },
        bodyStyles: { textColor: dark, fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: [248, 249, 255] },
        columnStyles: {
            0: { cellWidth: 85 },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 42, halign: 'right' },
            3: { cellWidth: 42, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 14, right: 14 }
    });

    const finalY = doc.lastAutoTable.finalY + 4;
    const total = facture.montant || facture.amount ||
        items.reduce(function(s, i) { return s + (Number(i.quantity||1) * Number(i.unitPrice||0)); }, 0);

    // Bloc total
    doc.setFillColor(...primary);
    doc.roundedRect(120, finalY + 2, 76, 14, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12); doc.setFont(undefined, 'bold');
    doc.text('TOTAL : ' + fmtMoney(total), 158, finalY + 11, { align: 'center' });

    // Mentions bas de page
    const noteY = finalY + 22;
    doc.setFillColor(248, 249, 255);
    doc.roundedRect(14, noteY, 182, 22, 4, 4, 'F');
    doc.setTextColor(...grey); doc.setFontSize(8); doc.setFont(undefined, 'normal');
    doc.text('Conditions de paiement : A reception de la facture', 20, noteY + 8);
    doc.text('Merci pour votre confiance !', 20, noteY + 15);
    if (facture.description) {
        const lines = doc.splitTextToSize('Notes : ' + facture.description, 160);
        doc.text(lines[0] || '', 20, noteY + 15);
    }

    // Pied de page
    doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
    doc.line(14, 281, 196, 281);
    doc.setTextColor(180, 180, 180); doc.setFontSize(7.5);
    doc.text('ProFacture - Document genere automatiquement - ' + fmtDate(new Date().toISOString()), 105, 286, { align: 'center' });

    doc.save('Facture_' + num + '.pdf');
}

/**
 * PDF DEVIS
 */
function generateDevisPDF(devis) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const session = JSON.parse(localStorage.getItem('pf_session') || '{}');

    const primary = [17, 153, 142];
    const green2  = [39, 174, 96];
    const dark    = [26, 26, 46];
    const grey    = [100, 100, 100];

    // En-tête
    doc.setFillColor(...primary);
    doc.rect(0, 0, 210, 42, 'F');
    doc.setFillColor(...green2);
    doc.triangle(140, 0, 210, 0, 210, 42, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28); doc.setFont(undefined, 'bold');
    doc.text('DEVIS', 14, 26);

    const num = devis.numero || devis.number || 'DEV-000';
    doc.setFontSize(9); doc.setFont(undefined, 'normal');
    doc.text('N : ' + num, 145, 14);
    doc.text('Date : ' + fmtDate(devis.date), 145, 21);
    doc.text('Validite : 30 jours', 145, 28);
    doc.text('Statut : ' + (devis.statut || 'Envoye'), 145, 35);

    // Entreprise
    doc.setTextColor(...dark);
    doc.setFontSize(11); doc.setFont(undefined, 'bold');
    doc.text(session.companyName || 'ProFacture', 14, 56);
    doc.setFontSize(9); doc.setFont(undefined, 'normal');
    doc.setTextColor(...grey);
    if (session.email) doc.text('Email : ' + session.email, 14, 63);

    // Client
    doc.setFillColor(240, 255, 252);
    doc.roundedRect(115, 48, 80, 32, 4, 4, 'F');
    doc.setDrawColor(...primary); doc.setLineWidth(0.4);
    doc.roundedRect(115, 48, 80, 32, 4, 4, 'S');
    doc.setTextColor(...dark); doc.setFontSize(9); doc.setFont(undefined, 'bold');
    doc.text('Destinataire :', 120, 56);
    doc.setFont(undefined, 'normal');
    const clientName = devis.clientName || devis.client || '';
    doc.text(clientName, 120, 63);
    if (devis.clientEmail) doc.text(devis.clientEmail, 120, 69);
    if (devis.clientPhone) doc.text(devis.clientPhone, 120, 75);

    // Séparateur
    doc.setDrawColor(...primary); doc.setLineWidth(0.6);
    doc.line(14, 86, 196, 86);

    // Tableau articles
    const items = devis.items && devis.items.length > 0
        ? devis.items
        : [{ description: devis.description || 'Prestation', quantity: 1, unitPrice: devis.montant || devis.amount || 0 }];

    const tableBody = items.map(function(item) {
        const qty   = Number(item.quantity  || 1);
        const price = Number(item.unitPrice || 0);
        return [ item.description || '-', String(qty), fmtMoney(price), fmtMoney(qty * price) ];
    });

    doc.autoTable({
        startY: 90,
        head: [['Description', 'Qte', 'Prix unitaire', 'Total']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: primary, textColor: [255,255,255], fontStyle: 'bold', fontSize: 10, cellPadding: 4 },
        bodyStyles: { textColor: dark, fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: [240, 255, 250] },
        columnStyles: {
            0: { cellWidth: 85 },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 42, halign: 'right' },
            3: { cellWidth: 42, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 14, right: 14 }
    });

    const finalY = doc.lastAutoTable.finalY + 4;
    const total = devis.montant || devis.amount ||
        items.reduce(function(s, i) { return s + (Number(i.quantity||1) * Number(i.unitPrice||0)); }, 0);

    // Bloc total
    doc.setFillColor(...primary);
    doc.roundedRect(120, finalY + 2, 76, 14, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12); doc.setFont(undefined, 'bold');
    doc.text('TOTAL ESTIME : ' + fmtMoney(total), 158, finalY + 11, { align: 'center' });

    // Mentions
    const noteY = finalY + 22;
    doc.setFillColor(240, 255, 252);
    doc.roundedRect(14, noteY, 182, 22, 4, 4, 'F');
    doc.setTextColor(...grey); doc.setFontSize(8); doc.setFont(undefined, 'normal');
    doc.text("Ce devis est valable 30 jours a compter de sa date d'emission.", 20, noteY + 8);
    doc.text('Pour accepter, veuillez nous retourner ce document signe.', 20, noteY + 15);

    // Pied de page
    doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
    doc.line(14, 281, 196, 281);
    doc.setTextColor(180, 180, 180); doc.setFontSize(7.5);
    doc.text('ProFacture - Document genere automatiquement - ' + fmtDate(new Date().toISOString()), 105, 286, { align: 'center' });

    doc.save('Devis_' + num + '.pdf');
}

// ── Utilitaires ──
function fmtDate(d) {
    if (!d) return '';
    try {
        const dt = new Date(d);
        return String(dt.getDate()).padStart(2,'0') + '/' +
               String(dt.getMonth()+1).padStart(2,'0') + '/' + dt.getFullYear();
    } catch(e) { return String(d); }
}
function fmtMoney(n) {
    const num = Math.round(Number(n) || 0);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
}
