function showLoading() {
	$('.loading').show();
}

function hideLoading() {
	$('.loading').hide();
}

function showResult(result, mode) {
	if(mode == 'alert'){
		alert(JSON.stringify(result));
	}else{
		console.log(result);
	}
}

function addToFavourite(data) {
	$('.favourite-off').on('click', function() {
		$(this).addClass('hide');
		$(this).closest('.favourite-icon').find('.favourite-on').removeClass('hide');
		saveForLater(data);
	})
}