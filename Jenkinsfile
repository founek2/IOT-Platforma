pipeline {
 	// Clean workspace before doing anything
    // deleteDir()
    agent any

    options {
        skipDefaultCheckout true
    }
    environment {
        ENV_CONFIG_PATH = "/home/martas/iot_test_env"
    }

    stages {
        stage('clear and checkout') {
            steps {
                // deleteDir()
                checkout scm
            }
        }
        // stage ('Clone') {
        //     steps {
        // 	    checkout scm
        //     }
        // }


        // stage ('setup Env') {
        //     script {
        //         env.ENV_CONFIG_PATH = "/home/delegi/test.env"
        //     }
        // }  
        stage ('Install dependencies') {
            steps {
                // clear previously generated types
                sh "yarn"
                sh "yarn lerna init"
            }
        }
        stage ('Build') {
            steps {
                sh "yarn build"
            }
        }
        // stage ('Tests') {
        //     steps {
        //         parallel 'static': {
        //             sh "yarn lerna run --scope backend --scope common coverage"
        //         },
        //         'unit': {
        //             sh "echo 'shell scripts to run unit tests...'"
        //         },
        //         'integration': {
        //             sh "echo 'shell scripts to run integration tests...'"
        //         }
        //     }
        // }

        // stage('SonarQube analysis') {
        //     environment {
        //         SCANNER_HOME = tool 'SonarQubeScanner'
        //     }
        //     steps {
        //         withSonarQubeEnv('Sonar qube') {
        //             sh '''
        //             $SCANNER_HOME/bin/sonar-scanner \
        //             -D sonar.projectKey=delegi \
        //             -D sonar.projectName="Delegy system" \
        //             -D sonar.projectVersion=0.1.0 \
        //             -D sonar.sources=packages/backend/src \
        //             -D sonar.language=ts \
        //             -D sonar.javascript.lcov.reportPaths=packages/backend/coverage/lcov.info
        //             '''
        //         }
        //     }
        // }

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
                IOT_DEPLOY_PATH = '/var/www/iot-test/deploy'
            }

            steps {
                sh "echo 'shell scripts to deploy to server...'"
                sh'''
                scp -r packages/frontend/build/* proxy:/home/websites/v2iotplatformaDev/www

                sudo -u deployer-test bash << EOF
                set -u -e 
                rm -rf "$IOT_DEPLOY_PATH"/backend/*
                rsync -a --exclude src/ --exclude node_modules/ packages "$IOT_DEPLOY_PATH"/backend
                cp package.json "$IOT_DEPLOY_PATH"/backend

                cd "$IOT_DEPLOY_PATH"/backend
                yarn install --production

                EOF
                exit $?
                '''    
                
            }
      	}
    }
}
