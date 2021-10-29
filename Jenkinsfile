pipeline {
 	// Clean workspace before doing anything
    // deleteDir()
    agent any

    environment {
        imagename = "founek2/iot-platform"
        registryCredential = 'docker-hub'
        dockerImage = ''
    }

    stages {
        stage ('Install dependencies') {
            steps {
                sh "yarn"
                sh "yarn lerna init"
            }
        }
        
        stage ('Pre build') {
            steps {
                sh "yarn pre"
            }
        }

        // stage ('Tests') {
        //     steps {
        //         // parallel 'static': {
        //         //     sh "yarn lerna run --scope backend --scope common coverage"
        //         // },
        //         // 'unit': {
        //         //     sh "echo 'shell scripts to run unit tests...'"
        //         // },
        //         // 'integration': {
        //         //     sh "echo 'shell scripts to run integration tests...'"
        //         // }
        //         script {
        //             sh "yarn test"
        //         }
        //     }
        // }

        stage ('Build') {
            environment {
                REACT_APP_OAUTH_SEZNAM_CLIENT_ID = "${env.BRANCH_NAME == 'master' ? '8c2aee73fd1a18477bb42efef6a48968054745839756ce06' : '1eb912e099785d4ddf2d0bf6fc63e3f21c86f44bffa8b750'}"
                REACT_APP_OATUH_REDIRECT_URI = "${env.BRANCH_NAME == 'master' ? 'https://v3.iotplatforma.cloud/authorization/redirect' : 'https://dev.iotplatforma.cloud/authorization/redirect'}"
            }
            steps {
                sh "CI= yarn build"
            }
        }


        stage('Deploy docs') {
            when { branch "release*" }
            steps{
                script {
                    sh "scp -r docs/* jenkins@free.iotplatforma.cloud:/home/websites/home-iot/www"
                }
            }
        }
          
        stage('Release') {
            when { branch "release*" }

            environment {
                USER_CREDENTIALS = credentials('Jenkins - iot')
            }
   
            steps {
                script {
                    sh "ci/jenkins/release.sh"
                }
            }
        }


        // stage('Building image') {
        //     when { branch "release*" }
        //     steps{
        //         script {
        //             dockerImage = docker.build("$imagename")
        //         }
        //     }
        // }

    }

    post {
        failure {
            // script {
            //     if (params.NOTIFY_SLACK == 'true') {
            //         slackSend(...)
            //     }
            // }
            
            emailext body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}",
                recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
                subject: "Jenkins Build ${currentBuild.currentResult}: Job ${env.JOB_NAME}"
            
        }
    }
}
