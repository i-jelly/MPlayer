function MPlayer() 
{
	this.container = document.getElementById('mplayr');
	this.model = '';
	this.motion = '';
	this.bgm = '';
	this.bg = '';
	this.loadProgressPrecent = 0;
	this.onLoadComplete = null;
	this.clock = new THREE.Clock();

	this.init = function()
	{
		if (!this.model)
		{
			console.log('Model err');
		}
		else if (!this.motion)
		{
			console.log('motion err');
		}
		else if(!this.bgm)
		{
			console.log('bgm err');
		}

		var hov = document.createElement('div');
		var loader = document.createElement('span');
		hov.setAttribute('id','hover');

		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
		camera.position.z = 30;

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xffffff);
		/*var gridHelper = new THREE.PolarGridHelper(30, 10);
		gridHelper.position.y = -10;
		scene.add( gridHelper );*/
		var ambient = new THREE.AmbientLight(0x666666);
		scene.add(ambient);
		var directionalLight = new THREE.DirectionalLight(0x887766);
		directionalLight.position.set(-1, 1, 1).normalize();
		scene.add(directionalLight);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth / 1, window.innerHeight / 1);
		this.container.appendChild(renderer.domElement);
		effect = new THREE.OutlineEffect(renderer);
		//stats = new Stats();
		//Audio
		aplayer = document.createElement('audio');
		aplayer.setAttribute('autoplay','autoplay');
		aplayer.src = this.bgm;
		aplayer.style.display = 'none';
		document.body.appendChild(aplayer);

		var onProgress = function(xhr)
		{

			if (xhr.lengthComputable)
			{
				this.loadProgressPrecent = xhr.loaded / xhr.total * 100;
				if ( xhr.loaded == xhr.total)
				{
					//this.onLoadComplete = function(xhr) {}
					console.log('load complete');
					if (typeof(this.onLoadComplete) == 'function')
					{
						aplayer.play();
						this.onLoadComplete(xhr);
					}
				}
			}
		}

		var onError = function(xhr) {};

		helper = new THREE.MMDHelper();
		var loader = new THREE.MMDLoader();
		loader.load(this.model,this.motion,function(obj)
		{
			mesh = obj;
			mesh.position.y = -10;
			scene.add(mesh);
			helper.add(mesh);
			helper.setAnimation(mesh);

			ikHelper = new THREE.CCDIKHelper(mesh);
			ikHelper.visible = false;
			scene.add(ikHelper);

			helper.setPhysics(mesh);
			physicsHelper = new THREE.MMDPhysicsHelper(mesh);
			physicsHelper.visible = false;
			scene.add(physicsHelper);
			helper.unifyAnimationDuration({ afterglow: 2.0 });
		},onProgress,onError);
		var controls = new THREE.OrbitControls(camera, renderer.domElement);
		window.addEventListener('resize', this.onWindowResize(), false);
		var phongMaterials;
		var originalMaterials;


	}
	this.makePhongMaterials = function(materials)
	{
		var array = [];
		for (var i = 0,il = materials.length;i < il;i++)
		{
			var m = new THREE.MeshPhongMaterials();
			m.copy(materials[i]);
			m.needsUpdate = true;
			array.push(m);
		}
		phongMaterials = array;
	}
	/**this.initGui = function()
	{
		var api = {
			'animation': false,
			'gradient mapping': true,
			'ik': true,
			'outline': true,
			'physics': true,
			'show IK bones': false,
			'show rigid bodies': false
		};
		var gui = new dat.GUI();
		gui.add(api,'animation').onChange(function()
		{
			helper.doAnimation = api['animation'];
		});
		gui.add(api,'gradient mapping').onChange(function()
		{
			if (originalMaterials === undefined)
			{
				originalMaterials = mesh.material;
			}
			if (phongMaterials === undefined)
			{
				this.makePhongMaterials(mesh.material);
			}
			if (api['gradient mapping'])
			{
				mesh.material = originalMaterials;
			}
			else
			{
				mesh.material = phongMaterials;
			}
		});
		gui.add(api,'ik').onChange(function()
		{
			helper.doIk = api[ 'ik' ];
		});
		gui.add(api,'outline').onChange(function()
		{
			effect.enabled = api['outline'];
		});
		gui.add(api,'physics').onChange(function()
		{
			helper.enablePhysics(api['physics']);
		});
		gui.add(api,'show IK bones').onChange(function()
		{
			ikHelper.visible = api['show IK bones'];
		});
		gui.add(api,'show rigid bodies').onChange(function()
		{
			if (physicsHelper !== undefined)
			{
				physicsHelper.visible = api['show rigid bodies'];
			}
		});
	}**/

	this.onWindowResize = function()
	{
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		effect.setSize(window.innerWidth / 1, window.innerHeight / 1);
	}

	this.animate = function()
	{
		this.render();
		requestAnimationFrame(this.animate());
	}

	this.render = function()
	{
		helper.animate(this.clock.getDelta());
		effect.render(scene, camera);
	}

}