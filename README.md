🚀 Automation Project - SauceDemo Complete Test Suite

Projet d'automatisation complet pour SauceDemo avec 5 suites de tests utilisant 3 frameworks différents.

📁 Structure du Projet
    automation-project-saucedemo/
            │
            ├── playwright_tests/           # 🎭 Tests Playwright (Node.js)
            │   ├── tests/
            │   │   ├── data/
            │   │   │   ├── commonData.json
            │   │   │   ├── filterData.json
            │   │   │   └── purchaseData.json
            │   │   ├── helpers/
            │   │   │   ├── authHelpers.js
            │   │   │   ├── filterHelpers.js
            │   │   │   └── purchaseHelpers.js
            │   │   ├── e2e-filter.spec.js       # TEST 1
            │   │   └── e2e-purchase.spec.js     # TEST 2
            │   ├── package.json
            │   └── playwright.config.js
            │
            ├── selenium_tests/             # 🐍 Tests Selenium Python
            │   ├── tests/
            │   │   ├── test_connection.py       # TEST 3
            │   │   └── test_produits.py         # TEST 4
            │   ├── data.json
            │   └── requirements.txt
            │
            ├── robot_tests/                # 🤖 Tests Robot Framework
            │   ├── tests/
            │   │   ├── test_burger_full.robot   # TEST 5 (principal)
            │   │   ├── test_logout.robot
            │   │   ├── test_about_page.robot
            │   │   ├── test_all_items_page.robot
            │   │   ├── test_close_menu.robot
            │   │   ├── test_menu_options.robot
            │   │   └── test_reset_state.robot
            │   ├── resources/
            │   │   └── keywords.robot
            │   ├── data/
            │   │   ├── config.json
            │   │   └── locators.json
            │   └── requirements.txt
            │
            ├── .github/workflows/
            │   └── ci.yml                  # Pipeline GitHub Actions
            ├── Jenkinsfile                 # Pipeline Jenkins
            └── README.md

🧪 Suites de Tests
🎭 Playwright Tests (2 suites)
TEST 1: Product Filter Tests (e2e-filter.spec.js)
Objectif: Vérifier le système de filtrage et tri des produits
Scénarios:

TC1: Vérifier que le filtre par défaut est "Name (A to Z)"
TC2: Trier par prix croissant (low to high) et vérifier l'ordre
TC3: Trier par prix décroissant (high to low) et vérifier premier/dernier

Particularité: Utilise un hook beforeAll pour une connexion unique partagée entre tous les tests.
Commande:
bashcd playwright_tests
npm run test:filter

TEST 2: E2E Purchase Tests (e2e-purchase.spec.js)
Objectif: Tester le parcours complet d'achat d'un produit
Scénarios (10 étapes):

Connexion avec utilisateur standard
Vérification de tous les produits du catalogue (6 produits)
Ajout d'un produit au panier
Consultation du panier
Processus de checkout
Remplissage du formulaire de livraison
Vérification du récapitulatif (quantité, prix, taxes, total)
Finalisation de la commande
Vérification du message de confirmation
Vérification de la disparition du badge panier

Commande:
bashcd playwright_tests
npm run test:purchase

🐍 Selenium Python Tests (2 suites)
TEST 3: Login Tests (test_connection.py)
Objectif: Valider les scénarios de connexion (positifs et négatifs)
Scénarios:

test_invalid_user: Tentative de connexion avec un utilisateur invalide

Vérifie le message d'erreur: "Epic sadface: Username and password do not match"


test_no_username: Tentative de connexion sans nom d'utilisateur

Vérifie le message: "Epic sadface: Username is required"


test_no_password: Tentative de connexion sans mot de passe

Vérifie le message: "Epic sadface: Password is required"



Commande:
bashcd selenium_tests
pytest tests/test_connection.py --html=report-connection.html --self-contained-html -v

TEST 4: Products Tests (test_produits.py)
Objectif: Vérifier l'affichage et les éléments des produits
Scénarios:

test_all_products_present: Vérifie que tous les 6 produits sont affichés
test_product_elements (paramétrisé): Pour chaque produit, vérifie:

L'image est visible
Le bouton "Add to cart" est visible
Le nom du produit est cliquable


test_total_products: Vérifie qu'il y a exactement 6 produits

Produits testés:

Sauce Labs Backpack ($29.99)
Sauce Labs Bike Light ($9.99)
Sauce Labs Bolt T-Shirt ($15.99)
Sauce Labs Fleece Jacket ($49.99)
Sauce Labs Onesie ($7.99)
Test.allTheThings() T-Shirt (Red) ($15.99)

Commande:
bashcd selenium_tests
pytest tests/test_produits.py --html=report-products.html --self-contained-html -v

🤖 Robot Framework Tests (1 suite principale)
TEST 5: Burger Menu Full Test (test_burger_full.robot)
Objectif: Tester toutes les fonctionnalités du menu burger
Scénarios complets:

Ouvrir le menu burger
Vérifier que le menu est ouvert (présence des options)
Vérifier toutes les options du menu:

All Items
About
Logout
Reset App State


Cliquer sur "All Items" et rester sur la page produits
Cliquer sur "About" et vérifier la redirection vers saucelabs.com
Retourner à l'application
Réinitialiser l'état de l'application
Vérifier que le panier est vide
Se déconnecter
Vérifier l'affichage de la page de connexion

Tests additionnels (dans d'autres fichiers):

test_logout.robot - Test de déconnexion isolé
test_about_page.robot - Test de la page About isolé
test_all_items_page.robot - Test du lien All Items
test_close_menu.robot - Test de fermeture du menu
test_menu_options.robot - Vérification des options
test_reset_state.robot - Test de réinitialisation

Commande:
bashcd robot_tests
robot --outputdir results tests/test_burger_full.robot

🛠️ Installation
Prérequis

Node.js 18+
Python 3.11+
Chrome/Chromium installé
Git

Installation Complète
bash# 1. Cloner le repository
git clone <votre-repo>
cd automation-project-saucedemo

# 2. Installer Playwright
cd playwright_tests
npm install
npx playwright install chromium
cd ..

# 3. Installer Selenium Python
cd selenium_tests
pip3 install -r requirements.txt
cd ..

# 4. Installer Robot Framework
cd robot_tests
pip3 install -r requirements.txt
cd ..

▶️ Exécution des Tests
Tous les tests
bash# GitHub Actions - automatiquement sur push/PR
# Jenkins - manuellement ou via webhook

# Localement - tous les frameworks
./run_all_tests.sh  # (voir section Scripts)
Tests individuels
bash# Playwright - Filtrage
cd playwright_tests
npm run test:filter

# Playwright - Achat
npm run test:purchase

# Selenium - Connexion
cd selenium_tests
pytest tests/test_connection.py -v

# Selenium - Produits
pytest tests/test_produits.py -v

# Robot Framework - Menu Burger
cd robot_tests
robot --outputdir results tests/test_burger_full.robot

📊 Rapports de Tests
Rapports Générés en Local
FrameworkRapportEmplacementPlaywrightHTML Reportplaywright_tests/playwright-report/index.htmlSeleniumHTML Reportselenium_tests/report-connection.html / report-products.htmlRobot FrameworkReport + Logrobot_tests/results/report.html + log.html
Rapports en CI/CD
GitHub Actions:

Tous les rapports disponibles dans l'onglet "Actions" → "Artifacts"
Rapport Allure généré (Playwright uniquement)

Jenkins:

Rapports publiés dans l'interface Jenkins
Liens directs vers chaque rapport


🚀 CI/CD
GitHub Actions
Pipeline: .github/workflows/ci.yml
Jobs:

✅ Playwright Filter Tests
✅ Playwright Purchase Tests
✅ Selenium Connection Tests
✅ Selenium Products Tests
✅ Robot Framework Tests
📊 Generate Allure Report (Playwright)
📋 Test Summary

Déclenchement:

Push sur main, master, develop
Pull Request
Manuellement via workflow_dispatch

Artifacts générés:

playwright-filter-report
playwright-purchase-report
selenium-connection-report
selenium-products-report
robot-framework-reports
allure-report (Playwright)


Jenkins
Pipeline: Jenkinsfile
Configuration requise:

Node.js 18+ configuré dans Global Tool Configuration
Python 3+ installé sur l'agent Jenkins
Chrome/Chromium installé

Rapports Jenkins:

🎭 Playwright Filter Report
🎭 Playwright Purchase Report
🐍 Selenium Connection Report
🐍 Selenium Products Report
🤖 Robot Framework Report
🤖 Robot Framework Log


📋 Scripts Utiles
Script de test complet (run_all_tests.sh)
bash#!/bin/bash
echo "🚀 Running all test suites..."

cd playwright_tests && npm test && cd ..
cd selenium_tests && pytest tests/ --html=report.html --self-contained-html -v && cd ..
cd robot_tests && robot --outputdir results tests/ && cd ..

echo "✅ All tests completed!"
Rendre exécutable:
bashchmod +x run_all_tests.sh
./run_all_tests.sh

🔧 Configuration
Playwright (playwright.config.js)

Base URL: https://www.saucedemo.com
Browsers: Chromium, Firefox, WebKit
Reporters: List, HTML, JSON, Allure
Timeout: 30 secondes

Selenium Python

Framework: pytest
Reporter: pytest-html
Webdriver: webdriver-manager (automatique)
Mode: headless en CI

Robot Framework

Library: SeleniumLibrary
Output: HTML + Log + XML
Browser: Chrome
Mode: headless en CI


👥 Contributeurs

Playwright Tests - Tests de filtrage et achat E2E
Selenium Tests - Tests de connexion et produits
Robot Framework Tests - Tests du menu burger


📝 Credentials de Test
Utilisateur standard:

Username: standard_user
Password: secret_sauce


🐛 Troubleshooting
Erreur: "chromedriver not found"
bashpip install webdriver-manager
Erreur: "Playwright browsers not installed"
bashnpx playwright install chromium
Erreur: "Module not found"
bash# Playwright
npm install

# Python
pip install -r requirements.txt

📄 License
ISC

🔗 Liens Utiles

SauceDemo
Playwright Documentation
pytest Documentation
Robot Framework Documentation


🎉 Projet créé dans le cadre de l'apprentissage de l'automatisation de tests
