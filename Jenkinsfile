pipeline {
 	// Clean workspace before doing anything
    // deleteDir()
    agent { label 'docker-node' }

    stages {
        stage ('Install dependencies') {
            steps {
                sh "yarn"
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
            when { branch "release*" }

            steps{
                script {
                    sh "ci/jenkins/docker-publish.sh"
                }
            }
        }

        stage('Building image dev') {
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
                TRIGGER_API_KEY = credentials('docker-compose-trigger-api-key')
            }

            steps {
                sh 'curl  -X POST -H  "X-API-Key: $TRIGGER_API_KEY" --ipv4 http://192.168.10.88:9020/trigger/IOT-hosting-dev/iot-server'
            }
        }
    }
}
