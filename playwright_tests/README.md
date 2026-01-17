Tests Playwright - Saucedemo
Ce projet contient deux suites de tests automatisés pour le site Saucedemo:

Tests de filtrage des produits (Projet 1)
Tests E2E d'achat de produits (Projet 2)

📁 Structure du projet
saucedemo-playwright-tests/
│
├── tests/
│   ├── helpers/
│   │   ├── authHelpers.js          # Fonctions de connexion communes
│   │   ├── filterHelpers.js        # Fonctions pour le filtrage
│   │   └── purchaseHelpers.js      # Fonctions pour l'achat
│   │
│   ├── data/
│   │   ├── commonData.json         # Données communes (credentials, URLs, selectors)
│   │   ├── filterData.json         # Données des tests de filtrage
│   │   └── purchaseData.json       # Données des tests d'achat
│   │
│   ├── e2e-filter.spec.js          # Tests de filtrage des produits
│   └── e2e-purchase.spec.js        # Tests E2E d'achat complet
│
├── screenshots/                     # Captures d'écran des tests
├── playwright-report/               # Rapports HTML Playwright
├── allure-results/                  # Résultats Allure
├── test-results/                    # Résultats JSON
│
├── package.json
├── playwright.config.js
└── .gitignore
🚀 Installation
bash# Installer les dépendances
npm install

# Installer les navigateurs Playwright
npx playwright install
▶️ Exécution des tests
Tous les tests
bashnpm test
Tests de filtrage uniquement
bashnpm run test:filter
Tests d'achat uniquement
bashnpm run test:purchase
Mode headed (avec interface graphique)
bashnpm run test:headed
Mode debug
bashnpm run test:debug
Mode UI interactif
bashnpm run test:ui
📊 Rapports
Rapport HTML Playwright
bashnpm run report
Rapports Allure
bash# Générer le rapport
npm run allure:generate

# Ouvrir le rapport
npm run allure:open

# Générer et ouvrir en une commande
npm run allure:serve
🧪 Description des tests
Tests de filtrage (e2e-filter.spec.js)

TC1: Vérifier que le filtre par défaut est "Name (A to Z)"
TC2: Trier par prix croissant et vérifier l'ordre
TC3: Trier par prix décroissant et vérifier premier/dernier

Particularité: Utilise un hook beforeAll pour se connecter une seule fois et partager la session entre tous les tests.
Tests E2E d'achat (e2e-purchase.spec.js)

E2E01: Parcours complet d'achat comprenant:

Connexion
Vérification de tous les produits
Ajout d'un produit au panier
Consultation du panier
Processus de checkout
Remplissage du formulaire
Vérification du récapitulatif
Finalisation de la commande
Vérification de la confirmation
Vérification du badge panier



🔧 Configuration
Le fichier playwright.config.js contient:

Browsers: Chromium, Firefox, WebKit
Reporters: List, HTML, JSON, Allure
Base URL: https://www.saucedemo.com
Timeouts: 30 secondes
Screenshots: Uniquement en cas d'échec
Traces: Conservées en cas d'échec

📝 Données de test
Identifiants (commonData.json)

Username: standard_user
Password: secret_sauce

Produits testés (purchaseData.json)

Sauce Labs Backpack ($29.99)
Sauce Labs Bike Light ($9.99)
Sauce Labs Bolt T-Shirt ($15.99)
Sauce Labs Fleece Jacket ($49.99)
Sauce Labs Onesie ($7.99)
Test.allTheThings() T-Shirt (Red) ($15.99)

👥 Contributeurs

ghadaaouini (Projet 1 - Tests de filtrage)
Contributeur 2 (Projet 2 - Tests E2E d'achat)

📄 Licence
ISC
