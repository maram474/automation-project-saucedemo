import { expect } from '@playwright/test';

/**
 * ============================================================================
 * HELPERS D'AUTHENTIFICATION - Fonctions communes aux deux projets
 * ============================================================================
 */

/**
 * Connexion à l'application Saucedemo
 * Fonction partagée entre les tests de filtrage et d'achat
 *
 * @param {Page} page - La page Playwright
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @param {object} selectors - Sélecteurs CSS
 */
export async function login(page, username, password, selectors) {
  console.log(`🔐 Connexion avec l'utilisateur: ${username}`);

  // Remplir le champ username
  await page.fill(selectors.login.username, username);

  // Remplir le champ password
  await page.fill(selectors.login.password, password);

  // Cliquer sur le bouton de connexion
  await page.click(selectors.login.loginButton);

  // Attendre que la page des produits soit chargée
  await page.waitForSelector(selectors.products.inventoryItems);

  console.log('✅ Connexion réussie');
}

/**
 * Navigation vers la page inventaire
 *
 * @param {Page} page - La page Playwright
 * @param {string} urlInventory - URL de la page inventaire
 * @param {object} selectors - Sélecteurs CSS
 */
export async function goToInventory(page, urlInventory, selectors) {
  await page.goto(urlInventory);
  await page.locator(selectors.products.sortDropdown).waitFor();
  console.log('   ✅ Page inventaire chargée');
}

/**
 * Connexion avec vérification via getByTestId (style Projet 2)
 * Alternative pour les tests qui préfèrent cette approche
 *
 * @param {Page} page - Instance de la page Playwright
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 */
export async function loginWithTestId(page, username, password) {
  try {
    console.log(`🔐 Connexion avec l'utilisateur: ${username}`);

    await page.goto('/');
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(password);
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('inventory-container')).toBeVisible();

    console.log('✅ Connexion réussie');
  } catch (error) {
    console.error('❌ ÉCHEC de la connexion');
    console.error(`❌ Erreur: ${error.message}`);
    await page.screenshot({
      path: `screenshots/login-fail-${Date.now()}.png`,
      fullPage: true
    });
    throw error;
  }
}
