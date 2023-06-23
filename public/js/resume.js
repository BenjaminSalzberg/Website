(function ($) {
	"use strict"; // Start of use strict

	// Smooth scrolling using jQuery easing
	$('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: (target.offset().top)
				}, 1000, "easeInOutExpo");
				return false;
			}
		}
	});

	// Closes responsive menu when a scroll trigger link is clicked
	$('.js-scroll-trigger').click(function () {
		$('.navbar-collapse').collapse('hide');
	});

	// Activate scrollspy to add active class to navbar items on scroll
	$('body').scrollspy({
		target: '#sideNav'
	});

})(jQuery); // End of use strict


const firebaseConfig = {
	apiKey: "AIzaSyDg5qMhvcPUGmwyIj1Qz22xvBHr2p4zUv4",
	authDomain: "benjamin-salzberg-website.firebaseapp.com",
	databaseURL: "https://benjamin-salzberg-website.firebaseio.com",
	projectId: "benjamin-salzberg-website",
	storageBucket: "benjamin-salzberg-website.appspot.com",
	messagingSenderId: "152510216347",
	appId: "1:152510216347:web:6c83a67180a38b39d56e3e",
	measurementId: "G-71C1HMM9BE"
};

firebase.initializeApp(firebaseConfig);

var provider = new firebase.auth.GoogleAuthProvider();

const database = firebase.database();

function writeUserData(userId, uid, email) {
	firebase.database().ref('Users/' + userId).set({
		UID: uid,
		Email: email
	});
}

function writeUserHashData(Hash, GUID) {
	firebase.database().ref('HashGUID/' + Hash).set({
		GUID: GUID
	});
}

String.prototype.hashCode = function () {
	var hash = 0,
		i, chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		chr = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}


function SignIn() {
	firebase.auth()
		.signInWithPopup(provider)
		.then((result) => {

			/** @type {firebase.auth.OAuthCredential} */
			var credential = result.credential;

			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = credential.accessToken;
			// The signed-in user info.
			var user = result.user;
			var email = user.email;
			// IdP data available in result.additionalUserInfo.profile.
			// ...
			var hash = email.hashCode();
			var UserId = "";
			var userExists = false;
			dbRef.child("HashGUID").child(hash).get().then((snapshot) => {
				if (snapshot.exists()) {
					UserId = snapshot.val().GUID;
					userExists = true;
				} else {
					UserId = crypto.randomUUID();
				}
			}).catch((error) => {
				console.error(error);
			}).then(() => {
				if (!userExists) {
					writeUserHashData(hash, UserId);
				}
				dbRef.child("Users").child(UserId).get().then((snapshot) => {
					if (!snapshot.exists()) {
						writeUserData(UserId, user.uid, user.email);
					}
				});
			});

		}).catch((error) => {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
			// ...
			console.error(errorCode);
			console.error(errorMessage);
			console.log(email);
			console.error(credential);
		});
};

function SignOut() {
	firebase.auth().signOut().then(() => {
		// Sign-out successful.
	}).catch((error) => {
		// An error happened.
		console.error(error);
	});

}
firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/v8/firebase.User
		var uid = user.uid;
		$("#_SignInID").hide();
		$("#_SignOutID").show();
		//console.log("Logged in");
		// ...
	} else {
		// User is signed out
		// ...
		$("#_SignInID").show();
		$("#_SignOutID").hide();
		//console.log("Logged Out");
	}
});

const dbRef = firebase.database().ref();
