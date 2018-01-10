#!/bin/bash
clear

gitClone () {
    clear
    echo ""
    echo ""
    echo "Clonando..."
    echo ""
    echo ""
    git clone $REPOSITORY_UFMG_CMS
    cd $FOLDER_UFMG_CMS
    git checkout develop
}

dependenceOS () {
    clear
    echo ""
    echo ""
    echo "Dependências do ambiente."
    sudo apt-get update && sudo apt-get install -y nodejs ruby git-all optipng pngquant libjpeg-progs
}

dependenceProject () {
    clear
    echo ""
    echo ""
    echo "Dependências do projeto."
    sudo npm i -g gulp-cli bower && npm i && bower i
}

postConfig () {
    export APPLICATION_ENV=development
    gulp dev
}

REPOSITORY_UFMG_CMS='http://150.164.180.61:8789/web/ufmg-cms.git';
FOLDER_UFMG_CMS='ufmg-cms';

gitClone
dependenceOS
dependenceProject
postConfig