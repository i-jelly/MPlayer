function MPlayer() {}

MPlayer.prototype = {
    container: document.getElementById('mplayer'),
    model: '',
    motion: [''],
    camera: [''],
    bgm: '',
    bg: '',
    delay: 0,
    ver: '0.1',
    author: 'SonneVogel',
}

MPlayer.prototype.ini = function() 
{
    var modelFile = this.model;
    var vmdFiles = this.motion;
    var cameraFiles = this.camera;
    var audioFile = this.bgm;
    var audioParams = this.delaytime;

    var container = this.container;
    var stats;

    var mesh, camera, scene, renderer, effect;
    var helper;

    var ready = false;
    var mouseX = 0,
        mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var clock = new THREE.Clock();


    init();
    animate();

    function init() 
    {
        //document.body.appendChild(container);
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        // scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        scene.add(new THREE.PolarGridHelper(30, 10));
        var ambient = new THREE.AmbientLight(0x666666);
        scene.add(ambient);
        var directionalLight = new THREE.DirectionalLight(0x887766);
        directionalLight.position.set(-1, 1, 1).normalize();
        scene.add(directionalLight);
        //
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        effect = new THREE.OutlineEffect(renderer);
        // model
        var onProgress = function(xhr) 
        {
            if (xhr.lengthComputable) 
            {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
                if ( xhr.loaded == xhr.total)
                {
                    //codes here will run zwei mal when loading complete,
                }
            }
        };
        var onError = function(xhr) {};

        helper = new THREE.MMDHelper();
        var loader = new THREE.MMDLoader();
        loader.load(modelFile, vmdFiles, function(object) 
        {
            mesh = object;
            scene.add(mesh);
            helper.add(mesh);
            helper.setAnimation(mesh);
            helper.setPhysics(mesh);
            loader.loadVmds(cameraFiles, function(vmd) 
            {
                helper.setCamera(camera);
                loader.pourVmdIntoCamera(camera, vmd);
                helper.setCameraAnimation(camera);
                loader.loadAudio(audioFile, function(audio, listener) 
                {
                    listener.position.z = 1;
                    helper.setAudio(audio, listener, audioParams);
                    /*
                     * Note: call this method after you set all animations
                     *       including camera and audio.
                     */
                    helper.unifyAnimationDuration();
                    scene.add(audio);
                    scene.add(listener);
                    scene.add(mesh);
                    ready = true;
                }, onProgress, onError);
            }, onProgress, onError);
        }, onProgress, onError);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        //
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() 
    {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        effect.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) 
    {
        mouseX = (event.clientX - windowHalfX) / 2;
        mouseY = (event.clientY - windowHalfY) / 2;
    }
    //
    function animate() 
    {
        requestAnimationFrame(animate);
        render();
    }

    function render() 
    {
        if (ready) 
        {
            helper.animate(clock.getDelta());
        }
        effect.render(scene, camera);
    }
}
