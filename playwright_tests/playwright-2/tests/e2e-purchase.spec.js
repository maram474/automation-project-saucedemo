const { test, expect } = require('@playwright/test');
const testData = require('../testData.json');
const {
  login,
  verifyProduct,
  addProductToCart,
  goToCart,
  verifyCartItem,
  proceedToCheckout,
  fillCheckoutForm,
  verifyCheckoutSummary,
  finishOrder,
  verifyOrderConfirmation,
  verifyCartBadgeNotVisible
} = require('./helpers/testHelpers');

/**
 * Suite de tests End-to-End pour le parcours complet d'achat d'un produit
 * Utilise un hook beforeAll pour la connexion avec le contexte Playwright
 */
test.describe('E2E - Achat d\'un produit', () => {

  /**
   * Hook beforeAll - Exécuté une seule fois avant tous les tests de cette suite
   * Affiche les informations de démarrage du test E2E
   */
  test.beforeAll(async ({ browser }) => {
    console.log('\n========================================');
    console.log('🚀 DÉBUT DU TEST E2E - ACHAT DE PRODUIT');
    console.log('========================================');
    console.log(`📅 Date: ${new Date().toLocaleString()}`);
    console.log(`🌐 URL de base: ${testData.user.username}`);
    console.log(`👤 Utilisateur: ${testData.user.username}`);
    console.log('========================================\n');
  });

  /**
   * Test E2E01 - Parcours complet d'achat d'un produit
   * Ce test couvre toutes les étapes depuis la connexion jusqu'à la confirmation de commande
   *
   * Étapes du test:
   * 1. Connexion avec l'utilisateur standard
   * 2. Vérification de tous les produits du catalogue
   * 3. Ajout d'un produit au panier
   * 4. Consultation du panier
   * 5. Processus de checkout
   * 6. Remplissage du formulaire de livraison
   * 7. Vérification du récapitulatif (quantité, prix, taxes, total)
   * 8. Finalisation de la commande
   * 9. Vérification du message de confirmation
   * 10. Vérification de la disparition du badge du panier
   */
  test('E2E01 - Parcours complet d\'achat d\'un produit', async ({ page }) => {
    try {
      // ÉTAPE 1: Connexion
      console.log('\n📋 ÉTAPE 1: CONNEXION');
      console.log('--------------------');
      await login(page, testData.user.username, testData.user.password);
      await expect(page).toHaveURL(/.*inventory.html/);
      console.log('✅ Étape 1 terminée avec succès');

      // ÉTAPE 2: Vérification des produits
      console.log('\n📋 ÉTAPE 2: VÉRIFICATION DES PRODUITS');
      console.log('--------------------------------------');
      for (const product of testData.products) {
        await verifyProduct(page, product);
      }
      console.log(`✅ Tous les ${testData.products.length} produits ont été vérifiés avec succès`);
      console.log('✅ Étape 2 terminée avec succès');

      // ÉTAPE 3: Ajout du produit au panier
      console.log('\n📋 ÉTAPE 3: AJOUT DU PRODUIT AU PANIER');
      console.log('---------------------------------------');
      const selectedProduct = testData.products[0];
      console.log(`🎯 Produit sélectionné: ${selectedProduct.name} - ${selectedProduct.price}`);
      await addProductToCart(page, selectedProduct.name);
      console.log('✅ Étape 3 terminée avec succès');

      // ÉTAPE 4: Consultation du panier
      console.log('\n📋 ÉTAPE 4: CONSULTATION DU PANIER');
      console.log('-----------------------------------');
      await goToCart(page);
      await expect(page).toHaveURL(/.*cart.html/);
      await verifyCartItem(page, selectedProduct.name, selectedProduct.price);
      console.log('✅ Étape 4 terminée avec succès');

      // ÉTAPE 5: Processus de checkout
      console.log('\n📋 ÉTAPE 5: PROCESSUS DE CHECKOUT');
      console.log('----------------------------------');
      await proceedToCheckout(page);
      await expect(page).toHaveURL(/.*checkout-step-one.html/);
      console.log('✅ Étape 5 terminée avec succès');

      // ÉTAPE 6: Remplissage du formulaire
      console.log('\n📋 ÉTAPE 6: REMPLISSAGE DU FORMULAIRE');
      console.log('--------------------------------------');
      console.log(`📝 Informations: ${testData.checkoutInfo.firstName} ${testData.checkoutInfo.lastName}, ${testData.checkoutInfo.zipCode}`);
      await fillCheckoutForm(
        page,
        testData.checkoutInfo.firstName,
        testData.checkoutInfo.lastName,
        testData.checkoutInfo.zipCode
      );
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
      console.log('✅ Étape 6 terminée avec succès');

      // ÉTAPE 7: Vérification du récapitulatif
      console.log('\n📋 ÉTAPE 7: VÉRIFICATION DU RÉCAPITULATIF');
      console.log('------------------------------------------');
      await verifyCheckoutSummary(page, selectedProduct.name, selectedProduct.price);
      console.log('✅ Étape 7 terminée avec succès');

      // ÉTAPE 8: Finalisation de la commande
      console.log('\n📋 ÉTAPE 8: FINALISATION DE LA COMMANDE');
      console.log('----------------------------------------');
      await finishOrder(page);
      await expect(page).toHaveURL(/.*checkout-complete.html/);
      console.log('✅ Étape 8 terminée avec succès');

      // ÉTAPE 9: Vérification de la confirmation
      console.log('\n📋 ÉTAPE 9: VÉRIFICATION DE LA CONFIRMATION');
      console.log('--------------------------------------------');
      await verifyOrderConfirmation(page);
      console.log('✅ Étape 9 terminée avec succès');

      // ÉTAPE 10: Vérification du badge panier
      console.log('\n📋 ÉTAPE 10: VÉRIFICATION DU BADGE PANIER');
      console.log('-----------------------------------------');
      await verifyCartBadgeNotVisible(page);
      console.log('✅ Étape 10 terminée avec succès');

      // Fin du test avec succès
      console.log('\n========================================');
      console.log('✅ TEST E2E TERMINÉ AVEC SUCCÈS');
      console.log('========================================');
      console.log(`🎉 Commande effectuée: ${selectedProduct.name}`);
      console.log(`💰 Prix: ${selectedProduct.price}`);
      console.log(`📅 Date de fin: ${new Date().toLocaleString()}`);
      console.log('========================================\n');

    } catch (error) {
      // Gestion des erreurs globales du test E2E
      console.error('\n========================================');
      console.error('❌ TEST E2E ÉCHOUÉ');
      console.error('========================================');
      console.error(`❌ Erreur: ${error.message}`);
      console.error(`📅 Date d\'échec: ${new Date().toLocaleString()}`);
      console.error('========================================\n');

      // Capture d'écran en cas d'échec du test E2E
      await page.screenshot({
        path: `screenshots/E2E01-fail-${Date.now()}.png`,
        fullPage: true
      });

      // Relance l'erreur pour que le test soit marqué comme échoué
      throw error;
    }
  });

  /**
   * Hook afterAll - Exécuté une seule fois après tous les tests de cette suite
   * Affiche un message de fin de suite de tests
   */
  test.afterAll(async () => {
    console.log('\n========================================');
    console.log('🏁 FIN DE LA SUITE DE TESTS E2E');
    console.log('========================================\n');
  });
});
