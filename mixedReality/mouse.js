/*
	intersectObjects may need to be recursive.
		But then you need to make it so the object grabbed is the parent
*/

let mouse = null
let clickables = []
function initMouse()
{
	var asynchronous = {
		clicking: false,
		rightClicking:false,
		justMoved: false,

		normalizedDevicePosition: new THREE.Vector2(), //top right is 1,1, bottom left is -1,-1
	};

	mouse = {
		clicking: false,
		rightClicking: false,
		oldClicking: false,
		oldRightClicking: false,
		justMoved: false,

		lastClickedObject: null,
		lastRightClickedObject:null,

		//don't use too much if clicking is not true - touchscreens. There are other ways to do things, and many people will be on phone
		rayCaster: new THREE.Raycaster()
	};
	mouse.rayCaster.setFromCamera(asynchronous.normalizedDevicePosition, camera)
	mouse.previousRay = mouse.rayCaster.ray.clone()

	mouse.rayIntersectionWithZPlane = function(z)
	{
		var zPlane = new THREE.Plane(zUnit,-z)
		return mouse.rayCaster.ray.intersectPlane(zPlane,new THREE.Vector3())
	}

	mouse.rotateObjectByGesture = function(object)
	{
		var rotationAmount = mouse.rayCaster.ray.direction.angleTo(mouse.previousRay.direction) * 2
		// console.log(mouse.rayCaster.ray.direction,mouse.previousRay.direction)
		if(rotationAmount === 0)
		{
			return
		}
		var rotationAxis = mouse.rayCaster.ray.direction.clone().cross(mouse.previousRay.direction);
		rotationAxis.applyQuaternion(object.quaternion.clone().inverse()).normalize();
		object.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(rotationAxis, rotationAmount))
	}

	mouse.updateFromAsyncAndCheckClicks = function()
	{
		this.oldClicking = this.clicking;
		this.clicking = asynchronous.clicking
		this.oldRightClicking = this.rightClicking;
		this.rightClicking = asynchronous.rightClicking;

		this.justMoved = asynchronous.justMoved;
		asynchronous.justMoved = false;

		mouse.previousRay.copy(mouse.rayCaster.ray);
		mouse.rayCaster.setFromCamera( asynchronous.normalizedDevicePosition, camera );
	}

	var currentRawX = 0;
	var currentRawY = 0;
	document.addEventListener( 'mousemove', function(event)
	{
		event.preventDefault();
		//for some bizarre reason this can be called more than once with the same values
		if(event.clientX !== currentRawX || event.clientY !== currentRawY)
		{
			asynchronous.justMoved = true;

			asynchronous.normalizedDevicePosition.x = ( event.clientX / window.innerWidth  ) * 2 - 1;
			asynchronous.normalizedDevicePosition.y =-( event.clientY / window.innerHeight ) * 2 + 1;

			currentRawX = event.clientX;
			currentRawY = event.clientY;
		}
	}, false );

	document.addEventListener( 'mousedown', function(event) 
	{
		if(event.which === 1)
		{
			asynchronous.clicking = true;
		}
		if(event.which === 3)
		{
			asynchronous.rightClicking = true;
		}
	}, false );
	document.addEventListener( 'mouseup', function(event) 
	{
		if(event.which === 1)
		{
			asynchronous.clicking = false;
		}
		if(event.which === 3)
		{
			asynchronous.rightClicking = false;
		}
	}, false );

	document.addEventListener('contextmenu', function(event)
	{
	    event.preventDefault()
	}, false);
}