# mcb-configurator
This is a 3D configurator for custom trucks using [threejs](https://threejs.org/) and [jQuery](https://jquery.com/)


Individual truck models are stored in
```
assets/models/<model_name>
```


## Installation

Include `cndce-configurator.css`

```html
<link rel="stylesheet" type="text/css" href="path_to_directory/cndce-configurator.css">
```

Include ThreeJS, jQuery, `cndce-configurator.js` and `options.js`

```html
<!-- ThreeJS -->
<script type="text/javascript" src="path_to_directory/lib/threejs/three.min.js"></script>
	<script type="text/javascript" src="path_to_directory/lib/threejs/controls/OrbitControls.js"></script>


<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"
integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>

<!-- MCB Configurator -->
<script type="text/javascript" src="path_to_directory/cndce-configurator.js"></script>
<script type="text/javascript" src="path_to_directory/assets/models/<model_name>/options.js"></script>
```

Initialize the configurator `DIV` element
```javascript
$('#cndce-configurator').cndceConfigurator({
	/* Parameters here */
})
```



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

##### choices
*Required*.
An array of choice objects. The objects may be custom defined depending on usage

---


##### choicesTemplateInit(choice)
*Required*.
A function to create and customize the DOM element in `choices[]`. Must return the DOM element.

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
