pipeline {
 	// Clean workspace before doing anything
    // deleteDir()
    agent any

    options {
        skipDefaultCheckout true
    }
    environment {
        // ENV_CONFIG_PATH = "/home/martas/iot_test_env"
        ENV_CONFIG_PATH = "${env.BRANCH_NAME == 'master' ? '/home/martas/iot_prod_env' : '/home/martas/iot_test_env'}"
    }

    stages {
        stage('clear and checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }

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

        stage ('Tests') {
            steps {
                // parallel 'static': {
                //     sh "yarn lerna run --scope backend --scope common coverage"
                // },
                // 'unit': {
                //     sh "echo 'shell scripts to run unit tests...'"
                // },
                // 'integration': {
                //     sh "echo 'shell scripts to run integration tests...'"
                // }
                script {
                    sh "yarn test"
                }
            }
        }

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
            // when {
            //     branch 'rebuild'
            // }

            environment {
                // IOT_DEPLOY_PATH = '/var/www/iot-test/deploy'
                IOT_DEPLOY_PATH = "${env.BRANCH_NAME == 'master' ? '/var/www/iot-platforma/deploy' : '/var/www/iot-test/deploy'}"
            }

            steps {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        sh "echo 'shell scripts to deploy to server...'"
                        sh'''
                        scp -r packages/frontend/build/* proxy:/home/websites/v2iotplatforma/www

                        sudo -u deployer bash << EOF
                        set -u -e 
                        echo "Stoping service iot-backend"
                        sudo systemctl stop iot-backend
                        echo "Stoping service iot-backend-mqtt"
                        sudo systemctl stop iot-backend-mqtt

                        rm -rf "$IOT_DEPLOY_PATH"/backend/*
                        rsync -a --exclude src/ --exclude node_modules/ packages "$IOT_DEPLOY_PATH"/backend
                        cp package.json "$IOT_DEPLOY_PATH"/backend

                        cd "$IOT_DEPLOY_PATH"/backend
                        yarn install --production

                        echo "Starting service iot-backend"
                        sudo systemctl start iot-backend
                        echo "Starting service iot-backend-mqtt"
                        sudo systemctl start iot-backend-mqtt
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
