// vim: set softtabstop=4:shiftwidth=4:expandtab:tabstop=4:autoindent

pipeline {
    environment {
        def scannerHome = tool 'DefaultSonarQubeScanner'
        def nodeEnv = 'NodeJS 10'
        def sonarServer = 'SonarOnRancher'
    }

    agent any

    options {
        timestamps()
    }

    stages {
        stage('Preparation') {
            steps {
                dir('dist') {
                    deleteDir()
                }

		checkout scm

                nodejs(nodeEnv) {
                    sh "npm install -g yarn synp"
                    sh "yarn install && rm -f package-lock.json && synp -s yarn.lock"
                }
            }
        }

        stage('Analysis') {
            parallel {
                stage('SonarQube') {
                    steps {
                        nodejs(nodeEnv) {
                            withSonarQubeEnv(sonarServer) {
                                sh "${scannerHome}/bin/sonar-scanner"
                            }
                        }
                    }
                }
                stage('Dependency Scan') {
                    steps {
                        dependencyCheckAnalyzer(
                            datadir: "${env.JENKINS_HOME}/dependency-check-data",
                            hintsFile: '',
                            includeCsvReports: false,
                            includeHtmlReports: false,
                            includeJsonReports: false,
                            includeVulnReports: false,
                            isAutoupdateDisabled: false,
                            outdir: '',
                            scanpath: 'package*.json,src/**/*,*.lock,*.js,static/**/*',
                            skipOnScmChange: false,
                            skipOnUpstreamChange: false,
                            suppressionFile: '',
                            zipExtensions: ''
                            )
                        dependencyCheckPublisher(
                            canComputeNew: false,
                            defaultEncoding: '',
                            healthy: '',
                            pattern: '',
                            unHealthy: ''
                            )
                    }
                }
            }
        }
        stage('Build') {
            steps {
                    nodejs(nodeEnv) {
                        sh "NODE_ENV=development npx yarn run build"
                    }
            }
        }
        stage('S3 Push') {
            steps {
                    withAWS(region:'eu-west-3', credentials:'AWS-135683813613-jenkins.dev-wwwpublisher') {
                        s3Upload(
                            bucket: 'aba-test.ceevo.com',
                            excludePathPattern: '.travis.yml,LICENSE,README.md,gulpfile.js,package*.json,scss/**',
                            includePathPattern: '**',
                            path: '',
                            workingDir: 'dist/',
			    metadatas: ["build_no:${BUILD_NUMBER}"]
                            )
                    }
            }
        }
	stage('Wait for SonaQube Result') {
	    steps {
		timeout(time: 1, unit: 'HOURS') {
		    waitForQualityGate(abortPipeline: false)
		}
	    }
	}
    }

    post {
	unstable {
	    emailext (subject: '$DEFAULT_SUBJECT', body: '$DEFAULT_CONTENT', recipientProviders: [culprits(), brokenTestsSuspects(), brokenBuildSuspects()])

	}
	failure {
	    emailext (subject: '$DEFAULT_SUBJECT', body: '$DEFAULT_CONTENT', recipientProviders: [culprits(), brokenTestsSuspects(), brokenBuildSuspects()])
	}
    }
}
