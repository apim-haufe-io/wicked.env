node('docker') {
    def dockerTag = env.BRANCH_NAME.replaceAll('/', '-')

    env.DOCKER_TAG = dockerTag

    sh './build.sh'
}
