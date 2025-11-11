pipeline {
    agent any
    
    environment {
        AWS_ACCOUNT_ID = "831441088496"
        AWS_REGION = "us-east-1"
        IMAGE_REPO = "my-node-app"
        IMAGE_TAG = "latest"
        EC2_IP = "34.206.184.118"
        WORKSPACE_DIR = "/var/lib/jenkins/workspace/my-node-app-pipeline"
    }

    options {
        skipDefaultCheckout()
        timestamps()
        timeout(time: 60, unit: 'MINUTES') // Optional: auto-abort if pipeline hangs
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning workspace..."
                sh """
                sudo chown -R jenkins:jenkins ${WORKSPACE_DIR} || true
                rm -rf ${WORKSPACE_DIR}/*
                """
            }
        }

        stage('Checkout Code') {
            steps {
                echo "🔄 Checking out code..."
                git branch: 'main', url: 'https://github.com/nehanreddyloka/my-node-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm dependencies..."
                sh 'npm install --no-audit --no-fund --silent'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh 'docker build -t $IMAGE_REPO:$IMAGE_TAG .'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                echo "🔑 Logging in to AWS ECR..."
                sh """
                aws ecr get-login-password --region $AWS_REGION | docker login \
                --username AWS \
                --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                """
            }
        }

        stage('Tag & Push Image') {
            steps {
                echo "📤 Tagging and pushing Docker image to ECR..."
                sh """
                docker tag $IMAGE_REPO:$IMAGE_TAG ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/$IMAGE_REPO:$IMAGE_TAG
                docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/$IMAGE_REPO:$IMAGE_TAG
                """
            }
        }

        stage('Deploy on EC2') {
            steps {
                echo "🚀 Deploying on EC2..."
                script {
                    try {
                        sh """
                        ssh -o StrictHostKeyChecking=no ec2-user@${EC2_IP} '
                        set -e
                        echo "Stopping old container if exists..."
                        docker stop app || true
                        docker rm app || true
                        echo "Pulling latest image from ECR..."
                        docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_REPO}:${IMAGE_TAG}
                        echo "Running new container..."
                        docker run -d -p 3000:3000 --name app ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_REPO}:${IMAGE_TAG}
                        '
                        """
                    } catch(err) {
                        error "⚠️ Deployment failed: ${err}"
                    }
                }
            }
        }

    }

    post {
        success {
            echo "✅ Pipeline Completed Successfully!"
        }
        failure {
            echo "❌ Pipeline Failed! Check logs for details."
        }
    }
}
