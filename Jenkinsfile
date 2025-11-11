pipeline {
    agent any
    
    environment {
        AWS_ACCOUNT_ID = "831441088496"
        AWS_REGION = "us-east-1"
        IMAGE_REPO = "my-node-app"
        IMAGE_TAG = "latest"
        EC2_IP = "34.206.184.118"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/nehanreddyloka/my-node-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_REPO:$IMAGE_TAG .'
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | docker login \
                --username AWS \
                --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Tag & Push Image') {
            steps {
                sh '''
                docker tag $IMAGE_REPO:$IMAGE_TAG ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/$IMAGE_REPO:$IMAGE_TAG
                docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/$IMAGE_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy on EC2') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no ec2-user@34.206.184.118 "
                docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/$IMAGE_REPO:$IMAGE_TAG &&
                docker stop app || true &&
                docker rm app || true &&
                docker run -d -p 3000:3000 --name app ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/$IMAGE_REPO:$IMAGE_TAG
                "
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Pipeline Failed! Check logs in Jenkins."
        }
    }
}
