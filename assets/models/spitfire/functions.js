CNDCE.DOOR_OPEN_ANGLE = 90 * Math.PI / 180;
CNDCE.DOOR_CLOSED_ANGLE = -180 * Math.PI  / 180;
CNDCE.DOOR_OPEN_TWEEN_DURATION = 500;
CNDCE.DOOR_OPEN_TWEEN_EASING = TWEEN.Easing.Back.Out;
CNDCE.DOOR_CLOSE_TWEEN_DURATION = 400;
CNDCE.DOOR_CLOSE_TWEEN_EASING = TWEEN.Easing.Cubic.Out;

CNDCE.OPACITY_TWEEN_DURATION = 500;
CNDCE.OPACITY_TWEEN_EASING = TWEEN.Easing.Cubic.Out;

CNDCE.PAINT_URL = './assets/models/spitfire/textures/paint.png';

CNDCE.ConfiguratorFunctions = {
	initModel: function(model){
		var textureLoader = new THREE.TextureLoader();

		var paints = [
			model.getObjectByName('CrewCab').getObjectByName('PaintL').material,
			model.getObjectByName('RegularCab').getObjectByName('PaintL').material,
			model.getObjectByName('Door1L').material[1]
		]

		// Paint Texture
		textureLoader.load(
			CNDCE.PAINT_URL,
			function(texture){
				for(var i=0; i < paints.length; i++){
					paints[i].map = texture;
					paints[i].needsUpdate = true;
				}
			}
		)




		// Render Order
		// Fixes transparency issues
		var  modelBack = model.getObjectByName('Back');

		modelBack.getObjectByName('Body').getObjectByName('Top').renderOrder = -1;

	},
	toggleDoors: function(e, model, scene){
		var doorsLeft = [
			model.getObjectByName('DoorLeft').getObjectByName('Door1L'),
			model.getObjectByName('DoorLeft').getObjectByName('Door2L'),
			model.getObjectByName('DoorLeft').getObjectByName('Door3'),
			model.getObjectByName('DoorRight').getObjectByName('Door1L_001'),
			model.getObjectByName('DoorRight').getObjectByName('Door2L_001')
		];

		var doorsRight = [
			model.getObjectByName('DoorLeft').getObjectByName('Door1R'),
			model.getObjectByName('DoorLeft').getObjectByName('Door2R'),
			model.getObjectByName('DoorRight').getObjectByName('Door1R_001'),
			model.getObjectByName('DoorRight').getObjectByName('Door2R_001'),
			model.getObjectByName('DoorRight').getObjectByName('Door3_001')
		];

		var moveDoor = function(door, toAngle, duration, easing){
			new TWEEN.Tween({z: door.rotation.z})
				.to({z: toAngle}, duration)
				.easing(easing)
				.onUpdate(function(){
					door.rotation.z = this.z;
				})
				.start();
		}



		// If doors are open, close doors
		if(CNDCE.isDoorsOpen){
			for(var i=0; i < doorsLeft.length; i++){
				moveDoor(doorsLeft[i], CNDCE.DOOR_CLOSED_ANGLE, CNDCE.DOOR_CLOSE_TWEEN_DURATION, CNDCE.DOOR_CLOSE_TWEEN_EASING);

			}

			for(var i=0; i < doorsRight.length; i++){
				moveDoor(doorsRight[i], CNDCE.DOOR_CLOSED_ANGLE, CNDCE.DOOR_CLOSE_TWEEN_DURATION, CNDCE.DOOR_CLOSE_TWEEN_EASING);
			}
			
			

			CNDCE.isDoorsOpen = false;


		// Else, open doors
		}else{
			for(var i=0; i < doorsLeft.length; i++){
				moveDoor(doorsLeft[i], -CNDCE.DOOR_OPEN_ANGLE, CNDCE.DOOR_OPEN_TWEEN_DURATION, CNDCE.DOOR_OPEN_TWEEN_EASING);
			}

			for(var i=0; i < doorsRight.length; i++){
				moveDoor(doorsRight[i], CNDCE.DOOR_CLOSED_ANGLE - CNDCE.DOOR_OPEN_ANGLE, CNDCE.DOOR_OPEN_TWEEN_DURATION, CNDCE.DOOR_OPEN_TWEEN_EASING);
			}
			

			CNDCE.isDoorsOpen = true;
		}
	},
	toggleHoseTray: function(model){
		var hoseTray = model.getObjectByName('HoseTray');
		var backHandle = model.getObjectByName('Back').getObjectByName('BackHandle');

		var showHoseTray = false;
		var choicesVal = Object.values(model.userData.hoseTray);

		for(var i=0; i < choicesVal.length; i++){
			if(choicesVal[i]){
				showHoseTray = true;
				break;
			}
		}

		if(showHoseTray){
			CNDCE.ConfiguratorFunctions.setModelOpacity(hoseTray, 1);
			hoseTray.visible = true;
			backHandle.visible = false;

		}else{
			CNDCE.ConfiguratorFunctions.setModelOpacity(hoseTray, 0);
			backHandle.visible = true;
		}

	},
	activateTransverseOption: function(){
		// Tank 425
		var $tank425 = $('.cndce-option[data-key="tankSize"] .tank-425');
		if($tank425.hasClass('active')){
			if(!confirm('Transverse compartment option is not available for the 425gal. tank size. Selecting this will change the tank size to 300gal. Proceed?'))
				return;

			$tank425.removeClass('active');
		}
		$tank425.addClass('disabled');
	},
	deactivateTransverseOption: function(){
		var $tank425 = $('.cndce-option[data-key="tankSize"] .tank-425');
		$tank425.removeClass('disabled');
	},
	changeColor: function(model, color){
		var materials = [
			{
				side: 'front',
				material: model.getObjectByName('FrontCommon').getObjectByName('Hood').material
			},
			{
				side: 'front',
				material: model.getObjectByName('RegularCab').getObjectByName('Body').material
			},
			{
				side: 'front',
				material: model.getObjectByName('CrewCab').getObjectByName('Body').material
			},
			{
				side: 'back',
				material: model.getObjectByName('Back').getObjectByName('Body').getObjectByName('Top').material
			},
			{
				side: 'back',
				material: model.getObjectByName('Back').getObjectByName('Body').getObjectByName('Left').material
			},
			{
				side: 'back',
				material: model.getObjectByName('Back').getObjectByName('TransverseCompartment').getObjectByName('Top').material
			},
			{
				side: 'back',
				material: model.getObjectByName('Back').getObjectByName('Door1L').material[0]
			},
			{
				side: 'back',
				material: model.getObjectByName('Back').getObjectByName('Hinges').material
			}
		];


		var threeColor = new THREE.Color(color.color);

		for(var i=0; i < materials.length; i++){

			new TWEEN.Tween({
					colorR: materials[i].material.color.r,
					colorG: materials[i].material.color.g,
					colorB: materials[i].material.color.b,

					metalness: materials[i].material.metalness,
					roughness: materials[i].material.roughness,

					material:  materials[i]
				})

				.to({
					colorR: threeColor.r,
					colorG: threeColor.g,
					colorB: threeColor.b,

					metalness: color.metalness[materials[i].side],
					roughness: color.roughness[materials[i].side]

				}, CNDCE.OPACITY_TWEEN_DURATION)

				.easing(CNDCE.OPACITY_TWEEN_EASING)

				.onUpdate(function(){
					this.material.material.color.setRGB(this.colorR, this.colorG, this.colorB);
					this.material.material.metalness =  this.metalness;
					this.material.material.roughness = this.roughness;
				})

				.start();


			// materials[i].material.color.set(color.color);

			// if(color.metalness[materials[i].side]){
			// 	materials[i].material.metalness = color.metalness[materials[i].side];
			// }

			// if(color.roughness[materials[i].side]){
			// 	materials[i].material.roughness = color.roughness[materials[i].side];
			// }
		}


		// Hinge Color
		// var hinge = model.getObjectByName('Back').getObjectByName('Hinges').material.color.set(color.color);
	},
	setObjectOpacity: function(object, opacity, onComplete){

		if(object.type == 'Group')
			CNDCE.ConfiguratorFunctions.setGroupOpacity(object, opacity, onComplete);

		else if(object.type.includes('Material'))
			CNDCE.ConfiguratorFunctions.setMaterialOpacity(object, opacity, onComplete);

		else
			CNDCE.ConfiguratorFunctions.setModelOpacity(object, opacity, onComplete);
	},
	setMaterialOpacity(material, opacity, onComplete){
		if(material.opacity == opacity)
			return;

		if(opacity < 1){
			material.transparent = true;
		}


		new TWEEN.Tween({
				opacity: material.opacity
			})

			.to({
				opacity: opacity
			})

			.easing(CNDCE.OPACITY_TWEEN_EASING)

			.onUpdate(function(){
				material.opacity = this.opacity
			})

			.onComplete(function(){
				if(opacity == 1){
					material.transparent = false;
				}

				if(onComplete)
					onComplete(this);

			})

			.start();
	},
	setModelOpacity: function(model, opacity, onComplete){
		if(Array.isArray(model.material)){
			for(var i=0; i < model.material.length; i++){
				CNDCE.ConfiguratorFunctions.setMaterialOpacity(model.material[i], opacity, onComplete);
			}
		}else{
			CNDCE.ConfiguratorFunctions.setMaterialOpacity(model.material, opacity, onComplete);
		}

		
	},
	setGroupOpacity: function(group, opacity, onComplete){
		for(var i=0; i < group.children.length; i++){
			CNDCE.ConfiguratorFunctions.setModelOpacity(group.children[i], opacity, onComplete);
		}
	}


}