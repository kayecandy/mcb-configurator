# mcb-configurator
This is a 3D configurator for custom trucks using [ThreeJS](https://threejs.org/), [jQuery](https://jquery.com/) and [TweenJS](https://github.com/tweenjs/tween.js/)


Individual truck models are stored in
```
assets/models/<model_name>
```


**Models**
- [Demo](https://repo.cndce.me/mcb-configurator/)
- [Spitfire](https://repo.cndce.me/mcb-configurator/spitfire.html)


## Installation

Include `cndce-configurator.css`

```html
<link rel="stylesheet" type="text/css" href="path_to_directory/cndce-configurator.css">
```

Include ThreeJS, jQuery and `cndce-configurator.js`

Optional (per model) includes are `functions.js` and `options.js`

```html
<!-- ThreeJS -->
<script type="text/javascript" src="path_to_directory/lib/threejs/three.min.js"></script>
	<script type="text/javascript" src="path_to_directory/lib/threejs/controls/OrbitControls.js"></script>

<!-- TweenJS -->
  	<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js"></script>


<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"
integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>

<!-- MCB Configurator -->
<script type="text/javascript" src="path_to_directory/cndce-configurator.js"></script>
<script type="text/javascript" src="path_to_directory/assets/models/<model_name>/functions.js"></script>
<script type="text/javascript" src="path_to_directory/assets/models/<model_name>/options.js"></script>
```

Initialize the configurator `DIV` element
```javascript
$('#cndce-configurator').cndceConfigurator({
	/* Parameters here */
})
```

*TODO: Add initialization parameters. Include description to LFS here* 


## functions.js
This contains all custom functions for the model.

```javascript
CNDCE.ConfiguratorFunctions = {
	function1: function(paramA, paramB, paramN){ },
	function2: function(paramA, paramB, paramN){ },
	...
	functionN: function(paramA, paramB, paramN){ }
}
````

### Reserved functions

##### initModel(model)
This is called after the model has been loaded. Put custom scripts to initialize the model here.

**Parameters**
- `model` - a ThreeJS object of the model



## options.js
This file contains the different configurable options for each model. Each key value pair is an individual configurable option.

```javascript
CNDCE.ConfiguratorOptions = {
	option1: { ... },
	option2: { ... },
	...
	optionN: { ... }
}

```


### Option Parameters
Available parameters for each options are:

##### name
*Required*.
This will appear on the *Selected Configurations* section and Summaries.

---

##### icon
*Required*.
A URL to the icon of the option.

---

##### defaultChoice
*Required*.
An index of the initial selected choice in `choices[]`

---

##### optionType
This will specify the type of option and may affect the UI/UX of the option's `DOM` element. Possible values are *'default'*, *'toggle'* and *'switches'*

*TODO: Add description of option types*

---

##### choices
*Required*.
An array of choice objects. The objects may be custom defined depending on usage

---


##### choicesTemplateInit(choice)
A function to create and customize the DOM element in `choices[]`. Must return the DOM element.

**Notes**
- Returned DOM element should have a class name `cndce-option-choice`
- This is ***required*** if optionType is *default*

**Parameters:**
- `choices` - An object in `choices[]` to be initialized.

---



##### applyChoices(choice, model, scene)
*Required*.
A function that runs when a choice is selected.

**Parameters:**
- `choice` - An object in `choices[]` that was selected
- `model` - A ThreeJS object of the entire truck model.
- `scene` - A ThreeJS object of the scene.
