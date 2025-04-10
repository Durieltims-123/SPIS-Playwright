pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *') // Poll GitHub every 2 minutes
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
                npx playwright test --reporter=junit --output=./test-results
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

        stage('Update Xray') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'jira-api-credentials', usernameVariable: 'JIRA_USERNAME', passwordVariable: 'JIRA_API_TOKEN')]) {
                    powershell '''
                        $headers = @{
                            "Authorization" = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$env:JIRA_USERNAME:$env:JIRA_API_TOKEN"))
                            "Content-Type" = "application/xml"
                        }

                        $resultsPath = "test-results\\*.xml"  # Adjust pattern if needed
                        $files = Get-ChildItem -Path $resultsPath -ErrorAction SilentlyContinue

                        if (-not $files) {
                            Write-Error "❌ No JUnit XML test results found in path: $resultsPath"
                            exit 1
                        }

                        Write-Output "✅ Found test result files:"
                        $files | ForEach-Object { Write-Output " - $_.FullName" }

                        foreach ($file in $files) {
                            try {
                                $url = "https://dswd-team-di9z8gya.atlassian.net/rest/raven/1.0/import/execution/junit"
                                Write-Output "📤 Uploading test results from: $($file.FullName)"
                                $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -InFile $file.FullName -ContentType "application/xml"
                                Write-Output "✅ Upload successful. Response:"
                                $response | ConvertTo-Json -Depth 3
                            } catch {
                                Write-Error "❌ Failed to upload $($file.FullName): $_"
                            }
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
