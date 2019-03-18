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

function removeFromFavourite(id){
	$('.favourite-off').hide();
	$('.favourite-on').removeClass("hide").show();
	$('.favourite-on').on('click', function() {
		$(this).addClass('hide');
		$(this).closest('.favourite-icon').find('.favourite-off').removeClass('hide').show();
		deleteTeam(id);
	})
}