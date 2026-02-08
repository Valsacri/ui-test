import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Save, RotateCcw, Palette } from 'lucide-react';

interface JerseyDesigner3DProps {
  onSave?: (design: any) => void;
}

export function JerseyDesigner3D({ onSave }: JerseyDesigner3DProps) {
  const [primaryColor, setPrimaryColor] = useState('#B8976B');
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');
  const [accentColor, setAccentColor] = useState('#003C66');
  const [pattern, setPattern] = useState('stripes');
  const [number, setNumber] = useState('10');
  const [playerName, setPlayerName] = useState('SQUAD');
  const [sponsor, setSponsor] = useState('SPORGATES');

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const jerseyGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const presetColors = [
    { name: 'Orange', primary: '#FC8936', secondary: '#FFFFFF' },
    { name: 'Blue', primary: '#003C66', secondary: '#FFFFFF' },
    { name: 'Red', primary: '#DC2626', secondary: '#FFFFFF' },
    { name: 'Green', primary: '#16A34A', secondary: '#FFFFFF' },
    { name: 'Black', primary: '#000000', secondary: '#FFFFFF' },
    { name: 'Navy', primary: '#1E3A8A', secondary: '#FCD34D' },
  ];

  const patterns = [
    { id: 'solid', name: 'Solid', icon: '⬛' },
    { id: 'stripes', name: 'Vertical Stripes', icon: '▦' },
    { id: 'hoops', name: 'Horizontal Hoops', icon: '☰' },
    { id: 'split', name: 'Half & Half', icon: '◧' },
  ];

  const handleSave = () => {
    const design = {
      primaryColor,
      secondaryColor,
      accentColor,
      pattern,
      number,
      playerName,
      sponsor,
    };
    onSave?.(design);
  };

  // Create fabric normal map texture for realistic material
  const createFabricNormalMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    const imageData = ctx.createImageData(256, 256);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = Math.random() * 10 - 5;
      imageData.data[i] = 128 + noise;     // R
      imageData.data[i + 1] = 128 + noise; // G
      imageData.data[i + 2] = 255;         // B
      imageData.data[i + 3] = 255;         // A
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting setup for realistic rendering
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(5, 5, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 0, -3);
    scene.add(fillLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.2);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(-3, 2, -5);
    scene.add(rimLight);

    // Ground plane for shadow
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.15 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create jersey group
    const jerseyGroup = new THREE.Group();
    jerseyGroupRef.current = jerseyGroup;
    scene.add(jerseyGroup);

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !jerseyGroup) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      jerseyGroup.rotation.y += deltaX * 0.01;
      jerseyGroup.rotation.x += deltaY * 0.01;
      
      // Clamp X rotation
      jerseyGroup.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, jerseyGroup.rotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (jerseyGroup && !isDragging) {
        jerseyGroup.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update jersey when colors or pattern change
  useEffect(() => {
    if (!jerseyGroupRef.current) return;

    // Clear existing jersey
    while (jerseyGroupRef.current.children.length > 0) {
      const child = jerseyGroupRef.current.children[0];
      jerseyGroupRef.current.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    // Create pattern texture
    const createPatternTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;

      if (pattern === 'solid') {
        ctx.fillStyle = primaryColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (pattern === 'stripes') {
        const stripeWidth = 25;
        for (let i = 0; i < canvas.width; i += stripeWidth * 2) {
          ctx.fillStyle = primaryColor;
          ctx.fillRect(i, 0, stripeWidth, canvas.height);
          ctx.fillStyle = secondaryColor;
          ctx.fillRect(i + stripeWidth, 0, stripeWidth, canvas.height);
        }
      } else if (pattern === 'hoops') {
        const hoopHeight = 50;
        for (let i = 0; i < canvas.height; i += hoopHeight * 2) {
          ctx.fillStyle = primaryColor;
          ctx.fillRect(0, i, canvas.width, hoopHeight);
          ctx.fillStyle = secondaryColor;
          ctx.fillRect(0, i + hoopHeight, canvas.width, hoopHeight);
        }
      } else if (pattern === 'split') {
        ctx.fillStyle = primaryColor;
        ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
        ctx.fillStyle = secondaryColor;
        ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const patternTexture = createPatternTexture();
    const normalMap = createFabricNormalMap();

    // Create realistic jersey material
    const jerseyMaterial = new THREE.MeshStandardMaterial({
      map: patternTexture,
      normalMap: normalMap,
      roughness: 0.7,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // Main body - using subdivided box with curved edges
    const bodyWidth = 3;
    const bodyHeight = 4;
    const bodyDepth = 0.8;
    
    // Create curved torso using multiple segments
    const torsoGeometry = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth, 20, 20, 10);
    const positionAttribute = torsoGeometry.attributes.position;
    
    // Apply curvature to make it more organic
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      
      // Curve the sides inward
      const curveAmount = Math.abs(x) / bodyWidth;
      const newZ = z - curveAmount * 0.2;
      
      // Round the shoulders
      if (y > bodyHeight * 0.3) {
        const shoulderCurve = (y - bodyHeight * 0.3) / (bodyHeight * 0.2);
        const shoulderZ = newZ - shoulderCurve * shoulderCurve * 0.3;
        positionAttribute.setZ(i, shoulderZ);
        
        // Narrow at shoulders
        const narrowAmount = shoulderCurve * 0.3;
        positionAttribute.setX(i, x * (1 - narrowAmount));
      } else {
        positionAttribute.setZ(i, newZ);
      }
      
      // Slight curve at bottom
      if (y < -bodyHeight * 0.3) {
        const bottomCurve = Math.abs(y + bodyHeight * 0.3) / (bodyHeight * 0.2);
        positionAttribute.setZ(i, newZ + bottomCurve * 0.1);
      }
    }
    
    torsoGeometry.computeVertexNormals();
    
    const torso = new THREE.Mesh(torsoGeometry, jerseyMaterial);
    torso.castShadow = true;
    torso.receiveShadow = true;
    jerseyGroupRef.current.add(torso);

    // Neck opening
    const neckGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.3, 32);
    const neckMaterial = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.6,
      metalness: 0.1,
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.set(0, 2.15, 0);
    neck.castShadow = true;
    jerseyGroupRef.current.add(neck);

    // Create realistic sleeves using tube geometry
    const createSleeve = (side: number) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 1.5, 1.5, 0),
        new THREE.Vector3(side * 2.2, 1.2, -0.2),
        new THREE.Vector3(side * 2.6, 0.5, -0.3),
        new THREE.Vector3(side * 2.8, -0.3, -0.25),
      ]);

      const sleeveGeometry = new THREE.TubeGeometry(curve, 20, 0.35, 16, false);
      const sleeve = new THREE.Mesh(sleeveGeometry, jerseyMaterial);
      sleeve.castShadow = true;
      sleeve.receiveShadow = true;
      jerseyGroupRef.current!.add(sleeve);

      // Sleeve stripes
      for (let i = 0; i < 3; i++) {
        const stripePosition = curve.getPoint(0.6 + i * 0.1);
        const stripeCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(stripePosition.x, stripePosition.y, stripePosition.z - 0.1),
          new THREE.Vector3(stripePosition.x, stripePosition.y, stripePosition.z + 0.1),
        ]);
        
        const stripeGeometry = new THREE.TubeGeometry(stripeCurve, 8, 0.37, 16, false);
        const stripeMaterial = new THREE.MeshStandardMaterial({
          color: accentColor,
          roughness: 0.6,
          metalness: 0.1,
        });
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.castShadow = true;
        jerseyGroupRef.current!.add(stripe);
      }
    };

    createSleeve(1);  // Right sleeve
    createSleeve(-1); // Left sleeve

    // Sponsor badge on front
    if (sponsor) {
      const badgeGeometry = new THREE.BoxGeometry(1.6, 0.5, 0.08, 10, 5, 1);
      const badgePositions = badgeGeometry.attributes.position;
      
      // Curve the badge to follow the torso
      for (let i = 0; i < badgePositions.count; i++) {
        const z = badgePositions.getZ(i);
        if (z > 0) {
          badgePositions.setZ(i, z + 0.05);
        }
      }
      badgeGeometry.computeVertexNormals();

      const badgeMaterial = new THREE.MeshStandardMaterial({
        color: secondaryColor,
        roughness: 0.4,
        metalness: 0.1,
      });
      const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
      badge.position.set(0, 0.8, 0.45);
      badge.castShadow = true;
      jerseyGroupRef.current.add(badge);

      // Sponsor text
      const sponsorCanvas = document.createElement('canvas');
      sponsorCanvas.width = 512;
      sponsorCanvas.height = 256;
      const sponsorCtx = sponsorCanvas.getContext('2d');
      if (sponsorCtx) {
        sponsorCtx.fillStyle = primaryColor;
        sponsorCtx.font = 'bold 70px Arial';
        sponsorCtx.textAlign = 'center';
        sponsorCtx.textBaseline = 'middle';
        sponsorCtx.fillText(sponsor, 256, 128);

        const sponsorTexture = new THREE.CanvasTexture(sponsorCanvas);
        const sponsorTextMaterial = new THREE.MeshBasicMaterial({
          map: sponsorTexture,
          transparent: true,
        });
        const sponsorTextGeometry = new THREE.PlaneGeometry(1.4, 0.4);
        const sponsorText = new THREE.Mesh(sponsorTextGeometry, sponsorTextMaterial);
        sponsorText.position.set(0, 0.8, 0.54);
        jerseyGroupRef.current.add(sponsorText);
      }
    }

    // Front number
    const frontNumberCanvas = document.createElement('canvas');
    frontNumberCanvas.width = 256;
    frontNumberCanvas.height = 256;
    const frontNumberCtx = frontNumberCanvas.getContext('2d');
    if (frontNumberCtx) {
      frontNumberCtx.fillStyle = secondaryColor;
      frontNumberCtx.globalAlpha = 0.25;
      frontNumberCtx.font = 'bold 150px Arial';
      frontNumberCtx.textAlign = 'center';
      frontNumberCtx.textBaseline = 'middle';
      frontNumberCtx.fillText(number, 128, 128);

      const frontNumberTexture = new THREE.CanvasTexture(frontNumberCanvas);
      const frontNumberMaterial = new THREE.MeshBasicMaterial({
        map: frontNumberTexture,
        transparent: true,
      });
      const frontNumberGeometry = new THREE.PlaneGeometry(1.2, 1.2);
      const frontNumber = new THREE.Mesh(frontNumberGeometry, frontNumberMaterial);
      frontNumber.position.set(0, -0.5, 0.45);
      jerseyGroupRef.current.add(frontNumber);
    }

    // Back - Player name
    const nameCanvas = document.createElement('canvas');
    nameCanvas.width = 1024;
    nameCanvas.height = 256;
    const nameCtx = nameCanvas.getContext('2d');
    if (nameCtx) {
      // Shadow/outline
      nameCtx.fillStyle = accentColor;
      nameCtx.font = 'bold 100px Arial';
      nameCtx.textAlign = 'center';
      nameCtx.textBaseline = 'middle';
      nameCtx.fillText(playerName, 512, 128);

      // Main text
      nameCtx.fillStyle = secondaryColor;
      nameCtx.font = 'bold 85px Arial';
      nameCtx.fillText(playerName, 512, 128);

      const nameTexture = new THREE.CanvasTexture(nameCanvas);
      const nameMaterial = new THREE.MeshBasicMaterial({
        map: nameTexture,
        transparent: true,
      });
      const nameGeometry = new THREE.PlaneGeometry(2.8, 0.5);
      const nameMesh = new THREE.Mesh(nameGeometry, nameMaterial);
      nameMesh.position.set(0, 1.5, -0.45);
      nameMesh.rotation.y = Math.PI;
      jerseyGroupRef.current.add(nameMesh);
    }

    // Back - Large number
    const backNumberCanvas = document.createElement('canvas');
    backNumberCanvas.width = 512;
    backNumberCanvas.height = 512;
    const backNumberCtx = backNumberCanvas.getContext('2d');
    if (backNumberCtx) {
      // Outline
      backNumberCtx.fillStyle = accentColor;
      backNumberCtx.font = 'bold 380px Arial';
      backNumberCtx.textAlign = 'center';
      backNumberCtx.textBaseline = 'middle';
      backNumberCtx.fillText(number, 256, 256);

      // Main number
      backNumberCtx.fillStyle = secondaryColor;
      backNumberCtx.font = 'bold 320px Arial';
      backNumberCtx.fillText(number, 256, 256);

      const backNumberTexture = new THREE.CanvasTexture(backNumberCanvas);
      const backNumberMaterial = new THREE.MeshBasicMaterial({
        map: backNumberTexture,
        transparent: true,
      });
      const backNumberGeometry = new THREE.PlaneGeometry(2.2, 2.2);
      const backNumber = new THREE.Mesh(backNumberGeometry, backNumberMaterial);
      backNumber.position.set(0, -0.2, -0.45);
      backNumber.rotation.y = Math.PI;
      jerseyGroupRef.current.add(backNumber);
    }

  }, [primaryColor, secondaryColor, accentColor, pattern, number, playerName, sponsor]);

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#FC8936]" />
            <span className="font-semibold text-gray-900">3D Jersey Designer</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              if (jerseyGroupRef.current) {
                jerseyGroupRef.current.rotation.set(0, 0, 0);
              }
            }}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>
            <Button 
              onClick={handleSave}
              size="sm" 
              className="bg-[#FC8936] hover:bg-[#E67A2E]"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Design
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Jersey Preview */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">3D Preview</h3>
          
          <div 
            ref={mountRef} 
            className="w-full h-[600px] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <span className="font-medium">🖱️ Drag to rotate</span> - Click and drag to view all angles
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900">
                <span className="font-medium">🔄 Auto-rotating</span> - Automatically spins when not dragging
              </p>
            </div>
          </div>
        </Card>

        {/* Design Controls */}
        <Card className="p-6">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Label className="text-sm font-medium mb-3 block">Preset Color Schemes</Label>
                <div className="grid grid-cols-2 gap-2">
                  {presetColors.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPrimaryColor(preset.primary);
                        setSecondaryColor(preset.secondary);
                      }}
                      className="justify-start gap-2"
                    >
                      <div 
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: preset.primary }}
                      />
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design" className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Pattern Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  {patterns.map((p) => (
                    <Button
                      key={p.id}
                      variant={pattern === p.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPattern(p.id)}
                      className={pattern === p.id ? 'bg-[#FC8936] hover:bg-[#E67A2E]' : ''}
                    >
                      <span className="mr-2">{p.icon}</span>
                      {p.name}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="number" className="text-sm font-medium mb-2 block">
                  Player Number
                </Label>
                <Input
                  id="number"
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value.slice(0, 2))}
                  maxLength={2}
                  placeholder="10"
                  className="text-center text-2xl font-bold"
                />
              </div>

              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                  Player Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                  maxLength={12}
                  placeholder="PLAYER"
                  className="text-center font-bold uppercase"
                />
              </div>

              <div>
                <Label htmlFor="sponsor" className="text-sm font-medium mb-2 block">
                  Sponsor Logo
                </Label>
                <Input
                  id="sponsor"
                  type="text"
                  value={sponsor}
                  onChange={(e) => setSponsor(e.target.value)}
                  placeholder="SPORGATES"
                  className="text-center"
                />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
