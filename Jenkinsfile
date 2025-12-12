pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "phantansy"        
        IMAGE_NAME         = "crowdfunding-fe"
        IMAGE_TAG          = "latest"
        IMAGE_FULL         = "${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        // ------------------------------------------------------------
        stage('Checkout') {
            steps {
                ansiColor('xterm') {
                    echo "🚀 Checking out source code..."
                    checkout scm
                }
            }
        }

        // ------------------------------------------------------------
        stage('Build App (Vite - build in Jenkins)') {
            agent none
            steps {
                ansiColor('xterm') {
                    withCredentials([
                        string(
                            credentialsId: 'vite-walletconnect-project-id',
                            variable: 'VITE_WALLETCONNECT_PROJECT_ID'
                        )
                    ]) {
                        script {
                            docker.image(
                                "node:20-alpine"
                            ).inside(
                                "-v /home/fink/Workspace/docker/jenkins/cache/pnpm:/root/.pnpm-store"
                            ) {
                                sh '''
                                    set -eux
                                    export HUSKY=0
                                    npm install -g pnpm

                                    export VITE_WALLETCONNECT_PROJECT_ID="$VITE_WALLETCONNECT_PROJECT_ID"

                                    echo "📦 Installing dependencies..."
                                    pnpm install --frozen-lockfile

                                    echo "⚙️ Building Vite app..."
                                    pnpm build

                                    echo "📁 Preparing Docker build context..."
                                    rm -rf build_output
                                    mkdir -p build_output

                                    cp -r build build_output/
                                    cp package.json pnpm-lock.yaml Dockerfile build_output/
                                '''
                            }
                        }
                    }
                }
            }
        }

        // ------------------------------------------------------------
        stage('Build & Push Docker Image (Docker Hub)') {
            agent none
            steps {
                ansiColor('xterm') {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'dockerhub-credentials',
                            usernameVariable: 'DOCKER_USER',
                            passwordVariable: 'DOCKER_PASS'
                        )
                    ]) {
                        script {
                            docker.image("docker:27-cli").inside(
                                "-v /var/run/docker.sock:/var/run/docker.sock"
                            ) {
                                sh '''
                                    set -eux

                                    echo "$DOCKER_PASS" | docker login \
                                      -u "$DOCKER_USER" \
                                      --password-stdin

                                    docker build -t "$IMAGE_FULL" build_output

                                    docker push "$IMAGE_FULL"

                                    docker logout
                                '''
                            }
                        }
                    }
                }
            }
        }

        // ------------------------------------------------------------
        stage('Deploy to VPS') {
            steps {
                ansiColor('xterm') {
                    sshagent(credentials: ['vps-fink-key']) {
                        sh '''
                            set -eux

                            ssh -o StrictHostKeyChecking=no fink@linux.fink.io.vn "
                                docker pull $IMAGE_FULL &&
                                docker stop crowdfunding-fe || true &&
                                docker rm crowdfunding-fe || true &&
                                docker run -d \
                                  --name crowdfunding-fe \
                                  -p 8386:8386 \
                                  --restart unless-stopped \
                                  $IMAGE_FULL
                            "
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build & Deploy SUCCESS → ${IMAGE_FULL}"
        }
        failure {
            echo "❌ Build or Deploy FAILED"
        }
    }
}
