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
 			lfsURL: 'https://media.githubusercontent.com/media/kayecandy/mcb-configurator/master/',
 			modelURL: './assets/models/demo/model.json',
 			texturesURL: './assets/models/demo/textures/',
 			envJSON: './assets/env/env1.json',

 			modelPosition: {x: 0, y: 0, z: 0},

 			cameraPosition: {x: 6.221168079763829, y: 2.238338815849478, z: 6.248784645270256},
 			cameraPositionTweenEasing: TWEEN.Easing.Cubic.Out,
 			cameraPositionTweenDuration: 1000,


 			rendererOptions: {
 				antialias: true,
 				alpha: true
 				// preserveDrawingBuffer: false
 			},

 			ambientLightColor: 0xffffff,
 			ambientLightIntensity: 1,


 			controlsTarget: {x: 0.04693004944501031, y: 0.7000000000000001, z: 0.030806087039626822},
 			controlsMinPolarAngle: 1.3361462735676852,
 			controlsMaxPolarAngle: 1.4960513154939388,
 			controlsEnableZoom: true,
 			controlsEnableDamping: true,
 			controlsDampingFactor: 0.15,
 			controlsEnableKeys: true,
 			controlsEnablePan: true,
 			controlsRotateSpeed: 0.05,

 			controlsTargetTweenDuration: 1000,
 			controlsTargetTweenEasing: TWEEN.Easing.Cubic.InOut,

 			bgRadius: 30,
 			bgWidthSegments: 20,
 			bgHeightSegments: 20,

 			hoverOffset: {x: 10, y: 0},

 			showSelectionTimeoutDuration: 1000,
 			noSelectionText: 'None Selected'
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
 		var textureLoader;

 		var raycaster;
 		var mouse = new THREE.Vector2();

 		var bgBox;
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
 			
 		var $selectionsCategoryContainer = $('.cndce-selections-categories', $container);
 		var $selectionsCategoryTemplate = $('.cndce-selections-category.cndce-template', $selectionsCategoryContainer);

 		var $selectionsContainer = $('.cndce-selections-content .cndce-selections-content-wrapper', $container);
 		var $selectionItemTemplate = $('.cndce-selection.cndce-template', $selectionsContainer);
 		var $selectionsCategoryItemsTemplate = $('.cndce-selections-category-items.cndce-template', $selectionsContainer);

 		var $selectionsToggleButton = $('#cndce-selections-toggle', $container);

 		var $screenshotLink = $('#cndce-screenshot-link', $container);

 		var controlsEndTimer;


 		function downloadScreenshot(){
 			renderer.render(scene, camera);
 			$screenshotLink[0].href = canvas.toDataURL();
 			$screenshotLink[0].click();
 		}

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

 			filename = filename.split('?')[0];

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

 		function getModelURL(url){
 			if(params.lfsURL){
 				return params.lfsURL + url;
 			}

 			return url;
 		}

 		function goToCameraZoom(zoomPosition){
 			var spherical = (new THREE.Spherical()).setFromVector3(zoomPosition);

 			goToCameraSphericalPosition(spherical.radius, controls.getPolarAngle(), controls.getAzimuthalAngle());
 		}

 		function goToCameraPosition(position){
 			if(camera.position.distanceTo(position) <= 1)
 				return;

 			var spherical = (new THREE.Spherical()).setFromVector3(position);

 			goToCameraSphericalPosition(spherical.radius, spherical.phi, spherical.theta, position);
 		}

 		function goToCameraSphericalPosition(radius, polarAngle, azimuthalAngle, position){

 			new TWEEN.Tween({
					radius: controls.target.distanceTo(camera.position),
					polarAngle: controls.getPolarAngle(),
					azimuthalAngle: controls.getAzimuthalAngle()
	 			})

 				.to({
 					radius: radius,
 					polarAngle: polarAngle,
 					azimuthalAngle: azimuthalAngle
 				}, params.cameraPositionTweenDuration)

 				.easing(params.cameraPositionTweenEasing)

 				.onUpdate(function(){
 					camera.position.setFromSphericalCoords(
 						this.radius,
 						this.polarAngle,
 						this.azimuthalAngle
 					)

 					controls.update();
 				})

 				.onComplete(function(){
 					// console.log(position);
 					if(position)
	 					camera.position.copy(position);
 				})

 				.start();
 		}

 		function goToControlsTarget(position){
 			if(controls.target.equals(position))
 				return;

 			// controls.target.copy(position);
 			new TWEEN.Tween(controls.target)
 				.to(position, params.controlsTargetTweenDuration)
 				.easing(params.controlsTargetTweenEasing)
 				.start();
 		}

 		function toPriceFormat(priceNum){
 			if(priceNum)
	 			return '$' + priceNum.toFixed(2);

	 		return '';
 		}

 		function toSelectionNameFormat(name, price, quantity){
 			var $name = $('<span>' + name + '</span>');

 			if(price){
 				var $price = $('<span></span>');
 				price =  toPriceFormat(price);

 				if(quantity > 1)
 					$price.html(' (' + price + ' x' + quantity + ')');
 				else
 					$price.html(' (' + price + ')');

 				$name.append($price); 
 			}

 			return $name;
 		}

 		function render(){
 			requestAnimationFrame(render);

 			controls.update();
 			TWEEN.update();
 			renderer.render(scene, camera);
 		}

 		function deactivateActiveOption(){
 			var $option = $('.cndce-option.active', $optionsContainer);
 			$option.removeClass('active');

 			$container.removeClass('option-active');


 		}


 		function updateChoiceQuantity($choice, deltaQuantity){
 			var choice = $choice.data('choice');

 			var $value = $('.choice-quantity-val', $choice);

 			choice.quantity = choice.quantity ? choice.quantity + deltaQuantity : deltaQuantity;

 			if(choice.basePrice){
	 			choice.price = choice.quantity * choice.basePrice;			
 			}

 			$value.html(choice.quantity);
 		}

 		function updateSelection($selection, choice){
 			var $option = $selection.data('$option');
 			var option = $option.data('option');

 			var $selectionChoice = $('.cndce-selection-choice', $selection);
 			var $selectionPrice = $('.cndce-selection-price', $selection);

			var price = 0;	

 			if($option.data('type') == 'switches'){

 				$selectionChoice.html('');

 				for(var i=0; i < option.choices.length; i++){
 					if(option.choices[i].isActive){
 						var priceString = option.choices[i].price;

 						if(option.choices[i].quantity && option.choices[i].basePrice){
 							priceString = option.choices[i].basePrice;
 						}

 						var $li = $('<li></li>');
 						$li.html(toSelectionNameFormat(option.choices[i].name, priceString, option.choices[i].quantity));

 						$selectionChoice.append($li);

 						if(option.choices[i].price){
	 						price += option.choices[i].price;
 						}

 					}
 				}

 				if($selectionChoice.html() == ''){
 					$selectionChoice.text(params.noSelectionText);
 				}


 			}else{

				$selectionChoice.html(toSelectionNameFormat(choice.name, choice.basePrice, choice.quantity));
 
	 			price = choice.price;
 			}


 			if(price){
				$selectionPrice.text('+ ' + toPriceFormat(price));
 			}else{
				$selectionPrice.text('');

 			}
 		}


 		// 360 videos are supported but I couldn't find a suitable sample
 		function initBackgroundMap(textureURL){
 			// Image Background
 			if(textureURL.endsWith('.jpg')){
 				return textureLoader.load(textureURL);
 			}

 			// Video Backgrounds
 			else if(textureURL.endsWidth('.mp4')){
 				var bgVideo = document.createElement('video');
 				var $bgVideo = $(bgVideo);
 				bgVideo.src = textureURL;


 				$bgVideo.prop('autoplay', true);
 				$bgVideo.prop('loop', true);

 				// window.bgVideo = bgVideo;

 				return new THREE.VideoTexture(bgVideo);
 			}

 		}

 		function initBackground(bgData){
 			var radius = (bgData.radius) ? bgData.radius : params.bgRadius;
 			var widthSegments = (bgData.widthSegments) ? bgData.widthSegments : params.bgWidthSegments;
 			var heightSegments = (bgData.heightSegments) ? bgData.heightSegments : params.bgWidthSegments;


 			var bgGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
 			var bgMaterial = new THREE.MeshBasicMaterial({
 				side: THREE.BackSide,
 				map: initBackgroundMap(bgData.textureURL)
 			});

 			for(var i=0;i<bgGeometry.vertices.length;i++){
 			  var v = bgGeometry.vertices[i];
 			  if(v.y<-6)
 			      v.y=-6;

 			}



 			bgGeometry.computeFaceNormals();
 			bgGeometry.computeVertexNormals();
 			bgGeometry.verticesNeedUpdate = true;


 			bgBox = new THREE.Mesh(bgGeometry, bgMaterial);

 			if(bgData.position)
	 			bgBox.position.copy(bgData.position);

	 		// copy() does not work
	 		if(bgData.rotation){
	 			bgBox.rotation.x = bgData.rotation.x;
	 			bgBox.rotation.y = bgData.rotation.y;
	 			bgBox.rotation.z = bgData.rotation.z;
	 		}

	 		if(bgData.scale)
	 			bgBox.scale.copy(bgData.scale);

 			scene.add(bgBox);


 			// console.log(bgData.rotation);
 			// window.bgBox = bgBox;



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
			renderer.gammaOutput = true;
			renderer.gammaFactor = 1.8;
			renderer.shadowMap.enabled = true;
			renderer.setSize(width, height);
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.autoClearColor = false;

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

			controls.addEventListener('start', onControlsStart)
			controls.addEventListener('end', onControlsEnd);


			// LOADERS
			loadingManager = new THREE.LoadingManager();
			loadingManager.onLoad = onLoadingManagerLoad;

			textureLoader = new THREE.TextureLoader(loadingManager);


			// BACKGROUND
			if(params.envJSON){
				$.ajax({
					url: params.envJSON,
					success: initBackground
				})
			}
			
			
			// RAYCASTER
			raycaster = new THREE.Raycaster();




			render();
 		}

 		function initModel(){
 			var modelURL = getModelURL(params.modelURL);
 			var loader = getLoader(modelURL);


			loader.load(
				modelURL,

				function onModelLoad(obj){

					truckModel = obj.getObjectByName('CndceModel');
					scene.add(obj);

					initOptionsCategories();
		 			initOptions();
		 			initTestObjects();
					initHoverables(truckModel);

					obj.position.copy(params.modelPosition);

					if(CNDCE.ConfiguratorFunctions.initModel){
						CNDCE.ConfiguratorFunctions.initModel(obj);
					}

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

 			window.bgBox = bgBox;
 			window.truckModel = truckModel;
 			window.hoverables = hoverables;

 			window.canvas = canvas;
 		}

 		function initOptionsCategories(){
 			if(!CNDCE.ConfiguratorOptionsCategories)
 				return;

 			var optionCategories = Object.keys(CNDCE.ConfiguratorOptionsCategories);

 			for(var i=0; i < optionCategories.length; i++){
 				var category = CNDCE.ConfiguratorOptionsCategories[optionCategories[i]];

 				var $category = getTemplate($selectionsCategoryTemplate);
 				$('span', $category).html(category.name);
 				$('img', $category)[0].src = category.icon;


 				$selectionsCategoryContainer.append($category);



 				var $categoryContainer = getTemplate($selectionsCategoryItemsTemplate);

 				$categoryContainer.attr('data-category', optionCategories[i]);
 				$category.data('$itemsContainer', $categoryContainer);

 				$selectionsContainer.append($categoryContainer);

 				category.$selectionsContainer = $categoryContainer;

 				if(category.default){
 					$category.addClass('active');
 					$categoryContainer.addClass('active');
 				}
 			}
 		}


 		function initOptions(){
 			if(!CNDCE.ConfiguratorOptions)
 				return;

 			var optionKeys = Object.keys(CNDCE.ConfiguratorOptions);

 			for(var i=0; i < optionKeys.length; i++){
 				var option = CNDCE.ConfiguratorOptions[optionKeys[i]];


 				// Options Container
 				var $option = getTemplate($optionItemTemplate);

 				$option.attr('data-key', optionKeys[i]);
 				$option.data('option', option);
 				$option.attr('data-type', option.optionType);


 				if(option.optionType == 'toggle'){
 					for(var j=0; j < option.choices.length; j++){
 						var $optionChoicesContainer = $('.cndce-option-choices', $option);
 						var $div = $('<div class="cndce-option-choice"></div>')

 						if(j == option.defaultChoice){
 							$div.addClass('toggle-active');
 						}

 						$div.data('choice', option.choices[j]);
 						$optionChoicesContainer.append($div);

 					}

 				}else{

					if(option.choicesTemplateInit){

	 					for(var j=0; j < option.choices.length; j++){
	 						var $optionChoicesContainer = $('.cndce-option-choices', $option);

							var $div = option.choicesTemplateInit(option.choices[j], $optionChoicesContainer);

							if(option.choices[j].class){
								$div.addClass(option.choices[j].class);
							}

							if(j == option.defaultChoice)
								$div.addClass('active');

							$div.addClass('cndce-option-choice');
							$div.data('choice', option.choices[j]);
							$optionChoicesContainer.append($div);
	 						
	 					}

	 				}else{
	 					console.error('Add a choicesTemplateInit() function to option ' + option.name);
	 				}
 				}

 				

 				$optionsContainer.append($option);

	 			new SimpleBar($option[0]);


 				// Selections Container
 				var $selection = getTemplate($selectionItemTemplate);
 				var defaultChoice = option.choices[option.defaultChoice];

 				$selection.data('$option', $option);
 				$option.data('$selection', $selection);


 				$('.cndce-selection-name', $selection).text(option.longName ? option.longName : option.name);

 				if(defaultChoice){
 					updateSelection($selection, defaultChoice);
 				}else{
 					$('.cndce-selection-choice', $selection).text(params.noSelectionText);
 				}
 				

 				

 				if(CNDCE.ConfiguratorOptionsCategories)
 					var category = CNDCE.ConfiguratorOptionsCategories[option.category];


 				if(option.category && category){
 					category.$selectionsContainer.append($selection);

 				}else{
	 				$selectionsContainer.append($selection);

 				}



 				// Apply Default Choice
 				// if(option.applyChoices)
	 			// 	option.applyChoices(defaultChoice, truckModel, scene);
 			}

 			// Init scrollbar
 			new SimpleBar($selectionsContainer[0]);
 		}

 		function onLoadingManagerLoad(e){

			console.log('loading manager load');

 			$container.focus();
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

 		function onControlsStart(e){
 			clearTimeout(controlsEndTimer);

 			deactivateActiveOption(true);
 			$container.addClass('selections-hidden');

 			// Camera position changes
 			
 			if(!controls.target.equals(params.controlsTarget)){
 				goToControlsTarget(params.controlsTarget);
 				goToCameraZoom(params.cameraPosition);
 			}
 		}

 		function onControlsEnd(e){
 			controlsEndTimer = setTimeout(function(){
 				$container.removeClass('selections-hidden');

 			}, params.showSelectionTimeoutDuration);
 		}


 		// Window Resize Event
 		$(window).on('resize', function(){

 			camera.aspect = $canvas.width() / $canvas.height();
 			camera.updateProjectionMatrix();

 			renderer.setSize($canvas.width(), $canvas.height());
 		});

 		$selectionsToggleButton.click(function onSelectionsToggleClick(e){
 			$container.toggleClass('selections-hidden');
 		});

 		$selectionsToggleButton.hover(function onSelectionsToggleHover(e){
 			if($container.hasClass('selections-hidden'))
 				$container.removeClass('selections-hidden');
 		});


 		$container.on('click', '.cndce-selection', function onSelectionClick(e){
 			var $option = $(this).data('$option');
 			var option = $option.data('option');

 			if(!$option.hasClass('active')){
 				if(option.cameraPosition){
 					goToCameraPosition(option.cameraPosition);
 				}else{
 					goToCameraPosition(params.cameraPosition);
 				}

 				if(option.controlsTarget){
 					goToControlsTarget(option.controlsTarget);
 				}else{
 					goToControlsTarget(params.controlsTarget);
 				}
 			}

 			deactivateActiveOption();
			$option.addClass('active');


 			if($option.data('type') == 'toggle'){
 				$('.toggle-active', $option).click();

 			}else if($option.data('type') == 'switches'){
 				// Show options dialog
 				$container.addClass('option-active');
 			}else{
 				// Show options dialog
 				$container.addClass('option-active');
 				if(!option.keepSelectionsOpen){
	 				// Hide Selections Container
		 			$container.addClass('selections-hidden');
 					 				
	 			}
			}
 		});

 		$container.on('click', '.cndce-selections-category', function onSelectionsCategoryClick(e){
 			var $this = $(this);

 			$('.cndce-selections-category.active', $selectionsCategoryContainer).removeClass('active');

 			$this.addClass('active');



 			$('.cndce-selections-category-items.active', $selectionsContainer).removeClass('active');

 			$this.data('$itemsContainer').addClass('active');




 		})

 


 		$container.on('click', '.cndce-option-choice', function onChoiceClick(e){
 			var $this = $(this);

 			if($this.hasClass('disabled') || $this.hasClass('active'))
 				return;

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


 			}else if($option.data('type') == 'switches'){
 				choice = $this.data('choice');

 				if(choice.isActive){
 					$this.removeClass('switch-active');
 				}else{
 					$this.addClass('switch-active');
 					if(!choice.quantity){
 						choice.quantity = 1;
 						updateChoiceQuantity($this, 0);
 					}

 					// console.log(choice.quantity);
 				}

 				// Toggle choice
 				choice.isActive = !choice.isActive;


 			}else{
 				$('.cndce-option-choice.active', $option).removeClass('active');

 				$this.addClass('active');
 				choice = $this.data('choice');
 			}

 			if(option.applyChoices){ 				
	 			option.applyChoices(choice, truckModel, scene);
 			}

 			// Camera & Controls Position
 			if(choice.cameraPosition)
 				goToCameraPosition(choice.cameraPosition);
 			if(choice.controlsTarget)
 				goToControlsTarget(choice.controlsTarget);


 			// Update selections
 			updateSelection($selection, choice);
 			
 		});

 		

 		$container.on('click', '.choice-quantity-minus', function onChoiceQuantityMinusClick(e){
 			var $choice = $(this).parents('.cndce-option-choice');
 			var choice = $choice.data('choice');

 			if(!choice.quantity){
 				choice.isActive = true;
 				return;
 			}

 			if(choice.isActive && choice.quantity - 1 > 0){
 				choice.isActive = false;
 				// e.stopPropagation();
 			}

 			updateChoiceQuantity($choice, -1);
 		});

 		$container.on('click', '.choice-quantity-plus', function onChoiceQuantityPlusClick(e){
 			var $choice = $(this).parents('.cndce-option-choice');
 			var choice = $choice.data('choice');

 			choice.isActive = false;

 			if(choice.maxQuantity && choice.quantity >= choice.maxQuantity)
 				return;

 			updateChoiceQuantity($choice, 1);
 		})

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


 		// Screenshots
 		$container.keyup(function(e){
 			if(e.key == 'p'){
 				downloadScreenshot();
 			}
 		})



 		;(function init(){


 			// Param Set Defaults
 			params = getDefaults(params, defaults);


 			if(!CNDCE.ConfiguratorFunctions){
 				CNDCE.ConfiguratorFunctions = {}
 			}

 			initThreeJs();
 			initModel();



 		})();
 	}
})