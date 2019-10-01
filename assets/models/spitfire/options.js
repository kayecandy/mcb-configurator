CNDCE.ConfiguratorOptions = {
	bodyType: {
		name: "Body Type",
		longName: "Chassis Cab Configuration",
		defaultChoice: 1,
		cameraPosition: {x: -1.7756007484124994, y: 3.568459579341723, z: 21.815799913218797},
		controlsTarget: {x: -0.8016136961964155, y: -6.230836516418912e-17, z: 0.8431390501944254},
		category: "chassis",
		choices: [
			{
				name: 'Crew Cab',
				icon: './assets/models/spitfire/icons/bodytype/crewcab.png',
				price: 1500

			},
			{
				name: 'Standard Cab',
				icon: './assets/models/spitfire/icons/bodytype/regcab.png'
			}
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice"></div>')
			var $bgDiv = $('<div class="cndce-option-bg"></div>')

			
			$bgDiv.css({
				'background-image': 'url(' + choice.icon + ')'
			})

			$div.append($bgDiv);

			return $div;
		},
		applyChoices: function(choice, model, scene){
			var front = model.getObjectByName('Front');
			var regularCab = front.getObjectByName('RegularCab');
			var crewCab = front.getObjectByName('CrewCab');

			var cabVisible, cabHidden, cabPositionX;

			if(choice.name == 'Crew Cab'){
				cabVisible = crewCab;
				cabHidden = regularCab;
				cabPositionX = 0;

			}else if(choice.name == 'Standard Cab'){
				cabVisible = regularCab;
				cabHidden = crewCab;
				cabPositionX = 1.9;
			}

			if(cabVisible.visible)
				return;

			cabHidden.visible = true;
			cabVisible.visible = true;

			new TWEEN.Tween({
					opacityVisible: 0,
					opacityHidden: 1,
					positionX: front.position.x
				})

				.to({
					opacityVisible: 1,
					opacityHidden: 0,
					positionX: cabPositionX
				}, CNDCE.OPACITY_TWEEN_DURATION)

				.easing(CNDCE.OPACITY_TWEEN_EASING)		

				.onUpdate(function(){
					var tween = this;
					front.position.x = this.positionX;


					cabVisible.traverse(function(node){
						if(node.material){
							node.material.opacity = node.userData.opacity ? node.userData.opacity : tween.opacityVisible;
							node.material.transparent = true;
						}
					})

					cabHidden.traverse(function(node){
						if(node.material){
							
							node.material.opacity = tween.opacityHidden;
							node.material.transparent = true;
						}
					})

				})

				.onComplete(function(){
					cabHidden.visible = false;

					cabVisible.traverse(function(node){
						if(node.material){
							if(!node.userData.opacity){
								node.material.transparent = false;
							}
						}
					})
				})

				.start();
		}
	},
	wheels: {
		name: 'Wheels',
		longName: 'Chassis Wheels',
		optionType: 'toggle',
		defaultChoice: 1,
		category: "chassis",
		choices: [
			{
				name: 'Polished Aluminum Wheels',
				price: 1500
			},
			{
				name: 'Painted OEM Wheels'
			}
		]
	},
	bumper: {
		name: "Bumper",
		longName: "Chassis Appearance Package",
		defaultChoice: 1,
		category: "chassis",
		cameraPosition: {x: -14.4052021671524, y: 1.0669669229603702, z: -7.846095982688091},
		controlsTarget: {x: -3.9391022458575264, y: -1.204711385685817e-17, z: 0.6986376721317923},
		choices: [
			{
				name: 'Chrome Bumper & Grille',
				opacity: 0,
				color: '#9e9e9e',
				reflectivity: 1,
				icon: './assets/models/spitfire/icons/bumper/chrome.png',
				price: 340,
			},
			{
				name: 'Black Bumper, Black Grille',
				opacity: 0,
				color: '#0d0d0d',
				reflectivity: 0.8,
				icon: './assets/models/spitfire/icons/bumper/black.png'
			},
			{
				name: 'Buckstop Bumper w/ Grille Guard',
				opacity: 1,
				color: '#0d0d0d',
				reflectivity: 0.8,
				price: 3000,
				icon: './assets/models/spitfire/icons/bumper/buckstop.png'
			}
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice"></div>')
			// var $bgDiv = $('<div class="cndce-option-bg"></div>')

			
			$div.css({
				'background-image': 'url(' + choice.icon + ')'
			})

			// $div.append($bgDiv);

			return $div;
		},
		applyChoices:function(choice, model, scene){
			var bumper = model.getObjectByName('FrontParts').getObjectByName('Bumper');
			var bumperBuckstop = model.getObjectByName('Addons').getObjectByName('Bumper');


			CNDCE.ConfiguratorFunctions.setModelOpacity(bumperBuckstop, choice.opacity);

			var choiceColor = new THREE.Color(choice.color);
			var bumperColor = bumper.material.color;


			if(choiceColor.getHex() != bumperColor.getHex()){
				new TWEEN.Tween({
						colorR: bumperColor.r,
						colorG: bumperColor.g,
						colorB: bumperColor.b,
						reflectivity: bumper.material.reflectivity

					})

					.to({
						colorR: choiceColor.r,
						colorG: choiceColor.g,
						colorB: choiceColor.b,
						reflectivity: choice.reflectivity
					}, CNDCE.OPACITY_TWEEN_DURATION)

					.easing(CNDCE.OPACITY_TWEEN_EASING)

					.onUpdate(function(){
						bumperColor.setRGB(this.colorR, this.colorG, this.colorB);
						bumper.material.reflectivity = this.reflectivity;
					})

					.start();
			}


			

		}
	},
	colors: {
		name: "Color",
		longName: "Chassis Paint",
		defaultChoice: 0,
		cameraPosition: {x: -18.8942154326018, y: 3.853852333769813, z: 10.468144535013506},
		controlsTarget: {x: -2.193178097862315, y: 1.0157851305517751e-16, z: -0.1387968760967085},
		category: "chassis",
		choices: [
			{
				name: 'Race Red Exterior Color',
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
			},
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
			
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice"></div>');

			$div.css({
				'background': choice.bg
			});

			return $div;
		},
		applyChoices: function(choice, model, scene){
			CNDCE.ConfiguratorFunctions.changeColor(model, choice);
		}
	},
	winch: {
		name: "Winch",
		longName: "Winch Option",
		defaultChoice: 1,
		optionType: "toggle",
		cameraPosition: {x: -18.634640581462925, y: 1.066966910003352, z: 0.28660077966635944},
		controlsTarget: {x: -4.528733204788705, y: 1.224512827439634e-17, z: 2.2949725851767604},
		category: "chassis",
		choices: [
			{
				name: 'With Winch',
				opacity: 1,
				price: 3000
			},
			{
				name: 'No Winch',
				opacity: 0
			}
		],
		applyChoices:function(choice, model, scene){
			var winch = model.getObjectByName('Addons').getObjectByName('Winch');

			CNDCE.ConfiguratorFunctions.setGroupOpacity(winch, choice.opacity);
		}
	},


	lightbar: {
		name: "Lightbar",
		longName: "Emergency Warning & Lighting Package",
		defaultChoice: 0,
		optionType: "toggle",
		cameraPosition: {x: -17.470885813303866, y: 4.530231010256712, z: 5.9005331776281595},
		controlsTarget: {x: 1.048596646552764, y: 4.343326425075145e-17, z: 1.8809446767855744},
		category: "body",
		choices: [
			{
				name: "Wheelen Warning & Lighting System"
			},
			{
				name: "Tomar Warning & Lighting System",
				price: 500
			}
		],
		applyChoices:  function(choice, model, scene){

		}
	},
	telescopingLights: {
		name: 'Telescoping Scene Lights',
		optionType: 'switches',
		category: 'body',
		cameraPosition: {x: -17.002543954413767, y: 4.324914298381455, z: 3.9485094009256385},
		controlsTarget: {x: 0.8104939747886545, y: 1, z: 0.7847742667180645},
		choices: [
			{
				name: 'Telescoping Scene Light Front of Body',
				modelName: 'TelescopingLightsL',
				isActive: false,
				price: 1500
			},
			{
				name: '2nd Telescoping Scene Light Front of Body',
				modelName: 'TelescopingLightsR',
				isActive: false,
				price: 1500
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

			var opacity = choice.isActive ? 1 : 0;

			CNDCE.ConfiguratorFunctions.setGroupOpacity(telescopingLight, opacity);

		}
	},
	additionalBodyOptions: {
		name: "Additional Body Options",
		optionType: "switches",
		category: "body",
		choices: [
			{
				name: "Kussmaul Battery Charger & Shoreline Auto-Eject",
				price: 1500,
				isActive: false
			},
			{
				name: "4\" NFPA Body Stripe & Rear Chevron Striping",
				price: 1300,
				isActive: false,
				key: 'backPattern',
				cameraPosition: {x: 25.29272019568001, y: 3.7170258329204326, z: 1.319949932973277},
				controlsTarget: {x: 3.699789616017394, y: -1.3503e-320, z: -2.1261418598592554}
			},
			{
				name: "Body Undercoating",
				price: 750,
				isActive: false
			},
			{
				name: "Slide-Out Tray in front driver compartment",
				price: 850,
				isActive: false,
				key: 'slideOutDriver',
				cameraPosition: {x: 2.5103439456072283, y: 4.835511438942193, z: 21.01528878160774},
				controlsTarget: {x: 2.6368914650491035, y: 4.841005530414487e-17, z: 0.787966431411528}
			},
			{
				name: "Slide-Out Tray in front officer compartment",
				price: 850,
				isActive: false,
				key: 'slideOutOfficer',
				cameraPosition: {x: 1.1594, y: 4.2510, z: -19.8427},
				controlsTarget: {x: 2.429258352088415, y: 4.8490670912017195e-17, z: 1.3774842956125226}
			}
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice"></div>')


			$div.html(choice.name);

			return $div;
		},
		
		applyChoices: function(choice, model, scene){
			if(!choice.key)
				return;

			if(choice.key == 'backPattern'){
				var backPatternMaterial = model.getObjectByName('Back').getObjectByName('Body').getObjectByName('Back').material[1]

				if(choice.isActive){
					CNDCE.ConfiguratorFunctions.setObjectOpacity(backPatternMaterial, 1);
				}else{
					CNDCE.ConfiguratorFunctions.setObjectOpacity(backPatternMaterial, 0);
				}


			}else if(choice.key.includes('slideOut')){
				if(!CNDCE.isDoorsOpen)
					CNDCE.ConfiguratorFunctions.toggleDoors({}, model, scene);


				var normalTray, slideOutTray;

				if(choice.key == 'slideOutDriver'){
					normalTray = model.getObjectByName('NormalTray1L');
					slideOutTray = model.getObjectByName('SlideOutTray1L');

				}else if(choice.key == 'slideOutOfficer'){
					normalTray = model.getObjectByName('NormalTray1R');
					slideOutTray = model.getObjectByName('SlideOutTray1R');
				}

				if(choice.isActive){
					slideOutTray.renderOrder = -1;
					normalTray.renderOrder = 0;
					CNDCE.ConfiguratorFunctions.setObjectOpacity(normalTray, 0);
					CNDCE.ConfiguratorFunctions.setObjectOpacity(slideOutTray, 1);
				}else{
					slideOutTray.renderOrder = 0;
					normalTray.renderOrder = -1;
					CNDCE.ConfiguratorFunctions.setObjectOpacity(normalTray, 1);
					CNDCE.ConfiguratorFunctions.setObjectOpacity(slideOutTray, 0);
				}
			}
		}
	},
	hoseTray: {
		name: 'Additional Hose Storage',
		optionType: 'switches',
		cameraPosition: {x: 19.714299525773598, y: 4.487715900579418, z: 5.467885117076072},
		controlsTarget: {x: 3.160204038409454, y: 3.115475749976581e-17, z: -3.385431309296108},
		category: 'body',
		choices: [
			{
				name: 'Hose Tray, Top of Side Compartment, 200\' of 2 1/2" Hose',
				isActive: false,
				price:  2150
			},
			{
				name: 'Hose Tray, Top of Side Compartment, 200\' of 1 1/2" Hose',
				isActive: false,
				price:  2150
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
	hitch: {
		name: "Trailer Hitch",
		defaultChoice: 0,
		optionType: "toggle",
		cameraPosition: {x: 20.47139445846311, y: 1.2828244061109775, z: 6.317519511402206},
		controlsTarget: {x: 5.970417263437373, y: 2.5922601324763686e-17, z: -2.802931493122089},
		category: 'body',
		choices: [
			{
				name: 'Without hitch'
			},
			{
				name: 'With hitch & light connector',
				price: 1400
			}
		],
		applyChoices: function(choice, model, scene){
			var hitch = model.getObjectByName('TrailerHitch');

			if(choice.name == 'Without hitch'){
				CNDCE.ConfiguratorFunctions.setModelOpacity(hitch, 0);
			}else{
				CNDCE.ConfiguratorFunctions.setModelOpacity(hitch, 1);
			}
		}
	},
	frontCompartment: {
		name: 'Front Compartment',
		defaultChoice: 0,
		cameraPosition: {x: 1.969296203972148, y: 2.6415167814242175, z: 18.913013836783694},
		controlsTarget: {x: 1.2882907169262734, y: 4.841005530414487e-17, z: 2.562857963934551},
		category: 'body',
		choices: [
			{
				name: 'Enclosed',
				class: 'enclosed',
				icon: './assets/models/spitfire/icons/front-compartment/enclosed.png'
			},
			{
				name: 'Transverse',
				class: 'transverse',
				icon: './assets/models/spitfire/icons/front-compartment/transverse.png',
				price: 1500
			}
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice"></div>')
			var img = new Image();

			img.src = choice.icon;
	
			$div.append(img);

			return $div;
		},
		applyChoices: function(choice, model, scene){
			var modelBack = model.getObjectByName('Back');

			var enclosed = [
				modelBack.getObjectByName('Body').getObjectByName('Top'),
				// modelBack.getObjectByName('Body').getObjectByName('Inside'),
				modelBack.getObjectByName('ContainersLeft').getObjectByName('Body1'),
				// modelBack.getObjectByName('ContainersRight').getObjectByName('Body1'),
				modelBack.getObjectByName('Misc').getObjectByName('BlackBox'),
				modelBack.getObjectByName('NormalTray1'),
				modelBack.getObjectByName('SlideOutTray1')
			];

			var transverse = [
				modelBack.getObjectByName('TransverseCompartment'),
				modelBack.getObjectByName('NormalTray4')
				// modelBack.getObjectByName('SlideOutTray4')
			];

			if(!CNDCE.isDoorsOpen){
				CNDCE.ConfiguratorFunctions.toggleDoors({}, model, scene);
			}

			// transverse[0].renderOrder = -1;
			// enclosed[0].renderOrder = -2;


			if(choice.name == 'Enclosed'){
				CNDCE.ConfiguratorFunctions.deactivateTransverseOption();

				for(var i=0; i < enclosed.length; i++){
					// enclosed[i].visible = true;
					enclosed[i].renderOrder = -1;
					CNDCE.ConfiguratorFunctions.setObjectOpacity(enclosed[i], 1);
				}

				for(var i=0; i < transverse.length; i++){
					// transverse[i].visible = false;
					transverse[i].renderOrder = 0;
					CNDCE.ConfiguratorFunctions.setObjectOpacity(transverse[i], 0);
				}


			}else{
				CNDCE.ConfiguratorFunctions.activateTransverseOption();


				for(var i=0; i < enclosed.length; i++){
					// enclosed[i].visible = false;
					enclosed.renderOrder = 0;
					CNDCE.ConfiguratorFunctions.setObjectOpacity(enclosed[i], 0);
				}

				for(var i=0; i < transverse.length; i++){
					// transverse[i].visible = true;
					transverse[i].renderOrder = -1;
					CNDCE.ConfiguratorFunctions.setObjectOpacity(transverse[i], 1);
				}

			}
		}
	},




	tankSize: {
		name: "Tank Size",
		category: "skid",
		defaultChoice: 0,
		keepSelectionsOpen: true,
		cameraPosition: {x: 20.709421111286012, y: 5.228948359217071, z: 9.427211401104948},
		controlsTarget: {x: 2.8814062428074574, y: -2.2561830406787324e-17, z: -2.379823493020536},
		choices: [
			{
				name: "300 gal.",
				class: 'tank-300',
				icon: "./assets/models/spitfire/icons/tank-size/300.svg"
			},
			{
				name: "425 gal.",
				class: 'tank-425',
				price: 1000,
				icon: "./assets/models/spitfire/icons/tank-size/425.svg"
			}
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice"></div>')
			var img = new Image();

			// $div.html(choice.name);
			img.src = choice.icon;
			$div.append(img);

			return $div;
		},
		applyChoices: function(choice, model, scene){
			
		}
	},
	foamSystem: {
		name: "Foam System",
		category: "skid",
		defaultChoice: 0,
		optionType: "toggle",
		choices: [
			{
				name: "Without Foam System"
			},
			{
				name: "With Foam System",
				price: 2500
			}
		]
	},
	discharges: {
		name: "Discharges",
		category: "skid",
		// keepSelectionsOpen: true,
		optionType: "switches",
		choices: [
			{
				name: "1 1/2\" Discharge",
				basePrice: 450,
				maxQuantity: 3
			},
			{
				name: "2 1/2 Discharge",
				price: 450
			},
			{
				name: "1\" Booster Reel, Electric Rewind",
				price: 3000
			}
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice"></div>')
			var $content = 


			$div.html(choice.name);

			if(choice.maxQuantity){
				var $quantity = $('<div class="choice-quantity"></div>')
				var $minus = $('<div class="choice-quantity-minus">-</div>');
				var $plus = $('<div class="choice-quantity-plus">+</div>');
				var $value = $('<div class="choice-quantity-val"></div>');

				$quantity.append($minus);
				$quantity.append($value);
				$quantity.append($plus);

				choice.quantity = choice.quantity ? choice.quantity : 0;

				$value.html(choice.quantity);

				$div.append($quantity);
			}

			return $div;
		}
	}
	
	
	
	
	
}
