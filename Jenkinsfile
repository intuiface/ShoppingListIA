pipeline {
  agent {
    node {
      label 'sapin3'
    }

  }
  stages {
   
    stage('Sign') {
      steps {
        copyArtifacts filter: '**/Cryptifix-x64-*.zip', fingerprintArtifacts: true, projectName: 'IntuiFace/master', selector: lastSuccessful(), target: 'cryptifix'
        script {
          def files = findFiles(glob: '**/Cryptifix-x64-*.zip')
          unzip zipFile: "cryptifix\\${files[0].name}", dir: 'cryptifix'
        }
        bat "cryptifix\\Cryptifix.exe sign \"\\ShoppingList\" --LicenseEdition=FREE --IsAllowedByNonInteractivePlayer=false"
      }
    }

    stage('Package') {
      steps {		
		    zip archive: true, dir: "ShoppingList", glob: '', zipFile: "ShoppingList.zip"
      }
    }
	
    stage('Archive') {
      steps {        
        archiveArtifacts 'ShoppingList.zip'
      }
    }

  }
}