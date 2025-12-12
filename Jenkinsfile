pipeline {
    agent any

    environment {
        IMAGE_NAME             = "fundhive-fe"
        HARBOR_REGISTRY        = "registry.fink.io.vn"
        HARBOR_PROJECT_FE      = "crowdfunding"
        HARBOR_PROJECT_AGENT   = "jenkins-agents"
        IMAGE_TAG              = "latest"
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
        stage('Build App (Vite)') {
            agent none
            steps {
                ansiColor('xterm') {
                    withCredentials([
                        string(credentialsId: 'vite-walletconnect-project-id', variable: 'VITE_WALLETCONNECT_PROJECT_ID'),
                    ]) {
                        script {
                            docker.withRegistry(
                                "https://${HARBOR_REGISTRY}",
                                "harbor-crowdfunding-agent"
                            ) {
                                docker.image(
                                    "${HARBOR_PROJECT_AGENT}/jenkins-agent-node-pnpm:v24.9.0-pnpm10.18.0"
                                ).inside(
                                    "-v /home/fink/Workspace/docker/jenkins/cache/pnpm:/root/.pnpm-store"
                                ) {
                                    sh '''
                                        set -eux
                                        export HUSKY=0

                                        # 🔑 Inject build-time env
                                        export VITE_WALLETCONNECT_PROJECT_ID="$VITE_WALLETCONNECT_PROJECT_ID"

                                        echo "📦 Installing dependencies..."
                                        pnpm install --frozen-lockfile

                                        echo "⚙️ Building Vite app..."
                                        pnpm build

                                        echo "📁 Checking build output..."
                                        test -d build

                                        mkdir -p "$WORKSPACE/build_output"
                                        cp -r build Dockerfile "$WORKSPACE/build_output/"
                                    '''
                                }
                            }
                        }
                    }
                }
            }
        }

        // ------------------------------------------------------------
        stage('Build & Push Image') {
            agent none
            steps {
                ansiColor('xterm') {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'harbor-crowdfunding-agent',
                            usernameVariable: 'AGENT_USER',
                            passwordVariable: 'AGENT_PASS'
                        ),
                        usernamePassword(
                            credentialsId: 'harbor-registry-credentials',
                            usernameVariable: 'HARBOR_USER',
                            passwordVariable: 'HARBOR_PASS'
                        )
                    ]) {
                        script {
                            def image = "${HARBOR_REGISTRY}/${HARBOR_PROJECT_FE}/${IMAGE_NAME}:${IMAGE_TAG}"

                            echo "🏷️ Image tag: ${IMAGE_TAG}"
                            echo "📦 Image: ${image}"

                            docker.withRegistry(
                                "https://${HARBOR_REGISTRY}",
                                "harbor-crowdfunding-agent"
                            ) {
                                docker.image(
                                    "${HARBOR_PROJECT_AGENT}/jenkins-agent-docker:v27.0.3"
                                ).inside(
                                    "-v /var/run/docker.sock:/var/run/docker.sock"
                                ) {
                                    sh '''
                                        set -eux

                                        docker build --pull \
                                          -t "$HARBOR_REGISTRY/$HARBOR_PROJECT_FE/$IMAGE_NAME:$IMAGE_TAG" \
                                          "$WORKSPACE/build_output"

                                        echo "$HARBOR_PASS" | docker login \
                                          "$HARBOR_REGISTRY" \
                                          -u "$HARBOR_USER" \
                                          --password-stdin

                                        docker push \
                                          "$HARBOR_REGISTRY/$HARBOR_PROJECT_FE/$IMAGE_NAME:$IMAGE_TAG"

                                        docker logout "$HARBOR_REGISTRY" || true
                                    '''
                                }
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
                            credentialsId: 'harbor-registry-credentials',
                            usernameVariable: 'HARBOR_USER',
                            passwordVariable: 'HARBOR_PASS'
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

                                ssh -o StrictHostKeyChecking=no \
                                  -o ProxyCommand="cloudflared access ssh \
                                    --hostname linux.fink.io.vn \
                                    --service-token-id $CF_CLIENT_ID \
                                    --service-token-secret $CF_CLIENT_SECRET" \
                                  "$REMOTE" "
                                    export HARBOR_USER='$HARBOR_USER' &&
                                    export HARBOR_PASS='$HARBOR_PASS' &&
                                    export HARBOR_REGISTRY='$HARBOR_REGISTRY' &&
                                    export HARBOR_PROJECT='$HARBOR_PROJECT_FE' &&
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
            echo "✅ Build & Deploy SUCCESS (tag: ${IMAGE_TAG})"
        }
        failure {
            echo "❌ Build or Deploy FAILED"
        }
    }
}
