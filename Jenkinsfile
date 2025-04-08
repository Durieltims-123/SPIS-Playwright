pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'your_dockerhub_username'
        DOCKER_HUB_PASSWORD = 'your_dockerhub_password'
        NODEJS_VERSION = '14'
    }

    tools {
        nodejs 'NodeJS_14'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/yourusername/your-repo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                    sh 'npm install playwright-webdriver'
                }
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    sh 'npx playwright test'
                }
            }
        }

        stage('Docker Setup') {
            steps {
                script {
                    sh 'docker info'
                    sh 'docker pull selenium/standalone-chrome'
                    sh 'docker run -d -p 4444:4444 --name selenium-hub selenium/standalone-chrome'
