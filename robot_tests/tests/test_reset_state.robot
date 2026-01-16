*** Settings ***
Library           SeleniumLibrary
Resource          ../resources/keywords.robot
Suite Teardown    Close Browser
Test Teardown     Run Keyword If Test Failed    Capture Page Screenshot

*** Test Cases ***
User Can Reset Application State
    [Documentation]    Vérifie que l'utilisateur peut réinitialiser l'état de l'application et vider le panier
    Open Application Browser
    Login With Standard User
    Add Product To Cart
    Reset App State
    Verify Cart Is Empty
