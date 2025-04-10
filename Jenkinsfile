pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *') // Poll GitHub every 2 minutes
    }

    environment {
        NODEJS_VERSION = '18' // Update to 18
    }

    tools {
        nodejs 'NodeJS_18' // Update to NodeJS_18 (Make sure it's set up in Jenkins → Global Tool Configuration)
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Durieltims-123/SPIS-Playwright.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npx playwright install'
            }
        }

        // 👇 OPTIONAL: Only if you're using Playwright in WebDriver mode with Selenium Grid
        stage('Start Selenium Grid') {
            when {
                expression {
                    return fileExists('playwright.config.js') && readFile('package.json').contains('playwright-webdriver')
                }
            }
            steps {
                sh '''
                docker rm -f selenium-hub || true
                docker pull selenium/standalone-chrome
                docker run -d -p 4444:4444 --name selenium-hub selenium/standalone-chrome
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test'
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker rm -f selenium-hub || true'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up any remaining containers...'
            sh 'docker rm -f selenium-hub || true'
        }
    }
}
