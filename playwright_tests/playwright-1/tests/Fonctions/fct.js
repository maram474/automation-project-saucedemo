/**
 * ============================================================================
 * FICHIER: fct.js
 * DESCRIPTION: Fonctions réutilisables pour les tests Playwright
 * PROJET: Test Playwright 1 - Filtrage des produits (Saucedemo)
 * ============================================================================
 */

// ============================================================================
// FONCTION 1: Connexion
// ============================================================================
/**
 * Se connecter à l'application Saucedemo
 * 
 * Cette fonction remplit les champs username/password et clique sur le bouton
 * de connexion, puis attend que la page des produits soit chargée.
 * 
 * @param {Page} page - La page Playwright
 * @param {string} username - Nom d'utilisateur (ex: "standard_user")
 * @param {string} password - Mot de passe (ex: "secret_sauce")
 * @param {object} selectors - Objet contenant les sélecteurs CSS
 */
export async function login(page, username, password, selectors) {
  // Remplir le champ username
  await page.fill(selectors.login.username, username);
  
  // Remplir le champ password
  await page.fill(selectors.login.password, password);
  
  // Cliquer sur le bouton de connexion
  await page.click(selectors.login.loginButton);
  
  // Attendre que la page des produits soit chargée
  // (on attend que les items de l'inventaire soient visibles)
  await page.waitForSelector(selectors.products.inventoryItems);
}

// ============================================================================
// FONCTION 2: Navigation vers la page inventaire
// ============================================================================
/**
 * Aller à la page inventaire et attendre le chargement complet
 * 
 * Cette fonction navigue vers la page des produits et attend que le dropdown
 * de tri soit visible, garantissant que la page est complètement chargée.
 * 
 * @param {Page} page - La page Playwright
 * @param {string} urlinv - URL de la page inventaire
 * @param {object} selectors - Objet contenant les sélecteurs CSS
 */
export async function goToInventory(page, urlinv, selectors) {
  // Naviguer vers la page inventaire
  await page.goto(urlinv);
  
  // Attendre que le dropdown de tri soit visible
  // Cela garantit que la page est complètement chargée et prête
  await page.locator(selectors.products.sortDropdown).waitFor();
  
  // Message de confirmation dans la console
  console.log('   ✓ Page inventaire chargée');
}

// ============================================================================
// FONCTION 3: Récupérer tous les prix
// ============================================================================
/**
 * Récupérer tous les prix des produits affichés sur la page
 * 
 * Cette fonction extrait le texte de tous les prix, retire le symbole $,
 * et les convertit en nombres pour faciliter les comparaisons.
 * 
 * @param {Page} page - La page Playwright
 * @param {string} priceSelector - Sélecteur CSS des prix (ex: ".inventory_item_price")
 * @returns {Array<number>} - Tableau contenant tous les prix sous forme de nombres
 * 
 * Exemple de retour: [7.99, 9.99, 15.99, 29.99, 49.99]
 */
export async function getPrices(page, priceSelector) {
  // Récupérer tous les éléments DOM correspondant au sélecteur
  const allPrices = await page.$$(priceSelector);
  
  // Tableau pour stocker les prix convertis
  const prices = [];
  
  // Boucle sur chaque élément de prix
  for (let i = 0; i < allPrices.length; i++) {
    // Extraire le texte (ex: "$29.99")
    const text = await allPrices[i].textContent();
    
    // Retirer le symbole $ et convertir en nombre (ex: 29.99)
    const number = parseFloat(text.replace('$', ''));
    
    // Ajouter le nombre au tableau
    prices.push(number);
  }
  
  // Retourner le tableau de prix
  return prices;
}

// ============================================================================
// FONCTION 4: Vérifier l'ordre des prix
// ============================================================================
/**
 * Vérifier si les prix sont correctement triés
 * 
 * Compare chaque prix avec le suivant pour s'assurer que l'ordre
 * (croissant ou décroissant) est respecté.
 * 
 * @param {Array<number>} prices - Tableau des prix à vérifier
 * @param {string} order - Type d'ordre: "ascending" ou "descending"
 * @returns {boolean} - true si l'ordre est correct, false sinon
 * 
 * Exemple:
 * verifyPriceOrder([5, 10, 15], "ascending") → true
 * verifyPriceOrder([15, 10, 5], "ascending") → false
 */
export function verifyPriceOrder(prices, order) {
  // Boucle sur tous les prix sauf le dernier
  // (on compare chaque prix avec le suivant)
  for (let i = 0; i < prices.length - 1; i++) {
    const currentPrice = prices[i];      // Prix actuel
    const nextPrice = prices[i + 1];     // Prix suivant
    
    // Vérification pour ordre croissant (du plus petit au plus grand)
    if (order === 'ascending') {
      // Si le prix actuel est plus grand que le suivant → erreur
      if (currentPrice > nextPrice) {
        return false;
      }
    }
    
    // Vérification pour ordre décroissant (du plus grand au plus petit)
    if (order === 'descending') {
      // Si le prix actuel est plus petit que le suivant → erreur
      if (currentPrice < nextPrice) {
        return false;
      }
    }
  }
  
  // Si on arrive ici, l'ordre est correct
  return true;
}

// ============================================================================
// FONCTION 5: Changer le filtre
// ============================================================================
/**
 * Sélectionner une option dans le dropdown de tri
 * 
 * Change le filtre de tri des produits et attend un peu pour que
 * le tri soit appliqué sur la page.
 * 
 * @param {Page} page - La page Playwright
 * @param {string} sortSelector - Sélecteur CSS du dropdown
 * @param {string} filterValue - Valeur de l'option à sélectionner
 *                                (ex: "lohi" pour "Price: low to high")
 * 
 * Valeurs possibles:
 * - "az" : Name (A to Z)
 * - "za" : Name (Z to A)
 * - "lohi" : Price (low to high)
 * - "hilo" : Price (high to low)
 */
export async function selectFilter(page, sortSelector, filterValue) {
  // Sélectionner l'option dans le dropdown
  await page.selectOption(sortSelector, filterValue);
  
  // Attendre 500ms pour que le tri soit appliqué
  await page.waitForTimeout(500);
}

// ============================================================================
// FONCTION 6: Obtenir le filtre actuel
// ============================================================================
/**
 * Récupérer la valeur actuellement sélectionnée dans le dropdown
 * 
 * @param {Page} page - La page Playwright
 * @param {string} sortSelector - Sélecteur CSS du dropdown
 * @returns {string} - Valeur de l'option sélectionnée (ex: "az", "lohi")
 */
export async function getCurrentFilter(page, sortSelector) {
  // Exécuter du JavaScript dans le navigateur pour récupérer la valeur
  const value = await page.$eval(sortSelector, el => el.value);
  
  return value;
}

// ============================================================================
// FONCTION 7: Prendre une capture d'écran
// ============================================================================
/**
 * Capturer une screenshot de la page complète
 * 
 * Sauvegarde une image PNG de la page entière dans le dossier screenshots/.
 * 
 * @param {Page} page - La page Playwright
 * @param {string} filename - Nom du fichier (ex: "prix-croissant.png")
 * 
 * Le fichier sera sauvegardé dans: screenshots/[filename]
 */
export async function takeScreenshot(page, filename) {
  // Prendre une capture d'écran
  await page.screenshot({ 
    path: 'screenshots/' + filename,  // Chemin de sauvegarde
    fullPage: true                     // Capturer la page entière (pas seulement la partie visible)
  });
}

// ============================================================================
// FONCTION 8: Vérifier que le premier prix est le maximum
// ============================================================================
/**
 * Vérifier que le premier produit a le prix le plus élevé
 * 
 * Utile pour tester le tri "Price (high to low)".
 * 
 * @param {Array<number>} prices - Tableau des prix
 * @returns {boolean} - true si le premier prix est le maximum, false sinon
 * 
 * Exemple:
 * verifyFirstIsHighest([49.99, 29.99, 15.99]) → true
 * verifyFirstIsHighest([15.99, 29.99, 49.99]) → false
 */
export function verifyFirstIsHighest(prices) {
  const firstPrice = prices[0];  // Premier prix du tableau
  
  // Trouver le prix maximum dans tout le tableau
  // ...prices transforme [10, 20, 30] en: Math.max(10, 20, 30)
  const maxPrice = Math.max(...prices);
  
  // Comparer: le premier prix doit être égal au prix maximum
  return firstPrice === maxPrice;
}

// ============================================================================
// FONCTION 9: Vérifier que le dernier prix est le minimum
// ============================================================================
/**
 * Vérifier que le dernier produit a le prix le plus bas
 * 
 * Utile pour tester le tri "Price (high to low)".
 * 
 * @param {Array<number>} prices - Tableau des prix
 * @returns {boolean} - true si le dernier prix est le minimum, false sinon
 * 
 * Exemple:
 * verifyLastIsLowest([49.99, 29.99, 7.99]) → true
 * verifyLastIsLowest([7.99, 29.99, 49.99]) → false
 */
export function verifyLastIsLowest(prices) {
  const lastPrice = prices[prices.length - 1];  // Dernier prix du tableau
  
  // Trouver le prix minimum dans tout le tableau
  // ...prices transforme [10, 20, 30] en: Math.min(10, 20, 30)
  const minPrice = Math.min(...prices);
  
  // Comparer: le dernier prix doit être égal au prix minimum
  return lastPrice === minPrice;
}

// ============================================================================
// FONCTION 10: Afficher les prix (pour debug)
// ============================================================================
/**
 * Afficher tous les prix dans la console
 * 
 * Fonction utile pour le débogage - affiche une liste numérotée
 * de tous les prix dans la console.
 * 
 * @param {Array<number>} prices - Tableau des prix à afficher
 * 
 * Exemple de sortie:
 * Liste des prix:
 * Produit 1: $7.99
 * Produit 2: $9.99
 * Produit 3: $15.99
 */
export function displayPrices(prices) {
  console.log('Liste des prix:');
  
  // Boucle sur tous les prix
  for (let i = 0; i < prices.length; i++) {
    // Afficher: "Produit [numéro]: $[prix]"
    // (i + 1) car on veut commencer à 1, pas à 0
    console.log('Produit ' + (i + 1) + ': $' + prices[i]);
  }
}

// ============================================================================
// FIN DU FICHIER
// ============================================================================