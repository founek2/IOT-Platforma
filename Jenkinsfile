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


        stage('Building image') {
            agent { label 'java-docker-slave' }
            when { branch "release*" }
            steps{
                script {
                    dockerImage = docker.build("$imagename")
                }
            }
        }

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
