pipeline {
    agent any

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
                script {
                    def exitCode = powershell(script: '''
                        npx playwright test
                        exit $LASTEXITCODE
                    ''', returnStatus: true)

                    // Handle the failed tests but continue
                    if (exitCode != 0) {
                        echo "⚠️ Some Playwright tests failed (exit code: ${exitCode}), continuing to Xray upload..."
                        currentBuild.result = 'UNSTABLE' // Optional: mark build as unstable
                    }
                }
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


        stage('Create Jira Bugs for Failed Tests') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'jira-api-credentials',
                    usernameVariable: 'JIRA_EMAIL',
                    passwordVariable: 'JIRA_API_TOKEN'
                )]) {
                    powershell '''
                        [xml]$junit = Get-Content "test-results\\results.xml"
                        $failedTests = $junit.testsuite.testcase | Where-Object { $_.failure }

                        if ($failedTests.Count -eq 0) {
                            Write-Host "✅ No failed tests to report to Jira."
                            return
                        }

                        foreach ($test in $failedTests) {
                            $testName = $test.name
                            $className = $test.classname
                            $errorMsg = $test.failure.'#text'

                            $payload = @{
                                fields = @{
                                    project = @{ key = "SPIS" }
                                    summary = "❌ Playwright test failed: $testName"
                                    description = "Test **$testName** in **$className** failed.\n\nError: `$errorMsg`\n\nSee Jenkins build #$env:BUILD_NUMBER"
                                    issuetype = @{ name = "Bug" }
                                }
                            } | ConvertTo-Json -Depth 10

                            $headers = @{
                                "Authorization" = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$env:JIRA_EMAIL:$env:JIRA_API_TOKEN"))
                                "Content-Type" = "application/json"
                            }

                            $response = Invoke-RestMethod -Uri "https://dswd-team-di9z8gya.atlassian.net/rest/api/3/issue" `
                                -Method Post -Headers $headers -Body $payload

                            Write-Host "🐞 Created Jira bug: $($response.key)"
                        }
                    '''
                }
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
