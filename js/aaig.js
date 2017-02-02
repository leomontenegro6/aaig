function renderizarImagemNavegador(elemento, nome_arquivo, callback){
	var $elemento = $(elemento);
	
	nome_arquivo = nome_arquivo.replace(/\n/g, ' ');
	
	html2canvas($elemento, {
		onrendered: function(canvas) {
			var a = document.createElement('a');
			a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			a.download = nome_arquivo + '.png';
			var $a = $(a);
			$('body').append($a);
			a.click();
			$a.remove();
			
			if(callback) callback();
		}
	});
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
	// Campos diversos
	var $ancoraSobrePrograma = $('#sobre_programa');
	var $formularios = $('form');
	
	// Campos de botões
	var $inputTextoBotoes = $('#texto_botoes');
	var $selectFonteBotoes = $('#fonte_botao');
	var $inputOutraFonteBotoes = $('#outra_fonte_botao');
	var $botaoGerarBotoes = $('#botao_gerar_botoes');
	var $divBotao = $('#conteiner_botao');
	var $divTextoBotao = $divBotao.children('div.texto');
	
	// Campos de botões menores
	var $inputTextoBotoesMenores = $('#texto_botoes_menores');
	var $selectFonteBotoesMenores = $('#fonte_botao_menor');
	var $inputOutraFonteBotoesMenores = $('#outra_fonte_botao_menor');
	var $botaoGerarBotoesMenores = $('#botao_gerar_botoes_menores');
	var $divBotaoMenor = $('#conteiner_botao_menor');
	var $divTextoBotaoMenor = $divBotaoMenor.children('div.texto');

	// Campos de nomes de prova / perfil
	var $inputTextoNome = $('#texto_nome');
	var $selectFonteNome = $('#fonte_nome');
	var $inputOutraFonteNome = $('#outra_fonte_nome');
	var $botaoGerarNome = $('#botao_gerar_nome');
	var $divNome = $('#conteiner_nome');
	var $divTextoNome = $divNome.children('div.texto');

	// Campos de subtitulos de prova / perfil
	var $textareaSubtitulo = $('#texto_subtitulo');
	var $selectFonteSubtitulo = $('#fonte_subtitulo');
	var $inputOutraFonteSubtitulo = $('#outra_fonte_subtitulo');
	var $botaoGerarSubtitulo = $('#botao_gerar_subtitulo');
	var $divSubtitulo = $('#conteiner_subtitulo');
	var $divTextoSubtitulo = $divSubtitulo.children('div.texto');

	// Campos de descrições de prova / perfil
	var $textareaDescricao = $('#texto_descricao');
	var $selectFonteDescricao = $('#fonte_descricao');
	var $inputOutraFonteDescricao = $('#outra_fonte_descricao');
	var $botaoGerarDescricao = $('#botao_gerar_descricao');
	var $divDescricao = $('#conteiner_descricao');
	var $divTextoDescricao = $divDescricao.children('div.texto');
	
	// Definindo texto padrão para os campos
	$inputTextoBotoes.attr('value', 'Phoenix Wright');
	$inputTextoBotoesMenores.attr('value', "Chief's Office");
	$inputTextoNome.attr('value', 'Fingerprinting Set');
	$textareaSubtitulo.html('Age: 27\nGender: Female');
	$textareaDescricao.html('Time of death: 9/5 at 9:00 PM.\nCause: single blunt force trauma.\nDeath was instantaneous.');
	
	// Evento do botão "Sobre este programa"
	$ancoraSobrePrograma.on('click', function(){
		abrirModal('about.html');
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
		$divTextoSubtitulo.html(texto);
	});
	$textareaDescricao.on('keyup', function(){
		var texto = (this.value).replace(/\n/g, '<br />');
		$divTextoDescricao.html(texto);
	});
	
	// Instanciando campos de escala, bem como seus eventos
	$('input.slider').each(function(){
		var $input = $(this);
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
			});

			$input.trigger('change');
		} else if($input.hasClass('margem_superior')){
			$input.on('change', function(){
				var margem_superior = this.value;
				
				$divTexto.css('marginTop', margem_superior + 'px');
			});
			
			$input.trigger('change');
		} else if($input.hasClass('margem_esquerda')){
			$input.on('change', function(){
				var margem_esquerda = this.value;
				
				$divTexto.css('marginLeft', margem_esquerda + 'px');
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
	$.get('fonts.html', function(r){
		// Obtendo fontes carregadas via ajax
		$selectFonteBotoes.add($selectFonteBotoesMenores).add($selectFonteNome).add($selectFonteSubtitulo).add($selectFonteDescricao).html(r);
		
		// Setando valor e evento nos campos.
		$selectFonteBotoes.val('Arial').on('change', function(){
			var fonte = this.value;
			if(fonte == '_o_'){
				$inputOutraFonteBotoes.show();
			} else {
				$inputOutraFonteBotoes.val('').hide();
				$divTextoBotao.css('fontFamily', fonte);
			}

		});
		$selectFonteBotoesMenores.val('Arial').on('change', function(){
			var fonte = this.value;
			if(fonte == '_o_'){
				$inputOutraFonteBotoesMenores.show();
			} else {
				$inputOutraFonteBotoesMenores.val('').hide();
				$divTextoBotaoMenor.css('fontFamily', fonte);
			}

		});
		$selectFonteNome.val('Vald Book').on('change', function(){
			var fonte = this.value;
			if(fonte == '_o_'){
				$inputOutraFonteNome.show();
			} else {
				$inputOutraFonteNome.val('').hide();
				$divTextoNome.css('fontFamily', fonte);
			}
		});
		$selectFonteSubtitulo.val('Vald Book').on('change', function(){
			var fonte = this.value;
			if(fonte == '_o_'){
				$inputOutraFonteSubtitulo.show();
			} else {
				$inputOutraFonteSubtitulo.val('').hide();
				$divTextoSubtitulo.css('fontFamily', fonte);
			}
		});
		$selectFonteDescricao.val('Vald Book').on('change', function(){
			var fonte = this.value;
			if(fonte == '_o_'){
				$inputOutraFonteDescricao.show();
			} else {
				$inputOutraFonteDescricao.val('').hide();
				$divTextoDescricao.css('fontFamily', fonte);
			}
		});
	})
	
	// Evento dos campos de digitação de outras fontes
	$inputOutraFonteBotoes.on('keyup', function(){
		var fonte = this.value;
		$divTextoBotao.css('fontFamily', fonte);
	});
	$inputOutraFonteBotoesMenores.on('keyup', function(){
		var fonte = this.value;
		$divTextoBotaoMenor.css('fontFamily', fonte);
	});
	$inputOutraFonteNome.on('keyup', function(){
		var fonte = this.value;
		$divTextoNome.css('fontFamily', fonte);
	});
	$inputOutraFonteSubtitulo.on('keyup', function(){
		var fonte = this.value;
		$divTextoSubtitulo.css('fontFamily', fonte);
	});
	$inputOutraFonteDescricao.on('keyup', function(){
		var fonte = this.value;
		$divTextoDescricao.css('fontFamily', fonte);
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
});