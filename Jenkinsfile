pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *') // Poll GitHub every 2 minutes
    }

    environment {
        NODEJS_VERSION = '18' // Update to 18
    }

    tools {
        nodejs 'NodeJS_18' // Ensure this is configured in Jenkins → Global Tool Configuration
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Durieltims-123/SPIS-Playwright.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                powershell '''
                npm install
                npx playwright install
                '''
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
                powershell '''
                docker rm -f selenium-hub
                if ($?) {
                    Write-Output 'Existing selenium-hub container removed.'
                } else {
                    Write-Output 'No container to remove.'
                }
                docker pull selenium/standalone-chrome
                docker run -d -p 4444:4444 --name selenium-hub selenium/standalone-chrome
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                powershell '''
                npx playwright test --reporter=junit --output=./test-results
                '''
            }
        }

        stage('Cleanup') {
            steps {
                powershell '''
                docker rm -f selenium-hub
                if ($?) {
                    Write-Output 'selenium-hub container removed.'
                } else {
                    Write-Output 'No container to remove.'
                }
                '''
            }
        }

        // Jira Xray Integration
        stage('Update Xray') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'jira-api-credentials', usernameVariable: 'JIRA_USERNAME', passwordVariable: 'JIRA_API_TOKEN')]) {
                    powershell '''
                    # Path to the JUnit XML results
                    $resultsPath = "test-results/junit-*.xml"

                    # Xray API URL for creating/updating test execution results
                    $url = "https://dswd-team-di9z8gya.atlassian.net/rest/raven/1.0/import/execution/junit"

                    # Authorization for Jira (Xray)
                    $headers = @{
                        "Authorization" = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${JIRA_USERNAME}:${JIRA_API_TOKEN}"))
                        "Content-Type" = "application/json"
                    }

                    # Prepare the body (JUnit XML test results) to send to Xray
                    $body = @{
                        "file" = Get-Item -LiteralPath $resultsPath
                    }

                    # Invoke the Xray API to upload test execution results
                    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -InFile $body["file"].FullName

                    Write-Output $response
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up any remaining containers...'
            powershell '''
            docker rm -f selenium-hub
            if ($?) {
                Write-Output 'selenium-hub container removed.'
            } else {
                Write-Output 'No container to remove.'
            }
            '''
        }
    }
}
