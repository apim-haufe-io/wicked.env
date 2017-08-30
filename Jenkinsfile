node('docker') {

    stage('Checkout') {
        checkout scm
    }

    def dockerTag = env.BRANCH_NAME.replaceAll('/', '-')

    env.DOCKER_TAG = dockerTag

    stage('Build and Push') {
        sh './build.sh'
    }
}
