/* Javascript library containing methods related to Ace Attorney Image Generator
 * 
 */

function aaig(){
	// Properties
	this.configs = {};
	this.defaultConfigs = {
		'theme': 'light',
		'language': 'pt-br'
	};
	this.languageStrings = {}
	this.platformConfigs = {
		'button-conteiner': {
			'ds': {
				'font-size': 18,
				'margin-top': {
					'min': -30,
					'max': 60,
					'value': 4
				},
				'margin-left': {
					'min': -30,
					'max': 60,
					'value': 16
				},
				'conteiner-class': 'ds',
				'conteiner-text-width': 224,
				'comparative-image-src': 'images/button_bg_filled_ds.png',
				'trigger-change-scale-fields': true
			},
			'3ds': {
				'font-size': 23,
				'margin-top': {
					'min': -5,
					'max': 30,
					'value': 0
				},
				'margin-left': {
					'min': -5,
					'max': 30,
					'value': 0
				},
				'conteiner-class': '',
				'conteiner-text-width': 280,
				'comparative-image-src': 'images/button_bg_filled.png',
				'trigger-change-scale-fields': true
			}
		},
		'smaller-button-conteiner': {
			'ds': {
				'font-size': 18,
				'margin-top': {
					'value': 4
				},
				'conteiner-class': 'ds',
				'conteiner-text-width': 128,
				'comparative-image-src': 'images/smaller_button_bg_filled_ds.png',
				'trigger-change-scale-fields': true
			},
			'3ds': {
				'font-size': 23,
				'margin-top': {
					'value': 0
				},
				'conteiner-class': '',
				'conteiner-text-width': 160,
				'comparative-image-src': 'images/smaller_button_bg_filled.png',
				'trigger-change-scale-fields': true
			}
		},
		'proof-profile-title-conteiner': {
			'ds': {
				'scale': {
					'value': 1
				},
				'font-3ds': 'Ace Attorney US',
				'font-ds': 'a',
				'font-size': 15,
				'margin-top': {
					'value': 1
				},
				'conteiner-class': 'proof-profile-title-sprites-ds',
				'conteiner-text-width': 128,
				'comparative-image-src': 'images/proof_profile_title_bg_filled_ds.png',
				'show-font-3ds-field': false,
				'show-font-ds-field': true,
				'show-scale-field': false,
				'trigger-change-scale-fields': true,
				'trigger-keyup-text-fields': true
			},
			'3ds': {
				'scale': {
					'value': 1.045
				},
				'font-3ds': 'Vaud Book',
				'font-size': 18,
				'margin-top': {
					'value': -2
				},
				'conteiner-class': '',
				'conteiner-text-width': 160,
				'comparative-image-src': 'images/proof_profile_title_bg_filled.png',
				'show-font-3ds-field': true,
				'show-font-ds-field': false,
				'show-scale-field': true,
				'trigger-change-scale-fields': true,
				'trigger-keyup-text-fields': true
			}
		},
		'proof-profile-subtitle-conteiner': {
			'ds': {
				'scale': {
					'value': 1
				},
				'font-3ds': 'Pixel Arial',
				'font-size': 8,
				'margin-top': {
					'value': 2
				},
				'line-height': {
					'value': 1.95
				},
				'conteiner-class': 'proof-profile-subtitle-sprites-ds',
				'conteiner-text-width': 128,
				'comparative-image-src': 'images/proof_profile_subtitle_bg_filled_ds.png',
				'show-font-3ds-field': false,
				'show-scale-field': false,
				'trigger-keyup-text-fields': true
			},
			'3ds': {
				'scale': {
					'value': 1
				},
				'font-3ds': 'Vaud Book',
				'font-size': 14,
				'margin-top': {
					'value': 4
				},
				'line-height': {
					'value': 1.35
				},
				'conteiner-class': '',
				'conteiner-text-width': 160,
				'comparative-image-src': 'images/proof_profile_subtitle_bg_filled.png',
				'show-font-3ds-field': true,
				'show-scale-field': true,
				'trigger-keyup-text-fields': true
			}
		},
		'proof-profile-description-conteiner': {
			'ds': {
				'scale': {
					'value': 1
				},
				'font-3ds': 'Ace Attorney US',
				'font-size': 16,
				'margin-top': {
					'value': 0
				},
				'margin-left': {
					'value': 18
				},
				'line-height': {
					'value': 1
				},
				'conteiner-class': 'proof-profile-description-sprites-ds brown-background',
				'conteiner-text-width': 238,
				'comparative-image-src': 'images/proof_profile_description_bg_filled_ds.png',
				'show-font-3ds-field': false,
				'show-font-ds-field': true,
				'show-scale-field': false,
				'trigger-keyup-text-fields': true
			},
			'3ds': {
				'scale': {
					'value': 1.075
				},
				'font-3ds': 'Vaud Book',
				'font-size': 14,
				'margin-top': {
					'value': 3
				},
				'margin-left': {
					'value': 23
				},
				'line-height': {
					'value': 1.35
				},
				'conteiner-class': 'brown-background',
				'conteiner-text-width': 256,
				'comparative-image-src': 'images/proof_profile_description_bg_filled.png',
				'show-font-3ds-field': true,
				'show-font-ds-field': false,
				'show-scale-field': true,
				'trigger-keyup-text-fields': true
			}
		},
		'button-conteiner-sandbox': {
			'ds': {
				'conteiner-class': 'ds'
			},
			'3ds': {
				'conteiner-class': ''
			}
		},
		'smaller-button-conteiner-sandbox': {
			'ds': {
				'conteiner-class': 'ds'
			},
			'3ds': {
				'conteiner-class': ''
			}
		},
		'proof-profile-conteiner-sandbox': {
			'ds': {
				'conteiner-class': 'ds',
				'conteiner-text-proof-profile-title-class': 'proof-profile-title-sprites-ds',
				'conteiner-text-proof-profile-subtitle-class': 'proof-profile-subtitle-sprites-ds',
				'conteiner-text-proof-profile-description-class': 'proof-profile-description-sprites-ds',
				'trigger-keyup-text-fields': true
			},
			'3ds': {
				'conteiner-class': '',
				'conteiner-text-proof-profile-title-class': '',
				'conteiner-text-proof-profile-subtitle-class': '',
				'conteiner-text-proof-profile-description-class': '',
				'trigger-keyup-text-fields': true
			}
		}
	};
	
	// Methods
	this.loadConfigs = function(){
		var theme = stash.get('theme');
		var language = stash.get('language');
		
		if(typeof theme == 'undefined') theme = this.defaultConfigs.theme;
		if(typeof language == 'undefined') language = this.defaultConfigs.language;
		
		this.configs = {
			'theme': theme,
			'language': language
		}
	}
	
	this.loadTheme = function(){
		var theme = this.configs.theme;
		$('body').addClass(theme);
	}
	
	this.changeTheme = function(element){
		var $element = $(element);
		var $body = $('body');
		
		var theme;
		if($element.is('a')){
			theme = ( $element.attr('href') ).replace('#', '');
		} else {
			theme = $element.val();
		}
		
		stash.set('theme', theme);
		$body.removeClass('light dark').addClass(theme);
		
		// Reloading configs after saving the new theme
		this.loadConfigs();
	}
	
	this.openPageAboutThisSoftware = function(){
		var language = this.configs.language;
		var readme_page;
		if(language != 'en-us'){
			readme_page = 'README.' + language + '.md';
		} else {
			readme_page = 'README.md';
		}
		var url_github = 'https://github.com/leomontenegro6/aaig/blob/master/' + readme_page;

		if( this.checkOnElectron() ){
			var shell = require('electron').shell;
			shell.openExternal(url_github);
		} else {
			window.open(url_github);
		}
	}
	
	this.loadLanguage = function(callback){
		var language = this.configs.language;
		var that = this;
		
		this.removeAllLanguageScripts();
		this.addLanguageScript(language, function(){
			that.loadLanguageScriptStrings();
			if(callback) callback();
		});
	}
	
	this.changeLanguage = function(element){
		var $element = $(element);
		
		var language;
		if($element.is('a')){
			language = ( $element.attr('href') ).replace('#', '');
		} else {
			language = $element.val();
		}
		
		stash.set('language', language);
		
		// Updating config variables and loading language afterwards
		this.loadConfigs();
		this.loadLanguage();
	}
	
	this.addLanguageScript = function(language, callback){
		$.getScript('js/lang.' + language + '.js', function(){
			if(callback) callback();
		})
	}
	
	this.removeAllLanguageScripts = function(){
		$('head').find("script[src^='lang']").remove();
	}
	
	this.loadLanguageScriptStrings = function(){
		var languageStrings = this.languageStrings;
		for(var textType in languageStrings){
			var textTypes = languageStrings[textType];
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
	
	this.loadTabContents = function(callback){
		var $divTabButtons = $('#buttons');
		var $divTabSmallerButtons = $('#smaller-buttons');
		var $divTabProofProfileTitles = $('#proof-profile-titles');
		var $divTabProofProfileSubtitles = $('#proof-profile-subtitles');
		var $divTabProofProfileDescriptions = $('#proof-profile-descriptions');
		var $divTabSandbox = $('#sandbox');
		
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
							$divTabSandbox.load('tab-sandbox.html', callback);
						});
					});
				});
			});
		});
	}
	
	this.loadModalWindows = function(callback){
		var $body = $('body');
		
		$.get('modal-loading.html').then(function(response){
			$body.append(response);
			$.get('modal-config.html').then(function(response){
				$body.append(response);
				if(callback) callback();
			});
		});
	}
	
	this.triggerClickTab = function(tabNumber){
		var $ulMainTabs = $('#main-tabs');
		var $selectedTabButton = $ulMainTabs.children('li').eq(tabNumber - 1).children('a');
		$selectedTabButton.trigger('click');
	}
	
	this.openTextFile = function(){
		if( this.checkOnElectron() ){
			return this.openTextFileOnElectron();
		}
		
		var $body = $('body');
		var $activeTab = $('#main-tabs-conteiners').children('div.active').first();
		var $inputTextBatchMode = $activeTab.find('textarea.text-batch-mode, textarea.text');
		var $checkboxBatchMode = $activeTab.find('input.batch-mode');
		var $inputFile;
		
		// If the currently active tab is the sandbox, then abort.
		if($activeTab.is('#sandbox')){
			alert('Esta funcionalidade não funciona na sandbox!');
			return;
		}
		
		// If auxiliary input file exists, retrieve it.
		// Else, create it and retrieve it afterwards
		if( $('#auxiliary-input-file').length > 0 ){
			$inputFile = $('#auxiliary-input-file');
		} else {
			$inputFile = $('<input />').attr({
				'id': 'auxiliary-input-file',
				'type': 'file'
			}).hide();
			$body.append($inputFile);
		}
		
		// Adding onchange event on the auxiliary input file, in order to get
		// data from the file provided by the user
		$inputFile.one('change', function(){
			var file = this.files[0];
			
			// File is invalid, so remove the input file and abort
			if(file.type != 'text/plain'){
				alert('Apenas arquivos .TXT são aceitos!');
				$inputFile.remove();
				return;
			}
			
			// File is valid, so doing changes in the fields of the currently
			// active tab that's non-sandbox
			var fileReader = new FileReader();
			fileReader.onload = function(fileLoadedEvent){
				var textFromFileLoaded = (fileLoadedEvent.target.result).replace(/^\s+|\s+$/g, "");
				
				$checkboxBatchMode.prop('checked', true).trigger('change');
				$inputTextBatchMode.val(textFromFileLoaded).focus();
			};

			fileReader.readAsText(file, "UTF-8");
			
			$inputFile.remove();
		});
		
		// Triggering click event in the auxiliary input field, in order to call
		// browser's filechooser window, asking for a text file to be selected
		$inputFile.trigger('click');
	}
	
	this.openTextFileOnElectron = function(){
		var dialog = require('electron').remote.dialog;
		var fs = require('fs');
		
		var $body = $('body');
		var $activeTab = $('#main-tabs-conteiners').children('div.active').first();
		var $inputTextBatchMode = $activeTab.find('textarea.text-batch-mode, textarea.text');
		var $checkboxBatchMode = $activeTab.find('input.batch-mode');
		
		dialog.showOpenDialog({properties: ['openFile']}, function(file){
			if (file !== undefined) {
				fs.readFile(file[0], 'utf8', function(err, data){
					if(err) return console.log(err);
					
					var textFromFileLoaded = data.replace(/^\s+|\s+$/g, "");
					$checkboxBatchMode.prop('checked', true).trigger('change');
					$inputTextBatchMode.val(textFromFileLoaded).focus();
				});
			}
		})
	}
	
	this.showConfigSettings = function(){
		var $divConfigSettings = $('#config-settings');
		
		// Showing modal
		$divConfigSettings.modal('show');
		
		// Loading configs into form
		this.loadConfigsForm();
	}
	
	this.loadConfigsForm = function(){
		var $selectedRadioTheme = $("[name='config-theme'][value='" + this.configs.theme + "']");
		var $selectedRadioLanguage = $("[name='config-language'][value='" + this.configs.language + "']");
		
		// Checking default options for each field
		$selectedRadioTheme.prop('checked', true);
		$selectedRadioLanguage.prop('checked', true);
		
		// Avoid form resetting default behaviour
		return false;
	}
	
	this.loadDefaultConfigsForm = function(){
		var $selectedRadioTheme = $("[name='config-theme'][value='" + this.defaultConfigs.theme + "']");
		var $selectedRadioLanguage = $("[name='config-language'][value='" + this.defaultConfigs.language + "']");
		
		// Checking default options for each field
		$selectedRadioTheme.prop('checked', true);
		$selectedRadioLanguage.prop('checked', true);
		
		// Avoid form resetting default behaviour
		return false;
	}
	
	this.hideScriptConfigSettings = function(){
		$('#config-settings').modal('hide');
	}
	
	this.saveConfigs = function(){
		var $radioTheme = $("input[name='config-theme']:checked");
		var $radioLanguage = $("input[name='config-language']:checked");
		
		var checkThemeChanged = ($radioTheme.val() != this.configs.theme);
		var checkLanguageChanged = ($radioLanguage.val() != this.configs.language);
		
		this.hideScriptConfigSettings();
		this.showLoadingIndicator();
		
		var that = this;
		setTimeout(function(){
			if(checkThemeChanged) that.changeTheme( $radioTheme[0] );
			if(checkLanguageChanged) that.changeLanguage( $radioLanguage[0] );

			that.hideLoadingIndicator();
		}, 25);
		
		// Needed to avoid form submission
		return false;
	}
	
	this.setDefaultTextFieldValues = function(){
		$('#button-text').attr('value', 'Phoenix Wright');
		$('#button-text-batch-mode').html('Phoenix Wright\nLarry Butz\nMia Fey');
		$('#smaller-button-text').attr('value', "Chief's Office");
		$('#smaller-button-text-batch-mode').html('Detention Center\nFey & Co. Law Offices\nGrossberg Law Offices\nGatewater Hotel');
		$('#proof-profile-title-text').attr('value', 'Fingerprinting Set');
		$('#proof-profile-title-text-batch-mode').html('Attorney\'s Badge\nCindy\'s Autopsy Report\nStatue / The Thinker\nPassport');
		$('#proof-profile-subtitle-text').html('Age: 27\nGender: Female');
		$('#proof-profile-description-text').html('Time of death: 9/5 at 9:00 PM.\nCause: single blunt force trauma.\nDeath was instantaneous.');
		$('#sandbox-buttons-text-1').attr('value', 'Aline Sato');
		$('#sandbox-buttons-text-2').attr('value', 'Cíntia Muito');
		$('#sandbox-buttons-text-3').attr('value', 'Cíntia Rocha');
		$('#sandbox-smaller-buttons-text-1').attr('value', 'Sato Advogados');
		$('#sandbox-smaller-buttons-text-2').attr('value', 'Hotel Aguajarú');
		$('#sandbox-smaller-buttons-text-3').attr('value', 'Massafera Advocacia');
		$('#sandbox-smaller-buttons-text-4').attr('value', 'Zulcorp');
		$('#proof-profile-title-text-sandbox').attr('value', 'Aline Sato');
		$('#proof-profile-subtitle-text-sandbox').html('Idade: 27\nGênero: Feminino');
		$('#proof-profile-description-text-sandbox').html('Advogada-chefe de Sato Advogados.\nMinha chefe e uma excelente\nadvogada de defesa.');
	}
	
	this.resetForm = function(form){
		var $form = $(form);
		
		var that = this;
		
		setTimeout(function(){
			$form.find("input[type='text'], input[type='checkbox'], select, textarea").each(function(){
				var $field = $(this);
				if($field.is('input.slider')){
					$field.slider('refresh').trigger('change');
				} else if($field.is('select')){
					$field.trigger('change');
				} else if($field.is("input[type='checkbox']")){
					$field.trigger('change');
				} else {
					$field.trigger('keyup');
				}
			});
			
			that.hidePreviewFilenamesBatchMode( $form.find("input[type='text']").first() );
		}, 25);
	}
	
	this.triggerMainTextFieldEvents = function(){
		var $inputButtonText = $('#button-text');
		var $inputSmallerButtonText = $('#smaller-button-text');
		var $textareaProofProfileTitleText = $('#proof-profile-title-text');
		var $textareaProofProfileSubtitleText = $('#proof-profile-subtitle-text');
		var $textareaProofProfileDescriptionText = $('#proof-profile-description-text');
		
		$inputButtonText.add($inputSmallerButtonText).add($textareaProofProfileTitleText).trigger('keyup');
		$textareaProofProfileSubtitleText.add($textareaProofProfileDescriptionText).trigger('keyup');
	}
	
	this.toggleSandboxFieldEventsOnTabClick = function(){
		var $buttonTabSandbox = $('a[aria-controls="sandbox"]');
		var $divSandboxTab = $('#sandbox');
		
		$buttonTabSandbox.on('shown.bs.tab', function () {
			$divSandboxTab.find('input, textarea').trigger('keyup');
		});
	}
	
	// Implementing plus / minus button switches when the "Visual Customizations" accordion is shown or hidden
	this.toggleAccordionIcon = function() {
		$('.panel-group').on('hide.bs.collapse show.bs.collapse', function(e){
			$(e.target).prev('.panel-heading').find(".plus-minus").toggleClass('glyphicon-plus glyphicon-minus');
		});
	}
	
	this.toggleAutomaticScale = function(checkbox){
		var $checkbox = $(checkbox);
		var $form = $checkbox.closest('form');
		var $scaleField = $form.find('input.scale');
		
		var defaultValue = parseFloat($scaleField.attr('data-slider-value'));
		
		if($checkbox.is(':checked')){
			$scaleField.slider('setValue', defaultValue).trigger('change').slider("disable");
		} else {
			$scaleField.slider("enable").slider('setValue', defaultValue).trigger('change');
		}
	}
	
	this.instantiateSliderFields = function(){
		var that = this;
		
		$('input.slider').each(function(){
			var $input = $(this);
			var $form = $input.closest('form');
			var previewConteinerFieldId = $form.attr('data-image');
			var $inputValueExhibitor = $input.next();
			var $divPreviewConteinerField = $('#' + previewConteinerFieldId);
			var $divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.text');

			$input.slider();

			if($input.hasClass('scale')){
				$input.on('change', function(){
					var scale = this.value;
					
					that.definePreviewScale($divPreviewConteinerFieldText, scale);

					$inputValueExhibitor.val(scale);
				});

				$input.trigger('change');
			} else if($input.hasClass('line-height')){
				$input.on('change', function(){
					var lineHeight = this.value;

					$divPreviewConteinerFieldText.css('lineHeight', lineHeight);

					$inputValueExhibitor.val(lineHeight);
				});

				$input.trigger('change');
			} else if($input.hasClass('luminosity')){
				$input.on('change', function(){
					var percentage = this.value;
					var color = 'hsla(20, 100%, ' + percentage + '%, 1)';

					$inputValueExhibitor.val(percentage + '%').css('backgroundColor', color);
					if(percentage > 50){
						$inputValueExhibitor.css('color', '#333');
					} else {
						$inputValueExhibitor.css('color', 'white');
					}
					$divPreviewConteinerFieldText.css('color', color);
				});
				
				$input.trigger('change');
			} else if($input.hasClass('margin-top')){
				$input.on('change', function(){
					var marginTop = this.value;

					$divPreviewConteinerFieldText.css('marginTop', marginTop + 'px');

					$inputValueExhibitor.val(marginTop);
				});

				$input.trigger('change');
			} else if($input.hasClass('margin-left')){
				$input.on('change', function(){
					var marginLeft = this.value;

					$divPreviewConteinerFieldText.css('marginLeft', marginLeft + 'px');

					$inputValueExhibitor.val(marginLeft);
				});

				$input.trigger('change');
			}
		});
	}
	
	this.instantiateFontFields = function(){
		var $fontFields = $('select.font-3ds');
		var languageStrings = this.languageStrings;
		
		$fontFields.html(
			$("<option />").html(languageStrings.l.loading).attr({
				'value': '',
				'selected': 'selected',
				'disabled': 'disabled'
			})
		);
		$.get('fonts.html', function(f){
			$.get('proprietary-fonts.html').always(function(fp) {
				$fontFields.each(function(){
					var $fontField = $(this);
					var $fontSizeField = $fontField.siblings('select.font-size');
					var name = $fontField.attr('name');
					var defaultFont, defaultFontSize;

					// Defining font and size parameters for each field type
					if(name == 'button-font'){
						defaultFont = 'Arial';
						defaultFontSize = 23;
					} else if(name == 'smaller-button-font'){
						defaultFont = 'Arial';
						defaultFontSize = 23;
					} else if(name == 'proof-profile-title-font'){
						defaultFont = 'Vaud Book';
						defaultFontSize = 18;
					} else if(name == 'proof-profile-subtitle-font'){
						defaultFont = 'Vaud Book';
						defaultFontSize = 14;
					} else if(name == 'proof-profile-description-font'){
						defaultFont = 'Vaud Book';
						defaultFontSize = 14;
					}

					// Appending loaded fonts inside font field
					$fontField.html(f);
					if ((typeof fp == 'string') && (fp.indexOf('<option') > -1)) {
						$fontField.append(fp);
					}

					// Sorting options per font name
					var $options = $fontField.find('option');
					var array_options = $options.map(function(e, o) {
						return{
							t: $(o).text(),
							v: o.value
						};
					}).get();
					array_options.sort(function(o1, o2){
						var t1 = o1.t.toLowerCase(), t2 = o2.t.toLowerCase();
						return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
					});
					$options.each(function(i, o) {
						o.value = array_options[i].v;
						$(o).text(array_options[i].t);
					});

					// Adding option for selecting another fonts
					$fontField.append('<option value="_o_" class="l-option-another-font">' + languageStrings.l['option-another-font'] + '</option>');

					// Setting default font, and fix it in case of the form begin resetted
					$fontField.val(defaultFont);
					var $selectedOption = $fontField.find('option:selected');
					$selectedOption.addClass('recommended');
					$selectedOption[0].defaultSelected = true;

					// Generating values for font size fields
					for(var i=8; i<=36; i++){
						$fontSizeField.append("<option value='" + i + "'>" + i + " px</option>");
						if(i == defaultFontSize){
							// Setting default font size, and fix it in case of the form begin resetted
							$fontSizeField.val(i);
							var $selectedOption = $fontSizeField.find('option:selected');
							$selectedOption.addClass('recommended');
							$selectedOption[0].defaultSelected = true;
						}
					}

					// Triggering onchange event in font size field, to set
					// default font size in the preview
					$fontSizeField.trigger('change');
				});
			});
		});
	}
	
	this.toggleComparativeImage = function(checkbox){
		var $checkbox = $(checkbox);
		var $form = $checkbox.closest('form');
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerField = $("#" + previewConteinerFieldId);
		var $imgComparative = $divPreviewConteinerField.siblings('img.button-template');

		if($checkbox.is(':checked')){
			$imgComparative.show();
		} else {
			$imgComparative.hide();
		}
	}
	
	this.updatePreview = function(field){
		var $field = $(field);
		var $form = $field.closest('form');
		var $selectPlatform = $form.find('select.platform');
		var $checkboxAutomaticScale = $form.find('input.automatic-scale');
		var $checkboxBatchMode = $form.find('input.batch-mode');
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerField = $('#' + previewConteinerFieldId);
		var $divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.text');
		
		var text = field.value;
		var textfieldName = $field.attr('name');
		var platform = $selectPlatform.val();
		var checkAutomaticScale = $checkboxAutomaticScale.is(':checked');
		var checkBatchModeActivated = $checkboxBatchMode.is(':checked');
		
		if(previewConteinerFieldId == 'button-conteiner' || previewConteinerFieldId == 'smaller-button-conteiner'){
			// Buttons and smaller buttons
			this.updatePreviewText($divPreviewConteinerFieldText, text, checkAutomaticScale);
		} else if(previewConteinerFieldId == 'proof-profile-title-conteiner'){
			// Proof / profile titles
			if(platform == '3ds'){
				text = text.replace(/\n/g, '<br />');
				this.updatePreviewText($divPreviewConteinerFieldText, text, checkAutomaticScale);
			} else {
				this.updatePreviewSprites($divPreviewConteinerFieldText, text);
			}
		} else if(previewConteinerFieldId == 'proof-profile-subtitle-conteiner' || previewConteinerFieldId == 'proof-profile-description-conteiner'){
			// Proof / profile subtitles and proof / profile descriptions
			if(checkBatchModeActivated){
				var selection_start = field.selectionStart;
				var block_number = (text.substr(0, selection_start).split(/\n\n/).length) - 1;
				
				// Separating text by blocks, based in two consecutive line breaks
				var blocks = text.split(/\n\n/);
				var current_block = $.trim( blocks[block_number] );

				// Updating preview from current block
				if(platform == '3ds'){
					current_block = current_block.replace(/\n/g, '<br />');
					this.updatePreviewText($divPreviewConteinerFieldText, current_block, checkAutomaticScale);
				} else {
					this.updatePreviewSprites($divPreviewConteinerFieldText, current_block, 'n');
				}
				
				// Updating filenames preview
				this.updatePreviewFilenamesBatchMode(field);
			} else {
				if(platform == '3ds'){
					text = text.replace(/\n/g, '<br />');
					this.updatePreviewText($divPreviewConteinerFieldText, text, checkAutomaticScale);
				} else {
					this.updatePreviewSprites($divPreviewConteinerFieldText, text);
				}
			}
		} else if(previewConteinerFieldId == 'button-conteiner-sandbox' || previewConteinerFieldId == 'smaller-button-conteiner-sandbox'){
			// Sandbox - Buttons and smaller buttons
			if(textfieldName == 'sandbox-buttons-text-1' || textfieldName == 'sandbox-smaller-buttons-text-1'){
				$divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.button1');
			} else if(textfieldName == 'sandbox-buttons-text-2' || textfieldName == 'sandbox-smaller-buttons-text-2'){
				$divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.button2');
			} else if(textfieldName == 'sandbox-buttons-text-3' || textfieldName == 'sandbox-smaller-buttons-text-3'){
				$divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.button3');
			} else if(textfieldName == 'sandbox-smaller-buttons-text-4'){
				$divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.button4');
			}
			
			this.updatePreviewText($divPreviewConteinerFieldText, text, true, 1);
		} else if(previewConteinerFieldId == 'proof-profile-conteiner-sandbox'){
			// Sandbox - Proofs / profiles
			if(textfieldName == 'proof-profile-title-text-sandbox'){
				// Preview called from title text field
				$divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.proof-profile-title');
				if(platform == 'ds'){
					var $newDivPreviewConteinerFieldText = $('<div />').addClass('text');
					$divPreviewConteinerFieldText.html($newDivPreviewConteinerFieldText).css('transform', 'none');

					this.updatePreviewSprites($newDivPreviewConteinerFieldText, text, 'a', function(checkLimitExceeded){
						if(checkLimitExceeded){
							$newDivPreviewConteinerFieldText.addClass('red');
						} else {
							$newDivPreviewConteinerFieldText.removeClass('red');
						}
					});
				} else {
					this.updatePreviewText($divPreviewConteinerFieldText, text, true, 1);
				}
			} else if(textfieldName == 'proof-profile-subtitle-text-sandbox'){
				// Preview called from subtitle text field
				$divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.proof-profile-subtitle');
				if(platform == 'ds'){
					var $newDivPreviewConteinerFieldText = $('<div />').addClass('text');
					$divPreviewConteinerFieldText.html($newDivPreviewConteinerFieldText).css('transform', 'none');

					this.updatePreviewSprites($newDivPreviewConteinerFieldText, text);
				} else {
					text = text.replace(/\n/g, '<br />');
					this.updatePreviewText($divPreviewConteinerFieldText, text, true, 1);
				}
			} else if(textfieldName == 'proof-profile-description-text-sandbox'){
				// Preview called from description text field
				$divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.proof-profile-description');
				if(platform == 'ds'){
					var $newDivPreviewConteinerFieldText = $('<div />').addClass('text');
					$divPreviewConteinerFieldText.html($newDivPreviewConteinerFieldText).css('transform', 'none');

					this.updatePreviewSprites($newDivPreviewConteinerFieldText, text, 'a');
				} else {
					text = text.replace(/\n/g, '<br />');
					this.updatePreviewText($divPreviewConteinerFieldText, text, true, 1);
				}
			}
		}
	}
	
	this.updatePreviewBatchMode = function(field){
		var $field = $(field);
		var $form = $field.closest('form');
		var $selectPlatform = $form.find('select.platform');
		var $checkboxAutomaticScale = $form.find('input.automatic-scale');
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerFieldText = $('#' + previewConteinerFieldId).children('div.text');
		
		var text = field.value;
		var selection_start = field.selectionStart;
		var line_number = (text.substr(0, selection_start).split(/\n/).length) - 1;

		// Separating text by line breaks
		var lines = text.split(/\n/);
		var current_line = lines[line_number];
		var platform = $selectPlatform.val();
		var checkAutomaticScale = $checkboxAutomaticScale.is(':checked');

		// Updating preview from the current line
		if((platform == 'ds') && (previewConteinerFieldId == 'proof-profile-title-conteiner')){
			this.updatePreviewSprites($divPreviewConteinerFieldText, current_line);
		} else {
			this.updatePreviewText($divPreviewConteinerFieldText, current_line, checkAutomaticScale);
		}
		
		// Updating filenames preview
		this.updatePreviewFilenamesBatchMode(field);
	}
	
	this.updatePreviewText = function(divPreviewConteiner, text, checkAutomaticScale, approximation){
		if(typeof approximation == 'undefined') approximation = 0.95;

		var $divPreviewConteiner = $(divPreviewConteiner);

		$divPreviewConteiner.html(text);

		if(checkAutomaticScale){
			this.definePreviewScale($divPreviewConteiner, 1);
			var text_width = this.calculateTextWidth($divPreviewConteiner);
			var preview_width = $divPreviewConteiner.width();

			if(text_width > preview_width){
				var scale = (preview_width * approximation / text_width);

				this.definePreviewScale($divPreviewConteiner, scale);
			}
		}
	}
	
	this.updatePreviewSprites = function(divPreviewConteiner, text, font, callback){
		var $divPreviewConteiner = $(divPreviewConteiner);
		var $divPreviewConteinerParent = $divPreviewConteiner.parent();
		var checkLimitExceeded = false;

		if(typeof font == 'undefined'){
			font = $divPreviewConteiner.closest('div.tab-pane').find("select.font-ds").val();
		}

		// Undoing condensed font effect, in case of the field's "automatic" option is activated.
		// Needed to check automatically if the font is condensed or not
		if(font == 'a'){
			$divPreviewConteinerParent.removeClass('condensed extra-condensed');
		}

		// Adding sprite letters in the preview
		$divPreviewConteiner.html('').css('fontFamily', '');
		for (var i = 0, size = text.length; i < size; i++) {
			var character = text[i];

			if(character == "\n"){
				$divPreviewConteiner.append(
					$('<br />')
				);
			} else {
				var new_character = this.formatCharacter(character);

				$divPreviewConteiner.append(
					$('<span />').addClass('letter ' + new_character + ' ').html('&nbsp;')
				);
			}
		}

		// Checking if condensed font must be used or not
		if(font == 'a'){
			var text_width = this.calculateTextWidth( $divPreviewConteiner );
			var preview_width = $divPreviewConteiner.width();

			// Checking if text width exceeded the maximum width of the preview
			if(text_width > preview_width){
				// Exceeded the maximum width, so changing font to condensed
				$divPreviewConteinerParent.addClass('condensed');

				var condensed_text_width = this.calculateTextWidth( $divPreviewConteiner );
				var condensed_preview_width = $divPreviewConteiner.width();

				// Checking if condensed text width exceeded the maximum width of the condensed preview
				if(condensed_text_width > condensed_preview_width){
					// Exceeded the maximum condensed width, so changing font to extra-condensed
					$divPreviewConteinerParent.addClass('extra-condensed');

					var extra_condensed_text_width = this.calculateTextWidth( $divPreviewConteiner );
					var extra_condensed_preview_width = $divPreviewConteiner.width();

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
	
	this.changePlatform = function(field){
		var $field = $(field);
		var $form = $field.closest('form');
		var $textFields = $form.find('input.text, textarea.text');
		var $automaticScaleField = $form.find('input.automatic-scale');
		var $scaleField = $form.find('input.scale');
		var $conteinerScaleField = $scaleField.closest('div.form-inline');
		var $fontField = $form.find('select.font-3ds');
		var $fontSizeField = $form.find('select.font-size');
		var $conteinerFontField = $fontField.closest('div.form-inline');
		var $fontFieldDS = $form.find('select.font-ds');
		var $conteinerFontFieldDS = $fontFieldDS.closest('div.form-inline');
		var $lineHeightField = $form.find('input.line-height');
		var $marginTopField = $form.find('input.margin-top');
		var $marginLeftField = $form.find('input.margin-left');
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerField = $('#' + previewConteinerFieldId);
		var $divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.text');
		var $imgComparative = $divPreviewConteinerField.siblings('img.button-template');
		
		var selectedPlatform = field.value;
		
		var platformConfigs = this.platformConfigs[previewConteinerFieldId][selectedPlatform];
		for(var configName in platformConfigs){
			var configValues = platformConfigs[configName];
			
			if(configName == 'scale'){
				$scaleField.slider('setValue', configValues.value);
				$scaleField.trigger('change');
			} else if(configName == 'font-3ds'){
				$fontField.val(configValues).trigger('change');
			} else if(configName == 'font-ds'){
				$fontFieldDS.val(configValues).trigger('change');
			} else if(configName == 'font-size'){
				$fontSizeField.val(configValues).trigger('change');
			} else if(configName == 'margin-top'){
				$marginTopField.slider('setValue', configValues.value);
				if(!isNaN(configValues.min)) $marginTopField.slider('setAttribute', 'min', configValues.min);
				if(!isNaN(configValues.max)) $marginTopField.slider('setAttribute', 'max', configValues.max);
				$marginTopField.trigger('change');
			} else if(configName == 'margin-left'){
				$marginLeftField.slider('setValue', configValues.value);
				if(!isNaN(configValues.min)) $marginLeftField.slider('setAttribute', 'min', configValues.min);
				if(!isNaN(configValues.max)) $marginLeftField.slider('setAttribute', 'max', configValues.max);
				$marginLeftField.trigger('change');
			} else if(configName == 'line-height'){
				$lineHeightField.slider('setValue', configValues.value);
				if(!isNaN(configValues.min)) $lineHeightField.slider('setAttribute', 'min', configValues.min);
				if(!isNaN(configValues.max)) $lineHeightField.slider('setAttribute', 'max', configValues.max);
				$lineHeightField.trigger('change');
			} else if(configName == 'conteiner-class'){
				$divPreviewConteinerField.attr('class', configValues);
			} else if(configName == 'conteiner-text-width'){
				$divPreviewConteinerFieldText.attr('data-width', configValues);
			} else if(configName == 'comparative-image-src'){
				$imgComparative.attr('src', configValues);
			} else if(configName == 'show-font-3ds-field'){
				if(configValues == true){
					$conteinerFontField.show();
				} else {
					$conteinerFontField.hide();
				}
			} else if(configName == 'show-font-ds-field'){
				if(configValues == true){
					$conteinerFontFieldDS.show();
				} else {
					$conteinerFontFieldDS.hide();
				}
			} else if(configName == 'show-scale-field'){
				if(configValues == true){
					$conteinerScaleField.show();
				} else {
					$conteinerScaleField.hide();
				}
			} else if(configName == 'conteiner-text-proof-profile-title-class'){
				$divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.proof-profile-title');
				$divPreviewConteinerFieldText.attr('class', 'proof-profile-title nowrap ' + configValues);
			} else if(configName == 'conteiner-text-proof-profile-subtitle-class'){
				$divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.proof-profile-subtitle');
				$divPreviewConteinerFieldText.attr('class', 'proof-profile-subtitle nowrap ' + configValues);
			} else if(configName == 'conteiner-text-proof-profile-description-class'){
				$divPreviewConteinerFieldText = $divPreviewConteinerField.children('div.proof-profile-description');
				$divPreviewConteinerFieldText.attr('class', 'proof-profile-description nowrap ' + configValues);
			} else if(configName == 'trigger-change-scale-fields'){
				if(configValues == true){
					if(previewConteinerFieldId == 'proof-profile-title-conteiner'){
						if($automaticScaleField.is(':checked') && (selectedPlatform != 'ds')){
							$automaticScaleField.trigger('change');
						} else {
							$scaleField.trigger('change');
						}
					} else {
						if($automaticScaleField.is(':checked')){
							$automaticScaleField.trigger('change');
						} else {
							$scaleField.trigger('change');
						}
					}
				}
			} else if(configName = 'trigger-keyup-text-fields'){
				$textFields.trigger('keyup');
			}
		}
	}
	
	this.toggleBatchModeFields = function(checkbox){
		var $checkbox = $(checkbox);
		var $form = $checkbox.closest('form');
		var previewConteinerFieldId = $form.attr('data-image');
		var $textfield = $form.find('input.text, textarea.text');
		var $textfieldBatchMode = $form.find('textarea.text-batch-mode');
		var $divBatchModeSettings = $form.find('div.batch-mode-settings');
		
		if( $.inArray(previewConteinerFieldId, ['button-conteiner', 'smaller-button-conteiner', 'proof-profile-title-conteiner']) !== -1 ){
			if($checkbox.is(':checked')){
				$textfield.hide();
				$textfieldBatchMode.height(214).slideDown('fast').trigger('keyup');
				$divBatchModeSettings.show();
				this.updatePreviewFilenamesBatchMode( $textfield[0] );
			} else {
				$textfieldBatchMode.slideUp('fast', function(){
					$textfield.show().trigger('keyup');
					$divBatchModeSettings.hide().find('input').each(function(){
						var $input = $(this);
						if($input.hasClass('batch-mode-initial-file-number')){
							$input.val('0');
						} else if($input.hasClass('batch-mode-left-zeroes')){
							$input.val('8');
						} else {
							$input.val('.bch');
						}
					});
				});
				this.hidePreviewFilenamesBatchMode( $textfield[0] );
			}
		} else if( $.inArray(previewConteinerFieldId, ['proof-profile-subtitle-conteiner', 'proof-profile-description-conteiner']) !== -1 ){
			var height, resizable_class;
			if($checkbox.is(':checked')){
				height = 214;
				resizable_class = 'resizable-vertical';
				
				$divBatchModeSettings.show();
			} else {
				height = 74;
				resizable_class = 'noresizable';
				
				$divBatchModeSettings.hide().find('input').each(function(){
					var $input = $(this);
					if($input.hasClass('batch-mode-initial-file-number')){
						$input.val('0');
					} else if($input.hasClass('batch-mode-left-zeroes')){
						$input.val('8');
					} else {
						$input.val('.bch');
					}
				});
			}
			
			$textfield.animate({'height': height}, 'fast', function(){
				$textfield.removeClass('noresizable resizable-vertical').addClass(resizable_class).trigger('keyup');
			});
		}
	}
	
	this.hidePreviewFilenamesBatchMode = function(field){
		var $field = $(field);
		var $form = $field.closest('form');
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerField = $('#' + previewConteinerFieldId);
		var $ulPreviewFilenames = $divPreviewConteinerField.parent().find('ul.preview-filenames-batch-mode');
		var $divConteinerPreviewFilenames = $ulPreviewFilenames.closest('div.form-inline');
		
		$divConteinerPreviewFilenames.hide();
	}
	
	this.updatePreviewFilenamesBatchMode = function(field){
		var $field = $(field);
		var $form = $field.closest('form');
		var $textarea = $form.find('textarea.text, textarea.text-batch-mode');
		var $inputBatchModeInitialFileNumber = $form.find('input.batch-mode-initial-file-number');
		var $inputBatchModeLeftZeroes = $form.find('input.batch-mode-left-zeroes');
		var $inputBatchModePrefix = $form.find('input.batch-mode-prefix');
		var $inputBatchModeSuffix = $form.find('input.batch-mode-suffix');
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerField = $('#' + previewConteinerFieldId);
		var $ulPreviewFilenames = $divPreviewConteinerField.parent().find('ul.preview-filenames-batch-mode');
		var $divConteinerPreviewFilenames = $ulPreviewFilenames.closest('div.form-inline');
		
		var text = $textarea.val();
		var blocks;
		if( $.inArray(previewConteinerFieldId, ['button-conteiner', 'smaller-button-conteiner', 'proof-profile-title-conteiner']) !== -1 ){
			blocks = text.split(/\n/);
		} else {
			blocks = text.split(/\n\n/);
		}
		var totalBlocks = blocks.length;
		var initialFileNumber = parseInt($inputBatchModeInitialFileNumber.val(), 10);
		var leftZeroes = parseInt($inputBatchModeLeftZeroes.val(), 10);
		var prefix = $inputBatchModePrefix.val();
		var suffix = $inputBatchModeSuffix.val();
		
		if(isNaN(initialFileNumber)) initialFileNumber = 0;
		if(isNaN(leftZeroes)) leftZeroes = 0;
		
		$divConteinerPreviewFilenames.show();
		$ulPreviewFilenames.html('');
		for(var i in blocks){
			var filename = this.formatFilenameBatchMode(initialFileNumber, leftZeroes, prefix, suffix) + '.png';
			
			$ulPreviewFilenames.append(
				$('<li />').html(filename)
			);
			
			initialFileNumber++;
			
			if(i >= 9){
				$ulPreviewFilenames.append(
					$('<li />').html((totalBlocks - i) + ' ').append(
						$('<span />').addClass('l-batch-filenaming-preview-other-files').html(this.languageStrings.l['batch-filenaming-preview-other-files'])
					)
				);
				break;
			}
		}
	}
	
	this.changeFont = function(fontField){
		var $fontField = $(fontField);
		var $form = $fontField.closest('form');
		var $inputOtherFont = $fontField.next();
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerFieldText = $('#' + previewConteinerFieldId).children('div.text');
		
		var selectedFont = fontField.value;
		
		if(selectedFont == '_o_'){
			$inputOtherFont.show();
		} else {
			$inputOtherFont.val('').hide();

			var regex_numeros = /\d/g;
			if(regex_numeros.test(selectedFont)){
				$divPreviewConteinerFieldText.css({'fontFamily': '"' + selectedFont + '"'});
			} else {
				$divPreviewConteinerFieldText.css('fontFamily', selectedFont);
			}
		}
	}
	
	this.setCustomFont = function(inputAnotherFont){
		var $inputAnotherFont = $(inputAnotherFont);
		var $form = $inputAnotherFont.closest('form');
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerFieldText = $('#' + previewConteinerFieldId).children('div.text');
		
		var customFont = inputAnotherFont.value;

		var regex_numeros = /\d/g;
		if(regex_numeros.test(customFont)){
			$divPreviewConteinerFieldText.css({'fontFamily': '"' + customFont + '"'});
		} else {
			$divPreviewConteinerFieldText.css('fontFamily', customFont);
		}
	}
	
	this.changeFontSize = function(fontSizeField){
		var $fontSizeField = $(fontSizeField);
		var $form = $fontSizeField.closest('form');
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerFieldText = $('#' + previewConteinerFieldId).children('div.text');
		
		var fontSize = fontSizeField.value;
		$divPreviewConteinerFieldText.css('fontSize', fontSize + 'px');
	}
	
	this.changeFontStyle = function(fontStyleCheckbox){
		var $fontStyleCheckbox = $(fontStyleCheckbox);
		var $form = $fontStyleCheckbox.closest('form');
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerFieldText = $('#' + previewConteinerFieldId).children('div.text');
		
		var styleType = $fontStyleCheckbox.val();
		if($fontStyleCheckbox.is(':checked')){
			if(styleType == 'b'){
				$divPreviewConteinerFieldText.addClass('bold');
			} else if(styleType == 'i'){
				$divPreviewConteinerFieldText.addClass('italic');
			}
		} else {
			if(styleType == 'b'){
				$divPreviewConteinerFieldText.removeClass('bold');
			} else if(styleType == 'i'){
				$divPreviewConteinerFieldText.removeClass('italic');
			}
		}
	}
	
	this.changeFontDS = function(fontField){
		var $fontField = $(fontField);
		var $form = $fontField.closest('form');
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerField = $('#' + previewConteinerFieldId);
		
		var selectedFont = $fontField.val();

		if(selectedFont == 'c'){
			$divPreviewConteinerField.addClass('condensed').removeClass('extra-condensed');
		} else if(selectedFont == 'ec'){
			$divPreviewConteinerField.addClass('extra-condensed').removeClass('condensed');
		} else {
			$divPreviewConteinerField.removeClass('condensed extra-condensed');
		}
	}
	
	this.definePreviewScale = function(element, scale){
		var $element = $(element);

		var width = parseFloat($element.attr('data-width'));
		var new_width = width / scale;

		$element.css({
			'width': new_width + 'px',
			'transform': 'scaleX(' + scale + ')'
		});
	}
	
	this.showLoadingIndicator = function(){
		$('#loading-indicator').modal('show');
	}
	
	this.hideLoadingIndicator = function(){
		$('#loading-indicator').modal('hide');
	}
	
	/* Function that returns de device used by the user, when acessing the app
	 * Possible return values:
	 *	- xs: Extra small (Cellphones, with screen width smaller than 768px);
	 *	- sm: Small (Tablets, with screen width equal or greater than 768px);
	 *	- md: Medium (Smaller Desktops, with screen width equal or greater than 992px);
	 *	- lg: Large (Widescreen Desktops, with screen width equal or greater than 1200px).
	 * */
	this.getDevice = function(onresize) {
		if(typeof onresize == 'undefined') onresize = false;
		if(onresize){
			var that = this;
			$(window).off('resize.updateGlobalVariable').on('resize.updateGlobalVariable', function(){
				window.device = that.getDevice(false);
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
	
	this.generateImages = function(form){
		var $form = $(form);
		var $textfield = $form.find('input.text, textarea.text');
		var $textfieldBatchMode = $form.find('textarea.text-batch-mode');
		var $selectPlatform = $form.find('select.platform');
		var $checkboxAutomaticScale = $form.find('input.automatic-scale');
		var $checkboxBatchMode = $form.find('input.batch-mode');
		var $inputBatchModeInitialFileNumber = $form.find('input.batch-mode-initial-file-number');
		var $inputBatchModeLeftZeroes = $form.find('input.batch-mode-left-zeroes');
		var $inputBatchModePrefix = $form.find('input.batch-mode-prefix');
		var $inputBatchModeSuffix = $form.find('input.batch-mode-suffix');
		var previewConteinerFieldId = $form.attr('data-image');
		var $divPreviewConteinerField = $('#' + previewConteinerFieldId);
		
		var platform = $selectPlatform.val();
		
		var text, checkAutomaticScale;
		var date = this.obtainClientDatetimeForFilenames();
		var filename = previewConteinerFieldId + '-' + date;
		var initialFileNumber = $inputBatchModeInitialFileNumber.val();
		var leftZeroes = $inputBatchModeLeftZeroes.val();
		var prefix = $inputBatchModePrefix.val();
		var suffix = $inputBatchModeSuffix.val();
		
		if( $.inArray(previewConteinerFieldId, ['button-conteiner', 'smaller-button-conteiner']) !== -1 ){
			// Buttons and small buttons
			checkAutomaticScale = $checkboxAutomaticScale.is(':checked');
			if($checkboxBatchMode.is(':checked')){
				text = $textfieldBatchMode.val();
				var lines = text.split(/\n/);
				this.batchRenderImages($divPreviewConteinerField, lines, checkAutomaticScale, initialFileNumber, leftZeroes, prefix, suffix);
			} else {
				this.renderImageOnBrowser($divPreviewConteinerField, filename);
			}
		} else if(previewConteinerFieldId == 'proof-profile-title-conteiner'){
			// Proof / profile titles
			checkAutomaticScale = ($checkboxAutomaticScale.is(':checked') && (platform != 'ds'));
			if($checkboxBatchMode.is(':checked')){
				text = $textfieldBatchMode.val();
				var lines = text.split(/\n/);
				this.batchRenderImages($divPreviewConteinerField, lines, checkAutomaticScale, initialFileNumber, leftZeroes, prefix, suffix);
			} else {
				this.renderImageOnBrowser($divPreviewConteinerField, filename);
			}
		} else if(previewConteinerFieldId == 'proof-profile-subtitle-conteiner'){
			// Proof / profile subtitles
			checkAutomaticScale = ($checkboxAutomaticScale.is(':checked') && (platform != 'ds'));
			if($checkboxBatchMode.is(':checked')){
				text = $textfield.val();
				var blocks = text.split(/\n\n/);
				this.batchRenderImages($divPreviewConteinerField, blocks, checkAutomaticScale, initialFileNumber, leftZeroes, prefix, suffix);
			} else {
				this.renderImageOnBrowser($divPreviewConteinerField, filename);
			}
		} else if(previewConteinerFieldId == 'proof-profile-description-conteiner'){
			// Proof / profile descriptions
			checkAutomaticScale = ($checkboxAutomaticScale.is(':checked') && (platform != 'ds'));
			if($checkboxBatchMode.is(':checked')){
				text = $textfield.val();
				var blocks = text.split(/\n\n/);
				$divPreviewConteinerField.removeClass('brown-background');
				this.batchRenderImages($divPreviewConteinerField, blocks, checkAutomaticScale, initialFileNumber, leftZeroes, prefix, suffix, function(){
					$divPreviewConteinerField.addClass('brown-background');
				});
			} else {
				$divPreviewConteinerField.removeClass('brown-background');
				this.renderImageOnBrowser($divPreviewConteinerField, filename, function(){
					$divPreviewConteinerField.addClass('brown-background');
				});
			}
		} else if( $.inArray(previewConteinerFieldId, ['button-conteiner-sandbox', 'smaller-button-conteiner-sandbox', 'proof-profile-conteiner-sandbox']) !== -1 ){
			// Sandbox
			this.renderImageOnBrowser($divPreviewConteinerField, filename);
		}
		
		// Avoid default form submission
		return false;
	}
	
	this.renderImageOnBrowser = function(element, filename, callback, triggerDownload){
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
	
	this.batchRenderImages = function(element, texts, checkAutomaticScale, initialFileNumber, leftZeroes, prefix, suffix, callback){
		var $element = $(element);
		var $divPreviewConteinerFieldText = $element.children('div.text');
		var $tab = $element.closest('div.tab-pane');
		var $selectPlatform = $tab.find("select.platform");

		var platform = $selectPlatform.val();
		if(typeof checkAutomaticScale == 'undefined') checkAutomaticScale = false;
		if(typeof initialFileNumber != 'undefined'){
			initialFileNumber = parseInt(initialFileNumber, 10);
			if(isNaN(initialFileNumber) || (initialFileNumber < 0)) initialFileNumber = 0;
		} else {
			initialFileNumber = 0;
		}
		if(typeof leftZeroes != 'undefined'){
			leftZeroes = parseInt(leftZeroes, 10);
			if(isNaN(leftZeroes) || (leftZeroes < 0)) leftZeroes = 0;
		} else {
			leftZeroes = 0;
		}
		
		var checkUsingSprites = (platform == 'ds') && ($tab.is("[id='proof-profile-titles'], [id='proof-profile-subtitles'], [id='proof-profile-descriptions']"));
		var i = 0;
		var canvases = [];
		var that = this;

		this.showLoadingIndicator();

		var renderImage = function(){
			var text = texts.shift();
			if(platform == '3ds') text = text.replace(/\n/g, '<br />');

			var filename = i + '.png';

			if(checkUsingSprites){
				that.updatePreviewSprites($divPreviewConteinerFieldText, text);
			} else {
				that.updatePreviewText($divPreviewConteinerFieldText, text, checkAutomaticScale);
			}

			that.renderImageOnBrowser($element, filename, function(canvas){
				canvases.push(canvas);

				if(texts.length){
					// Render image of the next line
					i++;
					renderImage();
				} else {
					// Generate zipped file containing the batch generated images
					var date = that.obtainClientDatetimeForFilenames();
					var final_filename = 'images-' + date + '.zip';

					var zip = new JSZip();

					// Adding images in the zip file
					for(var j in canvases){
						var filename = that.formatFilenameBatchMode(initialFileNumber, leftZeroes, prefix, suffix) + '.png';
						var image = canvases[j].toDataURL();
						var header_index = image.indexOf(",");
						var base64_image = image.slice(header_index + 1);

						zip.file(filename, base64_image, {base64: true});
						
						initialFileNumber++;
					}

					// Generating zip and offering it to the user
					zip.generateAsync({type:"blob"}).then(function(content){
						that.hideLoadingIndicator();
						saveAs(content, final_filename);

						if(callback) callback(canvases);
					});
				}
			}, false);
		}
		renderImage();
	}
	
	this.obtainClientDatetimeForFilenames = function(){
		var date = new Date();
		date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON();
		date = date.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');
		
		return date;
	}
	
	this.formatFilenameBatchMode = function(initialFileNumber, leftZeroes, prefix, suffix){
		return prefix + this.zeroFill(initialFileNumber, leftZeroes) + suffix;
	}
	
	this.zeroFill = function(number, width){
		width -= number.toString().length;
		if (width > 0){
			return new Array(width + (/\./.test( number ) ? 2 : 1)).join('0') + number;
		}
		return number + "";
	}
	
	this.calculateTextWidth = function(element){
		var $element = $(element);
		var html_org = $element.html();
		var html_calc = '<span>' + html_org + '</span>';
		$element.html(html_calc);
		var width = $element.find('span:first').width();
		$element.html(html_org);
		return width;
	}
	
	this.formatCharacter = function(character){
		var characterTable = {
			// Symbols
			' ': 'space', '!': 'exclamation', '"': 'double-quotes', '#': 'cerquilha',
			'$': 'money-sign', '%': 'percent', '&': 'ampersand', "'": 'quotes',
			"(": 'open-parenthesis', ")": 'close-parenthesis', '*': 'asterisk',
			'+': 'plus', ',': 'comma', '-': 'minus', '.': 'dot', '/': 'slash',
			':': 'colon', ';': 'semicolon', '<': 'less-than', '=': 'equal',
			'>': 'greater-than', '?': 'interrogation', '@': 'at-sign',
			'[': 'open-square-brackets', ']': 'close-square-brackets',
			'_': 'underscore', '`': 'grave-accent', '¡': 'inverted-exclamation',
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
	
	this.maskFilenameInput = function(event){
		var keyCode = event.which;
		
		var invalidKeycodes = [81, 87, 106, 111, 188, 191, 192, 220, 221];
		var checkKeycodeInvalid = ($.inArray(keyCode, invalidKeycodes) !== -1);
		if(checkKeycodeInvalid){
			return false;
		} else {
			return true;
		}
	}
	
	this.checkOnElectron = function(){
		return (typeof process == 'object');
	}
	
	this.getTitle = function(){
		if( this.checkOnElectron() ){
			var ipc = require('electron').ipcRenderer;
			return ipc.sendSync('getTitle');
		} else {
			return $('title').html();
		}
	}
	
	this.setTitle = function(title){
		if( this.checkOnElectron() ){
			var ipc = require('electron').ipcRenderer;
			ipc.send('setTitle', title);
		} else {
			$('title').html(title);
		}
	}
	
	this.removeTitleAttributeOnElectron = function(){
		if( this.checkOnElectron() ){
			var $title = $('title');
			var title = $title.html();
			
			$title.remove();
			this.setTitle(title);
		}
	}
	
	this.closeAboutWindowOnEscEvent = function(){
		if( this.checkOnElectron() ){
			document.addEventListener('keydown', function(e){
				if(e.which == 27){
					var ipc = require('electron').ipcRenderer;
					ipc.send('closeAboutWindow');
				}
			});
		}
	}
}

// Instantiating objct for class above
var aaig = new aaig();