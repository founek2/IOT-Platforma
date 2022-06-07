pipeline {
 	// Clean workspace before doing anything
    // deleteDir()
    agent any

    stages {
        stage ('Install dependencies') {
            steps {
                sh "yarn"
                sh "yarn lerna init"
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
                sh "yarn lerna clean --yes"
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
                    sh "ci/jenkins/docker-publish.sh"
                }
            }
        }

        stage('Deploy') {
            when { branch "release*" }
            environment {
                TRIGGER_API_KEY = credentials('docker-compose-trigger-api-key-free')
            }

            steps {
                sh 'curl  -X POST -H  "X-API-Key: $TRIGGER_API_KEY" --ipv4 http://free.iotplatforma.cloud:9020/trigger/IOT-Platforma-hosting/platform'
            }
        }
    }
}
