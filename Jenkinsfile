pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "831441088496"
        AWS_REGION = "us-east-1"
        IMAGE_REPO = "my-node-app"
        IMAGE_TAG = "latest"
        WORKSPACE_DIR = "/var/lib/jenkins/workspace/my-node-app-pipeline"
    }

    options {
        skipDefaultCheckout()
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
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
                sh "docker build -t ${IMAGE_REPO}:${IMAGE_TAG} ."
            }
        }

        stage('Login to AWS ECR') {
            steps {
                echo "🔑 Logging in to AWS ECR..."
                sh """
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                """
            }
        }

        stage('Tag & Push Docker Image') {
            steps {
                echo "📤 Tagging and pushing Docker image to ECR..."
                sh """
                    docker tag ${IMAGE_REPO}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_REPO}:${IMAGE_TAG}
                    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_REPO}:${IMAGE_TAG}
                """
            }
        }

        stage('Run Container') {
           steps {
        echo "🚀 Running container locally..."
        sh """
            docker stop app || true
            docker rm app || true
            docker run -d -p 80:3000 --name app ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_REPO}:${IMAGE_TAG}
        """
        }
}

    }

    post {
        success {
            echo "🎉 Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed! Check logs."
        }
    }
}
