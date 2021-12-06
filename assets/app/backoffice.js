// BUILD PAGE
//********************

var Entries;

$.getJSON("assets/data/entries.json", function(json) {
    Entries = json;
	showItems();
});

function showItems(){
	
	$("#items").empty();
	
	for (var i=0; i < Entries.length; i++){
		var html = "";
		html += '<div class="item" id="item'+Entries[i].id+'"><div class="item-thumb" style="background: url(\'assets/images/thumbs/'+Entries[i].name+'.jpg\'); background-size: cover; background-position: center center;"></div>';
		html += '<div class="item-desc"><div class="item-title">'+Entries[i].title+'</div><div class="item-release">'+Entries[i].release+'</div></div>';
		html += '<button id="item_del'+Entries[i].id+'" class="item_del btn btn-default btn-sm">Del</button><button id="item_edit'+Entries[i].id+'" class="item_edit btn btn-default btn-sm">Edit</button></div>';
		
		$("#items").append(html);
	}
	
	// BEHAVIOUR
	$(".item_edit").on("click", function(e){
		var n = parseInt($(e.currentTarget).attr('id').substr(9));
		var e = getEntryById(n);
		
		is_editing = e;
		added_id = false;
		
		$(".item").css("background-color", "inherit");
		$("#item"+n).css("background-color", "#eaeaea");
		
		$("#edit").show();
		
		$("#edit_title").val(Entries[e].title);
		$("#edit_name").val(Entries[e].name);
		$("#edit_release").val(Entries[e].release);
		$("#edit_note").val(Entries[e].note);
		$("#edit_editor").val(Entries[e].editor);
		$("#edit_duration").val(Entries[e].duration);
		$("#edit_price").val(Entries[e].price);
		$("#edit_description").val(Entries[e].description);
		$("#edit_plus1").val(Entries[e].plus1);
		$("#edit_plus2").val(Entries[e].plus2);
		$("#edit_plus3").val(Entries[e].plus3);
		$("#edit_minus1").val(Entries[e].minus1);
		$("#edit_minus2").val(Entries[e].minus2);
		$("#edit_minus3").val(Entries[e].minus3);
		$("#edit_link1").val(Entries[e].link1);
		$("#edit_link1_name").val(Entries[e].link1_name);
		$("#edit_link2").val(Entries[e].link2);
		$("#edit_link2_name").val(Entries[e].link2_name);
		
		for (var i=0; i<Categories.length; i++){
			$("#cat"+Categories[i].id).prop("checked", false);
		}
		for (var i=0; i<Entries[e].categories.length; i++){
			$("#cat"+Entries[e].categories[i]).prop("checked", true);
		}
		
		$("#edit_name").prop("disabled", true);
	});	
	
	// DELETE
	$(".item_del").on("click", function(e){
		var n = parseInt($(e.currentTarget).attr('id').substr(8));
		var e = getEntryById(n);
		
		if (confirm("Effacer l'entrée ?")) {
			
			delImg(Entries[e].name);
			
			Entries.splice(e, 1);
			saveJson();
			$("#edit").hide();
			showItems();
		}
	});
	
}

for (var i=0; i < Categories.length; i++){
	$("#categories").append('<div class="checkbox"><label><input type="checkbox" value="" id="cat'+Categories[i].id+'">'+Categories[i].name+'</label></div>');
}

// BEHAVIOUR
//**********************

var is_editing;
var added_id;


function getEntryById(n){
	for (var i=0; i<Entries.length; i++){
		if (n == Entries[i].id){
			return i;
			break;
		}
	}	
}

$("#edit_save").on("click", function(){
	
	if (added_id){
		var entry = {};
		entry.id = added_id;
		Entries.push(entry);
		is_editing = getEntryById(added_id);
	}
	
	Entries[is_editing].title = $("#edit_title").val();
	Entries[is_editing].name = $("#edit_name").val();
	Entries[is_editing].release = $("#edit_release").val();
	Entries[is_editing].note = $("#edit_note").val();
	Entries[is_editing].editor = $("#edit_editor").val();
	Entries[is_editing].duration = $("#edit_duration").val();
	Entries[is_editing].price = $("#edit_price").val();
	Entries[is_editing].description = $("#edit_description").val();
	Entries[is_editing].plus1 = $("#edit_plus1").val();
	Entries[is_editing].plus2 = $("#edit_plus2").val();
	Entries[is_editing].plus3 = $("#edit_plus3").val();
	Entries[is_editing].minus1 = $("#edit_minus1").val();
	Entries[is_editing].minus2 = $("#edit_minus2").val();
	Entries[is_editing].minus3 = $("#edit_minus3").val();
	Entries[is_editing].link1 = $("#edit_link1").val();
	Entries[is_editing].link1_name = $("#edit_link1_name").val();
	Entries[is_editing].link2 = $("#edit_link2").val();
	Entries[is_editing].link2_name = $("#edit_link2_name").val();
	
	var cats = [];
	for (var i=0; i<Categories.length; i++){
		if ($("#cat"+Categories[i].id).prop("checked")){
			cats.push(Categories[i].id);
		}
	}
	Entries[is_editing].categories = cats;
	
	saveJson();
	
	$("#edit").hide();
	showItems();
});

$("#items_add").on("click", function(){
	// get new entry id
	var id = 1;
	while(getEntryById(id) != undefined){
		id++;
	}
	added_id = id;

	$(".item").css("background-color", "inherit");
	
	$("#edit").show();
	
	$("#edit_title").val("");
	$("#edit_name").val("");
	$("#edit_release").val("");
	$("#edit_note").val("");
	$("#edit_editor").val("");
	$("#edit_duration").val("");
	$("#edit_price").val("");
	$("#edit_description").val("");
	$("#edit_plus1").val("");
	$("#edit_plus2").val("");
	$("#edit_plus3").val("");
	$("#edit_minus1").val("");
	$("#edit_minus2").val("");
	$("#edit_minus3").val("");
	$("#edit_link1").val("");
	$("#edit_link1_name").val("");
	$("#edit_link2").val("");
	$("#edit_link2_name").val("");
	
	for (var i=0; i<Categories.length; i++){
		$("#cat"+Categories[i].id).prop("checked", false);
	}
	
	$("#edit_name").prop("disabled", false);
});

// IMAGE UPLOAD
async function uploadFile() {
	if ($("#edit_name").val() != ""){
		let formData = new FormData(); 
		formData.append("file", file_upload.files[0]);
		formData.append("val", $("#edit_name").val());
		await fetch('assets/server/upload_img.php', {
			method: "POST", 
			body: formData
		});
		$("#edit_name").prop("disabled", true);
		alert('The file has been uploaded successfully.');
	} else {
		alert('ERROR: name needed');
	}
}

// SAVE JSON
async function saveJson() {
	let formData = new FormData(); 
	formData.append("entries", JSON.stringify(Entries));
	await fetch('assets/server/save_json.php', {
		method: "POST", 
		body: formData
	}); 
}

// DELETE IMAGE
async function delImg(name) {
	let formData = new FormData(); 
	formData.append("name", name);
	await fetch('assets/server/delete_img.php', {
		method: "POST", 
		body: formData
	}); 
}