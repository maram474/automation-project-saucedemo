*** Settings ***
Library           SeleniumLibrary
Resource          ../resources/keywords.robot
Suite Teardown    Close Browser
Test Teardown     Run Keyword If Test Failed    Capture Page Screenshot

*** Test Cases ***
User Can Return To Product List Using All Items
    [Documentation]    Vérifie que l'utilisateur peut revenir à la liste de produits via All Items
    Open Application Browser
    Login With Standard User
    Click All Items And Stay On Products Page
