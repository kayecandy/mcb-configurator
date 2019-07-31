CNDCE.ConfiguratorOptions = {
	colors: {
		name: "Color",
		icon: "./assets/images/icon-color.svg",
		defaultChoice: 1,
		choices: [
			{
				name: 'White',
				color: '#e0e0e0',
				bg: '#e0e0e0',
				metalness: {
					front: 0.8,
					back: 0.8
				},
				roughness: {
					front: 0.2,
					back: 0.2
				}
			},
			{
				name: 'Red',
				color: '#d0070f',
				bg: '#d0070f',
				metalness: {
					front: 0.73,
					back: 0.73
				},
				roughness: {
					front: 0.02,
					back: 0.02
				}
			},
			{
				name: 'Yellow',
				color: '#e8c814',
				bg: '#e8c814',
				metalness: {
					front: 0.73,
					back: 0.73
				},
				roughness: {
					front: 0.02,
					back: 0.02
				}
			}
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice cndce-choice-color"></div>');

			$div.css({
				'background': choice.bg
			});

			return $div;
		},
		applyChoices: function(choice, model, scene){
			CNDCE.ConfiguratorFunctions.changeColor(model, choice);
		}
	},
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
		name: 'Telescoping Scene Lights',
		defaultChoice: 0,
		optionType: 'switches',
		icon: './assets/images/icon-telescopinglights.png',
		choices: [
			{
				name: 'Telescoping Scene Light Front of Body',
				modelName: 'TelescopingLightsL',
				isActive: false
			},
			{
				name: '2nd Telescoping Scene Light Front of Body',
				modelName: 'TelescopingLightsR',
				isActive: false
			}
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice cndce-choice-telescopinglights"></div>')


			$div.html(choice.name);

			return $div;
		},
		applyChoices:function(choice, model, scene){
			var telescopingLights = model.getObjectByName('TelescopingLights');
			var telescopingLight = telescopingLights.getObjectByName(choice.modelName);

			telescopingLight.visible = choice.isActive;

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
	},
	hitch: {
		name: "Trailer Hitch",
		defaultChoice: 0,
		optionType: "toggle",
		choices: [
			{
				name: 'Without hitch',
				image: './assets/images/icon-nohitch.png'
			},
			{
				name: 'With hitch & light connector',
				image: './assets/images/icon-nohitch.png'
			}
		],
		applyChoices: function(choice, model, scene){
			var hitch = model.getObjectByName('TrailerHitch');

			if(choice.name == 'Without hitch'){
				hitch.visible = false;
			}else{
				hitch.visible = true;
			}
		}
	},
	hoseTray: {
		name: 'Additional Hose Storage',
		optionType: 'switches',
		icon: './assets/images/icon-hosetray.png',
		defaultChoice: 0,
		choices: [
			{
				name: 'Hose Tray, Top of Side Compartment, 200\' of 2 1/2" Hose',
				image: './assets/images/icon-hosetray.png',
				isActive: false
			},
			{
				name: 'Hose Tray, Top of Side Compartment, 200\' of 1 1/2" Hose',
				image: './assets/images/icon-hosetray.png',
				isActive: false
			}
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice cndce-choice-hosetray"></div>')


			$div.html(choice.name);

			return $div;

			
		},
		applyChoices: function(choice, model, scene){
			

			if(!model.userData.hoseTray)
				model.userData.hoseTray = {};

			model.userData.hoseTray[choice.name] = choice.isActive;

			CNDCE.ConfiguratorFunctions.toggleHoseTray(model);
			


			

		}
	},
	frontCompartment: {
		name: 'Front Compartment',
		optionType: 'toggle',
		defaultChoice: 0,
		choices: [
			{
				name: 'Enclosed',
				image: './assets/images/icon-enclosed.png'
			},
			{
				name: 'Transverse',
				image: './assets/images/icon-enclosed.png'
			}
		],
		applyChoices: function(choice, model, scene){
			var modelBack = model.getObjectByName('Back');

			var enclosed = [
				modelBack.getObjectByName('Body').getObjectByName('Top'),
				modelBack.getObjectByName('Body').getObjectByName('Inside'),
				modelBack.getObjectByName('ContainersLeft').getObjectByName('Body1'),
				modelBack.getObjectByName('ContainersRight').getObjectByName('Body1'),
				modelBack.getObjectByName('Misc').getObjectByName('BlackBox'),
				modelBack.getObjectByName('NormalTray1'),
				modelBack.getObjectByName('SlideOutTray1')
			];

			var transverse = [
				modelBack.getObjectByName('TransverseCompartment'),
				modelBack.getObjectByName('NormalTray4'),
				modelBack.getObjectByName('SlideOutTray4')
			];

			if(choice.name == 'Enclosed'){
				for(var i=0; i < enclosed.length; i++){
					enclosed[i].visible = true;
				}

				for(var i=0; i < transverse.length; i++){
					transverse[i].visible = false;
				}
			}else{

				for(var i=0; i < enclosed.length; i++){
					enclosed[i].visible = false;
					console.log('te', enclosed[i].name);
				}

				for(var i=0; i < transverse.length; i++){
					transverse[i].visible = true;
				}

			}
		}
	}
	
	
}
