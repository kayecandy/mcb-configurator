/***************************************************************************
 *  																	   *
 *																		   *
 *	     ___           ___           ___           ___           ___       *
 *	    /  /\         /  /\         /  /\         /  /\         /  /\      *
 *	   /  /::\       /  /::|       /  /::\       /  /::\       /  /::\     *
 *	  /  /:/\:\     /  /:|:|      /  /:/\:\     /  /:/\:\     /  /:/\:\    *
 *	 /  /:/  \:\   /  /:/|:|__   /  /:/  \:\   /  /:/  \:\   /  /::\ \:\   *
 *	/__/:/ \  \:\ /__/:/ |:| /\ /__/:/ \__\:| /__/:/ \  \:\ /__/:/\:\ \:\  *
 *	\  \:\  \__\/ \__\/  |:|/:/ \  \:\ /  /:/ \  \:\  \__\/ \  \:\ \:\_\/  *
 *	 \  \:\           |  |:/:/   \  \:\  /:/   \  \:\        \  \:\ \:\    *
 *	  \  \:\          |__|::/     \  \:\/:/     \  \:\        \  \:\_\/    *
 *	   \  \:\         /__/:/       \__\::/       \  \:\        \  \:\      *
 *	    \__\/         \__\/            ~~         \__\/         \__\/      *
 * 																		   *
 *																		   *
 ***************************************************************************/

window.CNDCE = {};

$.fn.extend({
 	cndceConfigurator: function(params){
 		var defaults = {
 			modelURL: './assets/models/demo/model.json',
 			texturesURL: './assets/models/demo/textures/',

 			modelPosition: {x: 0, y: 0, z: 0},

 			cameraPosition: {x: 6.221168079763829, y: 2.238338815849478, z: 6.248784645270256},

 			rendererOptions: {
 				antialias: true,
 				alpha: true,
 				shadows: true
 				// preserveDrawingBuffer: false
 			},

 			ambientLightColor: 0xffffff,
 			ambientLightIntensity: 1,


 			controlsTarget: {x: 0.04693004944501031, y: 0.7000000000000001, z: 0.030806087039626822},
 			controlsMinPolarAngle: 0.39792784908717854,
 			controlsMaxPolarAngle: 1.7127947295652755,
 			controlsEnableZoom: true,
 			controlsEnableDamping: true,
 			controlsDampingFactor: 0.15,
 			controlsEnableKeys: true,
 			controlsEnablePan: true,
 			controlsRotateSpeed: 0.05,

 			hoverOffset: {x: 10, y: 0}
 		}

 		// THREE JS Elements 
 		var scene;
 		var camera;
 		var renderer;
 		var controls;

		var ambientLight;


 		var loadingManager;
 		var objLoader;
 		var mtlLoader;
 		var tdsLoader;
 		var bufferGeometryLoader;
 		var colladaLoader;
 		var objectLoader;

 		var raycaster;
 		var mouse = new THREE.Vector2();

 		var truckModel;

 		var hoverables = [];

 		var currIntersected;


 		// DOM Elements
 		var $container = $(this);

 		var $canvas = $('#cndce-configurator-canvas', this);
 		var canvas = $canvas[0];


 		var $optionsContainer = $('.cndce-options', $container);
 		var $optionItemTemplate = $('.cndce-option.cndce-template', $optionsContainer);

 		var $hoverContainer = $('.cndce-hover', $container);
 		var $hoverTitle = $('.cndce-hover-title', $hoverContainer);
 		var $hoverDescription = $('.cndce-hover-description', $hoverContainer);
 			

 		var $selectionsContainer = $('.cndce-selection-table tbody', $container);
 		var $selectionItemTemplate = $('.cndce-selection.cndce-template', $selectionsContainer);


 		function getTemplate($template){
 			var $clone = $template.clone(true);
 			$clone.removeClass('cndce-template');

 			return $clone;
 		}

 		function getDefaults(obj, defaultsObj){
 			var duplicate = {};

 			if(obj == undefined)
 				obj = {};

 			for( var param in defaultsObj ){
 				if( defaultsObj.hasOwnProperty( param ) ){
 					if( !obj.hasOwnProperty( param ) || obj[param] == undefined ){
 						duplicate[param] = defaultsObj[param];
 					}else{
 						duplicate[param] = obj[param];
 					}
 				}
 			}

 			return duplicate;
 		}

 		function getLoader(filename){
 			// OBJ
 			if(filename.endsWith('.obj')){
 				if(objLoader == undefined){
 					objLoader = new THREE.OBJLoader(loadingManager);
 					mtlLoader = new THREE.MTLLoader(loadingManager);
 				}



 				return objLoader;

 			// 3DS
 			}else if(filename.endsWith('.3ds')){
 				if(tdsLoader == undefined)
 					tdsLoader = new THREE.TDSLoader(loadingManager);

 				tdsLoader.setResourcePath(params.texturesURL);

 				return tdsLoader;
 			}


 			// BUFFER GEOMETRY
 			else if(filename.endsWith('.buffergeometry.json')){
 				if(bufferGeometryLoader == undefined)
 					bufferGeometryLoader = new THREE.BufferGeometryLoader(loadingManager);

 				return bufferGeometryLoader;
 			}

 			// JSON
 			else if(filename.endsWith('.json')){
 				if(objectLoader == undefined)
 					objectLoader = new THREE.ObjectLoader(loadingManager);

 				return objectLoader;
 			}


 			// DAE
 			else if(filename.endsWith('.dae')){
 				if(colladaLoader == undefined)
 					colladaLoader = new THREE.ColladaLoader(loadingManager);

 				return colladaLoader;
 			}
 		}


 		function render(){
 			requestAnimationFrame(render);

 			controls.update();
 			TWEEN.update();
 			renderer.render(scene, camera);
 		}


 		function initThreeJs(){
 			var width = $canvas.width();
 			var height = $canvas.height();


 			halfWidth = width / 2;
 			halfHeight = height / 2;


 			scene = new THREE.Scene();
 			camera = new THREE.PerspectiveCamera(26, width/height, params.cameraFrustumMin, params.cameraFrustumMax);

 			camera.position.copy(params.cameraPosition);


 			// RENDERER
 			params.rendererOptions.canvas = canvas;
			renderer = new THREE.WebGLRenderer(params.rendererOptions);
			renderer.setSize(width, height);
			renderer.setPixelRatio(window.devicePixelRatio);

			// LIGHTS
			ambientLight = new THREE.AmbientLight(params.ambientLightColor, params.ambientLightIntensity);
			scene.add(ambientLight);



			// CONTROLS
			controls = new THREE.OrbitControls(camera, canvas);

			controls.minPolarAngle = params.controlsMinPolarAngle;
			controls.maxPolarAngle = params.controlsMaxPolarAngle;
			controls.enableZoom = params.controlsEnableZoom;
			controls.enableDamping = params.controlsEnableDamping;
			controls.dampingFactor = params.controlsDampingFactor;
			controls.enableKeys = params.controlsEnableKeys;
			controls.enablePan = params.controlsEnablePan;
			controls.rotateSpeed = params.controlsRotateSpeed;

			controls.target.copy(params.controlsTarget);


			// LOADERS
			loadingManager = new THREE.LoadingManager();
			loadingManager.onLoad = onModelLoad;


			// RAYCASTER
			raycaster = new THREE.Raycaster();



			render();
 		}

 		function initModel(){

 			var loader = getLoader(params.modelURL);


			loader.load(
				params.modelURL,

				function onLoad(obj){
					console.log(obj);

					truckModel = obj.getObjectByName('CndceModel');
					scene.add(obj);

					obj.position.copy(params.modelPosition);
					// scene = obj;


					initHoverables(truckModel);


					// for(var i=0; i < truckModel.children.length; i++){
					// 	var userData = truckModel.children[i].userData;

					// 	// Child has hover
					// 	if(userData.hover != undefined){
					// 		hoverables.push(truckModel.children[i]);
					// 	}
					// }

				}
			);



 			
 		}

 		function initHoverables(mesh){
 			if(mesh.userData.hover != undefined){
 				hoverables.push(mesh);
 			}

 			for(var i = 0; i < mesh.children.length; i++){
 				initHoverables(mesh.children[i]);
 			}
 		}


 		function initTestObjects(){
 			window.camera = camera;
 			window.scene = scene;
 			window.renderer = renderer;
 			window.controls = controls;

 			window.hoverables = hoverables;

 			window.canvas = canvas;
 		}


 		function initOptions(){
 			if(CNDCE.ConfiguratorOptions == undefined)
 				return;

 			var optionKeys = Object.keys(CNDCE.ConfiguratorOptions);

 			for(var i=0; i < optionKeys.length; i++){
 				var option = CNDCE.ConfiguratorOptions[optionKeys[i]];


 				// Options Container
 				var $option = getTemplate($optionItemTemplate);


 				$option.data('option', option);
 				$option.attr('data-type', option.optionType);


 				if(option.optionType == 'toggle'){
 					for(var j=0; j < option.choices.length; j++){
 						var $optionChoicesContainer = $('.cndce-option-choices', $option);
 						var $img = $('<img class="cndce-option-choice" />')

 						$img[0].src = option.choices[j].image;

 						if(j == option.defaultChoice){
 							$img.addClass('toggle-active');
 						}

 						$img.data('choice', option.choices[j]);
 						$optionChoicesContainer.append($img);

 					}

 				}else{

	 				$('img', $option)[0].src = option.icon;

 					for(var j=0; j < option.choices.length; j++){
 						var $optionChoicesContainer = $('.cndce-option-choices', $option);
 						var $div = option.choicesTemplateInit(option.choices[j], $optionChoicesContainer);

 						$div.data('choice', option.choices[j]);
 						$optionChoicesContainer.append($div);
 					}
 				}

 				

 				$optionsContainer.append($option);



 				// Selections Container
 				var $selection = getTemplate($selectionItemTemplate);

 				$('.cndce-selection-name', $selection).text(option.name);
 				$('.cndce-selection-choice', $selection).text(option.choices[option.defaultChoice].name);

 				$option.data('$selection', $selection);

 				$selectionsContainer.append($selection);
 			}
 		}

 		function onModelLoad(e){
 			$container.addClass('model-loaded');
 		}


 		function onModelPartMouseEnter(e, intersected){
 			$container.addClass('part-hovered');

 			$hoverTitle.text(intersected.object.userData.hover.title);
 			$hoverDescription.text(intersected.object.userData.hover.description);


 			if(intersected.object.material.opacity != undefined)
 				intersected.object.material.opacity = 0.8


 			for(var i=0; i < intersected.object.material.length; i++){
 				intersected.object.material[i].opacity = 0.8;
 			}
 		}

 		function onModelPartMouseExit(e, intersected){
 			$container.removeClass('part-hovered');

 			// $hoverTitle.text('');
 			// $hoverDescription.text('');

 			if(intersected.object.material.opacity != undefined)
 				intersected.object.material.opacity = 1


 			for(var i=0; i < intersected.object.material.length; i++){
 				intersected.object.material[i].opacity = 1;
 			}

 		}

 		function onModelPartMouseClick(e, intersected){
 			if(intersected.object.userData.onClick 
 				&& CNDCE.ConfiguratorFunctions[intersected.object.userData.onClick]){

 				CNDCE.ConfiguratorFunctions[intersected.object.userData.onClick](e, truckModel, scene);
 			}
 		}


 		function onModelPartMouseMove(e, intersected){
 			$hoverContainer.css({
 				left: e.mouseX + params.hoverOffset.x + 'px',
 				top: e.mouseY + params.hoverOffset.y + 'px'
 			})
 		}


 		// Window Resize Event
 		$(window).on('resize', function(){

 			camera.aspect = $canvas.width() / $canvas.height();
 			camera.updateProjectionMatrix();

 			renderer.setSize($canvas.width(), $canvas.height());
 		});


 		$container.on('click', '.cndce-option .cndce-option-icon', function(e){
 			var $option = $(this).parents('.cndce-option');

 			if($option.data('type') == 'toggle'){

 			}else{
 				$option.addClass('active');
 				$container.addClass('option-active');
 			}
 			
 		});

 		$container.on('click', '.cndce-option-choice', function(e){
 			var $this = $(this);
 			var $option = $this.parents('.cndce-option');
 			var option = $option.data('option');

 			var $selection = $option.data('$selection');

 			var choice;

 			if($option.data('type') == 'toggle'){
 				var $nextChoice = $this.next();

 				if(!$nextChoice.length){
 					$nextChoice = $this.siblings('.cndce-option-choice').eq(0);
 				}

 				choice = $nextChoice.data('choice');
 				$this.removeClass('toggle-active');
 				$nextChoice.addClass('toggle-active');


 			}else{
 				choice = $this.data('choice');
 			}

 			option.applyChoices(choice, truckModel, scene);

 			$('.cndce-selection-choice', $selection).text(choice.name);



 		});

 		$container.on('click', '.cndce-option-choices-back', function(e){
 			var $option = $(this).parents('.cndce-option');
 			$option.removeClass('active');
 			$container.removeClass('option-active');


 		});


 		$container.on('click', '#cndce-configurator-canvas', function(e){
 			if($container.hasClass('part-hovered'))
	 			onModelPartMouseClick(e, currIntersected);
 		});


 		$container.on('mousemove', '#cndce-configurator-canvas', function(e){
 			e.mouseX = e.pageX - $canvas.offset(  ).left;
 			e.mouseY = e.pageY - $canvas.offset(  ).top;

 			mouse.x = ( e.mouseX / $canvas.width(  ) ) * 2 - 1;
 			mouse.y = - ( e.mouseY / $canvas.height(  ) ) * 2 + 1;

			raycaster.setFromCamera( mouse, camera );

 			var intersected = raycaster.intersectObjects(hoverables);

 			if(intersected.length == 0){
 				if(currIntersected != undefined){
 					onModelPartMouseExit(e, currIntersected);
 					currIntersected = undefined;
 				}

 				return;
 			}
 			
 			if(currIntersected == undefined || currIntersected.object != intersected[0].object){
 				if(currIntersected != undefined){
 					onModelPartMouseExit(e, currIntersected);
 				}

 				currIntersected = intersected[0];
 				onModelPartMouseEnter(e, currIntersected);

 			}

 			onModelPartMouseMove(e, currIntersected);

 		});



 		;(function init(){

 			// Param Set Defaults
 			params = getDefaults(params, defaults);

 			initThreeJs();
 			initTestObjects();
 			initModel();
 			initOptions();

 		})();
 	}
})