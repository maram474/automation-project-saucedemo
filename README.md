# 🚀 Automation Project – SauceDemo Complete Test Suite

Projet d’automatisation **E2E complet et professionnel** pour l’application **SauceDemo**, utilisant **3 frameworks d’automatisation** et intégrant un pipeline **CI/CD (GitHub Actions & Jenkins)**.

---

## 🎯 Objectifs du projet
- Automatiser les parcours critiques utilisateurs (login, produits, panier, achat, menu)
- Mettre en place un **framework multi-outils** robuste
- Générer des **rapports HTML clairs**
- Exécuter les tests automatiquement en **CI/CD**
- Respecter les bonnes pratiques QA (POM, data-driven, helpers, keywords)

---

## 🧰 Technologies & Outils
- 🎭 **Playwright (Node.js)**
- 🐍 **Selenium (Python + Pytest)**
- 🤖 **Robot Framework**
- ⚙️ **GitHub Actions**
- 🧩 **Jenkins**
- 📊 **HTML Reports & Allure Reports**

---

## 📁 Project Structure

```text
automation-project-saucedemo/
├── playwright_tests/
│   ├── tests/
│   │   ├── data/
│   │   │   ├── commonData.json
│   │   │   ├── filterData.json
│   │   │   └── purchaseData.json
│   │   ├── helpers/
│   │   │   ├── authHelpers.js
│   │   │   ├── filterHelpers.js
│   │   │   └── purchaseHelpers.js
│   │   ├── e2e-filter.spec.js
│   │   └── e2e-purchase.spec.js
│   ├── package.json
│   └── playwright.config.js
│
├── selenium_tests/
│   ├── tests/
│   │   ├── test_connection.py
│   │   └── test_produits.py
│   ├── data.json
│   └── requirements.txt
│
├── robot_tests/
│   ├── tests/
│   │   ├── test_burger_full.robot
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
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── Jenkinsfile
└── README.md



