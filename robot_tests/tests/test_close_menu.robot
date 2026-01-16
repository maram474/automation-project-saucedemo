*** Settings ***
Library           SeleniumLibrary
Resource          ../resources/keywords.robot
Suite Teardown    Close Browser
Test Teardown     Run Keyword If Test Failed    Capture Page Screenshot

*** Test Cases ***
User Can Close Burger Menu Using X Button
    [Documentation]    Ferme le menu burger en cliquant sur le bouton X et vérifie qu'il disparaît
    Open Application Browser
    Login With Standard User
    Open Burger Menu
    Close Burger Menu 
