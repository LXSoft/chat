Messages = new Meteor.Collection('messages');

if (Meteor.isClient)
{
	var okcancel_events = function(selector)
	{
		return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
	};
	
	var make_okcancel_handler = function (options)
	{
		var ok = options.ok || function () {};
		var cancel = options.cancel || function () {};
  
		return function (evt)
		{
			if (evt.type === "keydown" && evt.which === 27)
			{
				// escape = cancel
				cancel.call(this, evt);
			}
			else if (evt.type === "keyup" && evt.which === 13)
			{
				// blur/return/enter = ok/submit if non-empty
				var value = String(evt.target.value || "");
				if (value) ok.call(this, value, evt);
				else       cancel.call(this, evt);
			}
		};
	};
  
	Template.form.events = {};
	Template.form.events[okcancel_events('#message')] = make_okcancel_handler(
	{
		ok: function(text, event)
		{
			var nameEntry = document.getElementById('name');
			var t = Date.now() / 1000;
			Messages.insert({name: nameEntry.value, message: text, time: t});
			event.target.value = "";
		}
	});
	
	Template.mouses.events =
	{
		'mousedown p' : function()
		{
			Mouses.insert({enabled: 'true', time: Date.now()});
		},
		'mouseup' : function()
		{
			Mouses.insert({enabled: 'false', time: Date.now()});
		}
	}
  
	Template.messages.messages = function()
	{
		return Messages.find({},{sort: {time:-1}});
	}

	Template.mouses.mouses = function()
	{
		return Mouses.find({},{sort: {time:-1}});
	}
}
	
if (Meteor.isServer)
{
	console.log("Start-up chat server normally!");
	// Cleanup method
	/*Meteor.startup
	(
		function()
		{
			var gzp = Messages.find().count();
			console.log("Objects in messages collection was: "+gzp);
			Messages.find().forEach
			(
				function(message)
				{
					Messages.remove({name: message.name});
					//console.log(message.name);
				}
			);
		}
	);*/
}
