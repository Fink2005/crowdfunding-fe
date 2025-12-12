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
                                    cp Dockerfile nginx.conf build_output/

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
            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_PASS'
                ),

                usernamePassword(
                    credentialsId: 'cloudflare-service-token',
                    usernameVariable: 'CF_CLIENT_ID',
                    passwordVariable: 'CF_CLIENT_SECRET'
                )
            ]) {
                sshagent(credentials: ['vps-fink-key']) {
                    sh '''
                        set -eux

                        REMOTE="fink@linux.fink.io.vn"

                        echo "🚀 Deploying to VPS via Cloudflare Tunnel..."

                        ssh -o StrictHostKeyChecking=no \
                          -o ProxyCommand="cloudflared access ssh \
                            --hostname linux.fink.io.vn \
                            --service-token-id $CF_CLIENT_ID \
                            --service-token-secret $CF_CLIENT_SECRET" \
                          "$REMOTE" "
                            export DOCKERHUB_USER='$DOCKERHUB_USER' &&
                            export DOCKERHUB_PASS='$DOCKERHUB_PASS' &&
                            export IMAGE_NAME='$IMAGE_NAME' &&
                            export IMAGE_TAG='$IMAGE_TAG' &&
                            bash /home/fink/Workspace/crowdfunding/deploy_scripts/deploy_fe.sh
                          "
                    '''
                }
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
