Changelogs
==========

Este projeto assume a organização e padronização do versionamento chamado semantic version presente em [SemVer](http://semver.org/lang/pt-BR/)

Assumindo a última versão em 1.0.24 pelo Gitlab. Será assumido uma nova versão como marco, sendo então versionado para a versão 2.0 devido a grandes mudanças estruturais, organização e padronização do projeto onde será válido o SemVer. A ideia é ter releases mensais.

#CMS UFMG.BR

<table>
	<thead>
		<tr>
			<td><b>Versão</b></td>
			<td><b>Data</b></td>
			<td><b>Autor</b></td>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><a href="#2.1.0">2.1.0</a></td>
			<td>26 Julho, 2017</td>
			<td>Henrique Rodrigues</td>
		</tr>
		<tr>
			<td><a href="#2.0.2">2.0.2</a></td>
			<td>04 Julho, 2017</td>
			<td>Henrique Rodrigues</td>
		</tr>
		<tr>
			<td><a href="#2.0.1">2.0.1</a></td>
			<td>05 Abril, 2017</td>
			<td>Henrique Rodrigues</td>
		</tr>
		<tr>
			<td><a href="#2.0.0">2.0.0</a></td>
			<td>24 Maio, 2017</td>
			<td>Henrique Rodrigues</td>
		</tr>
		<tr>
            <td><a href="#1.0.xx">1.0.xx</a></td>
			<td>23 Set, 2016</td>
			<td>Vários</td>
		</tr>
		<tr>
			<td><a href="#1.0.24">1.0.24</a></td>
			<td>19 Set, 2016</td>
			<td>Luiz Gustavo</td>
		</tr>
		<tr>
			<td><a href="#1.x.x">1.x.x</a></td>
			<td>Outros</td>
			<td>Outros</td>
		</tr>
		<tr>
			<td><a href="#0.x.x">0.x.x</a></td>
			<td>Outros</td>
			<td>Outros</td>
		</tr>
	</tbody>
</table>

#Para próxima versão
- Refatorar e criar todos os widgets

<a id="2.1.0"></a>
##2.1.0 <sub>26/07/2017</sub>
- estrutura: Correção do gulp watch para CSS
- fix: fixado versão jQuery (erro no deploy)
- new: Scripts para deploy
- estrutura: Update dependências
- estrutura: jshint atualizado
- componente: Gerenciamento de arquivos
- estrutura: Refatorações e padronizações

<a id="2.0.2"></a>
##2.0.2 <sub>04/07/2017</sub>
- estrutura: Atualizado todas as dependências. E isso inclui o angular.js :D
- fix: Bug no modal login, não some, mas faz login.
- otimize: Ordenar permissões em ordem alfabética.
- refactor: Refatorando component de publicação.
- layout: Remoção da coluna de publicação em modulo mídia.
- layout: add tag em cursos desativados
- fix: Não está excluindo 'editions'.
- fix: autocomplete de páginas filhas não carrega.
- fix: não salva type de novas notícias.
- fix: Cancelar das notícias não está funcionando.
- layout: mudado cor de citação no editor de texto. No editor de texto, retirar o estilo original do plugin, pois dá a entender que esta desabilitado.
- new: Componente publish, adicionar opções de publicação, aceitando hora e datas retroativas.
- refactor: aceitar datas de eventos retroativos em eventos e calendário.

<a id="2.0.1"></a>
##2.0.1 <sub>05/06/2017</sub>
- Modulo News: Correção de tipos em permissão.
- Layout: Add submenus Sidebar.
- Modulo news: correção do typeNews.
- Modulo news: Desmembrado Notícias em Agência, TV e Radio.
- Estrutura: Fix Bug Permission and Auth
- Estrutura: Troca de API Web Service

<a id="2.0.0"></a>
##2.0.0 <sub>24/05/2017</sub>

###Principais refatorações
- Modulo de usuários
- Modulo de permissões
- Tela de login
- Tabelas de dados
- Auth
- Controllers
- Services
- Views
- Rotas

###Mudanças notáveis
- Estrutural: 
	- Adoção do style guide John Papa
	- Correções na interface
	- Correção das dependências e adicionado notação
	- Gulp (Otimização ~21s para ~1,5s)
	- JSHint
	- ESLint
- Otimização:
	- Organização de projetos :D (usando Google Keep para organizar tarefas)
	- Componente autocomplete
	- Datatables com paginação no Web Service
	
**Outros**
- [fix](http://150.164.80.212:8789/web/ufmg-cms/commit/86d4cd6d4687ea110cde8d14ce9204eae224c23c): Login não redireciona
- [new](http://150.164.80.212:8789/web/ufmg-cms/commit/616a0d7910ecd044c882d41d4601fdcf09ee6ab3): Loading 
- [fix](http://150.164.80.212:8789/web/ufmg-cms/commit/616a0d7910ecd044c882d41d4601fdcf09ee6ab3): Correções no layout e fixed sidebar
- [new](http://150.164.80.212:8789/web/ufmg-cms/commit/06e6a3c6afabb0da89b9398676a280eda845119c): Lembrar usuário
- new: Resetar senha do usuário
- [new](http://150.164.80.212:8789/web/ufmg-cms/commit/b3a4a597b453016e1729c4c1a56cb4ac36870109): Novo campo de 'Notícia UFMG' no widget listnews
- [fix]() link do item da datatable é editar
- E muito mais! :D
**Principais commits** (commits de alto impacto na aplicação)
- [Paginação](http://150.164.80.212:8789/web/ufmg-cms/commit/a54bcf766caef8c18838c8b658df67dd1ce633f9)
- [Auth](http://150.164.80.212:8789/web/ufmg-cms/commit/ae735b97c5ce752a3f3c9e5ffd227054995615a4)
- [Lembrar usuário](http://150.164.80.212:8789/web/ufmg-cms/commit/06e6a3c6afabb0da89b9398676a280eda845119c)
- [Debug com $log](http://150.164.80.212:8789/web/ufmg-cms/commit/7e7ba3fb9a0087b2665042a05a8cd7f053444c1f)
- Permissões - [1](http://150.164.80.212:8789/web/ufmg-cms/commit/d81bf85f808f8c543c7389abee03a33995a250fa), [2](http://150.164.80.212:8789/web/ufmg-cms/commit/54facfd06dea337e37a5bf482374e72876b67553), [3](http://150.164.80.212:8789/web/ufmg-cms/commit/247a989d93ea13f3ba41e9ab4b2f6e0186d4bb35), [4](http://150.164.80.212:8789/web/ufmg-cms/commit/21360c51b11c8348116f80a49523a2314b680c67)
- Refatoração e organização - [1](http://150.164.80.212:8789/web/ufmg-cms/commit/c97339145398d4c524a32a03e3275c89cd0a582f), [2](http://150.164.80.212:8789/web/ufmg-cms/commit/7a4b9f2e2b02d13e307d3d6ac5e49523aa0149f5), [3](http://150.164.80.212:8789/web/ufmg-cms/commit/87aa1669ba2a833112ec666921a610cfd8c2ca4c), [4](http://150.164.80.212:8789/web/ufmg-cms/commit/b47eeb370b409beba0decb5428c2461ff6200abe)
- [ngInject](http://150.164.80.212:8789/web/ufmg-cms/commit/c6b40d36937c6424f01a73a3301df946cfe1f45b)
- [Correção de dependências](http://150.164.80.212:8789/web/ufmg-cms/commit/e52350705e675e5ea40c43c08d241a914b16511e)

<a id="1.0.xx"></a>
##1.0.xx (Não versionado)
...
<a id="1.0.24"></a>
##1.0.24
...
<a id="1.x.x"></a>
##1.x.x
...
<a id="0.x.x"></a>
##0.x.x
...