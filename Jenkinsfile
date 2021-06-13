pipeline {
 	// Clean workspace before doing anything
    // deleteDir()
    agent any

    environment {
        USER_CREDENTIALS = credentials('github-app-jenkins')
    }

    stages {
        stage ('Install dependencies') {
            steps {
                sh "printenv"
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
                sh "yarn build"
            }
        }


        stage('SonarQube analysis') {
            environment {
                SCANNER_HOME = tool 'SonarQubeScanner'
            }
            steps {
                withSonarQubeEnv('Sonar qube') {
                    sh '''
                    $SCANNER_HOME/bin/sonar-scanner \
                    -D sonar.projectKey=delegi \
                    -D sonar.projectName="Delegy system" \
                    -D sonar.projectVersion=0.1.0 \
                    -D sonar.sources=packages/backend/src \
                    -D sonar.language=ts \
                    -D sonar.javascript.lcov.reportPaths=packages/backend/coverage/lcov.info
                    '''
                }
            }
        }

        // stage("Quality Gate") {
        //     steps {
        //         timeout(time: 10, unit: 'MINUTES') {
        //             waitForQualityGate abortPipeline: true
        //         }
        //     }
        // }

      	stage ("Deploy") {
            when  {
                 branch pattern: "develop|master", comparator: "REGEXP"
            }

            environment {
                IOT_DEPLOY_PATH = "${env.BRANCH_NAME == 'master' ? '/var/www/iot-v3/deploy' : '/var/www/iot-test/deploy'}"
            }

            steps {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        sh "echo 'shell scripts to deploy to server...'"
                        sh'''
                        scp -r packages/frontend/build/* proxy:/home/websites/iot-v3/www

                        sudo -u deployer bash << EOF
                        set -u -e 
                        echo "Stoping service iot-v3"
                        sudo systemctl stop iot-v3
                        echo "Stoping service iot-v3-mqtt"
                        sudo systemctl stop iot-v3-mqtt

                        rm -rf "$IOT_DEPLOY_PATH"/backend/*
                        rsync -a --exclude src/ --exclude node_modules/ packages "$IOT_DEPLOY_PATH"/backend
                        cp package.json "$IOT_DEPLOY_PATH"/backend

                        cd "$IOT_DEPLOY_PATH"/backend
                        yarn install --production

                        echo "Starting service iot-v3"
                        sudo systemctl start iot-v3
                        echo "Starting service iot-v3-mqtt"
                        sudo systemctl start iot-v3-mqtt
                        '''   
                    } else {
                        sh "echo 'shell scripts to deploy to server...'"
                        sh'''
                        ssh proxy "rm -rf /home/websites/v2iotplatformaDev/www/*"
                        scp -r packages/frontend/build/* proxy:/home/websites/v2iotplatformaDev/www
                        scp -r docs proxy:/home/websites/v2iotplatformaDev/www

                        sudo -u deployer-test bash << EOF
                        set -u -e 
                        echo "Stoping service iot-backend-test"
                        sudo systemctl stop iot-backend-test
                        echo "Stoping service iot-backend-mqtt-test"
                        sudo systemctl stop iot-backend-mqtt-test

                        rm -rf "$IOT_DEPLOY_PATH"/backend/*
                        rsync -a --exclude src/ --exclude node_modules/ packages "$IOT_DEPLOY_PATH"/backend
                        cp package.json yarn.lock "$IOT_DEPLOY_PATH"/backend

                        cd "$IOT_DEPLOY_PATH"/backend
                        yarn install --production

                        echo "Starting service iot-backend-test"
                        sudo systemctl start iot-backend-test 
                        echo "Starting service iot-backend-mqtt-test"
                        sudo systemctl start iot-backend-mqtt-test
                        '''    
                    }
                }

            }
      	}
    }
}
