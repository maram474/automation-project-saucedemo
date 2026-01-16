pipeline {
    agent any

    stages {

        // 🔹 Étape 1 : Installation des dépendances Python
        stage('Setup') {
            steps {
                echo 'Installation des dépendances Python...'
                bat '''
                chcp 65001
                C:\\Users\\tlili\\AppData\\Local\\Programs\\Python\\Python314\\python.exe -m pip install --upgrade pip
                C:\\Users\\tlili\\AppData\\Local\\Programs\\Python\\Python314\\python.exe -m pip install -r requirements.txt
                '''
            }
        }

        // 🔹 Étape 2 : Lancement des tests et génération du rapport HTML
        stage('Tests + Rapport HTML') {
            steps {
                echo 'Exécution des tests et génération du rapport...'
                bat '''
                chcp 65001
                mkdir reports 2>nul

                C:\\Users\\tlili\\AppData\\Local\\Programs\\Python\\Python314\\python.exe -m pytest tests --html=reports/report.html --self-contained-html
                '''
            }
        }
    }

    // 🔹 Post-actions : publication du rapport HTML
    post {
        always {
            echo 'Publication du rapport HTML dans Jenkins...'
            publishHTML([
                reportDir: 'reports',
                reportFiles: 'report.html',
                reportName: 'Rapport Tests Selenium',
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true
            ])
        }

        success {
            echo 'Tous les tests ont réussi'
        }

        failure {
            echo 'Certains tests ont échoué'
        }
    }
}
