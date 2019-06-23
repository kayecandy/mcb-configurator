# mcb-configurator
This is a 3D configurator for custom trucks using [threejs](https://threejs.org/) and [jQuery](https://jquery.com/)


Individual truck models are stored in
```
assets/models/<model_name>
```


## options.js
This file contains the different configurable options for each model. Each key value pair is an individual configurable option.


### Option Parameters

```
CNDCE.ConfiguratorOptions = {
	option1: {
		name: "Option 1",
		icon: "./assets/image/option-icon.jpg",
		defaultChoice: 0,
		choices: [
			{ ... },
			{ ... }
		],
		choicesTemplateInit: function(choice, $choicesContainer),
		applyChoices: function(choice, model, scene)
	}
}

```