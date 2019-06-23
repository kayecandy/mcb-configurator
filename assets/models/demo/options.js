CNDCE.ConfiguratorOptions = {

	colors: {
		name: "Color",
		icon: "./assets/images/icon-color.svg",
		defaultChoice: 1,
		choices: [
			{
				name: 'White',
				color: '#b7b3b3',
				bg: '#b7b3b3'
			},
			{
				name: 'Red Orange',
				color: '#ac1a10',
				bg: '#ac1a10'
			},
			{
				name: 'Blue',
				color: '#1692b1',
				bg: '#1692b1'
			},
			{
				name: 'Black',
				color: 'black',
				bg: 'black'
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
			model.getObjectByName('mesh_DrawCall_03').material[0].color.set(choice.color);
		}
	},
	options: {
		name: "Rim",
		icon: "./assets/images/icon-wheel.svg",
		defaultChoice: 2,
		choices: [
			{
				name: 'Rim 1',
				key: 'rim1',
				image: './assets/images/options/rims/rim1.png'
			},
			{
				name: 'Rim 2',
				key: 'rim2',
				image: './assets/images/options/rims/rim2.png'
			},
			{
				name: 'Rim 3',
				key: 'rim3',
				image: './assets/images/options/rims/rim3.png'
			}
		],
		choicesTemplateInit: function(choice){
			var $div = $('<div class="cndce-option-choice cndce-choice-rim"></div>');

			$div.css({
				backgroundImage: 'url(' + choice.image + ')'
			})

			return $div;
		},
		applyChoices: function(choice, model, scene){
			var tireNames = ['tire-fr', 'tire-fl', 'tire-br', 'tire-bl'];

			for(var i=0; i < tireNames.length; i++){
				var tire = model.getObjectByName(tireNames[i]);

				for(var j=0; j < tire.children.length; j++){
					var rim = tire.children[j];

					rim.visible = false;
				}

				var choiceRim = tire.getObjectByName(choice.key);
				choiceRim.visible = true;
				choiceRim.material[0].opacity = 1;
			}
		}
	}
	
	
}
