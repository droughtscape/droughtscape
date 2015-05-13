Router.map(function () {
	this.route('home', {path: '/'});
	this.route('watersmart', {path: '/watersmart'});
	this.route('personalize', {path: '/personalize'});
	this.route('plants', {path: '/plants'});
	this.route('gallery', {path: '/gallery'});
	this.route('community', {path: '/community'});
	this.route('rebates', {path: '/rebates'});
	this.route('hello', {path: '/hello'});
	this.route('signin', {path: '/signin'});
});

if (Meteor.isClient) {
	Session.setDefault("resize", null);
	Meteor.startup(function () {
		window.addEventListener('resize', function () {
			Session.set("resize", new Date());
		});
	});
// counter starts at 0
	Session.setDefault('counter', 0);
	Session.setDefault('renderView', 'splash');
	Session.setDefault('secondBtn', 'favoritesBtn');
	if (typeof THREE !== 'undefined') {
		var scene = new THREE.Scene();
		console.log('THREE: scene: ' + scene);
	}
	else {
		console.log('THREE is undefined');
	}


	window.addEventListener("resize", myFunction);
	var x = 0;

	function myFunction() {
		x += 1;
	}
	
	Template.hello.helpers({
		counter: function () {
			return Session.get('counter');
		}
	});

	Template.hello.events({
		'click button': function () {
			// increment the counter when button is clicked
			Session.set('counter', Session.get('counter') + 1);
		}
	});

	function getPosition(element) {
		var xPosition = 0;
		var yPosition = 0;

		while (element) {
			xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			element = element.offsetParent;
		}
		return {x: xPosition, y: yPosition};
	}

	Template.home.onCreated(function(){
		this.testButton = new ReactiveVar;
		this.testButton.set('favoritesBtn');
	});

	Template.home.helpers({
		resize: function () {
			//console.log('resize');
			renderContent();
			return Session.get("resize");
		},
		dynamicTemplate: function () {
			// Contents of session variable renderView will 
			// fill the content area
			return Session.get('renderView');
		},
		buttonDynamic: function () {
			return Template.instance().testButton.get();
			//return Session.get('secondBtn');
		}
	});

	var renderContent = function renderContent() {
		var content = document.getElementById("content");
		if (content) {
			var footer = document.getElementById('page-footer');
			var footerHeight = (footer) ? footer.offsetHeight : 0;
			var contentPos = getPosition(content);
			var contentHeight = (window.innerHeight - footerHeight) - contentPos.y;
			content.style.height = contentHeight + 'px';
			//console.log('content: ' + content + ', w x h: ' + screen.width + ':' + screen.height);
			var render = document.getElementById('render');
			render.style.height = contentHeight + 'px';
			var rightNav = document.getElementById('rightnav');
			rightNav.style.height = contentHeight + 'px';
			var aboutbtn = document.getElementById("aboutbtn");
			var aboutTop = contentPos.y + (contentHeight - (aboutbtn.offsetHeight + 10));
			var spacer = document.getElementById('spacer');
			var spacerPos = getPosition(spacer);
			spacer.style.height = aboutTop - spacerPos.y + 'px';
		}
	};

	Template.home.rendered = function () {
		$(document).ready(function () {
			console.log('ready');
			$(".button-collapse").sideNav();
		});
		renderContent();
	};

	Template.home.events({
		'click #aboutbtn': function () {
			Session.set('renderView', 'about');
		},
		'click #personalize': function () {
			Session.set('renderView', 'personalize');
			//Router.go('personalize');
		},
		'click #plants': function () {
			Session.set('renderView', 'plants');
			//renderView = 'plants';
			//Router.go('plants');
		},
		'click #gallery': function () {
			Session.set('renderView', 'gallery');
			//Router.go('gallery');
		},
		'click #community': function () {
			Session.set('renderView', 'community');
			//Router.go('community');
		},
		'click #rebates': function () {
			Session.set('renderView', 'rebates');
			//Router.go('rebates');
		},
		'click #watersmart': function () {
			Session.set('renderView', 'watersmart');
			//Router.go('watersmart');
		},
		'click #login': function () {
			console.log('login reached');
			Session.set('renderView', 'signin');
			//Router.go('signin');
		},
		'click #create': function () {
			Session.set('renderView', 'createview');
		},
		'click #droughtscapelogo': function () {
			Session.set('renderView', 'splash');
		}
	})
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
		console.log('Server HELLO-materalize')
	});
}
