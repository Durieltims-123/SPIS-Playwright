pipeline {
    agent any

    environment {
        NODEJS_VERSION = '18'
    }

    tools {
        nodejs 'NodeJS_18' // Ensure this is configured in Jenkins → Global Tool Configuration
    }

    stages {
        // stage('Checkout') {
        //     steps {
        //         git url: 'https://github.com/Durieltims-123/SPIS-Playwright.git', branch: 'main'
        //     }
        // }

        // stage('Install Dependencies') {
        //     steps {
        //         powershell '''
        //         npm install
        //         npx playwright install
        //         '''
        //     }
        // }

        // stage('Start Selenium Grid') {
        //     when {
        //         expression {
        //             return fileExists('docker-compose.yml')
        //         }
        //     }
        //     steps {
        //         powershell '''
        //         docker-compose -f docker-compose.yml up -d
        //         '''
        //     }
        // }

        // stage('Run Playwright Tests') {
        //     steps {
        //         script {
        //             def exitCode = powershell(script: '''
        //                 npx playwright test
        //                 exit $LASTEXITCODE
        //             ''', returnStatus: true)

        //             // Handle the failed tests but continue
        //             if (exitCode != 0) {
        //                 echo "⚠️ Some Playwright tests failed (exit code: ${exitCode}), continuing to Xray upload..."
        //                 currentBuild.result = 'UNSTABLE' // Optional: mark build as unstable
        //             }
        //         }
        //     }
        // }

        // stage('Cleanup') {
        //     steps {
        //         powershell '''
        //         try {
        //             docker-compose -f docker-compose.yml down
        //         } catch {
        //             Write-Host "Cleanup failed, but continuing anyway..."
        //         }
        //         '''
        //     }
        // }

        // stage('Authenticate to Xray') {
        //     steps {
        //         withCredentials([usernamePassword(
        //             credentialsId: 'xray-cloud-creds', // use your saved Jenkins credential
        //             usernameVariable: 'XRAY_CLIENT_ID',
        //             passwordVariable: 'XRAY_CLIENT_SECRET'
        //         )]) {
        //             powershell '''
        //                 $body = @{
        //                     client_id = "$env:XRAY_CLIENT_ID"
        //                     client_secret = "$env:XRAY_CLIENT_SECRET"
        //                 } | ConvertTo-Json

        //                 $response = Invoke-RestMethod -Uri "https://xray.cloud.getxray.app/api/v2/authenticate" `
        //                     -Method Post -ContentType "application/json" -Body $body

        //                 if (-not $response) {
        //                     Write-Error "❌ Failed to authenticate with Xray."
        //                     exit 1
        //                 }

        //                 # Save token to temp file for next stage
        //                 Set-Content -Path "xray.token" -Value $response
        //                 Write-Host "✅ Xray authentication token acquired."
        //             '''
        //         }
        //     }
        // }

        // stage('Upload Results to Xray') {
        //     steps {
        //         powershell '''
        //             $resultsPath = "test-results\\results.xml"  # Change if your path is different

        //             if (-not (Test-Path $resultsPath)) {
        //                 Write-Error "❌ Test result file not found: $resultsPath"
        //                 exit 1
        //             }

        //             $token = Get-Content -Path "xray.token"

        //             Write-Host "📤 Uploading test results to Xray Cloud..."

        //             # Add projectKey to the URL
        //             $url = "https://xray.cloud.getxray.app/api/v2/import/execution/junit?projectKey=SPIS"

        //             $response = Invoke-RestMethod -Uri $url `
        //                 -Method Post `
        //                 -Headers @{ Authorization = "Bearer $token" } `
        //                 -InFile $resultsPath `
        //                 -ContentType "application/xml"

        //             Write-Host "✅ Upload complete."
        //             $response | ConvertTo-Json -Depth 3
        //         '''
        //     }
        // }

        stage('Create Jira Bug if Failed') {
            when {
                expression {
                    return currentBuild.result == 'UNSTABLE' || currentBuild.result == 'FAILURE'
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'jira-api-credentials',
                    usernameVariable: 'JIRA_EMAIL',
                    passwordVariable: 'JIRA_API_TOKEN'
                )]) {
                    powershell '''
                        try {
                            $encodedAuth = [Convert]::ToBase64String(
                                [Text.Encoding]::ASCII.GetBytes("${env:JIRA_EMAIL}:${env:JIRA_API_TOKEN}")
                            )

                            $headers = @{
                                "Authorization" = "Basic $encodedAuth"
                                "Content-Type"  = "application/json"
                            }

                            $body = @{
                                fields = @{
                                    project     = @{ key = "SPIS" }
                                    summary     = "❌ Playwright test failure detected in Jenkins"
                                    description = "Automated alert: One or more Playwright tests failed during CI. See Jenkins job logs for details."
                                    issuetype   = @{ name = "Bug" }
                                }
                            } | ConvertTo-Json -Depth 10 -Compress

                            Write-Host "📤 Sending JSON payload to Jira:"
                            Write-Host $body

                            $url = "https://durieltims.atlassian.net/rest/api/3/issue"
                            $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
                            Write-Host "✅ Jira issue created: $($response.key)"
                        }
                        catch {
                            Write-Host "❌ Failed to create Jira issue."
                            Write-Host "🔻 Exception: $($_.Exception.Message)"

                            try {
                                $resp = $_.Exception.Response
                                if ($resp -ne $null) {
                                    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
                                    $respBody = $reader.ReadToEnd()
                                    Write-Host "📋 Jira Response Body: $respBody"
                                } else {
                                    Write-Host "⚠️ No response body received from Jira."
                                }
                            } catch {
                                Write-Host "⚠️ Could not read error response from Jira."
                            }

                            exit 1
                        }
                    '''
                }
            }
        }


    }

    // post {
        // always {
        //     echo 'Cleaning up any remaining containers...'
        //     powershell '''
        //     try {
        //         docker-compose -f docker-compose.yml down
        //     } catch {
        //         Write-Host "Post-cleanup failed, but job completed."
        //     }
        //     '''
        // }
    // }
}
