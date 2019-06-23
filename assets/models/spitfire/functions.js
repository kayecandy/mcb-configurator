CNDCE.DOOR_OPEN_ANGLE = 90 * Math.PI / 180;
CNDCE.DOOR_OPEN_TWEEN_DURATION = 500;
CNDCE.DOOR_OPEN_TWEEN_EASING = TWEEN.Easing.Back.Out;
CNDCE.DOOR_CLOSE_TWEEN_DURATION = 400;
CNDCE.DOOR_CLOSE_TWEEN_EASING = TWEEN.Easing.Cubic.Out;

CNDCE.ConfiguratorFunctions = {
	toggleDoors: function(e, model, scene){
		var doorsLeft = [
			model.getObjectByName('DoorLeft').getObjectByName('Door1L'),
			model.getObjectByName('DoorLeft').getObjectByName('Door2L'),
			model.getObjectByName('DoorLeft').getObjectByName('Door3')
		];

		var doorsRight = [
			model.getObjectByName('DoorLeft').getObjectByName('Door1R'),
			model.getObjectByName('DoorLeft').getObjectByName('Door2R')
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
				moveDoor(doorsLeft[i], 0, CNDCE.DOOR_CLOSE_TWEEN_DURATION, CNDCE.DOOR_CLOSE_TWEEN_EASING);

			}

			for(var i=0; i < doorsRight.length; i++){
				moveDoor(doorsRight[i], 0, CNDCE.DOOR_CLOSE_TWEEN_DURATION, CNDCE.DOOR_CLOSE_TWEEN_EASING);
			}
			
			

			CNDCE.isDoorsOpen = false;


		// Else, open doors
		}else{
			for(var i=0; i < doorsLeft.length; i++){
				moveDoor(doorsLeft[i], -CNDCE.DOOR_OPEN_ANGLE, CNDCE.DOOR_OPEN_TWEEN_DURATION, CNDCE.DOOR_OPEN_TWEEN_EASING);
			}

			for(var i=0; i < doorsRight.length; i++){
				moveDoor(doorsRight[i], CNDCE.DOOR_OPEN_ANGLE, CNDCE.DOOR_OPEN_TWEEN_DURATION, CNDCE.DOOR_OPEN_TWEEN_EASING);
			}
			

			CNDCE.isDoorsOpen = true;
		}
	}
}