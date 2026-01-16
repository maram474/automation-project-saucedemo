/**
 * ============================================================================
 * FICHIER DE TEST: E2E_Test_Filtrage.spec.js
 * DESCRIPTION: Tests automatisés du filtrage des produits sur Saucedemo
 * PROJET: Test Playwright 1 - Filtrage des produits
 * ============================================================================
 */

import { test, expect, describe } from '@playwright/test';
import * as helpers from './Fonctions/fct.js';
import testData from './data/data.json' assert { type: 'json' };

// Variables globales pour partager la session entre tous les tests
let context;
let page;

describe('Test Playwright 1: Filtrage des produits et vérification de l\'ordre', () => {
  
  // =========================================================================
  // HOOK beforeAll: Connexion UNE SEULE FOIS avant tous les tests
  // =========================================================================
  /**
   * Setup global exécuté une seule fois avant tous les tests
   * - Crée un contexte de navigation
   * - Se connecte à l'application
   * - Partage la session pour tous les tests
   */
  test.beforeAll(async ({ browser }) => {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║        SETUP GLOBAL: beforeAll - Initialisation               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    
    // Créer un nouveau contexte de navigation
    console.log('   → Création du contexte de navigation...');
    context = await browser.newContext();
    
    // Créer une nouvelle page
    console.log('   → Création de la page...');
    page = await context.newPage();
    
    // Naviguer vers le site
    console.log('   → Navigation vers ' + testData.url);
    await page.goto(testData.url);
    
    // Se connecter avec l'utilisateur standard
    console.log('   → Connexion avec l\'utilisateur: ' + testData.credentials.standardUser);
    await helpers.login(
      page, 
      testData.credentials.standardUser, 
      testData.credentials.password, 
      testData.selectors
    );
    
    console.log('   ✓ Connexion réussie');
    console.log('   ✓ Session partagée créée pour tous les tests');
    console.log('');
  });

  // =========================================================================
  // HOOK beforeEach: Pré-requis avant CHAQUE test
  // =========================================================================
  /**
   * Pré-requis exécuté avant chaque test
   * - Navigue vers la page inventaire
   * - S'assure que la page est prête
   */
  test.beforeEach(async () => {
    console.log('┌────────────────────────────────────────────────────────────────┐');
    console.log('│  PRÉ-REQUIS DU TEST                                            │');
    console.log('└────────────────────────────────────────────────────────────────┘');
    
    // Naviguer vers la page inventaire
    console.log('   → Navigation vers la page inventaire...');
    await helpers.goToInventory(page, testData.url_inv, testData.selectors);
    
    console.log('   ✓ Session authentifiée active');
    console.log('   ✓ Pré-requis satisfaits - Test prêt à démarrer');
    console.log('');
  });

  // =========================================================================
  // TEST CASE 1: Vérifier le filtre par défaut
  // =========================================================================
  /**
   * Objectif: Vérifier que le filtre par défaut est "Name (A to Z)"
   * 
   * Steps:
   * 1. La page est déjà chargée (grâce à beforeEach)
   * 2. Récupérer la valeur actuelle du filtre
   * 3. Vérifier qu'elle est égale à "az" (Name A to Z)
   */
  test('TC1: Vérifier que le filtre par défaut est Name (A to Z)', async () => {
    const tc1 = testData.testCases.TC1_VerifierFiltreDefaut;
    
    console.log('🚀 DÉBUT DU TEST TC1');
    console.log('   Test: ' + tc1.description);
    console.log('');

    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 1: Récupérer la valeur actuelle du filtre
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 1: Récupération du filtre actuel');
    const currentFilter = await helpers.getCurrentFilter(
      page, 
      testData.selectors.products.sortDropdown
    );
    
    console.log('   📊 Filtre trouvé    : ' + currentFilter);
    console.log('   📋 Filtre attendu   : ' + tc1.expectedValue);
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 2: Vérification avec assertion Playwright
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 2: Vérification');
    expect(currentFilter).toBe(tc1.expectedValue);
    console.log('   ✓ Assertion réussie: Le filtre est bien "' + tc1.expectedValue + '"');
    console.log('');
    
    console.log('✅ TC1 PASSED!');
    console.log('   ' + tc1.description);
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
  });

  // =========================================================================
  // TEST CASE 2: Trier par prix croissant
  // =========================================================================
  /**
   * Objectif: Tester le tri des produits par prix croissant
   * 
   * Steps:
   * 1. Changer le filtre à "Price (low to high)"
   * 2. Récupérer tous les prix
   * 3. Vérifier que les prix sont triés en ordre croissant
   * 4. Capturer une screenshot
   */
  test('TC2: Changer le filtre à Price (low to high) et vérifier l\'ordre', async () => {
    const tc2 = testData.testCases.TC2_TriPrixCroissant;
    
    console.log('🚀 DÉBUT DU TEST TC2');
    console.log('   Test: ' + tc2.description);
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 1: Changer le filtre à "Price (low to high)"
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 1: Changement du filtre');
    console.log('   Filtre sélectionné: ' + tc2.filterText);
    await helpers.selectFilter(
      page, 
      testData.selectors.products.sortDropdown, 
      tc2.filterValue
    );
    console.log('   ✓ Filtre changé avec succès');
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 2: Récupérer tous les prix
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 2: Récupération de tous les prix');
    const prices = await helpers.getPrices(
      page, 
      testData.selectors.products.itemPrice
    );
    console.log('   ✓ Nombre de prix récupérés: ' + prices.length);
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 3: Afficher les prix (pour debug)
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 3: Affichage des prix récupérés');
    helpers.displayPrices(prices);
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 4: Vérifier l'ordre croissant
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 4: Vérification de l\'ordre croissant');
    const isCorrectOrder = helpers.verifyPriceOrder(prices, tc2.orderType);
    
    // Assertion Playwright
    expect(isCorrectOrder).toBe(true);
    console.log('   ✓ Assertion réussie: Les prix sont bien triés en ordre croissant');
    console.log('   Premier prix: $' + prices[0]);
    console.log('   Dernier prix: $' + prices[prices.length - 1]);
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 5: Capturer une screenshot
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 5: Capture d\'écran');
    await helpers.takeScreenshot(page, tc2.screenshotName);
    console.log('   ✓ Screenshot sauvegardée: screenshots/' + tc2.screenshotName);
    console.log('');
    
    console.log('✅ TC2 PASSED!');
    console.log('   ' + tc2.description);
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
  });

  // =========================================================================
  // TEST CASE 3: Trier par prix décroissant
  // =========================================================================
  /**
   * Objectif: Tester le tri des produits par prix décroissant
   * 
   * Steps:
   * 1. Changer le filtre à "Price (high to low)"
   * 2. Récupérer tous les prix
   * 3. Vérifier que le premier produit a le prix le plus élevé
   * 4. Vérifier que le dernier produit a le prix le plus bas
   */
  test('TC3: Changer le filtre à Price (high to low) et vérifier premier/dernier', async () => {
    const tc3 = testData.testCases.TC3_TriPrixDecroissant;
    
    console.log('🚀 DÉBUT DU TEST TC3');
    console.log('   Test: ' + tc3.description);
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 1: Changer le filtre à "Price (high to low)"
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 1: Changement du filtre');
    console.log('   Filtre sélectionné: ' + tc3.filterText);
    await helpers.selectFilter(
      page, 
      testData.selectors.products.sortDropdown, 
      tc3.filterValue
    );
    console.log('   ✓ Filtre changé avec succès');
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 2: Récupérer tous les prix
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 2: Récupération de tous les prix');
    const prices = await helpers.getPrices(
      page, 
      testData.selectors.products.itemPrice
    );
    console.log('   ✓ Nombre de prix récupérés: ' + prices.length);
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 3: Afficher les prix (pour debug)
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 3: Affichage des prix récupérés');
    helpers.displayPrices(prices);
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 4: Vérifier que le premier = prix max
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 4: Vérification que le premier produit a le prix maximum');
    const firstIsHighest = helpers.verifyFirstIsHighest(prices);
    
    // Assertion Playwright
    expect(firstIsHighest).toBe(true);
    console.log('   ✓ Assertion réussie: Premier produit a bien le prix max');
    console.log('   Prix du premier produit: $' + prices[0]);
    console.log('   Prix maximum trouvé: $' + Math.max(...prices));
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────
    // ÉTAPE 5: Vérifier que le dernier = prix min
    // ─────────────────────────────────────────────────────────────────────
    console.log('➡️  ÉTAPE 5: Vérification que le dernier produit a le prix minimum');
    const lastIsLowest = helpers.verifyLastIsLowest(prices);
    
    // Assertion Playwright
    expect(lastIsLowest).toBe(true);
    console.log('   ✓ Assertion réussie: Dernier produit a bien le prix min');
    console.log('   Prix du dernier produit: $' + prices[prices.length - 1]);
    console.log('   Prix minimum trouvé: $' + Math.min(...prices));
    console.log('');
    
    console.log('✅ TC3 PASSED!');
    console.log('   ' + tc3.description);
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
  });

  // =========================================================================
  // HOOK afterAll: Nettoyage après tous les tests
  // =========================================================================
  /**
   * Nettoyage exécuté une seule fois après tous les tests
   * - Ferme le contexte et la page
   * - Libère les ressources
   */
  test.afterAll(async () => {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║           NETTOYAGE: afterAll - Fermeture                     ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    
    console.log('   → Fermeture du contexte et de la page...');
    
    // Fermer le contexte (et automatiquement la page)
    if (context) {
      await context.close();
    }
    
    console.log('   ✓ Contexte fermé');
    console.log('   ✓ Ressources libérées');
    console.log('   ✓ Nettoyage terminé');
    console.log('');
  });

});

// ============================================================================
// FIN DU FICHIER DE TEST
// ============================================================================