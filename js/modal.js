/* Plugin modal de diálogos
 * 
 * Baseado no componente de modal do Bootstrap.
 * 
 * Formas de Uso:
 *	abrirModal( pagina, [titulo, callback] )
 *	fecharModal( [callback] )
 */

function modal(){}

modal.instanciar = function(mensagem, parametros, titulo, callback, tem_modal, tem_animacao, arrastavel){
	var tipo = 'm';
	if(typeof tem_modal == 'undefined') tem_modal = true;
	if(typeof tem_animacao == 'undefined') tem_animacao = true;
	if(typeof arrastavel == 'undefined') arrastavel = true;
	var classe_titulo;
	var resultado = false;
	var botoes_modal = $("<button />").addClass('btn btn-default btn-dynamic btn-ok').attr('data-dismiss', 'modal').html('OK').click(function(){
		resultado = true;
	});
	var backdrop;
	if(tem_modal){
		backdrop = true;
	} else {
		backdrop = false;
	}
	classe_titulo = 'janela_modal modal_pagina';
	if(tem_animacao) classe_titulo += ' fade';
	
	var $janela_modal = $("<div />").data('tipo', tipo).addClass('modal ' + classe_titulo).append(
		$("<div />").addClass('modal-dialog').append(
			$("<div />").addClass('modal-content')
		)
	);
	var $dialogo_janela_modal = $janela_modal.find('div.modal-dialog');
	var $conteudo_janela_modal = $janela_modal.find('div.modal-content');
	var $corpo_janela_modal = '';
	var $mensagem_janela_modal = '';
	
	var $modal_header = $("<div />").addClass('modal-header').append(
		$("<button />").attr({
			"type": "button",
			"data-dismiss": "modal",
			"aria-label": "Close"
		}).addClass('close').html(
			$("<span />").attr('aria-hidden', 'true').html('&times;')
		)
	);
	$modal_header.append(
		$("<h4 />").addClass('modal-title').html(titulo)
	);
	var $modal_body = $("<div />").addClass('modal-body');
	$conteudo_janela_modal.append($modal_header).append($modal_body);

	$conteudo_janela_modal.append(
		$("<div />").addClass('modal-footer').append(botoes_modal)
	)
	$corpo_janela_modal = $conteudo_janela_modal.find('div.modal-body');

	var mensagem_modal = 'Carregando...';
	$mensagem_janela_modal = $("<table />").attr('align', 'center').html(
		$("<tr />").append(
			$("<td />").attr('colspan', '2').addClass('mensagem_modal').html(mensagem_modal)
		)
	);
	$corpo_janela_modal.append($mensagem_janela_modal);
	
	centralizarModal = function(apenas_verticalmente){
		if(typeof apenas_verticalmente == 'undefined') apenas_verticalmente = false;
		
		var largura_janela = $(window).width();
		var altura_janela = $(window).height();
		var largura_modal = $dialogo_janela_modal.width();
		var altura_modal = $dialogo_janela_modal.height();
		var margem_esquerda = Math.max(0, (largura_janela - largura_modal) / 2);
		if(getDispositivo() == 'xs'){
			margem_esquerda = 10;
		} else {
			margem_esquerda = Math.max(0, (largura_janela - largura_modal) / 2);
		}
		var margem_direita;
		if(apenas_verticalmente){
			margem_direita = 20;
		} else {
			margem_direita = Math.max(0, (altura_janela - altura_modal) / 2);
		}
		
		$dialogo_janela_modal.css({
			'marginLeft': margem_esquerda,
			'marginTop': margem_direita
		});
	}
	
	var id = 'modal';
	$janela_modal.appendTo('body').attr('id', id);
	$janela_modal.on({
		'show.bs.modal': function(e) {
			centralizarModal(true);
			$janela_modal.find('button.btn-ok').trigger('focus');
		},
		'shown.bs.modal': function(e) {
			
		},
		'hidden.bs.modal': function(e) {
			$janela_modal.remove();
		}
	});
	$janela_modal.modal({
		'show': true,
		'backdrop': backdrop
	});
	if(arrastavel){
		var drags = '.modal-header';
		$janela_modal.drags({'handle': drags});
	}
	
	var pagina = mensagem;
	var metodo;
	if(typeof parametros != 'undefined'){
		metodo = 'POST';
	} else {
		metodo = 'GET';
	}
	$.ajax({
		type: metodo,
		cache: false,
		url: pagina,
		data: parametros,
		timeout: 5000,
		error: function(jqXHR, textStatus){
			$corpo_janela_modal.html("<b style='color: red; font-weight: bold'>Erro ao carregar página!</b>");
		},
		success: function(d) {
			$corpo_janela_modal.html(d);
			if(callback) callback(resultado);
		}
	});
}

function abrirModal(pagina, titulo, callback, tem_modal, tem_animacao){
	modal.instanciar(pagina, '', titulo, callback, tem_modal, tem_animacao, false);
}

function fecharModal(callback){
	var $janela_modal = $('div.janela_modal').last();
	$janela_modal.on('hidden.bs.modal', callback);
	$janela_modal.modal('hide');
}