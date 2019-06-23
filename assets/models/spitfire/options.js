CNDCE.ConfiguratorOptions = {
	bodyType: {
		name: "Body Type",
		icon: "./assets/images/icon-crewcab.png",
		optionType: "toggle",
		defaultChoice: 0,
		choices: [
			{
				name: 'Crew Cab',
				image: './assets/images/icon-crewcab.png',

			},
			{
				name: 'Regular Cab',
				image: './assets/images/icon-regcab.jpg'
			}
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice cndce-choice-bodytype"></div>')
			$div.css({
				backgroundImage: 'url(' + choice.image + ')'
			});

			return $div;
		},
		applyChoices: function(choice, model, scene){
			var front = model.getObjectByName('Front');
			var regularCab = front.getObjectByName('RegularCab');
			var crewCab = front.getObjectByName('CrewCab');

			if(choice.name == 'Crew Cab'){
				regularCab.visible = false;
				crewCab.visible = true;
				front.position.x = 0;

			}else if(choice. name == 'Regular Cab'){
				regularCab.visible = true;
				crewCab.visible = false;
				front.position.x = 1.9;
			}
		}
	},
	bumper: {
		name: "Bumper",
		defaultChoice: 1,
		optionType: "toggle",
		choices: [
			{
				name: 'Has Bumper',
				hasBumper: true,
				image: './assets/images/icon-bumper.png'
			},
			{
				name: 'No Bumper',
				hasBumper: false,
				image: './assets/images/icon-nobumper.png'
			}
		],
		applyChoices:function(choice, model, scene){
			var bumper = model.getObjectByName('Addons').getObjectByName('Bumper');

			bumper.visible = choice.hasBumper;

		}
	},
	winch: {
		name: "Winch",
		defaultChoice: 1,
		optionType: "toggle",
		choices: [
			{
				name: 'Has Winch',
				hasWinch: true,
				image: './assets/images/icon-winch.png'
			},
			{
				name: 'No Winch',
				hasWinch: false,
				image: './assets/images/icon-nowinch.png'
			}
		],
		applyChoices:function(choice, model, scene){
			var winch = model.getObjectByName('Addons').getObjectByName('Winch');

			winch.visible = choice.hasWinch;

		}
	},
	telescopingLights: {
		name: "Telescoping Lights",
		defaultChoice: 1,
		optionType: "toggle",
		choices: [
			{
				name: 'Has Telescoping Lights',
				hasTelescopingLights: true,
				image: './assets/images/icon-telescopinglights.png'
			},
			{
				name: 'No Telescoping Lights',
				hasTelescopingLights: false,
				image: './assets/images/icon-notelescopinglights.png'
			}
		],
		applyChoices:function(choice, model, scene){
			var telescopingLights = model.getObjectByName('TelescopingLights');

			telescopingLights.visible = choice.hasTelescopingLights;

		}
	},
	trays: {
		name: "Trays",
		defaultChoice: 0,
		optionType: "toggle",
		choices: [
			{
				name: 'Normal Trays',
				image: './assets/images/icon-normaltrays.png'
			},
			{
				name: 'Slide Out Trays',
				image: './assets/images/icon-slideouttrays.png'
			}
		],
		applyChoices: function(choice, model, scene){
			var trays = model.getObjectByName('Trays');
			var normalTrays = trays.getObjectByName('NormalTrays');
			var slideoutTrays = trays.getObjectByName('SlideOutTrays');

			if(!CNDCE.isDoorsOpen){
				CNDCE.ConfiguratorFunctions.toggleDoors({}, model, scene);
			}


			if(choice.name == 'Normal Trays'){
				slideoutTrays.visible = false;
				normalTrays.visible = true;
			}else{
				slideoutTrays.visible = true;
				normalTrays.visible = false;
			}
		}
	}
	
	
	
}
