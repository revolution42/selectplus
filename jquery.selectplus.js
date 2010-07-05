/**
 * Selectplus
 * @param {int} [options.itemAmount=5] The amount of items shown onhover.
 * @param {int} [options.movement=300] How fast the movement is when changing items.
 * @class
 * @version 0.5
 * @author <a href="mailto:shannon@onlinemind.net">Shannon Barratt</a>
 */

(function($){
 $.fn.selectplus = function(options) {

	var _options = {
		itemAmount:7,
		movement:300,
		amountOfSpeeds:10
	};
	_options = $.extend(_options, options);

    return this.each(function()
	{
		var originalSelect = $(this);
		var selectorContainer = $('<div class="selector"></div>');
		var selector = $('<ul></ul>');
		var selectedIndex = 0;
		var itemHeight = 1;
		var amountOfItems;
		var moveTopItemAmount;
		var selectBoxShown = false;
		var intervalAction = null;
		var movementIndicator = $('<div class="indicator">');

		setup();

		/**
		 * Setup the selectbox
		 */
		function setup()
		{
			originalSelect.children().each(function(){
				var option = $(this).text();
				var key = $(this).val();

				selector.append($('<li>'+option+'</li>').data('key', key));

			});

			selectorContainer.append(selector);
			originalSelect.after(movementIndicator);
			originalSelect.after(selectorContainer);
			//originalSelect.hide();

			itemHeight = $('li', selector).height();
			amountOfItems = $('li', selector).length;
		
			moveTopItemAmount = _options.itemAmount/2;
			if( (_options.itemAmount % 2) == 1 )
			{
				moveTopItemAmount =  (_options.itemAmount - 1)/2
			}

			setOffset();
		}

		$('li', selector).click( function()
		{
			mouseClick();
		});

		selectorContainer.mousemove(function(event)
		{
			var middle = selectorContainer.height()/2;
			var difference = (event.pageY - this.offsetTop)-middle;
			var middleBar = itemHeight/2;

			intervalAction = '';

			var heightPerSpeed = ((_options.itemAmount)/2)/_options.amountOfSpeeds;
			var speed = (difference/(itemHeight+10))/heightPerSpeed;
			intervalAction = parseInt(speed,10);

			movementIndicator.css({
				position: 'absolute',
				top: event.pageY + 15,
				left: event.pageX + 15
			})
		});

		setInterval(function()
		{
			var indicator = '';
			var count = 0;

			if( intervalAction < 0 )
			{
				
				var movement = 0;
				for( count = 0; count > intervalAction; count-- )
				{
					movement++;
					indicator += '-';
				}
				movementIndicator.html(indicator);
				moveDown(movement);
			}
			else if( intervalAction > 0 )
			{
				for( count = 0; count < intervalAction; count++ )
				{
					indicator += '+';
				}
				movementIndicator.html(indicator);
				moveUp(intervalAction);
			}

			movementIndicator.html(indicator);

		}, _options.movement);

		selectorContainer.hover(function(event)
		{
			movementIndicator.show();
			selectBoxShown = true;
			var height = _options.itemAmount * itemHeight;
			var top = moveTopItemAmount * itemHeight;
			selectorContainer.height(height);
			selectorContainer.css({
				position:'relative',
				top: '-'+top,
				cursor: 'default'
			});
			setOffset();
		}, function()
		{
			mouseClick();
		});

		function mouseClick()
		{
			movementIndicator.hide();
			selectBoxShown = false;
			selectorContainer.height(itemHeight);
			selectorContainer.css({
				position:'relative',
				top: 0
			});
			setOffset();
			intervalAction = 0;
		}

		/**
		 * Set the offset on the selector.
		 * @param {bool} [animate] Should the selector be animated when moving.
		 */
		function setOffset(animate, disableTrigger)
		{
			selector[0].selectedIndex = selectedIndex;

			var listTopOffet = 0;

			if( selectedIndex >= 0 )
			{
				var amount = selectedIndex;
				if( selectBoxShown )
				{
					amount -= moveTopItemAmount;
				}
			
				listTopOffet = parseInt('-'+itemHeight,10) * (amount);
			}

			var properties = {
				top: listTopOffet,
				position: 'absolute'
			};

			if( animate )
			{
				selector.animate(properties, _options.movement);
			}
			else
			{
				selector.css(properties);
			}

			originalSelect[0].selectedIndex = selectedIndex;
			originalSelect.trigger('change', [selectedIndex]);
		}

		/**
		 * Move the selector up
		 * @param {int} [amount=1]
		 */
		function moveUp(amount)
		{
			if( !amount )
			{
				amount = 1;
			}

			for(var i = 0; i < amount; i++)
			{
				if( selectedIndex < amountOfItems-1 )
				{
					selectedIndex++;
				}
			}

			setOffset(true);
		}

		/**
		 * Move the selector down
		 * @param {int} [amount=1]
		 */
		function moveDown(amount)
		{
			if( !amount )
			{
				amount = 1;
			}

			for(var i = 0; i < amount; i++)
			{
				if( selectedIndex > 0 )
				{
					selectedIndex--;
				}
			}

			setOffset(true);
		}
    });
 };
})(jQuery);