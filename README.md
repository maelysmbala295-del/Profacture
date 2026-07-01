# ProFacture - Plateforme de Gestion des Factures

## Description

**ProFacture** est une plateforme web simple et intuitive conçue pour aider les petites et moyennes entreprises (PME), les auto-entrepreneurs et les artisans à gérer facilement leurs factures, devis et clients.

## Fonctionnalités

### ✅ Authentification
- Page de connexion sécurisée
- Page d'inscription pour les nouveaux utilisateurs
- Gestion des profils utilisateurs

### 📊 Tableau de Bord
- Vue d'ensemble des statistiques clés
- Nombre de factures, devis et clients
- Chiffre d'affaires
- Dernières factures et devis
- Actions rapides

### 👥 Gestion des Clients
- Liste complète des clients
- Ajouter de nouveaux clients
- Éditer les informations des clients
- Supprimer des clients
- Recherche et filtrage

### 📄 Gestion des Factures
- Créer de nouvelles factures
- Voir et télécharger les factures en PDF
- Suivre le statut des factures (Payée, En attente, Impayée)
- Historique complet des factures
- Recherche et filtrage par statut

### 📋 Gestion des Devis
- Créer de nouveaux devis
- Voir et télécharger les devis en PDF
- Suivre le statut des devis (Envoyé, Accepté, En révision, Rejeté)
- Historique complet des devis
- Recherche et filtrage par statut

## Structure du Projet

```
profacture/
├── index.html              # Page de connexion
├── README.md               # Ce fichier
├── css/
│   └── style.css          # Feuille de styles personnalisée
├── js/
│   └── main.js            # Scripts JavaScript
├── pages/
│   ├── dashboard.html     # Tableau de bord
│   ├── clients.html       # Gestion des clients
│   ├── factures.html      # Gestion des factures
│   ├── devis.html         # Gestion des devis
│   └── signup.html        # Page d'inscription
└── assets/
    └── images/            # Dossier pour les images
```

## Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles personnalisés et responsive
- **Bootstrap 5** : Framework CSS pour le design responsive
- **JavaScript** : Interactivité et validation des formulaires
- **Bootstrap Icons** : Icônes modernes

## Responsive Design

La plateforme est entièrement responsive et s'adapte à tous les appareils :
- 📱 Téléphones (320px et plus)
- 📱 Tablettes (768px et plus)
- 💻 Ordinateurs de bureau (1024px et plus)

## Installation et Utilisation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Un serveur web local (optionnel pour les tests)

### Étapes d'installation

1. **Télécharger le projet**
   ```bash
   # Extraire le dossier profacture
   ```

2. **Ouvrir le projet**
   - Double-cliquez sur `index.html` pour ouvrir la page de connexion
   - Ou utilisez un serveur local :
   ```bash
   # Avec Python 3
   python -m http.server 8000
   
   # Avec Node.js (http-server)
   npx http-server
   ```

3. **Accéder à l'application**
   - Ouvrez votre navigateur et allez à `http://localhost:8000`

## Utilisation

### Connexion
1. Allez sur la page d'accueil (`index.html`)
2. Entrez vos identifiants (e-mail et mot de passe)
3. Cliquez sur "Se connecter"

### Inscription
1. Cliquez sur "S'inscrire" depuis la page de connexion
2. Remplissez le formulaire avec vos informations
3. Acceptez les conditions d'utilisation
4. Cliquez sur "S'inscrire"

### Créer une Facture
1. Allez dans "Factures"
2. Cliquez sur "Nouvelle Facture"
3. Remplissez les informations (client, montant, date, etc.)
4. Cliquez sur "Créer la Facture"

### Créer un Devis
1. Allez dans "Devis"
2. Cliquez sur "Nouveau Devis"
3. Remplissez les informations
4. Cliquez sur "Créer le Devis"

### Gérer les Clients
1. Allez dans "Clients"
2. Pour ajouter : Cliquez sur "Ajouter un Client"
3. Pour éditer : Cliquez sur "Éditer"
4. Pour supprimer : Cliquez sur "Supprimer"

## Prochaines Étapes

Pour transformer cette interface statique en application fonctionnelle, vous devrez :

1. **Ajouter le Backend PHP**
   - Créer des fichiers PHP pour gérer la logique serveur
   - Implémenter les fonctions de création, lecture, mise à jour et suppression (CRUD)
   - Gérer l'authentification des utilisateurs

2. **Configurer la Base de Données MySQL**
   - Créer les tables pour les utilisateurs, clients, factures et devis
   - Établir les relations entre les tables

3. **Intégrer la Génération de PDF**
   - Utiliser une bibliothèque comme TCPDF ou mPDF pour générer les factures en PDF

4. **Ajouter la Validation Côté Serveur**
   - Valider les données avant de les enregistrer en base de données

5. **Implémenter la Sécurité**
   - Utiliser des sessions sécurisées
   - Protéger contre les attaques CSRF et SQL injection

## Support et Contact

Pour toute question ou suggestion, veuillez contacter l'équipe ProFacture.

## Licence

© 2026 ProFacture. Tous droits réservés.

---

**Version** : 1.0  
**Dernière mise à jour** : Juin 2026
