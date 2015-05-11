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
	//if (THREE) {
	//	var scene = new THREE.Scene();
	//	console.log('THREE: scene: ' + scene);
	//}


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

	var renderView = 'render-component';

	Template.home.helpers({
		resize: function () {
			//console.log('resize');
			renderContent();
			return Session.get("resize");
		},
		dynamicTemplate: function () {
			return Session.get('renderView');
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
			var aboutCard = document.getElementById('about-card');
			if (aboutCard) {
				aboutCard.style.visibility = 'visible';
			}
		},
		'click #dismiss-about-btn': function () {
			var aboutCard = document.getElementById('about-card');
			aboutCard.style.visibility = 'hidden';
		},
		'click #personalize': function () {
			Router.go('personalize');
		},
		'click #plants': function () {
			Session.set('renderView', 'plants');
			//renderView = 'plants';
			//Router.go('plants');
		},
		'click #gallery': function () {
			Router.go('gallery');
		},
		'click #community': function () {
			Router.go('community');
		},
		'click #rebates': function () {
			Router.go('rebates');
		},
		'click #watersmart': function () {
			Router.go('watersmart');
		},
		'click #login': function () {
			console.log('login reached');
			Router.go('signin');
		}
	})
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
		console.log('Server HELLO-materalize')
	});
}
