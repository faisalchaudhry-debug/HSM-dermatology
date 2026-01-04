
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface MoleSimulationProps {
    mode: 'compare' | 'abcde';
}

// -- CUSTOM SHADERS FOR ORGANIC REALISM --

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

uniform float uTime;
uniform float uAsymmetry;
uniform float uBumpiness;
uniform float uDiameter;
uniform float uEvolution;

// Simplex 3D Noise function (standard implementation)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N)
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vUv = uv;
  vNormal = normal;

  // -- SHAPE DISTORTION --
  
  // 1. Asymmetry: Distort one side heavily based on uAsymmetry
  float distort = snoise(position * 1.5 + uTime * 0.1) * uAsymmetry * 0.5;
  
  // 2. Bumpiness: Fine grain skin texture simulation
  float microDetail = snoise(position * 8.0) * 0.05 * uBumpiness;
  
  // 3. Diameter / Evolution Scale
  float grow = 1.0 + (snoise(position + uTime * 0.5) * uEvolution * 0.2);
  
  vec3 finalPos = position + (normal * (distort + microDetail));
  
  // Apply flattening (moles are usually flatter domes)
  finalPos.y *= 0.4; 
  
  // Apply Scaling
  finalPos *= (uDiameter);

  vPosition = finalPos;
  vNoise = distort; // Pass noise to fragment for color variation

  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

uniform float uColorVar; // C: Color variation strength
uniform float uBorder;   // B: Border irregularity (alpha mask)
uniform vec3 uBaseColor;

void main() {
  // -- COLOR MIXING --
  vec3 brown = uBaseColor;
  vec3 darkSpot = vec3(0.05, 0.02, 0.02); // Almost black
  vec3 reddish = vec3(0.3, 0.05, 0.05);   // Red inflammation
  vec3 tan = vec3(0.6, 0.45, 0.35);       // Lighter tan

  // Mix based on noise and uColorVar (C)
  vec3 color = brown;
  
  // Add dark spots (Melanin clumps)
  float spotNoise = sin(vPosition.x * 10.0 + vNoise * 5.0) * cos(vPosition.z * 10.0);
  if (spotNoise > (1.0 - uColorVar)) {
      color = mix(color, darkSpot, 0.8 * uColorVar);
  }
  
  // Add redness/irritation if high variation (Melanoma trait)
  if (uColorVar > 0.6) {
       float redNoise = sin(vPosition.y * 5.0 + vNoise);
       if (redNoise > 0.5) color = mix(color, reddish, 0.5);
  }
  
  // -- BORDER LOGIC --
  // Create a radial gradient from center
  float dist = length(vPosition.xz);
  float radius = 0.9;
  
  // Border irregularity: Add noise to the radius check
  // if uBorder is high, the edge is very noisy (jagged)
  float borderNoise = vNoise * uBorder * 2.0; 
  float edge = smoothstep(radius + borderNoise, radius + borderNoise - 0.2, dist);
  
  // Discard pixels outside organic border
  if (edge < 0.1) discard;

  // -- LIGHTING (Basic Fresnel + Specular) --
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
  vec3 specular = vec3(1.0) * fresnel * 0.3; // Slight wet/oily skin look

  gl_FragColor = vec4(color + specular, 1.0);
}
`;


const MoleGeometry = ({
    isMelanoma,
    abcdeState = { a: 0, b: 0, c: 0, d: 0, e: 0 },
    mode
}: {
    isMelanoma: boolean;
    abcdeState?: { a: number, b: number, c: number, d: number, e: number };
    mode: 'compare' | 'abcde';
}) => {
    const meshRef = useRef<THREE.Mesh>(null);

    // Shader Uniforms
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uBaseColor: { value: new THREE.Color("#4a3b32") },
        uAsymmetry: { value: 0 },
        uBumpiness: { value: 0.5 }, // Base bump for realism
        uDiameter: { value: 1.0 },
        uEvolution: { value: 0 },
        uColorVar: { value: 0 },
        uBorder: { value: 0 },
    }), []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const mat = meshRef.current.material as THREE.ShaderMaterial;

        // Update Time
        mat.uniforms.uTime.value = state.clock.getElapsedTime();

        // Update ABCDE Uniforms based on Mode
        if (mode === 'compare') {
            // Melanin = High Chaos, Normal = Low Chaos
            const chaos = isMelanoma ? 1.0 : 0.0;

            // Smooth LERP for transition if we were toggling, but here static is fine
            mat.uniforms.uAsymmetry.value = THREE.MathUtils.lerp(mat.uniforms.uAsymmetry.value, chaos * 0.8, 0.05);
            mat.uniforms.uColorVar.value = THREE.MathUtils.lerp(mat.uniforms.uColorVar.value, chaos, 0.05);
            mat.uniforms.uBorder.value = THREE.MathUtils.lerp(mat.uniforms.uBorder.value, chaos * 0.5, 0.05);
            mat.uniforms.uDiameter.value = THREE.MathUtils.lerp(mat.uniforms.uDiameter.value, isMelanoma ? 1.4 : 1.0, 0.05);
            mat.uniforms.uEvolution.value = chaos * 0.2; // Subtle movement for melanoma
        } else {
            // Interactive Mode - use smooth lerp for visible transitions
            mat.uniforms.uAsymmetry.value = THREE.MathUtils.lerp(mat.uniforms.uAsymmetry.value, abcdeState.a, 0.1);
            mat.uniforms.uBorder.value = THREE.MathUtils.lerp(mat.uniforms.uBorder.value, abcdeState.b, 0.1);
            mat.uniforms.uColorVar.value = THREE.MathUtils.lerp(mat.uniforms.uColorVar.value, abcdeState.c, 0.1);
            mat.uniforms.uDiameter.value = THREE.MathUtils.lerp(mat.uniforms.uDiameter.value, 1.0 + abcdeState.d * 0.8, 0.1);
            mat.uniforms.uEvolution.value = THREE.MathUtils.lerp(mat.uniforms.uEvolution.value, abcdeState.e * 0.5, 0.1);
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0.1, 0]}>
            {/* High Poly Sphere for smooth displacement */}
            <sphereGeometry args={[1, 128, 128]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                // side={THREE.DoubleSide} 
                transparent={true}
            />
        </mesh>
    );
};

// Realistic Skin Base (PBR)
const SkinBase = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 10, 64, 64]} />
        <meshStandardMaterial
            color="#e8b5a0"
            roughness={0.6}
            metalness={0.0}
            // Subsurface Scattering effect simulated via color
            emissive="#cf8e80"
            emissiveIntensity={0.15}
        />
    </mesh>
);

const MoleSimulation: React.FC<MoleSimulationProps> = ({ mode }) => {
    const [abcde, setAbcde] = useState({ a: 0, b: 0, c: 0, d: 0, e: 0 });

    const updateVal = (key: string, val: number) => {
        setAbcde(prev => ({ ...prev, [key]: val }));
    };

    return (
        <div className="w-full min-h-[600px] md:h-[650px] flex flex-col md:flex-row bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl border border-neutral-800">

            {/* 3D Canvas */}
            <div className="flex-grow relative h-[400px] md:h-auto bg-gradient-to-br from-neutral-900 to-black">
                <Canvas camera={{ position: [0, 3.5, 7], fov: 35 }} shadows>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[5, 10, 5]} intensity={1.5} angle={0.5} penumbra={1} castShadow />
                    <pointLight position={[-2, 2, -2]} intensity={0.5} color="#e0f7fa" /> {/* Cold rim light */}

                    <group position={[0, 0, 0]}>
                        <SkinBase />
                        {mode === 'compare' ? (
                            <group>
                                <group position={[-1.5, 0, 0]}>
                                    <MoleGeometry isMelanoma={false} mode="compare" />
                                    <Html position={[0, 0, 1.5]} center>
                                        <div className="bg-emerald-500/10 backdrop-blur-md px-4 py-2 rounded-lg text-emerald-400 text-xs font-bold border border-emerald-500/30 flex flex-col items-center gap-1 shadow-lg shadow-emerald-900/20 whitespace-nowrap">
                                            <ShieldCheck size={16} />
                                            <span>Benign Mole</span>
                                            <span className="text-[9px] font-normal opacity-70">Uniform • Symmetrical</span>
                                        </div>
                                    </Html>
                                </group>
                                <group position={[1.5, 0, 0]}>
                                    <MoleGeometry isMelanoma={true} mode="compare" />
                                    <Html position={[0, 0, 1.5]} center>
                                        <div className="bg-red-500/10 backdrop-blur-md px-4 py-2 rounded-lg text-red-500 text-xs font-bold border border-red-500/30 flex flex-col items-center gap-1 shadow-lg shadow-red-900/20 whitespace-nowrap">
                                            <AlertTriangle size={16} />
                                            <span>Melanoma</span>
                                            <span className="text-[9px] font-normal opacity-70">Irregular • Multi-color</span>
                                        </div>
                                    </Html>
                                </group>
                            </group>
                        ) : (
                            <MoleGeometry isMelanoma={false} abcdeState={abcde} mode="abcde" />
                        )}
                    </group>

                    <OrbitControls
                        enableZoom={false}
                        maxPolarAngle={Math.PI / 2.5} // Don't allow going below surface
                        minPolarAngle={0.5}
                    />
                    <Environment preset="city" />
                </Canvas>

                {/* Instructions Overlay */}
                <div className="absolute top-6 left-6 max-w-[240px] pointer-events-none z-10">
                    <h3 className="text-white text-xl font-bold drop-shadow-lg mb-2">
                        {mode === 'compare' ? 'Visual Analysis' : 'Interactive ABCD Guide'}
                    </h3>
                    <p className="text-xs text-neutral-300 drop-shadow-md leading-relaxed bg-black/40 backdrop-blur-sm p-3 rounded-lg border border-white/5">
                        {mode === 'compare'
                            ? 'Compare the smooth, uniform structure of a benign mole against the chaotic, irregular growth of a melanoma.'
                            : 'Manipulate the simulation below to visualize the 5 key warning signs of skin cancer.'}
                    </p>
                </div>
            </div>

            {/* CONTROLS (Only for ABCDE mode) */}
            {mode === 'abcde' && (
                <div className="w-full md:w-96 bg-neutral-950 p-6 pt-4 flex flex-col justify-start border-l border-neutral-800 overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <Label label="A - Asymmetry" val={abcde.a} desc="One side does not match the other" />
                            <Slider val={abcde.a} onChange={(v) => updateVal('a', v)} />
                        </div>

                        <div>
                            <Label label="B - Border" val={abcde.b} desc="Edges are ragged, notched, or blurred" />
                            <Slider val={abcde.b} onChange={(v) => updateVal('b', v)} />
                        </div>

                        <div>
                            <Label label="C - Color" val={abcde.c} desc="Pigment is uneven (brown, black, tan, red)" />
                            <Slider val={abcde.c} onChange={(v) => updateVal('c', v)} />
                        </div>

                        <div>
                            <Label label="D - Diameter" val={abcde.d} desc="Size is increasing or >6mm" />
                            <Slider val={abcde.d} onChange={(v) => updateVal('d', v)} />
                        </div>

                        <div>
                            <Label label="E - Evolution" val={abcde.e} desc="Mole is changing shape, size, or color" />
                            <Slider val={abcde.e} onChange={(v) => updateVal('e', v)} />
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-4">
                        <AlertTriangle className="text-red-500 shrink-0 mt-1" size={20} />
                        <div>
                            <h5 className="text-red-400 font-bold text-xs uppercase tracking-wider mb-1">Health Warning</h5>
                            <p className="text-red-200/70 text-[10px] leading-relaxed">
                                This simulation is for educational purposes only. If you notice ANY change in your moles, book a professional consultation immediately.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Slider = ({ val, onChange }: { val: number, onChange: (v: number) => void }) => (
    <div className="relative h-6 w-full flex items-center">
        <div className="absolute inset-x-0 h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                style={{ width: `${val * 100}%` }}
            ></div>
        </div>
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={val}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
            className="absolute h-4 w-4 bg-white rounded-full shadow-lg pointer-events-none transition-all duration-75"
            style={{ left: `calc(${val * 100}% - 8px)` }}
        >
            <div className="absolute inset-0 rounded-full border-2 border-amber-500 opacity-50"></div>
        </div>
    </div>
);

const Label = ({ label, val, desc }: { label: string, val: number, desc: string }) => (
    <div className="mb-2">
        <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-bold text-white uppercase tracking-wider">{label}</span>
            <span className="text-xs text-amber-500 font-mono font-bold bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20">{(val * 100).toFixed(0)}%</span>
        </div>
        <p className="text-[10px] text-neutral-500 font-light">{desc}</p>
    </div>
);

export default MoleSimulation;
