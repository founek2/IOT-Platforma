pipeline {
 	// Clean workspace before doing anything
    // deleteDir()
    agent any

    options {
        skipDefaultCheckout true
    }
    environment {
        ENV_CONFIG_PATH = "/home/delegi/test.env"
    }

    stages {
        stage('clear and checkout') {
            steps {
                deleteDir()
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
                sh "find packages   -name '__generated__' -type d -exec rm -rf {} ';' 2&>/dev/null"
                sh "yarn"
                sh "yarn lerna init"
            }
        }
        stage ('Build') {
            steps {
                sh "yarn build"
            }
        }
        stage ('Tests') {
            steps {
                parallel 'static': {
                    sh "yarn lerna run --scope backend --scope common coverage"
                },
                'unit': {
                    sh "echo 'shell scripts to run unit tests...'"
                },
                'integration': {
                    sh "echo 'shell scripts to run integration tests...'"
                }
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

        stage("Quality Gate") {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

      	stage ("Deploy") {
            when {
                branch 'master'
            }

            environment {
                DEPLOY_PATH = '/var/www/delegi/deploy'
            }

            steps {
                sh "echo 'shell scripts to deploy to server...'"
                sh'''
                sudo -u delegi bash << EOF
                set -u -e 
                mkdir -p $DEPLOY_PATH/{frontend,docs,backend}
                cp -r packages/frontend/build/* "$DEPLOY_PATH/frontend"
                cp -r docs/* "$DEPLOY_PATH/docs"
                cp -r packages/backend/dist/* "$DEPLOY_PATH/backend"
                cp  packages/backend/package.json "$DEPLOY_PATH/package.json"
                cd $DEPLOY_PATH && yarn --prod
                cp -r "$PWD/packages/common" node_modules
                cd node_modules/common && yarn --prod
                sudo systemctl restart delegi
                sleep 5
                sudo systemctl status delegi
                exit $?
                '''    
                
            }
      	}
    }
}
