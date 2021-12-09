// BUILD PAGE
//********************

var Entries;

// LANDING PAGE


$("i.fas.fa-info-circle").on("click", function(){
	window.open("readme.html");
});

$("body").css("overflow", "hidden");
$("#infopage_box > i").hover(function(e){
	$(e.currentTarget).removeClass("far");
	$(e.currentTarget).addClass("fas");
}, function(e){
	$(e.currentTarget).removeClass("fas");
	$(e.currentTarget).addClass("far");
});
$("#infopage_box > i").click(function() {
	$(".infopage").hide();
	$(".navbar").show();
	$(".page").show();
	$("body").css("overflow", "inherit");
});

$("#nav_logo").on("click", function(e){
	$(".infopage").show();
	$("body").css("overflow", "hidden");
});

////////////////

var currentTheme;
if (Cookies.get("FranceInteractiveNovels_Theme")){
	currentTheme = Cookies.get("FranceInteractiveNovels_Theme");
	if (currentTheme==3){
		$("#darkmode").prop( "checked", true );
	}
} else {
	currentTheme = 2;
}

// CATEGORIES
//-----------
for (var i=0; i < Categories.length; i++){
	$(".sidebar").append('<div class="categorie" id="categorie'+Categories[i].id+'"><div>'+Categories[i].name+'</div><i class="fas fa-check-circle"></i></div>');
	$("#categorie"+Categories[i].id).css("background-color", Categories[i].color);
	
	//activate categories
	Categories[i].active = true;
}

// LOAD DATA
$.getJSON("assets/data/entries.json", function(json) {
    Entries = json;
	
	sortEntries("release");
	
	buildEntries();
});

// ENTRIES
// -------
function buildEntries(){
	for (var i=0; i < Entries.length; i++){
		var html = "";
		html += '<div class="article" id="entry'+Entries[i].id+'">';
		html += '<div class="note">'+Entries[i].note+'</div>';
		html += '<div class="thumb" style="background: url(\'assets/images/thumbs/'+Entries[i].name+'.jpg\'); background-size: cover; background-position: center center;"></div>';
		html += '<div class="titre">'+Entries[i].title+'</div>';
		html += '<div class="foot"><div class="annee">'+Entries[i].release.substr(0,4)+'</div><div class="prixduree">';
		if (Entries[i].price){
			html += '<span class="fas fa-tags"></span>'+parseFloat(Entries[i].price).toFixed(2)+'€';
		}
		html += '<span class="far fa-clock space"></span>'+Entries[i].duration+'</div></div>';
		// cats.............................
		html += '<div class="cats">';
		for (var j=0; j < Entries[i].categories.length; j++){
			html += '<div style="background-color:'+Categories[CategorieGetById(Entries[i].categories[j])].color+'"></div>';
		}
		html += '</div>';
		// close article......................
		html += '</div>';
		
		$(".wrapper").append(html);
		applyTheme(currentTheme);// TODO : COOKIE!!
	}
	
	//  BEHAVIOUR ITEMS
	// ----------------
	$(".article").on("click", function(e){
		
		var id = parseInt($(e.currentTarget).attr('id').substr(5));
		e = EntryGetById(id);
		
		items_array = [];
		for (var i=0; i<Entries.length; i++){
			if ($("#entry"+Entries[i].id).is(":visible")){
				var p = items_array.push(Entries[i].id);
				if (id == Entries[i].id){
					item_shown_index = p-1;
				}
			}
		}
		
		$("#navbox_left").show();
		$("#navbox_right").show();
		
		$("body").css("overflow", "hidden");
		$("#infobox_overlay").show();
		$("#infobox").show();

		showEntry(e);
	});
}

var items_array;
var item_shown_index;

function showEntry(e){
	$("#infobox_note").html(Entries[e].note);
	var months = [null, "jan.", "fev.", "mar.", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "dec."];
	var reldate = Entries[e].release.split("-");
	$("#infobox_release").html(parseInt(reldate[2])+" "+months[parseInt(reldate[1])]+" "+reldate[0]);
	$("#infobox_title").html(Entries[e].title);
	$("#infobox img").prop("src", "assets/images/"+Entries[e].name+".jpg");
	$("#infobox_description").html(Entries[e].description);
	$("#infobox_editor").html(Entries[e].editor);
	$("#infobox_price").html('<i class="fas fa-tags"></i>'+parseFloat(Entries[e].price).toFixed(2)+'€');
	if (Entries[e].price){
		$("#infobox_price").show();
	} else {
		$("#infobox_price").hide();
	}
	$("#infobox_duration").html('<i class="far fa-clock"></i>'+Entries[e].duration);
	$("#infobox_link1").html('<a href="'+Entries[e].link1+'" target="_blank">'+Entries[e].link1_name+'</a>');
	$("#infobox_link2").html('<a href="'+Entries[e].link2+'" target="_blank">'+Entries[e].link2_name+'</a>');
	if (Entries[e].link2){
		$("#infobox_link2").show();
	} else {
		$("#infobox_link2").hide();
	}
	$("#infobox_plus ul").empty();
	if (Entries[e].plus1){
		$("#infobox_plus ul").append("<li>"+Entries[e].plus1+"</li>");
	}
	if (Entries[e].plus2){
		$("#infobox_plus ul").append("<li>"+Entries[e].plus2+"</li>");
	}
	if (Entries[e].plus3){
		$("#infobox_plus ul").append("<li>"+Entries[e].plus3+"</li>");
	}
	$("#infobox_minus ul").empty();
	if (Entries[e].minus1){
		$("#infobox_minus ul").append("<li>"+Entries[e].minus1+"</li>");
	}
	if (Entries[e].minus2){
		$("#infobox_minus ul").append("<li>"+Entries[e].minus2+"</li>");
	}
	if (Entries[e].minus3){
		$("#infobox_minus ul").append("<li>"+Entries[e].minus3+"</li>");
	}
	$("#infobox_categories").empty();
	for (var i=0; i<Entries[e].categories.length; i++){
		$("#infobox_categories").append('<div style="background-color:'+Categories[CategorieGetById(Entries[e].categories[i])].color+'">'+Categories[CategorieGetById(Entries[e].categories[i])].name+"</div>");
	}
	
	$("#infobox").scrollTop(0);
	
	showHideArrows();
}

function EntryGetById(n){
	for (var i=0; i < Entries.length; i++){
		if (n == Entries[i].id) {
			return i;
			break;
		}
	}
}

// OVERLAY CLOSE
$("#infobox > i").on("click", function(){
	$("body").css("overflow", "inherit");
	$("#infobox_overlay").hide();
	$("#infobox").hide();
	$("#navbox_left").hide();
	$("#navbox_right").hide();
});

// NAV ITEMS
function showHideArrows(){
	if (item_shown_index == 0){
		$("#navbox_left").hide();
	} else {
		$("#navbox_left").show();
	}
	if (item_shown_index == items_array.length -1){
		$("#navbox_right").hide();
	} else {
		$("#navbox_right").show();
	}
}
$("#navbox_left").on("click", function(){
	item_shown_index --;
	showEntry(EntryGetById(items_array[item_shown_index]));
});
$("#navbox_right").on("click", function(){
	item_shown_index ++;
	showEntry(EntryGetById(items_array[item_shown_index]));
});

// BEHAVIOUR CATEGORIES
//***************************

var is_first = true;

$(".categorie").on("click", function(e){
	if ($(e.currentTarget).attr('id') != "catall"){
		var n = parseInt($(e.currentTarget).attr('id').substr(9));
		var c = CategorieGetById(n);
		
		$(".categorie div").css("font-weight", 400);
		$("#categorie"+n+" div").css("font-weight", 900);
		
		if (is_first){
			// is_first = false;
			for (var i=0; i < Categories.length; i++){
				$("#categorie"+Categories[i].id+" i").removeClass("fas");
				$("#categorie"+Categories[i].id+" i").addClass("far");
				$("#categorie"+Categories[i].id+" i").css("opacity", 0.3);
				Categories[i].active = false;
			}
		}
		
		if (Categories[c].active){
			Categories[c].active = false;
			$("#categorie"+n+" i").removeClass("fas");
			$("#categorie"+n+" i").addClass("far");
			$("#categorie"+n+" i").css("opacity", 0.3);
		} else {
			Categories[c].active = true;
			$("#categorie"+n+" i").removeClass("far");
			$("#categorie"+n+" i").addClass("fas");
			$("#categorie"+n+" i").css("opacity", 1);
		}
		filterEntries();
		$("html, body").scrollTop(0);
	}
});
$("#catall").on("click", function(){
	
	$(".categorie div").css("font-weight", 400);
	$("#catall div").css("font-weight", 900);
	
	for (var i=0; i < Categories.length; i++){
		$("#categorie"+Categories[i].id+" i").removeClass("far");
		$("#categorie"+Categories[i].id+" i").addClass("fas");
		$("#categorie"+Categories[i].id+" i").css("opacity", 1);
		Categories[i].active = true;
	}
	filterEntries();
	$("html, body").scrollTop(0);
});
function CategorieGetById(n){
	for (var i=0; i < Categories.length; i++){
		if (n == Categories[i].id) {
			return i;
			break;
		}
	}
}
function filterEntries(){
	
	for (var i=0; i < Entries.length; i++){
		
		var vis = false;
		for (var j=0; j < Entries[i].categories.length; j++){
			if (Categories[CategorieGetById(Entries[i].categories[j])].active){
				vis = true;
			}
		}
		if (vis) {
			$("#entry"+Entries[i].id).show();
		} else {
			$("#entry"+Entries[i].id).hide();
		}
	}
}

// SORT
function sortEntries(val, asc){
	
	// fix a-z sorting
	if (val == "title"){
		asc = !asc;
	}
	
	Entries.sort(compare);
	
	function compare( a, b ) {
		if ( a[val] < b[val] ){
			if (asc){
				return -1;
			} else {
				return 1;
			}
		}
		if ( a[val] > b[val] ){
			if (asc){
				return 1;
			} else {
				return -1;
			}
		}
			return 0;
	}
}

$(".navsort").on("click", function(e){
	
	var val = $(e.currentTarget).attr('id').split("_")[1];
	var asc = false;
	
	if ($(e.currentTarget).hasClass("active")){
		if ($("#navsort_"+val+" i").hasClass("fa-angle-down")){
			$("#navsort_"+val+" i").removeClass("fa-angle-down");
			$("#navsort_"+val+" i").addClass("fa-angle-up");
			asc = true;
		} else {
			$("#navsort_"+val+" i").removeClass("fa-angle-up");
			$("#navsort_"+val+" i").addClass("fa-angle-down");
		}
	} else {
		$(".navsort").removeClass("active");
		$(e.currentTarget).addClass("active");
		$(".navsort i").removeClass("fa-angle-up");
		$(".navsort i").addClass("fa-angle-down");
	}
	sortEntries(val, asc);
	$(".wrapper").empty();
	buildEntries();
	filterEntries();
	$("html, body").scrollTop(0);
});

// DARK MODE
//********************
$("#darkmode").on("click", function(e){
	if ($(e.currentTarget).is(":checked")){
		currentTheme = 3;
	} else {
		currentTheme = 2;
	}
	applyTheme(currentTheme);
});

function applyTheme(t){
	for (var i=0; i < Themes.length; i++){
		$(Themes[i][0]).css(Themes[i][1], Themes[i][t]);
	}
	Cookies.set("FranceInteractiveNovels_Theme", t, { expires: 90 });
}