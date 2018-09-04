function renderImageOnBrowser(element, filename, callback, triggerDownload){
	var $element = $(element);
	var $divPreviews = $element.closest('div.previews');
	var $divLastCanvases = $divPreviews.find('div.last-canvases').children('div.panel-body');
	
	if(typeof triggerDownload == 'undefined') triggerDownload = true;
	
	filename = filename.replace(/\n/g, ' ');
	html2canvas($element, {
		onrendered: function(canvas) {
			// Adding last generated canvases in the container on the right of the footer.
			// Useful for debugging purposes. Only the first 50 are maintained.
			$divLastCanvases.append(canvas);
			var total_canvas = $divLastCanvases.children('canvas').length;
			if(total_canvas > 50){
				for(var i = total_canvas; i > 50; i--){
					$divLastCanvases.children('canvas').first().remove();
				}
			}
			
			if(triggerDownload){
				// Creating temporary anchor for receiving data of the image generated
				var a = document.createElement('a');
				a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
				a.download = filename + '.png';
				
				// Adding anchor inside <body> tag
				var $a = $(a);
				$('body').append($a);

				// Triggering anchor click event, in order to start the download
				// of the image. After doing so, the anchor is removed.
				a.click();
				$a.remove();
			}
			
			if(callback) callback(canvas);
		}
	});
}

function batchRenderImages(element, texts, checkAutomaticScale, callback){
	var $element = $(element);
	var $divText = $element.children('div.text');
	var $tab = $element.closest('div.tab-pane');
	var $selectPlatform = $tab.find("select[name^='platform']");
	
	var platform = $selectPlatform.val();
	if(typeof checkAutomaticScale == 'undefined') checkAutomaticScale = false;
	var checkUsingSprites = (platform == 'ds') && ($tab.is("[id='proof-profile-titles'], [id='proof-profile-subtitles'], [id='proof-profile-descriptions']"));
	
	var i = 0;
	var canvases = [];
	
	showLoadingIndicator();
	
	var renderImage = function(){
		var text = texts.shift();
		if(platform == '3ds') text = text.replace(/\n/g, '<br />');
		
		var filename = i + '.png';
		
		if(checkUsingSprites){
			updatePreviewSprites($divText, text);
		} else {
			updatePreviewText($divText, text, checkAutomaticScale);
		}
		
		renderImageOnBrowser($element, filename, function(canvas){
			canvases.push(canvas);
			
			if(texts.length){
				// Render image of the next line
				i++;
				renderImage();
			} else {
				// Generate zipped file containing the batch generated images
				var date = new Date();
				date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON();
				date = date.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');
				var final_filename = 'images-' + date + '.zip';
				
				var zip = new JSZip();
				
				// Adding images in the zip file
				for(var j in canvases){
					var filename = j + '.png';
					var image = canvases[j].toDataURL();
					var header_index = image.indexOf(",");
					var base64_image = image.slice(header_index + 1);
					
					zip.file(filename, base64_image, {base64: true});
				}
				
				// Generating zip and offering it to the user
				zip.generateAsync({type:"blob"}).then(function(content){
					hideLoadingIndicator();
					saveAs(content, final_filename);
					
					if(callback) callback(canvases);
				});
			}
		}, false);
	}
	renderImage();
}

function calculateTextWidth(element){
	var $element = $(element);
	var html_org = $element.html();
	var html_calc = '<span>' + html_org + '</span>';
	$element.html(html_calc);
	var width = $element.find('span:first').width();
	$element.html(html_org);
	return width;
}

function definePreviewScale(element, scale){
	var $element = $(element);
	
	var width = parseFloat($element.attr('data-width'));
	var new_width = width / scale;

	$element.css({
		'width': new_width + 'px',
		'transform': 'scaleX(' + scale + ')'
	});
}

function updatePreviewText(divPreview, text, checkAutomaticScale, approximation){
	if(typeof approximation == 'undefined') approximation = 0.95;
	
	var $divPreview = $(divPreview);
	
	$divPreview.html(text);
	
	if(checkAutomaticScale){
		definePreviewScale($divPreview, 1);
		var text_width = calculateTextWidth($divPreview);
		var preview_width = $divPreview.width();
		
		if(text_width > preview_width){
			var scale = (preview_width * approximation / text_width);
			
			definePreviewScale($divPreview, scale);
		}
	}
}

function updatePreviewSprites(divPreview, text, font, callback){
	var $divPreview = $(divPreview);
	var $divPreviewConteiner = $divPreview.parent();
	var checkLimitExceeded = false;
	
	if(typeof font == 'undefined'){
		font = $divPreview.closest('div.tab-pane').find("select.font-ds").val();
	}
	
	// Undoing condensed font effect, in case of the field's "automatic" option is activated.
	// Needed to check automatically if the font is condensed or not
	if(font == 'a'){
		$divPreviewConteiner.removeClass('condensed extra-condensed');
	}
	
	// Adding sprite letters in the preview
	$divPreview.html('').css('fontFamily', '');
	for (var i = 0, size = text.length; i < size; i++) {
		var character = text[i];

		if(character == "\n"){
			$divPreview.append(
				$('<br />')
			);
		} else {
			var new_character = formatCharacter(character);

			$divPreview.append(
				$('<span />').addClass('letter ' + new_character + ' ').html('&nbsp;')
			);
		}
	}
	
	// Checking if condensed font must be used or not
	if(font == 'a'){
		var text_width = calculateTextWidth( $divPreview );
		var preview_width = $divPreview.width();
		
		// Checking if text width exceeded the maximum width of the preview
		if(text_width > preview_width){
			// Exceeded the maximum width, so changing font to condensed
			$divPreviewConteiner.addClass('condensed');
			
			var condensed_text_width = calculateTextWidth( $divPreview );
			var condensed_preview_width = $divPreview.width();
			
			// Checking if condensed text width exceeded the maximum width of the condensed preview
			if(condensed_text_width > condensed_preview_width){
				// Exceeded the maximum condensed width, so changing font to extra-condensed
				$divPreviewConteiner.addClass('extra-condensed');
				
				var extra_condensed_text_width = calculateTextWidth( $divPreview );
				var extra_condensed_preview_width = $divPreview.width();
				
				// Checking if extra-condensed text width exceeded the maximum width of the extra-condensed preview
				if(extra_condensed_text_width > extra_condensed_preview_width){
					// Exceeded the maximum extra-condensed width, so returning the limit exceed flag as callback
					checkLimitExceeded = true;
				}
			}
		}
	}
	
	if(callback) callback(checkLimitExceeded);
}

function showLoadingIndicator(){
	$('#loading-indicator').modal('show');
}

function hideLoadingIndicator(){
	$('#loading-indicator').modal('hide');
}

function addLanguageScript(idioma, callback){
	$.getScript('js/lang.' + idioma + '.js', function(){
		if(callback) callback();
	})
}

function removeAllLanguageScripts(){
	$('head').find("script[src^='lang']").remove();
}

function updateLanguage(){
	for(var textType in LANGUAGE){
		var textTypes = LANGUAGE[textType];
		for(var subtype in textTypes){
			var text = textTypes[subtype];
			var selector = '.' + textType + '-' + subtype;
			
			if(textType == 'l'){
				$(selector).html(text);
			} else if(textType == 't'){
				$(selector).attr('title', text);
			} else if(textType == 'p'){
				$(selector).attr('placeholder', text);
			}
		}
	}
}

function formatCharacter(character){
	var characterTable = {
		// Symbols
		' ': 'space', '!': 'exclamation', '"': 'double-quotes', '#': 'cerquilha',
		'$': 'money-sign', '%': 'percent', '&': 'ampersand', "'": 'quotes',
		"(": 'open-parenthesis', ")": 'close-parenthesis', '*': 'asterisk',
		'+': 'plus', ',': 'comma', '-': 'minus', '.': 'dot', '/': 'slash',
		':': 'colon', ';': 'semicolon', '<': 'less-than', '=': 'equal',
		'>': 'greater-than', '?': 'interrogation', '@': 'at-sign',
		'[': 'open-square-brackets', ']': 'close-square-brackets',
		'_': 'underscore', '¡': 'inverted-exclamation',
		'¿': 'inverted-interrogation', 'º': 'o-ordinal', 'ª': 'a-ordinal',

		// Numbers
		'0': 'n0', '1': 'n1', '2': 'n2', '3': 'n3', '4': 'n4', '5': 'n5',
		'6': 'n6', '7': 'n7', '8': 'n8', '9': 'n9',

		// Uppercase accents
		'À': 'A-grave', 'Á': 'A-acute', 'Â': 'A-circumflex', 'Ã': 'A-tilde',
		'Ä': 'A-diaeresis', 'Ç': 'C-cedilla', 'È': 'E-grave', 'É': 'E-acute',
		'Ê': 'E-circumflex', 'Ë': 'E-diaeresis', 'Ẽ': 'E-tilde', 'Ì': 'I-grave',
		'Í': 'I-acute', 'Ï': 'I-diaeresis', 'Î': 'I-circumflex', 'Ò': 'O-grave',
		'Ó': 'O-acute', 'Ô': 'O-circumflex', 'Õ': 'O-tilde', 'Ö': 'O-diaeresis',
		'Ù': 'U-grave', 'Ú': 'U-acute', 'Û': 'U-circumflex', 'Ü': 'U-diaeresis',
		'Ñ': 'N-tilde', 'Ÿ': 'Y-diaeresis',

		// Lowercase accents
		'à': 'a-grave', 'á': 'a-acute', 'â': 'a-circumflex', 'ã': 'a-tilde',
		'ä': 'a-diaeresis', 'ç': 'c-cedilla', 'è': 'e-grave', 'é': 'e-acute', 
		'ê': 'e-circumflex', 'ẽ': 'e-tilde', 'ë': 'e-diaeresis', 'ì': 'i-grave',
		'í': 'i-acute', 'ï': 'i-diaeresis', 'î': 'i-circumflex', 'ò': 'o-grave',
		'ó': 'o-acute', 'ô': 'o-circumflex', 'õ': 'o-tilde', 'ö': 'o-diaeresis',
		'ù': 'u-grave', 'ú': 'u-acute', 'û': 'u-circumflex', 'ü': 'u-diaeresis',
		'ñ': 'n-tilde', 'ÿ': 'y-diaeresis'

	}

	var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
	for(var i in alphabet){
		var letter = alphabet[i];

		characterTable[letter] = letter;
	}

	var key, newCharacter;
	for (key in characterTable) {
		if(key == character){
			var newValue = characterTable[key];
			newCharacter = character.replace(key, newValue);
			break;
		}
	}
	if(typeof newCharacter == 'string'){
		return newCharacter;
	} else {
		return 'unknown';
	}
}

/* Function that returns de device used by the user, when acessing the app
 * Possible return values:
 *	- xs: Extra small (Cellphones, with screen width smaller than 768px);
 *	- sm: Small (Tablets, with screen width equal or greater than 768px);
 *	- md: Medium (Smaller Desktops, with screen width equal or greater than 992px);
 *	- lg: Large (Widescreen Desktops, with screen width equal or greater than 1200px).
 * */
function getDevice(onresize) {
	if(typeof onresize == 'undefined') onresize = false;
	if(onresize){
		$(window).off('resize.updateGlobalVariable').on('resize.updateGlobalVariable', function(){
			window.device = getDevice(false);
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

function toggleAccordionIcon(e) {
    $(e.target).prev('.panel-heading').find(".plus-minus").toggleClass('glyphicon-plus glyphicon-minus');
}

$(function(){
	// Abas
	var $divTabButtons = $('#buttons');
	var $divTabSmallerButtons = $('#smaller-buttons');
	var $divTabProofProfileTitles = $('#proof-profile-titles');
	var $divTabProofProfileSubtitles = $('#proof-profile-subtitles');
	var $divTabProofProfileDescriptions = $('#proof-profile-descriptions');
	var $divTabSandbox = $('#sandbox');
	var $buttonTabSandbox = $('a[aria-controls="sandbox"]');
	
	// Disabling cache for ajax requests
	$.ajaxSetup ({
		cache: false
	});
	
	// Loading contents of each tab
	$divTabButtons.load('tab-buttons.html', function(){
		$divTabSmallerButtons.load('tab-smaller-buttons.html', function(){
			$divTabProofProfileTitles.load('tab-proof-profile-titles.html', function(){
				$divTabProofProfileSubtitles.load('tab-proof-profile-subtitles.html', function(){
					$divTabProofProfileDescriptions.load('tab-proof-profile-descriptions.html', function(){
						$divTabSandbox.load('tab-sandbox.html', instantiateFields);
					});
				});
			});
		});
	});
	
	// Method for instantiating fields. Called after all tabs are loaded
	var instantiateFields = function(){
		// Miscellaneous fields
		var $ancoraSobrePrograma = $('#about-program');
		var $botaoIdioma = $('#language-button');
		var $imgBandeira = $botaoIdioma.children('img.bandeira');
		var $spanNomeIdioma = $botaoIdioma.children('span.nome_idioma');
		var $ulListaIdiomas = $('#languages-list');
		var $ulListaTemas = $('#themes-list');
		var $formularios = $('form');

		// Button fields
		var $inputTextoBotoes = $('#texto_botoes');
		var $checkboxLoteBotoes = $('#lote_botao');
		var $textareaTextoBotoesLote = $('#texto_botoes_lote');
		var $selectPlataformaBotoes = $('#plataforma_botao');
		var $checkboxEscalaAutomaticaBotoes = $('#automatic-scale-button');
		var $selectFonteBotoes = $('#fonte_botao');
		var $botaoGerarBotoes = $('#botao_gerar_botoes');
		var $divBotao = $('#conteiner_botao');
		var $divTextoBotao = $divBotao.children('div.texto');

		// Smaller button fields
		var $inputTextoBotoesMenores = $('#texto_botoes_menores');
		var $checkboxLoteBotoesMenores = $('#lote_botao_menor');
		var $textareaTextoBotoesMenoresLote = $('#texto_botoes_menores_lote');
		var $selectPlataformaBotoesMenores = $('#plataforma_botao_menor');
		var $checkboxEscalaAutomaticaBotoesMenores = $('#automatic-scale-smaller-button');
		var $selectFonteBotoesMenores = $('#fonte_botao_menor');
		var $botaoGerarBotoesMenores = $('#botao_gerar_botoes_menores');
		var $divBotaoMenor = $('#smaller-button-conteiner');
		var $divTextoBotaoMenor = $divBotaoMenor.children('div.texto');

		// Proof / profile title fields
		var $inputTextoNome = $('#texto_nome');
		var $checkboxLoteNome = $('#lote_nome');
		var $textareaTextoNomeLote = $('#texto_nome_lote');
		var $selectPlataformaNome = $('#plataforma_nome');
		var $checkboxEscalaAutomaticaNomes = $('#escala_automatica_nome');
		var $selectFonteNome = $('#fonte_nome');
		var $selectFonteNomeDS = $('#fonte_nome_ds');
		var $botaoGerarNome = $('#botao_gerar_nome');
		var $divNome = $('#proof-profile-title-conteiner');
		var $divTextoNome = $divNome.children('div.texto');

		// Proof / profile subtitle fields
		var $textareaSubtitulo = $('#texto_subtitulo');
		var $checkboxLoteSubtitulo = $('#lote_subtitulo');
		var $selectPlataformaSubtitulo = $('#plataforma_subtitulo');
		var $checkboxEscalaAutomaticaSubtitulos = $('#escala_automatica_subtitulo');
		var $selectFonteSubtitulo = $('#fonte_subtitulo');
		var $botaoGerarSubtitulo = $('#botao_gerar_subtitulo');
		var $divSubtitulo = $('#proof-profile-subtitle-conteiner');
		var $divTextoSubtitulo = $divSubtitulo.children('div.texto');

		// Proof / profile description fields
		var $textareaDescricao = $('#texto_descricao');
		var $checkboxLoteDescricao = $('#lote_descricao');
		var $selectPlataformaDescricao = $('#plataforma_descricao');
		var $checkboxEscalaAutomaticaDescricoes = $('#escala_automatica_descricao');
		var $selectFonteDescricao = $('#fonte_descricao');
		var $selectFonteDescricaoDS = $('#fonte_descricao_ds');
		var $botaoGerarDescricao = $('#botao_gerar_descricao');
		var $divDescricao = $('#proof-profile-description-conteiner');
		var $divTextoDescricao = $divDescricao.children('div.texto');

		// Sandbox fields
		var $inputTextoBotaoSandbox1 = $('#texto_botoes_sandbox1');
		var $inputTextoBotaoSandbox2 = $('#texto_botoes_sandbox2');
		var $inputTextoBotaoSandbox3 = $('#texto_botoes_sandbox3');
		var $selectPlataformaBotaoSandbox = $('#plataforma_botoes_sandbox');
		var $inputTextoBotaoMenorSandbox1 = $('#texto_botoes_menores_sandbox1');
		var $inputTextoBotaoMenorSandbox2 = $('#texto_botoes_menores_sandbox2');
		var $inputTextoBotaoMenorSandbox3 = $('#texto_botoes_menores_sandbox3');
		var $inputTextoBotaoMenorSandbox4 = $('#texto_botoes_menores_sandbox4');
		var $selectPlataformaBotaoMenorSandbox = $('#plataforma_botoes_menores_sandbox');
		var $inputTextoNomeSandbox = $('#texto_nome_sandbox');
		var $textareaSubtituloSandbox = $('#texto_subtitulo_sandbox');
		var $textareaDescricaoSandbox = $('#texto_descricao_sandbox');
		var $selectPlataformaProvasPerfisSandbox = $('#plataforma_provas_perfis_sandbox');
		var $divBotoesSandbox = $('#button-conteiner-sandbox');
		var $divTextoBotoesSandbox1 = $divBotoesSandbox.children('div.botao1');
		var $divTextoBotoesSandbox2 = $divBotoesSandbox.children('div.botao2');
		var $divTextoBotoesSandbox3 = $divBotoesSandbox.children('div.botao3');
		var $divBotoesMenoresSandbox = $('#smaller-button-conteiner-sandbox');
		var $divTextoBotoesMenoresSandbox1 = $divBotoesMenoresSandbox.children('div.botao1');
		var $divTextoBotoesMenoresSandbox2 = $divBotoesMenoresSandbox.children('div.botao2');
		var $divTextoBotoesMenoresSandbox3 = $divBotoesMenoresSandbox.children('div.botao3');
		var $divTextoBotoesMenoresSandbox4 = $divBotoesMenoresSandbox.children('div.botao4');
		var $divProvaSubtituloSandbox = $('#proof-profile-subtitle-conteiner-sandbox');
		var $divTextoNomeSandbox = $divProvaSubtituloSandbox.children('div.nome');
		var $divTextoSubtituloSandbox = $divProvaSubtituloSandbox.children('div.subtitulo');
		var $divTextoDescricaoSandbox = $divProvaSubtituloSandbox.children('div.descricao');
		var $botaoGerarSandbox1 = $('#botao_gerar_sandbox_1');
		var $botaoGerarSandbox2 = $('#botao_gerar_sandbox_2');
		var $botaoGerarSandbox3 = $('#botao_gerar_sandbox_3');

		// Events from language selection fields
		$ulListaIdiomas.find('a').on('click', function(e){
			var $a = $(this);
			var idioma = ( $a.attr('href') ).replace('#', '');
			var imagem = $a.children('img').attr('src');
			var nome_idioma = $a.children('span').html();

			$imgBandeira.attr('src', imagem);
			$spanNomeIdioma.attr('data-valor', idioma).html(nome_idioma);

			removeAllLanguageScripts();
			addLanguageScript(idioma, updateLanguage);

			e.preventDefault();
		});
		
		// Evento dos campos de seleção de temas
		$ulListaTemas.find('a').on('click', function(e){
			var $a = $(this);
			var tema = ( $a.attr('href') ).replace('#', '');
			
			$("body").removeClass('light dark').addClass(tema);
		});

		// Definindo textos do idioma padrão (Português)
		updateLanguage();

		// Definindo texto padrão para os campos
		$inputTextoBotoes.attr('value', 'Phoenix Wright');
		$textareaTextoBotoesLote.html('Phoenix Wright\nLarry Butz\nMia Fey');
		$inputTextoBotoesMenores.attr('value', "Chief's Office");
		$textareaTextoBotoesMenoresLote.html('Detention Center\nFey & Co. Law Offices\nGrossberg Law Offices\nGatewater Hotel');
		$inputTextoNome.attr('value', 'Fingerprinting Set');
		$textareaTextoNomeLote.html('Attorney\'s Badge\nCindy\'s Autopsy Report\nStatue / The Thinker\nPassport');
		$textareaSubtitulo.html('Age: 27\nGender: Female');
		$textareaDescricao.html('Time of death: 9/5 at 9:00 PM.\nCause: single blunt force trauma.\nDeath was instantaneous.');
		$inputTextoBotaoSandbox1.attr('value', 'Aline Sato');
		$inputTextoBotaoSandbox2.attr('value', 'Cíntia Muito');
		$inputTextoBotaoSandbox3.attr('value', 'Cíntia Rocha');
		$inputTextoBotaoMenorSandbox1.attr('value', 'Sato Advogados');
		$inputTextoBotaoMenorSandbox2.attr('value', 'Hotel Aguajarú');
		$inputTextoBotaoMenorSandbox3.attr('value', 'Massafera Advocacia');
		$inputTextoBotaoMenorSandbox4.attr('value', 'Zulcorp');
		$inputTextoNomeSandbox.attr('value', 'Aline Sato');
		$textareaSubtituloSandbox.html('Idade: 27\nGênero: Feminino');
		$textareaDescricaoSandbox.html('Advogada-chefe de Sato Advogados.\nMinha chefe e uma excelente\nadvogada de defesa.');

		// Evento do botão "Sobre este programa"
		$ancoraSobrePrograma.on('click', function(){
			var idioma = $spanNomeIdioma.attr('data-valor');
			var readme_page;
			if(idioma != 'en-us'){
				readme_page = 'README.' + idioma + '.md';
			} else {
				readme_page = 'README.md';
			}
			var url_github = 'https://github.com/leomontenegro6/aaig/blob/master/' + readme_page;
			
			var checkAcessandoViaElectron = (typeof process == 'object');
			
			if(checkAcessandoViaElectron){
				var shell = require('electron').shell;
				shell.openExternal(url_github);
			} else {
				window.open(url_github);
			}
		});

		// Eventos dos campos de texto
		$inputTextoBotoes.on('keyup', function(){
			var texto = this.value;
			var checkAutomaticScale = $checkboxEscalaAutomaticaBotoes.is(':checked');
			updatePreviewText($divTextoBotao, texto, checkAutomaticScale);
		});
		$inputTextoBotoesMenores.on('keyup', function(){
			var texto = this.value;
			var checkAutomaticScale = $checkboxEscalaAutomaticaBotoesMenores.is(':checked');
			updatePreviewText($divTextoBotaoMenor, texto, checkAutomaticScale);
		});
		$inputTextoNome.on('keyup', function(){
			var texto = this.value;
			var plataforma = $selectPlataformaNome.val();
			
			if(plataforma == '3ds'){
				var checkAutomaticScale = $checkboxEscalaAutomaticaNomes.is(':checked');
				
				texto = texto.replace(/\n/g, '<br />');
				updatePreviewText($divTextoNome, texto, checkAutomaticScale);
			} else {
				updatePreviewSprites($divTextoNome, texto);
			}
		});
		$textareaSubtitulo.on({
			'keyup': function(){
				var texto = this.value;
				var plataforma = $selectPlataformaSubtitulo.val();
				
				var checkEmLote = $checkboxLoteSubtitulo.is(':checked');
				var checkAutomaticScale = $checkboxEscalaAutomaticaSubtitulos.is(':checked');
				
				if(checkEmLote){
					var inicio_selecao = this.selectionStart;
					var numero_bloco = (texto.substr(0, inicio_selecao).split(/\n\n/).length) - 1;

					// Separando texto por blocos, tomando por base
					// duas quebras-de-linha consecutivas
					var blocos = texto.split(/\n\n/);
					var bloco_atual = $.trim( blocos[numero_bloco] );

					// Atualizando prévia de subtítulos do bloco atual
					if(plataforma == '3ds'){
						bloco_atual = bloco_atual.replace(/\n/g, '<br />');
						updatePreviewText($divTextoSubtitulo, bloco_atual, checkAutomaticScale);
					} else {
						updatePreviewSprites($divTextoSubtitulo, bloco_atual, 'n');
					}
				} else {
					if(plataforma == '3ds'){
						texto = texto.replace(/\n/g, '<br />');
						updatePreviewText($divTextoSubtitulo, texto, checkAutomaticScale);
					} else {
						updatePreviewSprites($divTextoSubtitulo, texto);
					}
				}
			},
			'click': function(){
				$(this).trigger('keyup');
			}
		});
		$textareaDescricao.on({
			'keyup': function(){
				var texto = this.value;
				var plataforma = $selectPlataformaDescricao.val();
				
				var checkEmLote = $checkboxLoteDescricao.is(':checked');
				var checkAutomaticScale = $checkboxEscalaAutomaticaDescricoes.is(':checked');
				
				if(checkEmLote){
					var inicio_selecao = this.selectionStart;
					var numero_bloco = (texto.substr(0, inicio_selecao).split(/\n\n/).length) - 1;

					// Separando texto por blocos, tomando por base
					// duas quebras-de-linha consecutivas
					var blocos = texto.split(/\n\n/);
					var bloco_atual = $.trim( blocos[numero_bloco] );

					// Atualizando prévia de descrições do bloco atual
					if(plataforma == '3ds'){
						bloco_atual = bloco_atual.replace(/\n/g, '<br />');
						updatePreviewText($divTextoDescricao, bloco_atual, checkAutomaticScale);
					} else {
						updatePreviewSprites($divTextoDescricao, bloco_atual);
					}
				} else {
					if(plataforma == '3ds'){
						texto = texto.replace(/\n/g, '<br />');
						updatePreviewText($divTextoDescricao, texto, checkAutomaticScale);
					} else {
						updatePreviewSprites($divTextoDescricao, texto);
					}
				}
			},
			'click': function(){
				$(this).trigger('keyup');
			}
		});
		$inputTextoBotaoSandbox1.on('keyup', function(){
			var texto = this.value;
			updatePreviewText($divTextoBotoesSandbox1, texto, true, 1);
		});
		$inputTextoBotaoSandbox2.on('keyup', function(){
			var texto = this.value;
			updatePreviewText($divTextoBotoesSandbox2, texto, true, 1);
		});
		$inputTextoBotaoSandbox3.on('keyup', function(){
			var texto = this.value;
			updatePreviewText($divTextoBotoesSandbox3, texto, true, 1);
		});
		$inputTextoBotaoMenorSandbox1.on('keyup', function(){
			var texto = this.value;
			updatePreviewText($divTextoBotoesMenoresSandbox1, texto, true, 0.99);
		});
		$inputTextoBotaoMenorSandbox2.on('keyup', function(){
			var texto = this.value;
			updatePreviewText($divTextoBotoesMenoresSandbox2, texto, true, 0.99);
		});
		$inputTextoBotaoMenorSandbox3.on('keyup', function(){
			var texto = this.value;
			updatePreviewText($divTextoBotoesMenoresSandbox3, texto, true, 0.99);
		});
		$inputTextoBotaoMenorSandbox4.on('keyup', function(){
			var texto = this.value;
			updatePreviewText($divTextoBotoesMenoresSandbox4, texto, true, 0.99);
		});
		$inputTextoNomeSandbox.on('keyup', function(){
			var texto = this.value;
			var plataforma = $selectPlataformaProvasPerfisSandbox.val();
			
			if(plataforma == 'ds'){
				var $divTexto = $('<div />').addClass('texto');
				$divTextoNomeSandbox.html($divTexto).css('transform', 'none');
				
				updatePreviewSprites($divTexto, texto, 'a', function(checkLimitExceeded){
					if(checkLimitExceeded){
						$divTexto.addClass('vermelho');
					} else {
						$divTexto.removeClass('vermelho');
					}
				});
			} else {
				updatePreviewText($divTextoNomeSandbox, texto, true, 1);
			}
		});
		$textareaSubtituloSandbox.on('keyup', function(){
			var texto = this.value;
			var plataforma = $selectPlataformaProvasPerfisSandbox.val();
			
			if(plataforma == 'ds'){
				var $divTexto = $('<div />').addClass('texto');
				$divTextoSubtituloSandbox.html($divTexto).css('transform', 'none');
				
				updatePreviewSprites($divTexto, texto);
			} else {
				texto = texto.replace(/\n/g, '<br />');
				updatePreviewText($divTextoSubtituloSandbox, texto, true, 1);
			}
		});
		$textareaDescricaoSandbox.on('keyup', function(){
			var texto = this.value;
			var plataforma = $selectPlataformaProvasPerfisSandbox.val();
			
			if(plataforma == 'ds'){
				var $divTexto = $('<div />').addClass('texto');
				$divTextoDescricaoSandbox.html($divTexto).css('transform', 'none');
				
				updatePreviewSprites($divTexto, texto, 'a');
			} else {
				texto = texto.replace(/\n/g, '<br />');
				updatePreviewText($divTextoDescricaoSandbox, texto, true, 1);
			}
		});
		
		// Eventos dos campos referentes a geração de imagens em lote
		/* Botões */
		$checkboxLoteBotoes.on('change', function(){
			var $checkbox = $(this);
			
			if($checkbox.is(':checked')){
				$inputTextoBotoes.hide();
				$textareaTextoBotoesLote.show().trigger('keyup');
			} else {
				$inputTextoBotoes.show().trigger('keyup');
				$textareaTextoBotoesLote.hide();
			}
		});
		$textareaTextoBotoesLote.on({
			'keyup': function(){
				var texto = this.value;
				var inicio_selecao = this.selectionStart;
				var numero_linha = (texto.substr(0, inicio_selecao).split(/\n/).length) - 1;

				// Separando texto por quebras-de-linha
				var linhas = texto.split(/\n/);
				var linha_atual = linhas[numero_linha];
				var checkAutomaticScale = $checkboxEscalaAutomaticaBotoes.is(':checked');

				// Atualizando prévia de botões da linha atual
				updatePreviewText($divTextoBotao, linha_atual, checkAutomaticScale);
			},
			'click': function(){
				$textareaTextoBotoesLote.trigger('keyup');
			}
		});
		/* Botões Menores */
		$checkboxLoteBotoesMenores.on('change', function(){
			var $checkbox = $(this);
			
			if($checkbox.is(':checked')){
				$inputTextoBotoesMenores.hide();
				$textareaTextoBotoesMenoresLote.show().trigger('keyup');
			} else {
				$inputTextoBotoesMenores.show().trigger('keyup');
				$textareaTextoBotoesMenoresLote.hide();
			}
		});
		$textareaTextoBotoesMenoresLote.on({
			'keyup': function(){
				var texto = this.value;
				var inicio_selecao = this.selectionStart;
				var numero_linha = (texto.substr(0, inicio_selecao).split(/\n/).length) - 1;

				// Separando texto por quebras-de-linha
				var linhas = texto.split(/\n/);
				var linha_atual = linhas[numero_linha];
				var checkAutomaticScale = $checkboxEscalaAutomaticaBotoesMenores.is(':checked');

				// Atualizando prévia de botões menores da linha atual
				updatePreviewText($divTextoBotaoMenor, linha_atual, checkAutomaticScale);
			},
			'click': function(){
				$textareaTextoBotoesMenoresLote.trigger('keyup');
			}
		});
		/* Nomes de Provas / Perfis*/
		$checkboxLoteNome.on('change', function(){
			var $checkbox = $(this);
			
			if($checkbox.is(':checked')){
				$inputTextoNome.hide();
				$textareaTextoNomeLote.show().trigger('keyup');
			} else {
				$inputTextoNome.show().trigger('keyup');
				$textareaTextoNomeLote.hide();
			}
		});
		$textareaTextoNomeLote.on({
			'keyup': function(){
				var texto = this.value;
				var inicio_selecao = this.selectionStart;
				var numero_linha = (texto.substr(0, inicio_selecao).split(/\n/).length) - 1;

				// Separando texto por quebras-de-linha
				var linhas = texto.split(/\n/);
				var linha_atual = linhas[numero_linha];
				var plataforma = $selectPlataformaNome.val();
				var checkAutomaticScale = $checkboxEscalaAutomaticaNomes.is(':checked');

				// Atualizando prévia de nomes da linha atual
				if(plataforma == 'ds'){
					updatePreviewSprites($divTextoNome, linha_atual);
				} else {
					updatePreviewText($divTextoNome, linha_atual, checkAutomaticScale);
				}
			},
			'click': function(){
				$textareaTextoNomeLote.trigger('keyup');
			}
		});
		/* Subtítulos de Provas / Perfis*/
		$checkboxLoteSubtitulo.on('change', function(){
			var $checkbox = $(this);
			
			var linhas;
			if($checkbox.is(':checked')){
				linhas = 10;
			} else {
				linhas = 3;
			}
			
			$textareaSubtitulo.attr('rows', linhas).trigger('keyup');
		});
		
		/* Descrições de Provas / Perfis*/
		$checkboxLoteDescricao.on('change', function(){
			var $checkbox = $(this);
			
			var linhas;
			if($checkbox.is(':checked')){
				linhas = 10;
			} else {
				linhas = 3;
			}
			
			$textareaDescricao.attr('rows', linhas).trigger('keyup');
		});

		// Eventos dos campos de plataforma
		/* Botões */
		$selectPlataformaBotoes.on('change', function(){
			var $checkboxEscalaAutomatica = $('#automatic-scale-button');
			var $campoEscala = $('#escala_botao');
			var $campoTamanhoFonte = $('#tamanho_fonte_botao');
			var $campoMargemSuperior = $('#margem_superior_botao');
			var $campoMargemEsquerdo = $('#margem_esquerdo_botao');
			var $previa = $('#previa_botoes');
			var $divTexto = $previa.find('div.texto');
			var $divConteiner = $divTexto.parent();
			var $imgPreenchida = $previa.find('img.button-template');
			var plataforma = this.value;

			if(plataforma == 'ds'){
				$campoTamanhoFonte.val(18);
				$campoMargemSuperior.slider('setAttribute', 'min', -30).slider('setAttribute', 'max', 60).slider('setValue', 4);
				$campoMargemEsquerdo.slider('setAttribute', 'min', -30).slider('setAttribute', 'max', 60).slider('setValue', 16);
				$divConteiner.attr('id', 'conteiner_botao_ds');
				$divTexto.attr('data-width', '224');
				$imgPreenchida.attr('src', 'images/background_botoes_preenchido_ds.png');
			} else {
				$campoTamanhoFonte.val(23);
				$campoMargemSuperior.slider('setAttribute', 'min', -5).slider('setAttribute', 'max', 30).slider('setValue', 0);
				$campoMargemEsquerdo.slider('setAttribute', 'min', -5).slider('setAttribute', 'max', 30).slider('setValue', 0);
				$divConteiner.attr('id', 'conteiner_botao');
				$divTexto.attr('data-width', '280');
				$imgPreenchida.attr('src', 'images/background_botoes_preenchido.png');
			}
			
			// Atualizando outros campos de formulário, após a mudança de plataforma
			$campoTamanhoFonte.add($campoMargemSuperior).add($campoMargemEsquerdo).trigger('change');
			if($checkboxEscalaAutomatica.is(':checked')){
				$checkboxEscalaAutomatica.trigger('change');
			} else {
				$campoEscala.trigger('change');
			}
			
		})
		/* Botões Menores */
		$selectPlataformaBotoesMenores.on('change', function(){
			var $checkboxEscalaAutomatica = $('#automatic-scale-smaller-button');
			var $campoEscala = $('#escala_botao_menor');
			var $campoTamanhoFonte = $('#tamanho_fonte_botao_menor');
			var $campoMargemSuperior = $('#margem_superior_botao_menor');
			var $previa = $('#previa_botoes_menores');
			var $divTexto = $previa.find('div.texto');
			var $divConteiner = $divTexto.parent();
			var $imgPreenchida = $previa.find('img.button-template');
			var plataforma = this.value;

			if(plataforma == 'ds'){
				$campoTamanhoFonte.val(18);
				$campoMargemSuperior.slider('setValue', 4);
				$divConteiner.attr('id', 'smaller-button-conteiner_ds');
				$divTexto.attr('data-width', '128');
				$imgPreenchida.attr('src', 'images/background_botoes_menores_preenchido_ds.png');
			} else {
				$campoTamanhoFonte.val(23);
				$campoMargemSuperior.slider('setValue', 0);
				$divConteiner.attr('id', 'smaller-button-conteiner');
				$divTexto.attr('data-width', '160');
				$imgPreenchida.attr('src', 'images/background_botoes_menores_preenchido.png');
			}
			
			// Atualizando outros campos de formulário, após a mudança de plataforma
			$campoTamanhoFonte.add($campoMargemSuperior).trigger('change');
			if($checkboxEscalaAutomatica.is(':checked')){
				$checkboxEscalaAutomatica.trigger('change');
			} else {
				$campoEscala.trigger('change');
			}
		})
		/* Nomes de Provas / Perfis */
		$selectPlataformaNome.on('change', function(){
			var $checkboxEscalaAutomatica = $('#escala_automatica_nome');
			var $campoEscala = $('#escala_nome');
			var $conteinerCampoEscala = $campoEscala.closest('div.form-inline');
			var $campoFonte = $('#fonte_nome');
			var $campoTamanhoFonte = $('#tamanho_fonte_nome');
			var $conteinerCampoFonte = $campoFonte.closest('div.form-inline');
			var $campoFonteDS = $('#fonte_nome_ds');
			var $conteinerCampoFonteDS = $campoFonteDS.closest('div.form-inline');
			var $campoMargemSuperior = $('#margem_superior_nome');
			var $previa = $('#previa_nomes');
			var $divTexto = $previa.find('div.texto');
			var $divConteiner = $divTexto.parent();
			var $imgPreenchida = $previa.find('img.button-template');
			var plataforma = this.value;

			if(plataforma == 'ds'){
				$campoEscala.slider('setValue', 1);
				$campoFonte.val('Ace Attorney US');
				$campoFonteDS.val('a');
				$campoTamanhoFonte.val(15);
				$campoMargemSuperior.slider('setValue', 1);
				$divConteiner.addClass('sprites_nomes_ds');
				$divTexto.attr('data-width', '128');
				$imgPreenchida.attr('src', 'images/background_nomes_preenchido_ds.png');
				
				// Alternando campo de fonte para a versão de DS
				$conteinerCampoFonte.hide('fast');
				$conteinerCampoFonteDS.show('fast');
				
				// Ocultando campo de escala
				$conteinerCampoEscala.hide('fast');
			} else {
				$campoEscala.slider('setValue', 1.045);
				$campoFonte.val('Vald Book');
				$campoTamanhoFonte.val(18);
				$campoMargemSuperior.slider('setValue', -2);
				$divConteiner.removeClass('sprites_nomes_ds');
				$divTexto.attr('data-width', '160');
				$imgPreenchida.attr('src', 'images/proof_profile_title_bg_filled.png');
				
				// Alternando campo de fonte para a versão de 3DS
				$conteinerCampoFonte.show('fast');
				$conteinerCampoFonteDS.hide('fast');
				
				// Exibindo campo de escala
				$conteinerCampoEscala.show('fast');
			}
			$campoTamanhoFonte.add($campoFonte).add($campoFonteDS).add($campoMargemSuperior).trigger('change');
			if($checkboxEscalaAutomatica.is(':checked') && (plataforma != 'ds')){
				$checkboxEscalaAutomatica.trigger('change');
			} else {
				$campoEscala.trigger('change');
			}
			$inputTextoNome.trigger('keyup');
		});
		/* Subtítulos de Provas / Perfis */
		$selectPlataformaSubtitulo.on('change', function(){
			var $campoEscala = $('#escala_subtitulo');
			var $conteinerCampoEscala = $campoEscala.closest('div.form-inline');
			var $campoFonte = $('#fonte_subtitulo');
			var $campoTamanhoFonte = $('#tamanho_fonte_subtitulo');
			var $conteinerCampoFonte = $campoFonte.closest('div.form-inline');
			var $campoMargemSuperior = $('#margem_superior_subtitulo');
			var $campoAlturaLinha = $('#altura_linha_subtitulo');
			var $previa = $('#previa_subtitulos');
			var $divTexto = $previa.find('div.texto');
			var $divConteiner = $divTexto.parent();
			var $imgPreenchida = $previa.find('img.button-template');
			var plataforma = this.value;

			if(plataforma == 'ds'){
				$campoEscala.slider('setValue', 1);
				$campoFonte.val('Pixel Arial');
				$campoTamanhoFonte.val(8);
				$campoMargemSuperior.slider('setValue', 2);
				$campoAlturaLinha.slider('setValue', 1.95);
				$divConteiner.addClass('sprites_subtitulos_ds');
				$divTexto.attr('data-width', '128');
				$imgPreenchida.attr('src', 'images/background_subtitulos_preenchido_ds.png');
				
				// Ocultando campos de escala e fonte
				$conteinerCampoFonte.add($conteinerCampoEscala).hide('fast');
			} else {
				$campoEscala.slider('setValue', 1);
				$campoFonte.val('Vald Book');
				$campoTamanhoFonte.val(14);
				$campoMargemSuperior.slider('setValue', 4);
				$campoAlturaLinha.slider('setValue', 1.35);
				$divConteiner.removeClass('sprites_subtitulos_ds');
				$divTexto.attr('data-width', '160');
				$imgPreenchida.attr('src', 'images/proof_profile_subtitle_bg_filled.png');
				
				// Desocultando campos de escala e fonte
				$conteinerCampoFonte.add($conteinerCampoEscala).show('fast');
			}
			$campoEscala.add($campoTamanhoFonte).add($campoFonte).add($campoMargemSuperior).add($campoAlturaLinha).trigger('change');
			$textareaSubtitulo.trigger('keyup');
		});
		/* Descrições de Provas / Perfis */
		$selectPlataformaDescricao.on('change', function(){
			var $campoEscala = $('#escala_descricao');
			var $conteinerCampoEscala = $campoEscala.closest('div.form-inline');
			var $campoFonte = $('#fonte_descricao');
			var $campoTamanhoFonte = $('#tamanho_fonte_descricao');
			var $conteinerCampoFonte = $campoFonte.closest('div.form-inline');
			var $campoFonteDS = $('#fonte_descricao_ds');
			var $conteinerCampoFonteDS = $campoFonteDS.closest('div.form-inline');
			var $campoAlturaLinha = $('#altura_linha_descricao');
			var $campoMargemSuperior = $('#margem_superior_descricao');
			var $campoMargemEsquerda = $('#margem_esquerdo_descricao');
			var $previa = $('#previa_descricoes');
			var $divTexto = $previa.find('div.texto');
			var $divConteiner = $divTexto.parent();
			var $imgPreenchida = $previa.find('img.button-template');
			var plataforma = this.value;

			if(plataforma == 'ds'){
				$campoEscala.slider('setValue', 1);
				$campoFonte.val('Ace Attorney US');
				$campoTamanhoFonte.val(16);
				$campoAlturaLinha.slider('setValue', 1);
				$campoMargemSuperior.slider('setValue', 0);
				$campoMargemEsquerda.slider('setValue', 18);
				$divConteiner.addClass('sprites_descricoes_ds');
				$divTexto.attr('data-width', '238');
				$imgPreenchida.attr('src', 'images/background_descricao_preenchido_ds.png');
				
				// Alternando campo de fonte para a versão de DS
				$conteinerCampoFonte.hide('fast');
				$conteinerCampoFonteDS.show('fast');
				
				// Ocultando campo de escala
				$conteinerCampoEscala.hide('fast');
			} else {
				$campoEscala.slider('setValue', 1.075);
				$campoFonte.val('Vald Book');
				$campoTamanhoFonte.val(14);
				$campoAlturaLinha.slider('setValue', 1.35);
				$campoMargemSuperior.slider('setValue', 3);
				$campoMargemEsquerda.slider('setValue', 23);
				$divConteiner.removeClass('sprites_descricoes_ds');
				$divTexto.attr('data-width', '256');
				$imgPreenchida.attr('src', 'images/background_descricao_preenchido.png');
				
				// Alternando campo de fonte para a versão de 3DS
				$conteinerCampoFonte.show('fast');
				$conteinerCampoFonteDS.hide('fast');
				
				// Exibindo campo de escala
				$conteinerCampoEscala.show('fast');
			}
			$campoEscala.add($campoTamanhoFonte).add($campoFonte).add($campoFonteDS).add($campoAlturaLinha).add($campoMargemSuperior).add($campoMargemEsquerda).trigger('change');
			$textareaDescricao.trigger('keyup');
		});
		/* Sandbox */
		$selectPlataformaBotaoSandbox.on('change', function(){
			var plataforma = this.value;
			if(plataforma == 'ds'){
				$divBotoesSandbox.addClass('ds');
			} else {
				$divBotoesSandbox.removeClass('ds');
			}
			
			$inputTextoBotaoSandbox1.add($inputTextoBotaoSandbox2).add($inputTextoBotaoSandbox3).trigger('keyup');
		});
		$selectPlataformaBotaoMenorSandbox.on('change', function(){
			var plataforma = this.value;
			if(plataforma == 'ds'){
				$divBotoesMenoresSandbox.addClass('ds');
			} else {
				$divBotoesMenoresSandbox.removeClass('ds');
			}
			
			$inputTextoBotaoMenorSandbox1.add($inputTextoBotaoMenorSandbox2).add($inputTextoBotaoMenorSandbox3).add($inputTextoBotaoMenorSandbox4).trigger('keyup');
		});
		$selectPlataformaProvasPerfisSandbox.on('change', function(){
			var plataforma = this.value;
			if(plataforma == 'ds'){
				$divProvaSubtituloSandbox.addClass('ds');
				$divTextoNomeSandbox.addClass('sprites_nomes_ds');
				$divTextoSubtituloSandbox.addClass('sprites_subtitulos_ds');
				$divTextoDescricaoSandbox.addClass('sprites_descricoes_ds');
			} else {
				$divProvaSubtituloSandbox.removeClass('ds');
				$divTextoNomeSandbox.removeClass('sprites_nomes_ds');
				$divTextoSubtituloSandbox.removeClass('sprites_subtitulos_ds');
				$divTextoDescricaoSandbox.removeClass('sprites_descricoes_ds');
			}
			
			$inputTextoNomeSandbox.add($textareaSubtituloSandbox).add($textareaDescricaoSandbox).trigger('keyup');
		});
		
		// Implementando troca de botões + e - nos accordions de personalizações visuais
		$('.panel-group').on('hide.bs.collapse show.bs.collapse', toggleAccordionIcon);

		// Instanciando checkboxes de escala automática
		/* Botões */
		$checkboxEscalaAutomaticaBotoes.on('change', function(){
			var $checkbox = $(this);
			var $campoEscala = $('#escala_botao');
			
			if($checkbox.is(':checked')){
				$campoEscala.slider('setValue', 1).slider("disable");
				$inputTextoBotoes.trigger('keyup');
			} else {
				$campoEscala.slider("enable").slider('setValue', 1).trigger('change');
			}
		});
		/* Botões Menores */
		$checkboxEscalaAutomaticaBotoesMenores.on('change', function(){
			var $checkbox = $(this);
			var $campoEscala = $('#escala_botao_menor');
			
			if($checkbox.is(':checked')){
				$campoEscala.slider('setValue', 1).slider("disable");
				$inputTextoBotoesMenores.trigger('keyup');
			} else {
				$campoEscala.slider("enable").slider('setValue', 1).trigger('change');
			}
		});
		/* Nomes de Provas / Perfis */
		$checkboxEscalaAutomaticaNomes.on('change', function(){
			var $checkbox = $(this);
			var $campoEscala = $('#escala_nome');
			
			if($checkbox.is(':checked')){
				$campoEscala.slider('setValue', 1).slider("disable");
				$inputTextoNome.trigger('keyup');
			} else {
				$campoEscala.slider("enable").slider('setValue', 1).trigger('change');
			}
		});
		/* Subtítulos de Provas / Perfis */
		$checkboxEscalaAutomaticaSubtitulos.on('change', function(){
			var $checkbox = $(this);
			var $campoEscala = $('#escala_subtitulo');
			
			if($checkbox.is(':checked')){
				$campoEscala.slider('setValue', 1).slider("disable");
				$textareaDescricao.trigger('keyup');
			} else {
				$campoEscala.slider("enable").slider('setValue', 1).trigger('change');
			}
		});
		/* Descrições de Provas / Perfis */
		$checkboxEscalaAutomaticaDescricoes.on('change', function(){
			var $checkbox = $(this);
			var $campoEscala = $('#escala_descricao');
			
			if($checkbox.is(':checked')){
				$campoEscala.slider('setValue', 1).slider("disable");
				$textareaDescricao.trigger('keyup');
			} else {
				$campoEscala.slider("enable").slider('setValue', 1).trigger('change');
			}
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
					
					definePreviewScale($divTexto, escala);

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
		
		// Configurando campos de exibir / ocultar a imagem comparativa na prévia
		$("input[type='checkbox'][name^='mostrar_comparativo']").on('change', function(){
			var $checkbox = $(this);
			var $divConteiner = $("[id^='" + $checkbox.attr('data-imagem') + "']");
			var $imgComparativo = $divConteiner.siblings('img.button-template');
			
			if($checkbox.is(':checked')){
				$imgComparativo.show();
			} else {
				$imgComparativo.hide();
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
		$.get('fonts.html', function(f){
			$.get('proprietary-fonts.html').always(function(fp) {
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
		
		// Configurando campos de alteração de estilo de fonte via sprites (DS)
		$selectFonteNomeDS.on('change', function(){
			var $selectFonte = $(this);
			
			var fonte = $selectFonte.val();
			var name = $selectFonte.attr('name');
			
			if(name == 'fonte_nome_ds'){
				var $divConteiner = $('.sprites_nomes_ds');
				
				if(fonte == 'c'){
					$divConteiner.addClass('condensed').removeClass('extra-condensed');
				} else if(fonte == 'ec'){
					$divConteiner.addClass('extra-condensed').removeClass('condensed');
				} else {
					$divConteiner.removeClass('condensed extra-condensed');
				}
			}
		});
		$selectFonteDescricaoDS.on('change', function(){
			var $selectFonte = $(this);
			
			var fonte = $selectFonte.val();
			var name = $selectFonte.attr('name');
			
			if(name == 'fonte_descricao_ds'){
				var $divConteiner = $('.sprites_descricoes_ds');
				
				if(fonte == 'c'){
					$divConteiner.addClass('condensed').removeClass('extra-condensed');
				} else if(fonte == 'ec'){
					$divConteiner.addClass('extra-condensed').removeClass('condensed');
				} else {
					$divConteiner.removeClass('condensed extra-condensed');
				}
			}
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
			var texto;
			var checkAutomaticScale = $checkboxEscalaAutomaticaBotoes.is(':checked');
			
			if($checkboxLoteBotoes.is(':checked')){
				texto = $textareaTextoBotoesLote.val();
				var linhas = texto.split(/\n/);
				batchRenderImages($divBotao, linhas, checkAutomaticScale);
			} else {
				texto = $inputTextoBotoes.val();
				renderImageOnBrowser($divBotao, texto);
			}
		});
		$botaoGerarBotoesMenores.on('click', function(){
			var texto;
			var checkAutomaticScale = $checkboxEscalaAutomaticaBotoesMenores.is(':checked');
			
			if($checkboxLoteBotoesMenores.is(':checked')){
				texto = $textareaTextoBotoesMenoresLote.val();
				var linhas = texto.split(/\n/);
				batchRenderImages($divBotaoMenor, linhas, checkAutomaticScale);
			} else {
				texto = $inputTextoBotoesMenores.val();
				renderImageOnBrowser($divBotaoMenor, texto);
			}
		});
		$botaoGerarNome.on('click', function(){
			var texto;
			var plataforma = $selectPlataformaNome.val();
			var checkAutomaticScale = ($checkboxEscalaAutomaticaNomes.is(':checked') && (plataforma != 'ds'));
			
			if($checkboxLoteNome.is(':checked')){
				texto = $textareaTextoNomeLote.val();
				var linhas = texto.split(/\n/);
				batchRenderImages($divNome, linhas, checkAutomaticScale);
			} else {
				texto = $inputTextoNome.val();
				renderImageOnBrowser($divNome, texto);
			}
		});
		$botaoGerarSubtitulo.on('click', function(){
			var texto = $textareaSubtitulo.val();
			var plataforma = $selectPlataformaSubtitulo.val();
			var checkAutomaticScale = ($checkboxEscalaAutomaticaSubtitulos.is(':checked') && (plataforma != 'ds'));
			
			if($checkboxLoteSubtitulo.is(':checked')){
				var blocos = texto.split(/\n\n/);
				batchRenderImages($divSubtitulo, blocos, checkAutomaticScale);
			} else {
				renderImageOnBrowser($divSubtitulo, texto);
			}
		});
		$botaoGerarDescricao.on('click', function(){
			var texto = $textareaDescricao.val();
			var plataforma = $selectPlataformaDescricao.val();
			var checkAutomaticScale = ($checkboxEscalaAutomaticaDescricoes.is(':checked') && (plataforma != 'ds'));
			
			if($checkboxLoteDescricao.is(':checked')){
				var blocos = texto.split(/\n\n/);
				
				$divDescricao.removeClass('brown-background');
				batchRenderImages($divDescricao, blocos, checkAutomaticScale, function(){
					$divDescricao.addClass('brown-background');
				});
			} else {
				$divDescricao.removeClass('brown-background');
				renderImageOnBrowser($divDescricao, texto, function(){
					$divDescricao.addClass('brown-background');
				});
			}
		});
		$botaoGerarSandbox1.on('click', function(){
			var data = new Date();
			data = new Date(data.getTime() - (data.getTimezoneOffset() * 60000)).toJSON()
			data = data.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');

			var texto = 'sandbox1-' + data;
			renderImageOnBrowser($divBotoesSandbox, texto);
		});
		$botaoGerarSandbox2.on('click', function(){
			var data = new Date();
			data = new Date(data.getTime() - (data.getTimezoneOffset() * 60000)).toJSON()
			data = data.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');

			var texto = 'sandbox2-' + data;
			renderImageOnBrowser($divBotoesMenoresSandbox, texto);
		});
		$botaoGerarSandbox3.on('click', function(){
			var data = new Date();
			data = new Date(data.getTime() - (data.getTimezoneOffset() * 60000)).toJSON()
			data = data.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');

			var texto = 'sandbox3-' + data;
			renderImageOnBrowser($divProvaSubtituloSandbox, texto);
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
		
		// Chamadas de eventos da aba "sandbox", chamados quando o
		// usuário clica na aba homônima
		$buttonTabSandbox.on('shown.bs.tab', function (e) {
			$inputTextoBotaoSandbox1.add($inputTextoBotaoSandbox2).add($inputTextoBotaoSandbox3).trigger('keyup');
			$inputTextoBotaoMenorSandbox1.add($inputTextoBotaoMenorSandbox2).add($inputTextoBotaoMenorSandbox3).add($inputTextoBotaoMenorSandbox4).trigger('keyup');
			$inputTextoNomeSandbox.add($textareaSubtituloSandbox).add($textareaDescricaoSandbox).trigger('keyup');
		});
	}
});