*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem
Library    JSONLibrary

*** Variables ***
${DATA_DIR}    ${CURDIR}${/}..${/}data
${CONFIG_FILE}    ${DATA_DIR}${/}config.json
${LOCATORS_FILE}    ${DATA_DIR}${/}locators.json
&{CONFIG_CACHE}    
&{LOCATORS_CACHE}    

*** Keywords ***
Load Config
    # Utilise le cache pour éviter de recharger le fichier
    IF    $CONFIG_CACHE == {}
        ${config_content}=    Get File    ${CONFIG_FILE}
        ${config}=    Evaluate    json.loads('''${config_content}''')    json
        Set Suite Variable    &{CONFIG_CACHE}    &{config}
    END
    RETURN    ${CONFIG_CACHE}

Load Locators
    # Utilise le cache pour éviter de recharger le fichier
    IF    $LOCATORS_CACHE == {}
        ${locators_content}=    Get File    ${LOCATORS_FILE}
        ${locators}=    Evaluate    json.loads('''${locators_content}''')    json
        Set Suite Variable    &{LOCATORS_CACHE}    &{locators}
    END
    RETURN    ${LOCATORS_CACHE}

Get Locator
    [Arguments]    ${key}
    ${locators}=    Load Locators
    ${locator}=    Set Variable    ${locators}[${key}]
    
    # Find the index of the colon character
    ${colon_index}=    Evaluate    '''${locator}'''.find(':')
    
    IF    ${colon_index} >= 0
        ${strategy}=    Evaluate    '''${locator}'''[:${colon_index}]
        ${value}=    Evaluate    '''${locator}'''[${colon_index + 1}:]
        RETURN    ${strategy}    ${value}
    ELSE
        RETURN    ${EMPTY}    ${locator}
    END

# ============================
# Browser
# ============================
Open Application Browser
    ${config}=    Load Config

    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys

    ${prefs}=    Create Dictionary
    ...    credentials_enable_service=${False}
    ...    profile.password_manager_enabled=${False}

    Call Method    ${options}    add_experimental_option    prefs    ${prefs}

    Call Method    ${options}    add_argument    --disable-notifications
    Call Method    ${options}    add_argument    --disable-infobars
    Call Method    ${options}    add_argument    --incognito

    # 🔥 OBLIGATOIRE EN GITHUB ACTIONS
    Call Method    ${options}    add_argument    --headless
    Call Method    ${options}    add_argument    --no-sandbox
    Call Method    ${options}    add_argument    --disable-dev-shm-usage

    Open Browser    ${config}[URL]    Chrome    options=${options}
    Maximize Browser Window
    Set Selenium Speed    0.3s


# ============================
# Authentication
# ============================
Login With Standard User
    ${config}=    Load Config
    ${username_strategy}    ${username_value}=    Get Locator    LOGIN_USER
    ${password_strategy}    ${password_value}=    Get Locator    LOGIN_PASSWORD
    ${button_strategy}    ${button_value}=    Get Locator    LOGIN_BUTTON
    ${products_text}=    Get Locator    PRODUCTS_PAGE_TEXT
    
    Input Text    ${username_strategy}:${username_value}    ${config}[USERNAME]
    Input Text    ${password_strategy}:${password_value}    ${config}[PASSWORD]
    Click Button    ${button_strategy}:${button_value}
    Wait Until Page Contains    ${products_text[1]}

# ============================
# Burger Menu Generic
# ============================
Open Burger Menu
    Close Burger Menu If Open
    ${menu_btn_strategy}    ${menu_btn_value}=    Get Locator    BURGER_MENU_BTN
    Wait Until Element Is Visible    ${menu_btn_strategy}:${menu_btn_value}    timeout=5s
    Wait Until Element Is Enabled    ${menu_btn_strategy}:${menu_btn_value}    timeout=5s
    Sleep    0.3s
    Click Element    ${menu_btn_strategy}:${menu_btn_value}

Close Burger Menu If Open
    ${close_btn_strategy}    ${close_btn_value}=    Get Locator    BURGER_MENU_CLOSE_BTN
    ${is_visible}=    Run Keyword And Return Status    Element Should Be Visible    ${close_btn_strategy}:${close_btn_value}
    Run Keyword If    ${is_visible}    Click Element    ${close_btn_strategy}:${close_btn_value}

Close Burger Menu
    [Documentation]    Ferme le menu burger en cliquant sur le bouton X et attend que le menu disparaisse.
    ${close_btn_strategy}    ${close_btn_value}=    Get Locator    BURGER_MENU_CLOSE_BTN
    Wait Until Element Is Visible    ${close_btn_strategy}:${close_btn_value}    5s
    Click Element    ${close_btn_strategy}:${close_btn_value}
    Wait Until Element Is Not Visible    ${close_btn_strategy}:${close_btn_value}    5s

Click Burger Menu Option
    [Arguments]    ${option_key}
    ${option_strategy}    ${option_value}=    Get Locator    ${option_key}
    Open Burger Menu
    Click Element    ${option_strategy}:${option_value}

# ============================
# Validations
# ============================
Verify Burger Menu Is Open
    ${all_items_strategy}    ${all_items_value}=    Get Locator    MENU_ALL_ITEMS
    ${close_btn_strategy}    ${close_btn_value}=    Get Locator    BURGER_MENU_CLOSE_BTN
    Element Should Be Visible    ${all_items_strategy}:${all_items_value}
    Element Should Be Visible    ${close_btn_strategy}:${close_btn_value}

Verify Burger Menu Options
    ${all_items_strategy}    ${all_items_value}=    Get Locator    MENU_ALL_ITEMS
    ${about_strategy}    ${about_value}=    Get Locator    MENU_ABOUT
    ${logout_strategy}    ${logout_value}=    Get Locator    MENU_LOGOUT
    ${reset_strategy}    ${reset_value}=    Get Locator    MENU_RESET_APP_STATE
    
    Element Should Be Visible    ${all_items_strategy}:${all_items_value}
    Element Should Be Visible    ${about_strategy}:${about_value}
    Element Should Be Visible    ${logout_strategy}:${logout_value}
    Element Should Be Visible    ${reset_strategy}:${reset_value}

# ============================
# Actions
# ============================
Click All Items And Stay On Products Page
    ${products_text}=    Get Locator    PRODUCTS_PAGE_TEXT
    Click Burger Menu Option    MENU_ALL_ITEMS
    Wait Until Page Contains    ${products_text[1]}

Click About And Verify Saucelabs Page
    Click Burger Menu Option    MENU_ABOUT
    Wait Until Location Contains    saucelabs.com
    ${location}=    Get Location
    Should Not Contain    ${location}    /error/404

Return To Application
    ${products_text}=    Get Locator    PRODUCTS_PAGE_TEXT
    Go Back
    Wait Until Page Contains    ${products_text[1]}

Add Product To Cart
    ${add_cart_strategy}    ${add_cart_value}=    Get Locator    ADD_TO_CART_BACKPACK
    ${badge_strategy}    ${badge_value}=    Get Locator    SHOPPING_CART_BADGE
    
    Click Button    ${add_cart_strategy}:${add_cart_value}
    Element Should Be Visible    ${badge_strategy}:${badge_value}

Reset App State
    Click Burger Menu Option    MENU_RESET_APP_STATE

Verify Cart Is Empty
    [Documentation]    Réinitialise l'état de l'application et vérifie que le panier est vide et que tous les produits sont remis à "Add to cart".

    Open Burger Menu
    ${reset_strategy}    ${reset_value}=    Get Locator    MENU_RESET_APP_STATE
    Click Element    ${reset_strategy}:${reset_value}
    Close Burger Menu

    # 1️ Vérifier que le panier est vide
    ${badge_strategy}    ${badge_value}=    Get Locator    SHOPPING_CART_BADGE
    Wait Until Element Is Not Visible    ${badge_strategy}:${badge_value}    5s

    # 2️ Vérifier que tous les boutons sont "Add to cart"
    @{buttons}=    Get WebElements    css:button.btn_inventory

    FOR    ${btn}    IN    @{buttons}
        ${text}=    Get Text    ${btn}
        Should Be Equal    ${text}    Add to cart
    END
    Element Should Not Be Visible    ${badge_strategy}:${badge_value}

Logout From Application
    Click Burger Menu Option    MENU_LOGOUT

Verify Login Page Is Displayed
    ${login_btn_strategy}    ${login_btn_value}=    Get Locator    LOGIN_BUTTON
    Wait Until Element Is Visible    ${login_btn_strategy}:${login_btn_value}