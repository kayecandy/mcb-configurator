CNDCE.DOOR_OPEN_ANGLE = 90 * Math.PI / 180;
CNDCE.DOOR_CLOSED_ANGLE = -180 * Math.PI  / 180;
CNDCE.DOOR_OPEN_TWEEN_DURATION = 500;
CNDCE.DOOR_OPEN_TWEEN_EASING = TWEEN.Easing.Back.Out;
CNDCE.DOOR_CLOSE_TWEEN_DURATION = 400;
CNDCE.DOOR_CLOSE_TWEEN_EASING = TWEEN.Easing.Cubic.Out;

CNDCE.PAINT_URL = './assets/models/spitfire/textures/paint.png';

CNDCE.ConfiguratorFunctions = {
	initModel: function(model){
		var textureLoader = new THREE.TextureLoader();

		var paintL = model.getObjectByName('CrewCab').getObjectByName('PaintL');

		// Paint Texture
		textureLoader.load(
			CNDCE.PAINT_URL,
			function(texture){
				paintL.material.map = texture;
				paintL.material.needsUpdate = true;
			}
		)

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
	changeColor: function(model, color){
		var materials = [
			{
				side: 'front',
				material: model.getObjectByName('FrontCommon').getObjectByName('Hood').material
			},
			{
				side: 'back',
				material: model.getObjectByName('Back').getObjectByName('Body').getObjectByName('Top').material
			}
		];



		for(var i=0; i < materials.length; i++){
			materials[i].material.color.set(color.color);

			if(color.metalness[materials[i].side]){
				materials[i].material.metalness = color.metalness[materials[i].side];
			}

			if(color.roughness[materials[i].side]){
				materials[i].material.roughness = color.roughness[materials[i].side];
			}
		}


	}
}