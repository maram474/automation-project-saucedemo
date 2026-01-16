*** Settings ***
Library           SeleniumLibrary
Resource          ../resources/keywords.robot
Suite Teardown    Close Browser
Test Teardown     Run Keyword If Test Failed    Capture Page Screenshot

*** Test Cases ***
User Can See Burger Menu Options
    [Documentation]    Vérifie que l'utilisateur peut voir toutes les options du menu burger
    Open Application Browser
    Login With Standard User
    Open Burger Menu
    Verify Burger Menu Options
