node('build-jenkins-4-test') {

    stage('Checkout') {
        checkout scm
    }

    def dockerTag = env.BRANCH_NAME.replaceAll('/', '-')

    echo 'Building docker tag: ' + dockerTag
    env.DOCKER_TAG = dockerTag

    stage('Build and Push') {
        sh './build.sh'
    }
}
