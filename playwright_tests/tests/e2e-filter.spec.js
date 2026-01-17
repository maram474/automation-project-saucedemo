/**
 * ============================================================================
 * Tests de filtrage des produits sur Saucedemo
 * ============================================================================
 */

import { test, expect } from '@playwright/test';
import { login, goToInventory } from './helpers/authHelpers.js';
import * as filterHelpers from './helpers/filterHelpers.js';
import commonData from './data/commonData.json' assert { type: 'json' };
import filterData from './data/filterData.json' assert { type: 'json' };

let context;
let page;

test.describe('Test Playwright 1: Filtrage des produits et vérification de l\'ordre', () => {

  /**
   * Setup global - Connexion UNE SEULE FOIS avant tous les tests
   */
  test.beforeAll(async ({ browser }) => {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║        SETUP GLOBAL: beforeAll - Initialisation               ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');

    context = await browser.newContext();
    console.log('   → Création du contexte de navigation...');

    page = await context.newPage();
    console.log('   → Création de la page...');

    console.log('   → Navigation vers ' + commonData.url);
    await page.goto(commonData.url);

    console.log('   → Connexion avec l\'utilisateur: ' + commonData.credentials.standardUser);
    await login(
      page,
      commonData.credentials.standardUser,
      commonData.credentials.password,
      commonData.selectors
    );

    console.log('   ✓ Connexion réussie');
    console.log('   ✓ Session partagée créée pour tous les tests');
    console.log('');
  });

  /**
   * Pré-requis avant CHAQUE test
   */
  test.beforeEach(async () => {
    console.log('┌────────────────────────────────────────────────────────────┐');
    console.log('│  PRÉ-REQUIS DU TEST                                            │');
    console.log('└────────────────────────────────────────────────────────────┘');

    console.log('   → Navigation vers la page inventaire...');
    await goToInventory(page, commonData.url_inventory, commonData.selectors);

    console.log('   ✓ Session authentifiée active');
    console.log('   ✓ Pré-requis satisfaits - Test prêt à démarrer');
    console.log('');
  });

  /**
   * TC1: Vérifier le filtre par défaut
   */
  test('TC1: Vérifier que le filtre par défaut est Name (A to Z)', async () => {
    const tc1 = filterData.testCases.TC1_VerifierFiltreDefaut;

    console.log('🚀 DÉBUT DU TEST TC1');
    console.log('   Test: ' + tc1.description);
    console.log('');

    console.log('➡️ ÉTAPE 1: Récupération du filtre actuel');
    const currentFilter = await filterHelpers.getCurrentFilter(
      page,
      commonData.selectors.products.sortDropdown
    );

    console.log('   📊 Filtre trouvé    : ' + currentFilter);
    console.log('   📋 Filtre attendu   : ' + tc1.expectedValue);
    console.log('');

    console.log('➡️ ÉTAPE 2: Vérification');
    expect(currentFilter).toBe(tc1.expectedValue);
    console.log('   ✓ Assertion réussie: Le filtre est bien "' + tc1.expectedValue + '"');
    console.log('');

    console.log('✅ TC1 PASSED!');
    console.log('   ' + tc1.description);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
  });

  /**
   * TC2: Trier par prix croissant
   */
  test('TC2: Changer le filtre à Price (low to high) et vérifier l\'ordre', async () => {
    const tc2 = filterData.testCases.TC2_TriPrixCroissant;

    console.log('🚀 DÉBUT DU TEST TC2');
    console.log('   Test: ' + tc2.description);
    console.log('');

    console.log('➡️ ÉTAPE 1: Changement du filtre');
    console.log('   Filtre sélectionné: ' + tc2.filterText);
    await filterHelpers.selectFilter(
      page,
      commonData.selectors.products.sortDropdown,
      tc2.filterValue
    );
    console.log('   ✓ Filtre changé avec succès');
    console.log('');

    console.log('➡️ ÉTAPE 2: Récupération de tous les prix');
    const prices = await filterHelpers.getPrices(
      page,
      commonData.selectors.products.itemPrice
    );
    console.log('   ✓ Nombre de prix récupérés: ' + prices.length);
    console.log('');

    console.log('➡️ ÉTAPE 3: Affichage des prix récupérés');
    filterHelpers.displayPrices(prices);
    console.log('');

    console.log('➡️ ÉTAPE 4: Vérification de l\'ordre croissant');
    const isCorrectOrder = filterHelpers.verifyPriceOrder(prices, tc2.orderType);

    expect(isCorrectOrder).toBe(true);
    console.log('   ✓ Assertion réussie: Les prix sont bien triés en ordre croissant');
    console.log('   Premier prix: $' + prices[0]);
    console.log('   Dernier prix: $' + prices[prices.length - 1]);
    console.log('');

    console.log('➡️ ÉTAPE 5: Capture d\'écran');
    await filterHelpers.takeScreenshot(page, tc2.screenshotName);
    console.log('   ✓ Screenshot sauvegardée: screenshots/' + tc2.screenshotName);
    console.log('');

    console.log('✅ TC2 PASSED!');
    console.log('   ' + tc2.description);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
  });

  /**
   * TC3: Trier par prix décroissant
   */
  test('TC3: Changer le filtre à Price (high to low) et vérifier premier/dernier', async () => {
    const tc3 = filterData.testCases.TC3_TriPrixDecroissant;

    console.log('🚀 DÉBUT DU TEST TC3');
    console.log('   Test: ' + tc3.description);
    console.log('');

    console.log('➡️ ÉTAPE 1: Changement du filtre');
    console.log('   Filtre sélectionné: ' + tc3.filterText);
    await filterHelpers.selectFilter(
      page,
      commonData.selectors.products.sortDropdown,
      tc3.filterValue
    );
    console.log('   ✓ Filtre changé avec succès');
    console.log('');

    console.log('➡️ ÉTAPE 2: Récupération de tous les prix');
    const prices = await filterHelpers.getPrices(
      page,
      commonData.selectors.products.itemPrice
    );
    console.log('   ✓ Nombre de prix récupérés: ' + prices.length);
    console.log('');

    console.log('➡️ ÉTAPE 3: Affichage des prix récupérés');
    filterHelpers.displayPrices(prices);
    console.log('');

    console.log('➡️ ÉTAPE 4: Vérification que le premier produit a le prix maximum');
    const firstIsHighest = filterHelpers.verifyFirstIsHighest(prices);

    expect(firstIsHighest).toBe(true);
    console.log('   ✓ Assertion réussie: Premier produit a bien le prix max');
    console.log('   Prix du premier produit: $' + prices[0]);
    console.log('   Prix maximum trouvé: $' + Math.max(...prices));
    console.log('');

    console.log('➡️ ÉTAPE 5: Vérification que le dernier produit a le prix minimum');
    const lastIsLowest = filterHelpers.verifyLastIsLowest(prices);

    expect(lastIsLowest).toBe(true);
    console.log('   ✓ Assertion réussie: Dernier produit a bien le prix min');
    console.log('   Prix du dernier produit: $' + prices[prices.length - 1]);
    console.log('   Prix minimum trouvé: $' + Math.min(...prices));
    console.log('');

    console.log('✅ TC3 PASSED!');
    console.log('   ' + tc3.description);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
  });

  /**
   * Nettoyage après tous les tests
   */
  test.afterAll(async () => {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║           NETTOYAGE: afterAll - Fermeture                     ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');

    console.log('   → Fermeture du contexte et de la page...');

    if (context) {
      await context.close();
    }

    console.log('   ✓ Contexte fermé');
    console.log('   ✓ Ressources libérées');
    console.log('   ✓ Nettoyage terminé');
    console.log('');
  });

});
