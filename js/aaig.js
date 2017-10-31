function renderizarImagemNavegador(elemento, nome_arquivo, callback){
	var $elemento = $(elemento);
	var $divPrevias = $elemento.closest('div.previas');
	var $divUltimosCanvas = $divPrevias.find('div.ultimos_canvas');
	
	nome_arquivo = nome_arquivo.replace(/\n/g, ' ');
	html2canvas($elemento, {
		onrendered: function(canvas) {
			// Criando âncora temporária para receber dados da imagem gerada
			var a = document.createElement('a');
			a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			a.download = nome_arquivo + '.png';
			
			// Adicionando últimos canvas gerados no contêiner à direita do rodapé.
			// Útil para fins de depuração
			$divUltimosCanvas.children('div.panel-body').append(canvas);
			
			// Adicionando âncora no corpo da página
			var $a = $(a);
			$('body').append($a);
			
			// Acionando evento de clique no âncora, para assim iniciar
			// o download da imagem. Ao término da geração, remover âncora
			a.click();
			$a.remove();
			
			if(callback) callback();
		}
	});
}

function adicionarScriptIdioma(idioma, callback){
	$.getScript('js/lang.' + idioma + '.js', function(){
		if(callback) callback();
	})
}

function removerScriptsIdiomas(){
	$('head').find("script[src^='lang']").remove();
}

function atualizarIdioma(){
	for(var tipo in LANGUAGE){
		var tipos = LANGUAGE[tipo];
		for(var subtipo in tipos){
			var texto = tipos[subtipo];
			var seletor = '.' + tipo + '_' + subtipo;
			
			if(tipo == 'l'){
				$(seletor).html(texto);
			} else if(tipo == 't'){
				$(seletor).attr('title', texto);
			} else if(tipo == 'p'){
				$(seletor).attr('placeholder', texto);
			}
		}
	}
}

/* Função que retorna o dispositivo utilizado pelo usuário, para acessar o sistema
 * Valores possíveis de retorno:
 *	- xs: Extra small (Celulares, com largura de tela menor que 768px);
 *	- sm: Small (Tablets, com largura de tela maior ou igual a 768px);
 *	- md: Medium (Desktops de monitor antigo, com largura maior ou igual a 992px);
 *	- lg: Large (Desktops de monitor widescreen, com largura maior ou igual a 1200px).
 * */
function getDispositivo(onresize) {
	if(typeof onresize == 'undefined') onresize = false;
	if(onresize){
		$(window).off('resize.atualizaVariavelGlobal').on('resize.atualizaVariavelGlobal', function(){
			window.dispositivo = getDispositivo(false);
		});
	}
	var envs = ['xs', 'sm', 'md', 'lg'];

	var $el = $('<div>');
	$el.appendTo( $('body') );

	for (var i = envs.length - 1; i >= 0; i--) {
		var env = envs[i];

		$el.addClass('hidden-'+env);
		if ($el.is(':hidden')) {
			$el.remove();
			return env;
		}
	};
}

$(function(){
	// Abas
	var $divAbaBotoes = $('#botoes');
	var $divAbaBotoesMenores = $('#botoes_menores');
	var $divAbaNomesProvas = $('#nome_prova');
	var $divAbaSubtitulosProvas = $('#subtitulo_prova');
	var $divAbaDescricoesProvas = $('#descricao_prova');
	var $divAbaSandbox = $('#sandbox');
	
	// Desativando cache para requisições ajax
	$.ajaxSetup ({
		cache: false
	});
	
	// Carregando conteúdos de cada aba
	$divAbaBotoes.load('aba_botoes.html', function(){
		$divAbaBotoesMenores.load('aba_botoes_menores.html', function(){
			$divAbaNomesProvas.load('aba_nomes_provas_perfis.html', function(){
				$divAbaSubtitulosProvas.load('aba_subtitulos_provas_perfis.html', function(){
					$divAbaDescricoesProvas.load('aba_descricoes_provas_perfis.html', function(){
						$divAbaSandbox.load('aba_sandbox.html', instanciarCampos);
					});
				});
			});
		});
	});
	
	// Método de instanciar campos, chamado após carregar o conteúdo de todas as abas
	var instanciarCampos = function(){
		// Campos diversos
		var $ancoraSobrePrograma = $('#sobre_programa');
		var $botaoIdioma = $('#botao_idioma');
		var $imgBandeira = $botaoIdioma.children('img.bandeira');
		var $spanNomeIdioma = $botaoIdioma.children('span.nome_idioma');
		var $ulListaIdiomas = $('#lista_idiomas');
		var $formularios = $('form');

		// Campos de botões
		var $inputTextoBotoes = $('#texto_botoes');
		var $selectPlataformaBotoes = $('#plataforma_botao');
		var $selectFonteBotoes = $('#fonte_botao');
		var $botaoGerarBotoes = $('#botao_gerar_botoes');
		var $divBotao = $('#conteiner_botao');
		var $divTextoBotao = $divBotao.children('div.texto');

		// Campos de botões menores
		var $inputTextoBotoesMenores = $('#texto_botoes_menores');
		var $selectPlataformaBotoesMenores = $('#plataforma_botao_menor');
		var $selectFonteBotoesMenores = $('#fonte_botao_menor');
		var $botaoGerarBotoesMenores = $('#botao_gerar_botoes_menores');
		var $divBotaoMenor = $('#conteiner_botao_menor');
		var $divTextoBotaoMenor = $divBotaoMenor.children('div.texto');

		// Campos de nomes de prova / perfil
		var $inputTextoNome = $('#texto_nome');
		var $selectPlataformaNome = $('#plataforma_nome');
		var $selectFonteNome = $('#fonte_nome');
		var $botaoGerarNome = $('#botao_gerar_nome');
		var $divNome = $('#conteiner_nome');
		var $divTextoNome = $divNome.children('div.texto');

		// Campos de subtitulos de prova / perfil
		var $textareaSubtitulo = $('#texto_subtitulo');
		var $selectPlataformaSubtitulo = $('#plataforma_subtitulo');
		var $selectFonteSubtitulo = $('#fonte_subtitulo');
		var $botaoGerarSubtitulo = $('#botao_gerar_subtitulo');
		var $divSubtitulo = $('#conteiner_subtitulo');
		var $divTextoSubtitulo = $divSubtitulo.children('div.texto');

		// Campos de descrições de prova / perfil
		var $textareaDescricao = $('#texto_descricao');
		var $selectPlataformaDescricao = $('#plataforma_descricao');
		var $selectFonteDescricao = $('#fonte_descricao');
		var $botaoGerarDescricao = $('#botao_gerar_descricao');
		var $divDescricao = $('#conteiner_descricao');
		var $divTextoDescricao = $divDescricao.children('div.texto');

		// Campos de sandbox
		var $inputTextoBotaoSandbox1 = $('#texto_botoes_sandbox1');
		var $inputTextoBotaoSandbox2 = $('#texto_botoes_sandbox2');
		var $inputTextoBotaoSandbox3 = $('#texto_botoes_sandbox3');
		var $inputTextoBotaoMenorSandbox = $('#texto_botoes_menores_sandbox');
		var $inputTextoNomeSandbox = $('#texto_nome_sandbox');
		var $textareaSubtituloSandbox = $('#texto_subtitulo_sandbox');
		var $textareaDescricaoSandbox = $('#texto_descricao_sandbox');
		var $divBotoesSandbox = $('#conteiner_botoes_sandbox');
		var $divTextoBotoesSandbox1 = $divBotoesSandbox.children('div.botao1');
		var $divTextoBotoesSandbox2 = $divBotoesSandbox.children('div.botao2');
		var $divTextoBotoesSandbox3 = $divBotoesSandbox.children('div.botao3');
		var $divBotaoMenorSandbox = $('#conteiner_botao_menor_sandbox');
		var $divTextoBotaoMenorSandbox = $divBotaoMenorSandbox.children('div.botao');
		var $divProvaSubtituloSandbox = $('#conteiner_provas_subtitulos_sandbox');
		var $divTextoNomeSandbox = $divProvaSubtituloSandbox.children('div.nome');
		var $divTextoSubtituloSandbox = $divProvaSubtituloSandbox.children('div.subtitulo');
		var $divTextoDescricaoSandbox = $divProvaSubtituloSandbox.children('div.descricao');
		var $botaoGerarSandbox1 = $('#botao_gerar_sandbox_1');
		var $botaoGerarSandbox2 = $('#botao_gerar_sandbox_2');
		var $botaoGerarSandbox3 = $('#botao_gerar_sandbox_3');

		// Evento dos campos de seleção de idiomas
		$ulListaIdiomas.find('a').on('click', function(e){
			var $a = $(this);
			var idioma = ( $a.attr('href') ).replace('#', '');
			var imagem = $a.children('img').attr('src');
			var nome_idioma = $a.children('span').html();

			$imgBandeira.attr('src', imagem);
			$spanNomeIdioma.attr('data-valor', idioma).html(nome_idioma);

			removerScriptsIdiomas();
			adicionarScriptIdioma(idioma, atualizarIdioma);

			e.preventDefault();
		});

		// Definindo textos do idioma padrão (Português)
		atualizarIdioma();

		// Definindo texto padrão para os campos
		$inputTextoBotoes.attr('value', 'Phoenix Wright');
		$inputTextoBotoesMenores.attr('value', "Chief's Office");
		$inputTextoNome.attr('value', 'Fingerprinting Set');
		$textareaSubtitulo.html('Age: 27\nGender: Female');
		$textareaDescricao.html('Time of death: 9/5 at 9:00 PM.\nCause: single blunt force trauma.\nDeath was instantaneous.');
		$inputTextoBotaoSandbox1.attr('value', 'Amélia Ayasato');
		$inputTextoBotaoSandbox2.attr('value', 'Sêntia Pedra');
		$inputTextoBotaoSandbox3.attr('value', 'Cíntia Rocha');
		$inputTextoBotaoMenorSandbox.attr('value', 'Centro de detenção');
		$inputTextoNomeSandbox.attr('value', 'Amélia Ayasato');
		$textareaSubtituloSandbox.html('Idade: 27\nGênero: Feminino');
		$textareaDescricaoSandbox.html('Advogada-chefe da Ayasato &\nassociados. Minha chefe, e uma\nexcelente advogada de defesa.');

		// Evento do botão "Sobre este programa"
		$ancoraSobrePrograma.on('click', function(){
			var idioma = $spanNomeIdioma.attr('data-valor');
			var readme_page;
			if(idioma != 'en-us'){
				readme_page = 'README.' + idioma + '.md';
			} else {
				readme_page = 'README.md';
			}

			window.open('https://github.com/leomontenegro6/aaig/blob/master/' + readme_page);
		});

		// Eventos dos campos de texto
		$inputTextoBotoes.on('keyup', function(){
			var texto = this.value;
			$divTextoBotao.html(texto);
		});
		$inputTextoBotoesMenores.on('keyup', function(){
			var texto = this.value;
			$divTextoBotaoMenor.html(texto);
		});
		$inputTextoNome.on('keyup', function(){
			var texto = this.value;
			$divTextoNome.html(texto);
		});
		$textareaSubtitulo.on('keyup', function(){
			var texto = (this.value).replace(/\n/g, '<br />');
			var plataforma = $selectPlataformaSubtitulo.val();
			
			if(plataforma = '3ds'){
				$divTextoSubtitulo.html(texto);
			} else {
				for (var i = 0, tamanho = texto.length; i < tamanho; i++) {
					var caractere = texto[i];
				}
			}
		});
		$textareaDescricao.on('keyup', function(){
			var texto = (this.value).replace(/\n/g, '<br />');
			$divTextoDescricao.html(texto);
		});
		$inputTextoBotaoSandbox1.on('keyup', function(){
			var texto = this.value;
			$divTextoBotoesSandbox1.html(texto);
		});
		$inputTextoBotaoSandbox2.on('keyup', function(){
			var texto = this.value;
			$divTextoBotoesSandbox2.html(texto);
		});
		$inputTextoBotaoSandbox3.on('keyup', function(){
			var texto = this.value;
			$divTextoBotoesSandbox3.html(texto);
		});
		$inputTextoBotaoMenorSandbox.on('keyup', function(){
			var texto = this.value;
			$divTextoBotaoMenorSandbox.html(texto);
		});
		$inputTextoNomeSandbox.on('keyup', function(){
			var texto = this.value;
			$divTextoNomeSandbox.html(texto);
		});
		$textareaSubtituloSandbox.on('keyup', function(){
			var texto = (this.value).replace(/\n/g, '<br />');
			$divTextoSubtituloSandbox.html(texto);
		});
		$textareaDescricaoSandbox.on('keyup', function(){
			var texto = (this.value).replace(/\n/g, '<br />');
			$divTextoDescricaoSandbox.html(texto);
		});

		// Eventos dos campos de plataforma
		/* Botões */
		$selectPlataformaBotoes.on('change', function(){
			var $campoEscala = $('#escala_botao');
			var $campoTamanhoFonte = $('#tamanho_fonte_botao');
			var $campoMargemSuperior = $('#margem_superior_botao');
			var $campoMargemEsquerdo = $('#margem_esquerdo_botao');
			var $previa = $('#previa_botoes');
			var $divTexto = $previa.find('div.texto');
			var $divConteiner = $divTexto.parent();
			var $imgPreenchida = $previa.find('img.botao_template');
			var plataforma = this.value;

			if(plataforma == 'ds'){
				$campoTamanhoFonte.val(18);
				$campoMargemSuperior.slider('setAttribute', 'min', -30).slider('setAttribute', 'max', 60).slider('setValue', 4);
				$campoMargemEsquerdo.slider('setAttribute', 'min', -30).slider('setAttribute', 'max', 60).slider('setValue', 16);
				$divConteiner.attr('id', 'conteiner_botao_ds');
				$divTexto.attr('data-largura', '224');
				$imgPreenchida.attr('src', 'img/background_botoes_preenchido_ds.png');
			} else {
				$campoTamanhoFonte.val(23);
				$campoMargemSuperior.slider('setAttribute', 'min', -5).slider('setAttribute', 'max', 30).slider('setValue', 0);
				$campoMargemEsquerdo.slider('setAttribute', 'min', -5).slider('setAttribute', 'max', 30).slider('setValue', 0);
				$divConteiner.attr('id', 'conteiner_botao');
				$divTexto.attr('data-largura', '280');
				$imgPreenchida.attr('src', 'img/background_botoes_preenchido.png');
			}
			$campoEscala.add($campoTamanhoFonte).add($campoMargemSuperior).add($campoMargemEsquerdo).trigger('change');
		})
		/* Botões Menores */
		$selectPlataformaBotoesMenores.on('change', function(){
			var $campoEscala = $('#escala_botao_menor');
			var $campoTamanhoFonte = $('#tamanho_fonte_botao_menor');
			var $campoMargemSuperior = $('#margem_superior_botao_menor');
			var $previa = $('#previa_botoes_menores');
			var $divTexto = $previa.find('div.texto');
			var $divConteiner = $divTexto.parent();
			var $imgPreenchida = $previa.find('img.botao_template');
			var plataforma = this.value;

			if(plataforma == 'ds'){
				$campoTamanhoFonte.val(18);
				$campoMargemSuperior.slider('setValue', 4);
				$divConteiner.attr('id', 'conteiner_botao_menor_ds');
				$divTexto.attr('data-largura', '128');
				$imgPreenchida.attr('src', 'img/background_botoes_menores_preenchido_ds.png');
			} else {
				$campoTamanhoFonte.val(23);
				$campoMargemSuperior.slider('setValue', 0);
				$divConteiner.attr('id', 'conteiner_botao_menor');
				$divTexto.attr('data-largura', '160');
				$imgPreenchida.attr('src', 'img/background_botoes_menores_preenchido.png');
			}
			$campoEscala.add($campoTamanhoFonte).add($campoMargemSuperior).trigger('change');
		})
		/* Nomes de Provas / Perfis */
		$selectPlataformaNome.on('change', function(){
			var $campoEscala = $('#escala_nome');
			var $campoFonte = $('#fonte_nome');
			var $campoTamanhoFonte = $('#tamanho_fonte_nome');
			var $campoMargemSuperior = $('#margem_superior_nome');
			var $previa = $('#previa_nomes');
			var $divTexto = $previa.find('div.texto');
			var $divConteiner = $divTexto.parent();
			var $imgPreenchida = $previa.find('img.botao_template');
			var plataforma = this.value;

			if(plataforma == 'ds'){
				//$campoEscala.slider('setValue', 1);
				$campoFonte.val('Ace Attorney US');
				$campoTamanhoFonte.val(15);
				$campoMargemSuperior.slider('setValue', -3);
				$divConteiner.attr('id', 'conteiner_nome_ds');
				$divTexto.attr('data-largura', '128');
				$imgPreenchida.attr('src', 'img/background_nomes_preenchido_ds.png');
			} else {
				//$campoEscala.slider('setValue', 1.045);
				$campoFonte.val('Vald Book');
				$campoTamanhoFonte.val(18);
				$campoMargemSuperior.slider('setValue', 0);
				$divConteiner.attr('id', 'conteiner_nome');
				$divTexto.attr('data-largura', '160');
				$imgPreenchida.attr('src', 'img/background_nomes_preenchido.png');
			}
			$campoEscala.add($campoTamanhoFonte).add($campoFonte).add($campoMargemSuperior).trigger('change');
		});
		/* Subtítulos de Provas / Perfis */
		$selectPlataformaSubtitulo.on('change', function(){
			var $campoEscala = $('#escala_subtitulo');
			var $campoFonte = $('#fonte_subtitulo');
			var $campoTamanhoFonte = $('#tamanho_fonte_subtitulo');
			var $campoAlturaLinha = $('#altura_linha_subtitulo');
			var $previa = $('#previa_subtitulos');
			var $divTexto = $previa.find('div.texto');
			var $divConteiner = $divTexto.parent();
			var $imgPreenchida = $previa.find('img.botao_template');
			var plataforma = this.value;

			if(plataforma == 'ds'){
				$campoEscala.slider('setValue', 1);
				$campoFonte.val('Pixel Arial');
				$campoTamanhoFonte.val(8);
				$campoAlturaLinha.slider('setValue', 1.95);
				$divConteiner.attr('id', 'conteiner_subtitulo_ds');
				$divTexto.attr('data-largura', '128');
				$imgPreenchida.attr('src', 'img/background_subtitulos_preenchido_ds.png');
			} else {
				$campoEscala.slider('setValue', 1);
				$campoFonte.val('Vald Book');
				$campoTamanhoFonte.val(14);
				$campoAlturaLinha.slider('setValue', 1.35);
				$divConteiner.attr('id', 'conteiner_subtitulo');
				$divTexto.attr('data-largura', '160');
				$imgPreenchida.attr('src', 'img/background_subtitulos_preenchido.png');
			}
			$campoEscala.add($campoTamanhoFonte).add($campoFonte).add($campoAlturaLinha).trigger('change');
		});
		/* Descrições de Provas / Perfis */
		$selectPlataformaDescricao.on('change', function(){
			var $campoEscala = $('#escala_descricao');
			var $campoFonte = $('#fonte_descricao');
			var $campoTamanhoFonte = $('#tamanho_fonte_descricao');
			var $campoAlturaLinha = $('#altura_linha_descricao');
			var $campoMargemSuperior = $('#margem_superior_descricao');
			var $campoMargemEsquerda = $('#margem_esquerdo_descricao');
			var $previa = $('#previa_descricoes');
			var $divTexto = $previa.find('div.texto');
			var $divConteiner = $divTexto.parent();
			var $imgPreenchida = $previa.find('img.botao_template');
			var plataforma = this.value;

			if(plataforma == 'ds'){
				$campoEscala.slider('setValue', 1);
				$campoFonte.val('Ace Attorney US');
				$campoTamanhoFonte.val(16);
				$campoAlturaLinha.slider('setValue', 1);
				$campoMargemSuperior.slider('setValue', -2);
				$campoMargemEsquerda.slider('setValue', 18);
				$divConteiner.attr('id', 'conteiner_descricao_ds');
				$divTexto.attr('data-largura', '256');
				$imgPreenchida.attr('src', 'img/background_descricao_preenchido_ds.png');
			} else {
				$campoEscala.slider('setValue', 1.075);
				$campoFonte.val('Vald Book');
				$campoTamanhoFonte.val(14);
				$campoAlturaLinha.slider('setValue', 1.35);
				$campoMargemSuperior.slider('setValue', 3);
				$campoMargemEsquerda.slider('setValue', 23);
				$divConteiner.attr('id', 'conteiner_descricao');
				$divTexto.attr('data-largura', '256');
				$imgPreenchida.attr('src', 'img/background_descricao_preenchido.png');
			}
			$campoEscala.add($campoTamanhoFonte).add($campoFonte).add($campoAlturaLinha).add($campoMargemSuperior).add($campoMargemEsquerda).trigger('change');
		});

		// Instanciando campos de escala, bem como seus eventos
		$('input.slider').each(function(){
			var $input = $(this);
			var $inputMostraValor = $input.next();
			var id_imagem = $input.attr('data-imagem');
			var $conteinerImagem = $('#' + id_imagem);
			var $divTexto = $conteinerImagem.children('div.texto');

			$input.slider();

			if($input.hasClass('escala')){
				$input.on('change', function(){
					var escala = this.value;
					var largura = parseFloat($divTexto.attr('data-largura'));
					var nova_largura = largura / escala;

					$divTexto.css({
						'width': nova_largura + 'px',
						'transform': 'scaleX(' + escala + ')'
					})

					$inputMostraValor.val(escala);
				});

				$input.trigger('change');
			} else if($input.hasClass('altura_linha')){
				$input.on('change', function(){
					var altura_linha = this.value;

					$divTexto.css('lineHeight', altura_linha);

					$inputMostraValor.val(altura_linha);
				});

				$input.trigger('change');
			} else if($input.hasClass('claridade')){
				$input.on('change', function(){
					var porcentagem = this.value;
					var cor = 'hsla(20, 100%, ' + porcentagem + '%, 1)';

					$inputMostraValor.val(porcentagem + '%').css('backgroundColor', cor);
					if(porcentagem > 50){
						$inputMostraValor.css('color', '#333');
					} else {
						$inputMostraValor.css('color', 'white');
					}
					$divTexto.css('color', cor);
				});
				
				$input.trigger('change');
			} else if($input.hasClass('margem_superior')){
				$input.on('change', function(){
					var margem_superior = this.value;

					$divTexto.css('marginTop', margem_superior + 'px');

					$inputMostraValor.val(margem_superior);
				});

				$input.trigger('change');
			} else if($input.hasClass('margem_esquerda')){
				$input.on('change', function(){
					var margem_esquerda = this.value;

					$divTexto.css('marginLeft', margem_esquerda + 'px');

					$inputMostraValor.val(margem_esquerda);
				});

				$input.trigger('change');
			}
		});

		// Configurando campos de seleção de fonte
		$selectFonteBotoes.add($selectFonteBotoesMenores).add($selectFonteNome).add($selectFonteSubtitulo).add($selectFonteDescricao).html(
			$("<option />").html('Carregando...').attr({
				'value': '',
				'selected': 'selected',
				'disabled': 'disabled'
			})
		);
		$.get('fontes.html', function(f){
			$.get('fontes_proprietarias.html').always(function(fp) {
				var $selectsFontes = $selectFonteBotoes.add($selectFonteBotoesMenores).add($selectFonteNome).add($selectFonteSubtitulo).add($selectFonteDescricao);

				$selectsFontes.each(function(){
					var $selectFonte = $(this);
					var $selectTamanhoFonte = $selectFonte.siblings('select.tamanho_fonte');
					var $inputOutraFonte = $selectFonte.next();
					var $divTexto;
					var name = $selectFonte.attr('name');
					var fonte_padrao, tamanho_padrao;

					// Definindo parâmetros em função do nome do campo
					if(name == 'fonte_botao'){
						$divTexto = $divTextoBotao;
						fonte_padrao = 'Arial';
						tamanho_padrao = 23;
					} else if(name == 'fonte_botao_menor'){
						$divTexto = $divTextoBotaoMenor;
						fonte_padrao = 'Arial';
						tamanho_padrao = 23;
					} else if(name == 'fonte_nome'){
						$divTexto = $divTextoNome;
						fonte_padrao = 'Arial';
						tamanho_padrao = 18;
					} else if(name == 'fonte_subtitulo'){
						$divTexto = $divTextoSubtitulo;
						fonte_padrao = 'Vald Book';
						tamanho_padrao = 14;
					} else if(name == 'fonte_descricao'){
						$divTexto = $divTextoDescricao;
						fonte_padrao = 'Vald Book';
						tamanho_padrao = 14;
					}

					// Obtendo fontes carregadas via ajax
					$selectFonte.html(f);
					if ((typeof fp == 'string') && (fp.indexOf('<option') > -1)) {
						$selectFonte.append(fp);
					}

					// Ordenando opções por nome
					var $opcoes = $selectFonte.find('option');
					var array_opcoes = $opcoes.map(function(e, o) {
						return{
							t: $(o).text(),
							v: o.value
						};
					}).get();
					array_opcoes.sort(function(o1, o2){
						var t1 = o1.t.toLowerCase(), t2 = o2.t.toLowerCase();
						return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
					});
					$opcoes.each(function(i, o) {
						o.value = array_opcoes[i].v;
						$(o).text(array_opcoes[i].t);
					});

					// Adicionando opção "Outra"
					$selectFonte.append('<option value="_o_" class="l_opcao_outra_fonte">Another</option>');

					// Setando valor e evento nos campos de fonte
					$selectFonte.val(fonte_padrao);
					var $opcaoSelecionada = $selectFonte.find('option:selected');
					$opcaoSelecionada.addClass('recomendada');
					$opcaoSelecionada[0].defaultSelected = true;
					$selectFonte.on('change', function(){
						var fonte = this.value;
						if(fonte == '_o_'){
							$inputOutraFonte.show();
						} else {
							$inputOutraFonte.val('').hide();
							
							var regex_numeros = /\d/g;
							if(regex_numeros.test(fonte)){
								$divTexto.css({'fontFamily': '"' + fonte + '"'});
							} else {
								$divTexto.css('fontFamily', fonte);
							}
						}
					});

					// Gerando tamanhos para os campos de tamanho da fonte
					for(var i=8; i<=36; i++){
						$selectTamanhoFonte.append("<option value='" + i + "'>" + i + " px</option>");
						if(i == tamanho_padrao){
							$selectTamanhoFonte.val(i);
						}
					}

					// Setando evento dos campos de digitação de outras fontes
					$inputOutraFonte.on('keyup', function(){
						var fonte = this.value;
						
						var regex_numeros = /\d/g;
						if(regex_numeros.test(fonte)){
							$divTexto.css({'fontFamily': '"' + fonte + '"'});
						} else {
							$divTexto.css('fontFamily', fonte);
						}
					});

					// Setando evento de mudança do campo de tamanho da fonte
					$selectTamanhoFonte.on('change', function(){
						$divTexto.css('fontSize', this.value + 'px');
					});

					// Chamando evento padrão dos campos de tamanho da fonte
					$selectTamanhoFonte.trigger('change');
				});

				// Definindo textos das opções "Outra", dos campos de fonte
				$('.l_opcao_outra_fonte').html(LANGUAGE.l.opcao_outra_fonte);
			});
		});

		// Evento dos checkboxes de mudança de estilo (negrito e itálico)
		$('input.estilos').each(function(){
			var $input = $(this);
			var id_imagem = $input.attr('data-imagem');
			var $conteinerImagem = $('#' + id_imagem);
			var $divTexto = $conteinerImagem.children('div.texto');

			$input.on('change', function(){
				var estilo = $input.val();
				if($input.is(':checked')){
					if(estilo == 'n'){
						$divTexto.addClass('negrito');
					} else if(estilo == 'i'){
						$divTexto.addClass('italico');
					}
				} else {
					if(estilo == 'n'){
						$divTexto.removeClass('negrito');
					} else if(estilo == 'i'){
						$divTexto.removeClass('italico');
					}
				}
			});

			$input.trigger('change');
		})

		// Evento dos botões "Gerar"
		$botaoGerarBotoes.on('click', function(){
			var texto = $inputTextoBotoes.val();
			renderizarImagemNavegador($divBotao, texto);
		});
		$botaoGerarBotoesMenores.on('click', function(){
			var texto = $inputTextoBotoesMenores.val();
			renderizarImagemNavegador($divBotaoMenor, texto);
		});
		$botaoGerarNome.on('click', function(){
			var texto = $inputTextoNome.val();
			renderizarImagemNavegador($divNome, texto);
		});
		$botaoGerarSubtitulo.on('click', function(){
			var texto = $textareaSubtitulo.val();
			renderizarImagemNavegador($divSubtitulo, texto);
		});
		$botaoGerarDescricao.on('click', function(){
			var texto = $textareaDescricao.val();
			$divDescricao.removeClass('fundo_cinza_escuro');
			renderizarImagemNavegador($divDescricao, texto, function(){
				$divDescricao.addClass('fundo_cinza_escuro');
			});
		});
		$botaoGerarSandbox1.on('click', function(){
			var data = new Date();
			data = new Date(data.getTime() - (data.getTimezoneOffset() * 60000)).toJSON()
			data = data.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');

			var texto = 'sandbox1-' + data;
			renderizarImagemNavegador($divBotoesSandbox, texto);
		});
		$botaoGerarSandbox2.on('click', function(){
			var data = new Date();
			data = new Date(data.getTime() - (data.getTimezoneOffset() * 60000)).toJSON()
			data = data.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');

			var texto = 'sandbox2-' + data;
			renderizarImagemNavegador($divBotaoMenorSandbox, texto);
		});
		$botaoGerarSandbox3.on('click', function(){
			var data = new Date();
			data = new Date(data.getTime() - (data.getTimezoneOffset() * 60000)).toJSON()
			data = data.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');

			var texto = 'sandbox3-' + data;
			renderizarImagemNavegador($divProvaSubtituloSandbox, texto);
		});

		// Ação dos botões "resetar"
		$formularios.on('reset', function(){
			var $form = $(this);
			setTimeout(function(){
				$form.find("input[type='text'], input[type='checkbox'], select, textarea").each(function(){
					var $campo = $(this);
					if($campo.is('input.slider')){
						$campo.slider('refresh').trigger('change');
					} else if($campo.is('select')){
						$campo.trigger('change');
					} else if($campo.is("input[type='checkbox']")){
						$campo.prop('checked', false).closest('label').removeClass('active');
						$campo.trigger('change');
					} else {
						$campo.trigger('keyup');
					}
				})
			}, 25);
		})

		// Chamadas de eventos padrões
		$inputTextoBotoes.add($inputTextoBotoesMenores).add($inputTextoNome).add($textareaSubtitulo).add($textareaDescricao).trigger('keyup');
		$inputTextoBotaoSandbox1.add($inputTextoBotaoSandbox2).add($inputTextoBotaoSandbox3).add($inputTextoBotaoMenorSandbox).trigger('keyup');
		$inputTextoNomeSandbox.add($textareaSubtituloSandbox).add($textareaDescricaoSandbox).trigger('keyup');
	}
});