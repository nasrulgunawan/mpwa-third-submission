const base_url = "https://api.football-data.org/";
var apiToken = '4a0cb9df07fc46e183314afc2a95c8d9';

function status(response) {
	if (response.status !== 200) {
		console.log(`Error: ${response.status}`);
		return Promise.reject(new Error(response.statusText));
	}else{
		return Promise.resolve(response);
	}
}

function json(response) {
	return response.json();
}

function error(error) {
	console.log(`Error: ${error}`);
	// standingHTML = '<tr><td class="text-center" colspan="7">Data tidak tersedia</td></tr>';
	// document.getElementById("standings").innerHTML = standingHTML;
	hideLoading();
}

var myHeaders = new Headers({
  'X-Auth-Token': apiToken
});

function getStandings(league_id = 2001) {
	showLoading();

	if ("caches" in window) {
		caches.match(`${base_url}v2/competitions/${league_id}/standings`).then(function(response) {
		  if (response) {
		    response.json().then(function(data) {
		     
				var result = data.standings[0].table
				var standingHTML = "";

				result.forEach(function(standing) {
					var logo = standing.team.crestUrl;
					logo = logo.replace(/^http:\/\//i, 'https://');
					standingHTML += `
					  <tr>
					  	<td>${standing.position}</td>
					  	<td><img class="team-fb-logo" src="${logo == null ? '/images/default_team_image.png' : logo}"></td>
					  	<td>${standing.team.name}</td>
					  	<td>${standing.won}</td>
					  	<td>${standing.points}</td>
					  	<td><a href="./team_matches.html?id=${standing.team.id}" class="waves-effect waves-light pink darken-1 btn-small">Detail</a></td>
					  </tr>
					 `;
				});


				document.getElementById("standings").innerHTML = standingHTML;
				hideLoading();
		    });
		  }
		});
		}


	fetch(`${base_url}v2/competitions/${league_id}/standings`, { headers: myHeaders })
		.then(status)
		.then(json)
		.then(function(data) {

			var result = data.standings[0].table
			var standingHTML = "";

			result.forEach(function(standing) {
				var logo = standing.team.crestUrl;
				logo = logo.replace(/^http:\/\//i, 'https://');
				standingHTML += `
				  <tr>
				  	<td>${standing.position}</td>
				  	<td><img class="team-fb-logo" src="${logo == null ? '/images/default_team_image.png' : logo}"></td>
				  	<td>${standing.team.name}</td>
				  	<td>${standing.won}</td>
				  	<td>${standing.points}</td>
				  	<td><a href="./team_matches.html?id=${standing.team.id}" class="waves-effect waves-light pink darken-1 btn-small">Detail</a></td>
				  </tr>
				 `;
			});

			document.getElementById("standings").innerHTML = standingHTML;
			hideLoading();
		})
		.catch(function() {
			standingHTML = '<tr><td class="text-center" colspan="7">Data tidak tersedia</td></tr>';
			document.getElementById("standings").innerHTML = standingHTML;
			hideLoading();
		});
}


function getMatches() {
	showLoading();

	if ("caches" in window) {
		caches.match(`${base_url}v2/competitions/${league_id}/standings`).then(function(response) {
		  if (response) {
		    response.json().then(function(data) {
		     
			    var result = data.standings[0].table

				var standingHTML = "";
				result.forEach(function(standing) {
					let logo = standing.team.crestUrl;
					logo = logo.replace(/^http:\/\//i, 'https://');

					standingHTML += `
					  <div class="card card-fb-rounded">
					    <div class="card-content black-text">
							<div class="row no-margin-bottom">
							  <div class="col s2 m2">
								<div class="position">${standing.position}</div>
							  </div>
							  <div class="col s2 m2 text-center">
							  	<img class="team-fb-logo" src="${logo}">
							  </div>
							  <div class="col s8 m8">
							  	${standing.team.name}
							  </div>
							</div>
					    </div>
					  </div>
					 `;
				});

				document.getElementById("standings").innerHTML = standingHTML;
				hideLoading();
		    });
		  }
		});
	}


	fetch(`${base_url}v2/competitions/${league_id}/standings`, { headers: myHeaders })
		.then(status)
		.then(json)
		.then(function(data) {

			var result = data.standings[0].table
			// alert(JSON.stringify(result))

			var standingHTML = "";
			result.forEach(function(standing) {
				let logo = standing.team.crestUrl;
				logo = logo.replace(/^http:\/\//i, 'https://');
				
				standingHTML += `
				  <div class="card card-fb-rounded">
				    <div class="card-content black-text">
						<div class="row no-margin-bottom">
						  <div class="col s2 m2">
							<div class="position">${standing.position}</div>
						  </div>
						  <div class="col s2 m2 text-center">
						  	<img class="team-fb-logo" src="${logo}">
						  </div>
						  <div class="col s8 m8">
						  	${standing.team.name}
						  </div>
						</div>
				    </div>
				  </div>
				 `;
			});

			// standingHTML == null ? standingHTML = '<tr><td colspan="6">Data tidak tersedia</td></tr>' : standingHTML = standingHTML

			document.getElementById("standings").innerHTML = standingHTML;
			hideLoading();
		})
		.catch(error);
}

function getTeamMatch() {
  let params = new URLSearchParams(window.location.search);
  let team_id = params.get("id");
  let isSaved = params.get("saved");
  showLoading();

  fetch(`${base_url}v2/teams/${team_id}/matches?status=SCHEDULED`, { headers: myHeaders })
    .then(status)
    .then(json)
    .then(function(data) {
    	showResult(data)
    	var result = data.matches
		var matchesHTML = "";
    	
    	var item = getDetailTeam(team_id);
    	item.then(function(data) {
	      addToFavourite(data);
	    });

		result.forEach(function(match) {
			matchesHTML += `
			  <div class="card card-fb-rounded">
			    <div class="card-content black-text text-center">
				    <div class="row">
				      <div class="col s12 m12">
				      	<b class="pink-text text-darken-1">${match.competition.name}</b>
				      	<br>
				      	<span class="pink-text text-darken-1">${match.utcDate}</span>
				      </div>
					</div>

					<div class="row">
					  <div class="col s4 m4">
						<img class="team-fb-logo" src="/images/default_team_image.png">
						<br>
						<span>${match.homeTeam.name}</span>
					  </div>
					  <div class="col s4 m4">
					  	<b>VS</b>
					  </div>
					  <div class="col s4 m4">
					  	<img class="team-fb-logo" src="/images/default_team_image.png">
						<br>
					  	<span>${match.awayTeam.name}</span>
					  </div>
					</div>
			    </div>
			  </div>
			 `;

	  	// getLogo(match.homeTeam.id);
		});

      document.getElementById("matches").innerHTML = matchesHTML;
      hideLoading();
    })
    .catch(error);
}

function getDetailTeam(team_id) {
  showLoading();

  return new Promise(function(resolve, reject) {

  if ("caches" in window) {
		caches.match(`${base_url}v2/teams/${team_id}`).then(function(response) {
		  if (response) {
		    response.json().then(function(data) {
		     	
		     	let logo = data.crestUrl;
		     	logo = logo.replace(/^http:\/\//i, 'https://');
			    $('#team_logo').attr('src', logo);
		    	$('#team_name').html(data.name);
		    	$('.team_email').html(data.email);
		    	$('#team_short_name').html(data.shortName);
		    	$('#team_founded').html(data.founded);
		    	$('#team_website').attr('href', data.website);
		    	$('#team_phone').html(data.phone);
		    	$('#team_club_colors').html(data.clubColors);
		    	$('#team_address').html(data.address);

		    	listPlayer = '';
		    	data.squad.forEach(function(player) {
					listPlayer += `
					  <div class="col s12 m8 offset-m2 l6 offset-l3">
		                <div class="card-panel grey lighten-5 mbr-5 card-fb-rounded">
		                  <div class="row valign-wrapper no-margin-bottom player">
		                    <div class="col s3">
		                      <i class="material-icons medium responsive-img">account_circle</i> <!-- notice the "circle" class -->
		                    </div>
		                    <div class="col s9">
		                      <p class="heading-fb pink-text text-darken-1">${player.name}</p>
		                      <p><strong>Position:</strong> ${player.position}</p>
		                      <p><strong>Nationality:</strong> ${player.nationality}</p>
		                    </div>
		                  </div>
		                </div>
		              </div>
					 `;
				});

		      	document.getElementById("player-content").innerHTML = listPlayer;
		      	resolve(data)
		      	hideLoading();
		      	$('.tooltipped').tooltip();
		    });
		  }
		});
	}

  fetch(`${base_url}v2/teams/${team_id}`, { headers: myHeaders })
    .then(status)
    .then(json)
    .then(function(data) {
    	showResult(data)
		let logo = data.crestUrl;
		logo = logo.replace(/^http:\/\//i, 'https://');

    	$('#team_logo').attr('src', logo);
    	$('#team_name').html(data.name);
    	$('.team_email').html(data.email);
    	$('#team_short_name').html(data.shortName);
    	$('#team_founded').html(data.founded);
    	$('#team_website').attr('href', data.website);
    	$('#team_phone').html(data.phone);
    	$('#team_club_colors').html(data.clubColors);
    	$('#team_address').html(data.address);

    	listPlayer = '';
    	data.squad.forEach(function(player) {
			listPlayer += `
			  <div class="col s12 m8 offset-m2 l6 offset-l3">
                <div class="card-panel grey lighten-5 mbr-5 card-fb-rounded">
                  <div class="row valign-wrapper no-margin-bottom">
                    <div class="col s3">
                      <i class="material-icons medium responsive-img">account_circle</i> <!-- notice the "circle" class -->
                    </div>
                    <div class="col s9">
                      <p class="heading-fb pink-text text-darken-1">${player.name}</p>
                      <p><strong>Position:</strong> ${player.position}</p>
                      <p><strong>Nationality:</strong> ${player.nationality}</p>
                    </div>
                  </div>
                </div>
              </div>
			 `;
		});

      	document.getElementById("player-content").innerHTML = listPlayer;
    	resolve(data)
    	hideLoading();

    })
    .catch(error);

  });
}

function getSavedTeams() {
  showLoading();
  getAll().then(function(data) {
    
  	listTeam = '';
	data.forEach(function(team) {
		let logo = team.crestUrl;
		logo = logo.replace(/^http:\/\//i, 'https://');
		listTeam += `
		<a href="./team_matches.html?id=${team.id}">
		  <div class="col s12 m8 offset-m2 l6 offset-l3">
            <div class="card-panel grey lighten-5 mbr-5 card-fb-rounded">
              <div class="row valign-wrapper no-margin-bottom player">
                <div class="col s3">
                  <img class="team-fb-logo" src="${logo == null ? '/images/default_team_image.png' : logo}">
                </div>
                <div class="col s9">
                  <p class="heading-fb pink-text text-darken-1">${team.name}</p>
                  <p><strong>Short Name:</strong> ${team.shortName}</p>
                  <p><strong>Founded:</strong> ${team.founded}</p>
                </div>
              </div>
            </div>
          </div>
         </a>
		`;
	});

	$('.container').css('width', '100%');

  	document.getElementById("favourite_team").innerHTML = listTeam;
  	hideLoading();
  });
}

function getSavedTeamById() {
  var urlParams = new URLSearchParams(window.location.search);
  var teamId = urlParams.get("id");
  
  alert(teamId)
  getById(teamId).then(function(data) {
  });

  // alert(JSON.stringify(getById(teamId)));
}
