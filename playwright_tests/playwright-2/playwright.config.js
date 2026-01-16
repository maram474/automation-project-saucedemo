
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuration Playwright pour les tests SauceDemo
 *
 * Cette configuration définit:
 * - Le répertoire des tests
 * - Les paramètres de parallélisation
 * - Les reporters (HTML et Allure)
 * - Les paramètres d'utilisation (baseURL, headless, screenshots, traces)
 * - L'attribut de test ID personnalisé (data-test)
 * - Les projets de navigateurs à utiliser (Chromium, Firefox, WebKit)
 */
module.exports = defineConfig({
  // Répertoire contenant les fichiers de test
  testDir: './tests',

  // Permet l'exécution parallèle de tous les tests
  fullyParallel: true,

  // Interdit l'utilisation de .only en CI pour éviter les tests oubliés
  forbidOnly: !!process.env.CI,

  // Nombre de tentatives en cas d'échec (2 en CI, 0 en local)
  retries: process.env.CI ? 2 : 0,

  // Nombre de workers (1 en CI pour la stabilité, automatique en local)
  workers: process.env.CI ? 1 : undefined,

  // Configuration des reporters pour générer des rapports de test
  reporter: [
    // Reporter console pour voir les résultats en temps réel
    ['list'],

    // Reporter HTML natif de Playwright
    ['html', { outputFolder: 'playwright-report' }],

    // Reporter Allure pour des rapports détaillés
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  // Paramètres d'utilisation communs à tous les tests
  use: {
    // URL de base utilisée dans les actions comme page.goto('')
    baseURL: 'https://www.saucedemo.com',

    // Mode headless (sans interface graphique) activé par défaut
    headless: true,

    // Capture d'écran uniquement en cas d'échec de test
    screenshot: 'only-on-failure',

    // Trace conservée uniquement en cas d'échec (pour le débogage)
    trace: 'retain-on-failure',

    // Attribut personnalisé pour les sélecteurs de test (data-test)
    // Permet d'utiliser getByTestId() au lieu de getByRole() ou autres
    testIdAttribute: 'data-test',

    // Timeout pour les actions (30 secondes par défaut)
    actionTimeout: 30000,

    // Timeout pour la navigation
    navigationTimeout: 30000,
  },

  // Configuration des projets de navigateurs
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
