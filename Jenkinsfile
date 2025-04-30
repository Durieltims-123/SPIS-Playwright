pipeline {
    agent any

    triggers {
        pollSCM('H/10 * * * *') // Poll GitHub every 2 minutes
    }

    environment {
        NODEJS_VERSION = '18'
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

        stage('Start Selenium Grid') {
           when {
                expression {
                    return fileExists('docker-compose.yml')
                }
            }
            steps {
                powershell '''
                docker-compose -f docker-compose.yml up -d
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                powershell '''
                npx playwright test
                '''
            }
        }

        stage('Cleanup') {
            steps {
                powershell '''
                try {
                    docker-compose -f docker-compose.yml down
                } catch {
                    Write-Host "Cleanup failed, but continuing anyway..."
                }
                '''
            }
        }

        stage('Authenticate to Xray') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'xray-cloud-creds', // use your saved Jenkins credential
                    usernameVariable: 'XRAY_CLIENT_ID',
                    passwordVariable: 'XRAY_CLIENT_SECRET'
                )]) {
                    powershell '''
                        $body = @{
                            client_id = "$env:XRAY_CLIENT_ID"
                            client_secret = "$env:XRAY_CLIENT_SECRET"
                        } | ConvertTo-Json

                        $response = Invoke-RestMethod -Uri "https://xray.cloud.getxray.app/api/v2/authenticate" `
                            -Method Post -ContentType "application/json" -Body $body

                        if (-not $response) {
                            Write-Error "❌ Failed to authenticate with Xray."
                            exit 1
                        }

                        # Save token to temp file for next stage
                        Set-Content -Path "xray.token" -Value $response
                        Write-Host "✅ Xray authentication token acquired."
                    '''
                }
            }
        }
        
       stage('Upload Results to Xray') {
            steps {
                powershell '''
                    $resultsPath = "test-results\\results.xml"  # Change if your path is different

                    if (-not (Test-Path $resultsPath)) {
                        Write-Error "❌ Test result file not found: $resultsPath"
                        exit 1
                    }

                    $token = Get-Content -Path "xray.token"

                    Write-Host "📤 Uploading test results to Xray Cloud..."

                    # Add projectKey to the URL
                    $url = "https://xray.cloud.getxray.app/api/v2/import/execution/junit?projectKey=SPIS"

                    $response = Invoke-RestMethod -Uri $url `
                        -Method Post `
                        -Headers @{ Authorization = "Bearer $token" } `
                        -InFile $resultsPath `
                        -ContentType "application/xml"

                    Write-Host "✅ Upload complete."
                    $response | ConvertTo-Json -Depth 3

                '''
            }
        }


    }

    post {
        always {
            echo 'Cleaning up any remaining containers...'
            powershell '''
            try {
                docker-compose -f docker-compose.yml down
            } catch {
                Write-Host "Post-cleanup failed, but job completed."
            }
            '''
        }
    }
}
