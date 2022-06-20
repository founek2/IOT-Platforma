pipeline {
 	// Clean workspace before doing anything
    // deleteDir()
    agent any

    stages {
        stage ('Install dependencies') {
            steps {
                sh "yarn"
                sh "yarn lerna init"
                sh "yarn prepare"
            }
        }

        stage ('Prepare') {
            steps {
                sh "yarn clean"
                sh "yarn build:shared"
            }
        }
        
        stage ('Build') {
            steps {
                sh "yarn build"
                sh "ci/jenkins/bundle-zip.sh"
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
          
        stage('Release prod') {
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

        stage('Release dev') {
            when { branch "develop*" }

            environment {
                USER_CREDENTIALS = credentials('Jenkins - iot')
            }
   
            steps {
                script {
                    sh "ci/jenkins/release-dev.sh"
                }
            }
        }


        stage('Building image prod') {
            agent { label 'java-docker-slave' }
            when { branch "release*" }

            steps{
                script {
                    sh "ci/jenkins/docker-publish.sh"
                }
            }
        }

        stage('Building image dev') {
            agent { label 'java-docker-slave' }
            when { branch "develop*" }

            steps{
                script {
                    sh "ci/jenkins/docker-publish-dev.sh"
                }
            }
        }

        stage('Deploy prod') {
            when { branch "release*" }
            environment {
                TRIGGER_API_KEY = credentials('docker-compose-trigger-api-key-free')
            }

            steps {
                sh 'curl  -X POST -H  "X-API-Key: $TRIGGER_API_KEY" --ipv4 http://free.iotplatforma.cloud:9020/trigger/IOT-hosting-prod/iot-server'
            }
        }

        stage('Deploy dev') {
            when { branch "develop*" }
            environment {
                TRIGGER_API_KEY = credentials('docker-compose-trigger-api-key-free')
            }

            steps {
                sh 'curl  -X POST -H  "X-API-Key: $TRIGGER_API_KEY" --ipv4 http://free.iotplatforma.cloud:9020/trigger/IOT-hosting-dev/iot-server'
            }
        }
    }
}
