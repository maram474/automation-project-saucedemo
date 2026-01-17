pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ========================================
        // JOB 1: PLAYWRIGHT FILTER TESTS
        // ========================================
        stage('Playwright - Filter Tests') {
            steps {
                script {
                    dir('playwright_tests') {
                        sh 'npm ci'
                        sh 'npx playwright install --with-deps chromium'
                        sh 'npm run test:filter'
                    }
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright_tests/playwright-report',
                        reportFiles: 'index.html',
                        reportName: '🎭 Playwright Filter Report',
                        reportTitles: 'Playwright Filter Tests'
                    ])
                }
            }
        }

        // ========================================
        // JOB 2: PLAYWRIGHT PURCHASE TESTS
        // ========================================
        stage('Playwright - Purchase Tests') {
            steps {
                script {
                    dir('playwright_tests') {
                        sh 'npm run test:purchase'
                    }
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright_tests/playwright-report',
                        reportFiles: 'index.html',
                        reportName: '🎭 Playwright Purchase Report',
                        reportTitles: 'Playwright Purchase Tests'
                    ])
                }
            }
        }

        // ========================================
        // JOB 3: SELENIUM CONNECTION TESTS
        // ========================================
        stage('Selenium - Connection Tests') {
            steps {
                script {
                    dir('selenium_tests') {
                        sh 'python3 -m pip install --upgrade pip'
                        sh 'pip install -r requirements.txt'
                        sh 'pytest tests/test_connection.py --html=report-connection.html --self-contained-html -v'
                    }
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'selenium_tests',
                        reportFiles: 'report-connection.html',
                        reportName: '🐍 Selenium Connection Report',
                        reportTitles: 'Selenium Connection Tests'
                    ])
                }
            }
        }

        // ========================================
        // JOB 4: SELENIUM PRODUCTS TESTS
        // ========================================
        stage('Selenium - Products Tests') {
            steps {
                script {
                    dir('selenium_tests') {
                        sh 'pytest tests/test_produits.py --html=report-products.html --self-contained-html -v'
                    }
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'selenium_tests',
                        reportFiles: 'report-products.html',
                        reportName: '🐍 Selenium Products Report',
                        reportTitles: 'Selenium Products Tests'
                    ])
                }
            }
        }

        // ========================================
        // JOB 5: ROBOT FRAMEWORK TESTS
        // ========================================
        stage('Robot Framework Tests') {
            steps {
                script {
                    dir('robot_tests') {
                        sh 'python3 -m pip install --upgrade pip'
                        sh 'pip install -r requirements.txt'
                        sh 'robot --outputdir results tests/'
                    }
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'robot_tests/results',
                        reportFiles: 'report.html',
                        reportName: '🤖 Robot Framework Report',
                        reportTitles: 'Robot Framework Tests'
                    ])

                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'robot_tests/results',
                        reportFiles: 'log.html',
                        reportName: '🤖 Robot Framework Log',
                        reportTitles: 'Robot Framework Detailed Log'
                    ])
                }
            }
        }
    }

    post {
        always {
            echo '========================================='
            echo '📊 ARCHIVING ALL ARTIFACTS'
            echo '========================================='

            // Archiver tous les rapports
            archiveArtifacts artifacts: 'playwright_tests/playwright-report/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'selenium_tests/report-*.html', allowEmptyArchive: true
            archiveArtifacts artifacts: 'robot_tests/results/**/*', allowEmptyArchive: true

            // Screenshots si échecs
            archiveArtifacts artifacts: 'playwright_tests/screenshots/**/*', allowEmptyArchive: true
        }

        success {
            echo '========================================='
            echo '✅ ALL TEST SUITES PASSED SUCCESSFULLY!'
            echo '========================================='
            echo '📋 Summary:'
            echo '  ✅ Playwright Filter Tests'
            echo '  ✅ Playwright Purchase Tests'
            echo '  ✅ Selenium Connection Tests'
            echo '  ✅ Selenium Products Tests'
            echo '  ✅ Robot Framework Tests'
            echo '========================================='
        }

        failure {
            echo '========================================='
            echo '❌ SOME TESTS FAILED'
            echo '========================================='
            echo 'Check the reports for details'
        }
    }
}
