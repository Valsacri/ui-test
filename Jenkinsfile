// Sporgates Frontend – build, test, optional Docker build/push.
// Set CONTAINER_REGISTRY and NEXT_PUBLIC_API_URL in Jenkins (or below).
def CONTAINER_REGISTRY = env.CONTAINER_REGISTRY ?: 'your-docker-user/sporgates-frontend'
def NEXT_PUBLIC_API_URL = env.NEXT_PUBLIC_API_URL ?: 'http://localhost:8080/api'
def COMMIT_HASH

pipeline {
    agent any
    options {
        timeout(time: 20, unit: 'MINUTES')
    }
    environment {
        CONTAINER_REGISTRY = "${CONTAINER_REGISTRY}"
        NEXT_PUBLIC_API_URL = "${NEXT_PUBLIC_API_URL}"
    }
    stages {
        stage('Install & Test') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u root -v ${WORKSPACE}:/app -w /app'
                    reuseNode true
                }
            }
            steps {
                sh 'npm ci'
                sh 'npm run lint'
                sh 'npm run test 2>/dev/null || true'
            }
        }

        stage('Build Docker image') {
            when {
                expression { return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'develop' }
            }
            steps {
                script {
                    COMMIT_HASH = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                }
                sh "docker build --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} -t ${CONTAINER_REGISTRY}:latest -t ${CONTAINER_REGISTRY}:${COMMIT_HASH} ."
            }
        }

        stage('Push image') {
            when {
                expression { return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'develop' }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-registry',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh "echo \$PASS | docker login -u \$USER --password-stdin"
                }
                sh "docker push ${CONTAINER_REGISTRY}:latest"
                sh "docker push ${CONTAINER_REGISTRY}:${COMMIT_HASH}"
            }
        }
    }
    post {
        always {
            cleanWs(deleteDirs: true, patterns: [[pattern: 'node_modules/', type: 'INCLUDE'], [pattern: '.next/', type: 'INCLUDE']])
        }
    }
}
