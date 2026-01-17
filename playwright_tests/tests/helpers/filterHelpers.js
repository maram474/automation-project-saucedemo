/**
 * ============================================================================
 * HELPERS DE FILTRAGE - Fonctions pour les tests de tri des produits
 * ============================================================================
 */

/**
 * Récupérer tous les prix des produits
 * @param {Page} page - La page Playwright
 * @param {string} priceSelector - Sélecteur CSS des prix
 * @returns {Array<number>} - Tableau des prix
 */
export async function getPrices(page, priceSelector) {
  const allPrices = await page.$$(priceSelector);
  const prices = [];

  for (let i = 0; i < allPrices.length; i++) {
    const text = await allPrices[i].textContent();
    const number = parseFloat(text.replace('$', ''));
    prices.push(number);
  }

  return prices;
}

/**
 * Vérifier si les prix sont correctement triés
 * @param {Array<number>} prices - Tableau des prix
 * @param {string} order - "ascending" ou "descending"
 * @returns {boolean} - true si l'ordre est correct
 */
export function verifyPriceOrder(prices, order) {
  for (let i = 0; i < prices.length - 1; i++) {
    const currentPrice = prices[i];
    const nextPrice = prices[i + 1];

    if (order === 'ascending') {
      if (currentPrice > nextPrice) {
        return false;
      }
    }

    if (order === 'descending') {
      if (currentPrice < nextPrice) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Sélectionner une option dans le dropdown de tri
 * @param {Page} page - La page Playwright
 * @param {string} sortSelector - Sélecteur CSS du dropdown
 * @param {string} filterValue - Valeur de l'option (ex: "lohi")
 */
export async function selectFilter(page, sortSelector, filterValue) {
  await page.selectOption(sortSelector, filterValue);
  await page.waitForTimeout(500);
}

/**
 * Récupérer la valeur actuellement sélectionnée dans le dropdown
 * @param {Page} page - La page Playwright
 * @param {string} sortSelector - Sélecteur CSS du dropdown
 * @returns {string} - Valeur de l'option sélectionnée
 */
export async function getCurrentFilter(page, sortSelector) {
  const value = await page.$eval(sortSelector, el => el.value);
  return value;
}

/**
 * Prendre une capture d'écran
 * @param {Page} page - La page Playwright
 * @param {string} filename - Nom du fichier
 */
export async function takeScreenshot(page, filename) {
  await page.screenshot({
    path: 'screenshots/' + filename,
    fullPage: true
  });
}

/**
 * Vérifier que le premier produit a le prix maximum
 * @param {Array<number>} prices - Tableau des prix
 * @returns {boolean}
 */
export function verifyFirstIsHighest(prices) {
  const firstPrice = prices[0];
  const maxPrice = Math.max(...prices);
  return firstPrice === maxPrice;
}

/**
 * Vérifier que le dernier produit a le prix minimum
 * @param {Array<number>} prices - Tableau des prix
 * @returns {boolean}
 */
export function verifyLastIsLowest(prices) {
  const lastPrice = prices[prices.length - 1];
  const minPrice = Math.min(...prices);
  return lastPrice === minPrice;
}

/**
 * Afficher tous les prix dans la console (pour debug)
 * @param {Array<number>} prices - Tableau des prix
 */
export function displayPrices(prices) {
  console.log('Liste des prix:');
  for (let i = 0; i < prices.length; i++) {
    console.log('Produit ' + (i + 1) + ': $' + prices[i]);
  }
}
