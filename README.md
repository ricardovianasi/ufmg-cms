UFMG CMS v2.0.0
===============

> **Alo! Alo! Seja Bem vindo ao repositório do UFMG CMS**
Versão: 2.0.0 <sub>[changelogs](./docs/CHANGELOG_V2.md)</sub>

 - [Introdução](#introdução)
	 - [Workflow](#workflow)
 - [Documentação](./docs/DOCUMENTATION.md)
 - [Requisitos de Ambiente](#requisitos-de-ambiente)
	 - [Windows](#windows)
	 - [Linux](#linux)
	 - [MacOS](#macos)
 - [Automatização](#automatização)
 - [Deploy](#deploy)

----------
## Introdução
Este projeto é um Web App SPA feito em AngularJS com a finalidade de gerenciar o conteúdo do portal [ufmg.br](https://ufmg.br/)

####**Workflow**

- [AngularJS v1.4.x](https://angularjs.org) `- JavaScript MVW Framework`
- [Browsersync](https://browsersync.io/) `- Sync devices`
- [NPM](https://www.npmjs.com/) `- Package manager for NodeJS`
- [Bower](https://bower.io) `- Package manager for the web`
- [Gulp](http://gulpjs.com/) `- Task-builder`
- [Git 2.x](https://git-scm.com/) `- Version control system`
- [SASS](http://sass-lang.com/) `- CSS pre-processor`
- [JSHhint](http://jshint.com/) `- (Deprecated) JavaScript Code Quality Tool`
- [ESLint](https://github.com/eslint/eslint) `- (new) JavaScript Code Quality Tool`
- ~~[Angular 1 Style Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md) `Good practices`~~ Em andamento
- ~~[Angular Patterns: Clean Code](https://www.pluralsight.com/courses/angularjs-patterns-clean-code) `Design pattern AngularJS`~~ Em andamento

```json
OBS.: "JSHhint", "Angular 1 Style Guide", "Angular Patterns: Clean Code" será desenvolvido com o tempo.
```

## Requisitos de Ambiente

####**Windows**

> **Automatização: ** use `ambient.cmd` da sessão [`Automatização`](#automatização)
 
- Variável de ambiente <i class="icon-terminal"></i> `setx APPLICATION_ENV development`
- [NodeJS 4.x](https://nodejs.org)
		 - Fazer o download do programa e instalar
- [NPM 3.x](https://www.npmjs.com/) (incluso no NodeJS)
- [Git 2.x](https://git-scm.com/) 
		 - Fazer o download do programa e instalar


> - [OptiPNG](http://optipng.sourceforge.net/) *
> - [Pngquant](https://pngquant.org/) *
> - [Jpegtran](http://jpegclub.org/jpegtran) *

> **\*** Programas de tratamento de imagem usados no deploy, fazer download dos executavéis e copiar para a pasta `%Windir%\System32`

####**Linux**
 
  > **Automatização: ** use `sh ./ambient.sh` da sessão [`Automatização`](#automatização)

- Variável de ambiente
	 Edite o arquivo de configuração do seu shell <i class="icon-terminal"></i> `gedit ~/.bashrc` e adicione na última linha `export APPLICATION_ENV=development`
- [NodeJS 4.x](nodejs.org)
	 <i class="icon-terminal"></i> `sudo apt-get install -y nodejs`
- [NPM 3.x](https://www.npmjs.com/) (incluso no NodeJS)
- [Git 2.x](https://git-scm.com/) 
	 <i class="icon-terminal"></i> `sudo apt-get install git-all`
	 
- [OptiPNG](http://optipng.sourceforge.net/) *
	 <i class="icon-terminal"></i> `sudo apt-get install optipng`
	 
- [Pngquant](https://pngquant.org/) *
	 <i class="icon-terminal"></i>`sudo apt-get install pngquant`
	 
- [Jpegtran](http://jpegclub.org/jpegtran) *
	 <i class="icon-terminal"></i>`apt-get install libjpeg-progs`
	 

> **\*** Programas de tratamento de imagem usados no deploy

####**MacOS**

>TODO: Fazer!

## Execução do projeto

1. Baixe o código fonte:
    <i class="icon-terminal"></i>`git clone http://cajuri.bu.ufmg.br:8789/web/ufmg-cms.git`

2. Instalação das dependências do projeto
    <i class="icon-terminal"></i>`npm i -g gulp-cli bower && npm i && bower i`
3. Iniciando o projeto
    <i class="icon-terminal"></i> `gulp dev`

## Automatização

**Windows**

Extraia o arquivo [windows.zip](./ambient/windows.zip) para a pasta em que irá trabalhar, em seguida, execute o `windows.cmd`

**Linux (Ubuntu)**

Baixe o arquivo [ubuntu.sh](./ambient/ubuntu.sh) e mova para sua pasta de trabalho, em seguida use <i class="icon-terminal"></i> `sh ./ambient.sh`

**MacOS**

TODO: Fazer!

## Deploy

  Use `gulp production`

## E pra finalizar!

Achou algo de errado neste README? Por favor use o [StackEdit](https://stackedit.io/editor#)  e faça o seu commit! :)
