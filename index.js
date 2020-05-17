var kartoj = [];
var ludotaj_kartoj = [];
var obeu_url = 1;
$(document).ready(function() {
	$.get('kartoj.json', legu_kartojn);
	if (is_touch_device4()){
		$('#nova_teksto').on({'touchstart':  function(){$(this).css('color', 'red')}});
		$('#nova_teksto').on({'touchend':    function(){$(this).css('color', ''   )}});
		$('#nova_teksto').on({'touchcancel': function(){$(this).css('color', ''   )}});
	}else{
		$('#nova_teksto').on({'mouseenter':  function(){$(this).css('color', 'red')}});
		$('#nova_teksto').on({'mouseleave':  function(){$(this).css('color', ''   )}});
	}
	$('#nova_teksto').click(function(){
		obeu_url = 0;
		elektu_karton();
	});
	$('.vorto').click(function(){
		if ($(this).hasClass('griza')){
			$('.vorto').addClass('griza');
			$(this).removeClass('griza');
		}else{
			$(this).addClass('griza');
		}
	});
});

$(window).resize(adaptigu_tiparon);

function legu_kartojn(json){
	kartoj = json;
	elektu_karton();
}

function elektu_karton(){
	if (localStorage.getItem('Restantaj Kartoj')){
		ludotaj_kartoj = localStorage.getItem('Restantaj Kartoj').split(/,/);
		console.log ('Trovis restantajn kartojn en loka memoro: ' + ludotaj_kartoj);
	}
	if (ludotaj_kartoj.length == 0){
		for (var i = 0; i< kartoj.length; i++){
			ludotaj_kartoj.push(i);
		}
	}
	var hazarda = Math.floor(Math.random() * ludotaj_kartoj.length);
	var karta_indekso = ludotaj_kartoj[hazarda];

	// Se ni ricevis deziratan karton per URL, montru ĝin kaj ne ellistigu la elektitan karton
	if ($(location).attr('hash') && obeu_url){
		karta_indekso = parseInt($(location).attr('hash').replace(/[^0-9\-]/g, '')) - 1;
		console.log('Ricevis per URL: ' + $(location).attr('hash') + ' -> indekso ' + karta_indekso);
	}else{
		ludotaj_kartoj.splice(hazarda, 1);
	}

	var ludata_karto = kartoj[karta_indekso];

	var karta_nombro = parseInt(karta_indekso) + 1; // Laŭ la tradukinto
	console.log('Mi ludos la karton #' + karta_nombro + ' ĉe indekso ' + karta_indekso);
	console.log(ludata_karto);
	console.log('Restas ' + ludotaj_kartoj.length + ' kartoj: ' + ludotaj_kartoj);

	// persistigi la staton en URL kaj kuketoj
	$(location).attr('hash', karta_nombro);
	localStorage.setItem('Restantaj Kartoj', ludotaj_kartoj);

	// enigi la vortojn
	$('.vorto').each(function(indekso, elemento){
		$(elemento).text(ludata_karto[indekso]);
	});
	$('.vorto').addClass('griza');
	adaptigu_tiparon();

}

function adaptigu_tiparon(){
	var fenestro_vasto = $(window).width();
	// http://stackoverflow.com/questions/5844571/reset-changed-css-values
	$('.linio').css("font-size", "");
	$('#nova').css("font-size", "");
	while(1){
		var enhavo_vasto = 0
		$('.linio').each(function(){
			var tiu_vasto = $(this).find('.nombro').outerWidth() + $(this).find('.vorto').outerWidth();
			if (tiu_vasto > enhavo_vasto){
				enhavo_vasto = tiu_vasto;
			}
		});
		if (fenestro_vasto < enhavo_vasto){
			var font_size = parseInt($('.linio').css("font-size"));
			font_size = font_size - 1 + "px";
			$('.linio').css('font-size', font_size);
		}else{
			break;
		}
	}
	while(fenestro_vasto < $('#nova_teksto').width()){
		var font_size = parseInt($('#nova').css("font-size"));
		font_size = font_size - 1 + "px";
		$('#nova').css('font-size', font_size);
	}
}

// https://stackoverflow.com/a/4819886
function is_touch_device4() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function (query) {
        return window.matchMedia(query).matches;
    }
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }
    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}
