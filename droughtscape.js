Router.map(function () {
	this.route('home', {path: '/'});
	this.route('waterwise', {path: '/waterwise'});
	this.route('plants', {path: '/plants'});
	this.route('hello', {path: '/hello'});
});

if (Meteor.isClient) {
	Session.set("resize", null);
	Meteor.startup(function () {
		window.addEventListener('resize', function () {
			Session.set("resize", new Date());
		});
	});
// counter starts at 0
	Session.setDefault('counter', 0);
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

	Template.home.helpers({
		resize: function () {
			//console.log('resize');
			renderContent();
			return Session.get("resize");
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
		$(document).ready(function(){
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
		'click #plants': function () {
			Router.go('plants');		},
		'click #waterwise': function () {
			Router.go('waterwise');
		}
	})
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
		console.log('Server HELLO-materalize')
	});
}
