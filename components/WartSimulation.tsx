
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Procedural texture for skin
const SkinMaterial = ({ color, roughness = 0.8, bumpScale = 0.05 }) => {
    return (
        <meshStandardMaterial
            color={color}
            roughness={roughness}
            metalness={0.1}
            bumpScale={bumpScale}
        />
    );
};

const WartGrowth = ({ progress, type }: { progress: number, type: 'general' | 'verruca' | 'genital' | 'skintag' | 'cyst' | 'lipoma' }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Geometry Generation
    const geometry = useMemo(() => {
        // Skin Tag: Cylinder/Capsule shape for stalk
        if (type === 'skintag') {
            const geo = new THREE.CapsuleGeometry(0.5, 1, 4, 16);
            const pos = geo.getAttribute('position');
            const v = new THREE.Vector3();
            // Narrow the base to simulate a stalk
            for (let i = 0; i < pos.count; i++) {
                v.fromBufferAttribute(pos, i);
                if (v.y < -0.2) {
                    v.x *= 0.4; // Narrow neck
                    v.z *= 0.4;
                }
                pos.setXYZ(i, v.x, v.y, v.z);
            }
            return geo;
        }


        // Cyst: Smooth Subcutaneous Dome
        if (type === 'cyst') {
            // A slightly flattened sphere to represent a lump UNDER the skin
            const geo = new THREE.SphereGeometry(1.2, 64, 64);
            const pos = geo.getAttribute('position');
            const v = new THREE.Vector3();
            for (let i = 0; i < pos.count; i++) {
                v.fromBufferAttribute(pos, i);
                // Flatten the bottom (deep tissue) and top (skin surface) slightly
                if (v.y < 0) v.y *= 0.6;
                pos.setXYZ(i, v.x, v.y, v.z);
            }
            geo.computeVertexNormals();
            return geo;
        }

        // Lipoma: Soft, Lobulated, Fatty Lump (Subcutaneous)
        if (type === 'lipoma') {
            const geo = new THREE.SphereGeometry(1.4, 64, 64); // Larger base
            const pos = geo.getAttribute('position');
            const v = new THREE.Vector3();
            for (let i = 0; i < pos.count; i++) {
                v.fromBufferAttribute(pos, i);
                // Flatten more significantly (spreads under skin)
                if (v.y > 0.3) v.y *= 0.5;
                // Add some lumpiness (lobules)
                const noise = Math.sin(v.x * 3) * Math.cos(v.z * 3) * 0.1;
                v.y += noise;
                pos.setXYZ(i, v.x, v.y, v.z);
            }
            geo.computeVertexNormals();
            return geo;
        }

        // Standard Wart Sphere
        const geo = new THREE.SphereGeometry(1, 64, 64);
        const positionAttribute = geo.getAttribute('position');
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);
            const noise = Math.sin(vertex.x * 5) * Math.cos(vertex.y * 5) * Math.sin(vertex.z * 5);
            vertex.addScaledVector(vertex, noise * (type === 'genital' ? 0.2 : 0.1));
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        geo.computeVertexNormals();
        return geo;
    }, [type]);

    useFrame(() => {
        if (meshRef.current) {
            let scale = 0.1 + (progress * 1.5);
            let height = 0.05 + (progress * 1.2);

            if (type === 'verruca') {
                height = 0.05 + (progress * 0.4); // Flatter
                scale = 0.1 + (progress * 1.8); // Wider
            }
            if (type === 'skintag') {
                height = 0.1 + (progress * 2.0); // Grows outward
                scale = 0.1 + (progress * 0.8);
                meshRef.current.position.y = height * 0.4;
            }
            if (type === 'cyst') {
                // Cyst grows as a smooth lump
                scale = 0.4 + (progress * 1.1);
                height = 0.3 + (progress * 0.9);
                // Subcutaneous positioning
                meshRef.current.position.y = (height * 0.5) - 0.2;
            }
            if (type === 'lipoma') {
                // Lipoma grows slowly and spreads
                scale = 0.5 + (progress * 1.2);
                height = 0.2 + (progress * 0.6); // Stays flatter
                meshRef.current.position.y = (height * 0.5) - 0.3; // Deeper
            }
            else if (type !== 'skintag' && type !== 'verruca' && type !== 'cyst') {
                meshRef.current.scale.set(scale, height, scale);
            }

            if (type === 'cyst' || type === 'lipoma') {
                meshRef.current.scale.set(scale, height, scale);
            }

            const healthyColor = new THREE.Color("#eec0b6");
            let wartColor = new THREE.Color("#8d6e63");

            if (type === 'genital') wartColor = new THREE.Color("#dfaea1");
            if (type === 'skintag') wartColor = new THREE.Color("#dca594");
            // Cyst: Starts skin color, becomes yellower (keratin) or red (inflamed)
            if (type === 'cyst') {
                // Interpolate: Skin -> White/Yellow (Sac) -> Red (Inflamed)
                if (progress < 0.5) {
                    wartColor = new THREE.Color("#eec0b6"); // Skin Match
                } else if (progress < 0.8) {
                    wartColor = new THREE.Color("#fef3c7"); // Keratin (Yellowish)
                } else {
                    wartColor = new THREE.Color("#ef4444"); // Inflamed (Red)
                }
            }
            // Lipoma is fatty tissue (Yellowish)
            if (type === 'lipoma') {
                // Starts skin colored, becomes distinct fatty yellow mass
                if (progress < 0.3) wartColor = new THREE.Color("#eec0b6");
                else wartColor = new THREE.Color("#fcd34d"); // Fatty Yellow
            }

            // @ts-ignore
            meshRef.current.material.color.lerpColors(healthyColor, wartColor, progress);

            // Cyst specific material properties (glossy/tight skin)
            if (type === 'cyst' || type === 'lipoma') {
                // @ts-ignore
                meshRef.current.material.roughness = 0.3; // Shinier (tight skin)
                // @ts-ignore
                meshRef.current.material.metalness = 0.1;
                // @ts-ignore
                meshRef.current.material.transparent = true;
                // @ts-ignore
                meshRef.current.material.opacity = 0.9;
            }
        }

        // ... (Genital cluster logic remains same)
    });

    // ... (Genital return remains same)

    return (
        <mesh ref={meshRef} position={[0, type === 'verruca' ? -0.2 : 0, 0]} geometry={geometry}>
            <meshStandardMaterial roughness={type === 'skintag' ? 0.5 : 0.9} metalness={0.0} transparent={type === 'cyst'} opacity={type === 'cyst' ? 0.95 : 1} />
        </mesh>
    );
};

// Red blood vessel dots (capillaries)
const Vessels = ({ progress, type }: { progress: number, type: 'general' | 'verruca' | 'genital' | 'skintag' | 'cyst' | 'lipoma' }) => {
    if (progress < 0.3 || type === 'skintag' || type === 'cyst' || type === 'lipoma') return null; // No visible vessels on skin tags or cysts typically

    const count = type === 'verruca' ? 60 : 30; // More dots for verruca
    const positions = useMemo(() => {
        const pos = [];
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const r = Math.random() * (type === 'verruca' ? 0.8 : 0.5);
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            const y = type === 'verruca' ? 0.1 : (0.5 + Math.random() * 0.5);
            pos.push([x, y, z]);
        }
        return pos;
    }, [type]);

    return (
        <group>
            {positions.map((p, i) => (
                <mesh key={i} position={[p[0], progress * p[1], p[2]]} scale={[0.03 * progress, 0.03 * progress, 0.03 * progress]}>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshBasicMaterial color={type === 'verruca' ? "#3f0000" : "#7f1d1d"} />
                </mesh>
            ))}
        </group>
    )

}

const VirusParticles = ({ progress }: { progress: number }) => {
    if (progress > 0.3) return null;

    return (
        <group position={[0, 2 - (progress * 10), 0]}>
            {Array.from({ length: 10 }).map((_, i) => (
                <mesh key={i} position={[Math.random() - 0.5, Math.random(), Math.random() - 0.5]}>
                    <icosahedronGeometry args={[0.05, 0]} />
                    <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
                </mesh>
            ))}
        </group>
    )
}

const SkinLayer = ({ type }: { type: 'general' | 'verruca' | 'genital' | 'skintag' | 'cyst' | 'lipoma' }) => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color={type === 'verruca' ? "#eaddcf" : "#f3d0c7"} roughness={1} />
            <gridHelper args={[10, 20, 0x000000, 0x000000]} position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
    )
}


const SimulationScene = ({ type }: { type: 'general' | 'verruca' | 'genital' | 'skintag' | 'cyst' | 'lipoma' }) => {
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useFrame((state, delta) => {
        if (isPlaying) {
            setProgress((prev) => {
                if (prev >= 1) {
                    setIsPlaying(false);
                    return 1;
                }
                return prev + (delta * 0.15);
            });
        }
    });

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPlaying(false);
        setProgress(parseFloat(e.target.value));
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const getStageTitle = (stage: number) => {
        if (type === 'verruca') {
            if (stage === 2) return "Inward Growth";
            if (stage === 3) return "Vascular Thrombosis";
            if (stage === 4) return "Plantar Verruca";
        }
        if (type === 'genital') {
            if (stage === 2) return "Cluster Formation";
            if (stage === 3) return "Vascularization";
            if (stage === 4) return "Genital Warts";
        }
        if (type === 'skintag') {
            if (stage === 2) return "Friction & Rubbing";
            if (stage === 3) return "Collagen Buildup";
            if (stage === 4) return "Benign Fibroma";
        }
        if (type === 'cyst') {
            if (stage === 2) return "Sebum Blockage";
            if (stage === 3) return "Keratin Sac Forms";
            if (stage === 4) return "Epidermoid Cyst";
        }
        if (type === 'lipoma') {
            if (stage === 2) return "Fatty Tissue Growth";
            if (stage === 3) return "Soft Mobile Lump";
            if (stage === 4) return "Benign Lipoma";
        }
        if (stage === 2) return "Hyperkeratosis";
        if (stage === 3) return "Angiogenesis";
        if (stage === 4) return "Established Wart";
        return "";
    }

    return (
        <>
            <group position={[0, 0, 0]}>
                {/* Healthy Skin Base */}
                <SkinLayer type={type} />

                {/* The Wart / Cyst */}
                <group position={[0, 0, 0]}>
                    {/* @ts-ignore - Prop type mismatch is known/safe here */}
                    <WartGrowth progress={progress} type={type} />
                    {type !== 'cyst' && type !== 'lipoma' && <Vessels progress={progress} type={type} />}
                    {type !== 'skintag' && type !== 'cyst' && type !== 'lipoma' && <VirusParticles progress={progress} />}
                </group>

                {/* Educational Labels for Cyst */}
                {type === 'cyst' && progress > 0.1 && (
                    <Html position={[0, 2.5, 0]} center>
                        <div className="bg-black/90 text-amber-500 px-3 py-2 rounded-lg border border-amber-500/50 text-center min-w-[140px] backdrop-blur-sm">
                            <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Anatomy</p>
                            <p className="font-bold text-sm">
                                {progress < 0.4 ? "Blocked Pore" : progress < 0.7 ? "Sac Formation" : "Mature Cyst"}
                            </p>
                            <p className="text-[9px] text-neutral-300 mt-1 italic leading-tight">
                                {progress < 0.4 ? "Sebum gets trapped" : progress < 0.7 ? "Keratin fills the sac" : "Must remove sac to cure"}
                            </p>
                        </div>
                    </Html>
                )}

                {/* Educational Labels for Lipoma */}
                {type === 'lipoma' && progress > 0.1 && (
                    <Html position={[0, 2.5, 0]} center>
                        <div className="bg-black/90 text-amber-500 px-3 py-2 rounded-lg border border-amber-500/50 text-center min-w-[140px] backdrop-blur-sm">
                            <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Diagnosis</p>
                            <p className="font-bold text-sm text-yellow-400">
                                {progress < 0.4 ? "Adipose Growth" : progress < 0.7 ? "Soft Lump" : "Lipoma"}
                            </p>
                            <p className="text-[9px] text-neutral-300 mt-1 italic leading-tight">
                                {progress < 0.4 ? "Fat cells multiply slightly" : progress < 0.7 ? "Soft, movable mass forms" : "Benign fatty tumor (Harmless)"}
                            </p>
                        </div>
                    </Html>
                )}

                {/* Standard Labels for others (Existing) */}
                {type !== 'cyst' && type !== 'lipoma' && progress < 0.2 && (
                    <Html position={[0, 2, 0]} center>
                        <div className="bg-black/90 text-amber-500 px-3 py-2 rounded-lg border border-amber-500/50 text-center min-w-[120px] max-w-[160px] backdrop-blur-sm">
                            <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Stage 1</p>
                            <p className="font-bold text-xs sm:text-sm">{type === 'skintag' ? 'Skin Friction' : 'HPV Infection'}</p>
                            <p className="text-[9px] text-neutral-300 mt-1 italic leading-tight">
                                {type === 'skintag' ? 'Collagen fibers loosen' : 'Virus enters via micro-abrasion'}
                            </p>
                        </div>
                    </Html>
                )}

                {/* ... (Keep existing Stage 2, 3, 4 logic for non-cyst) ... */}
                {type !== 'cyst' && type !== 'lipoma' && progress > 0.3 && progress < 0.7 && (
                    <Html position={[1.8, 1, 0]} center>
                        <div className="bg-black/90 text-amber-500 px-3 py-2 rounded-lg border border-amber-500/50 text-center min-w-[120px] max-w-[160px] backdrop-blur-sm">
                            <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Stage 2</p>
                            <p className="font-bold text-xs sm:text-sm">{getStageTitle(2)}</p>
                            <p className="text-[9px] text-neutral-300 mt-1 italic leading-tight">
                                {type === 'verruca' ? 'Pressure forces growth inward' : type === 'skintag' ? 'Skin rubbing creates excess growth' : 'Rapid excess keratin production'}
                            </p>
                        </div>
                    </Html>
                )}
                {type !== 'cyst' && type !== 'lipoma' && progress > 0.5 && (
                    <Html position={[-1.8, 0.5, 0]} center>
                        <div className={`bg-black/90 ${type === 'skintag' ? 'text-amber-500 border-amber-500/50' : 'text-red-500 border-red-500/50'} px-3 py-2 rounded-lg text-center min-w-[120px] max-w-[160px] backdrop-blur-sm`}>
                            <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Stage 3</p>
                            <p className="font-bold text-xs sm:text-sm">{getStageTitle(3)}</p>
                            <p className="text-[9px] text-neutral-300 mt-1 italic leading-tight">
                                {type === 'verruca' ? 'Black dots (clotted vessels) appear' : type === 'skintag' ? 'Loose collagen gets trapped' : 'Blood supply hijacked by wart'}
                            </p>
                        </div>
                    </Html>
                )}
                {type !== 'cyst' && type !== 'lipoma' && progress > 0.9 && (
                    <Html position={[0, 2.2, 0]} center>
                        <div className="bg-black/90 text-amber-500 px-3 py-2 rounded-lg border border-amber-500/50 text-center backdrop-blur-sm">
                            <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Final Stage</p>
                            <p className="font-bold text-xs sm:text-sm">{getStageTitle(4)}</p>
                        </div>
                    </Html>
                )}

            </group>

            <OrbitControls enableZoom={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.5} />

            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Environment preset="studio" />

            {/* Interactive Controls UI - Mobile Optimized */}
            <Html position={[0, -2.5, 0]} center zIndexRange={[100, 0]}>
                <div className="flex flex-col items-center space-y-3 bg-black/80 p-3 rounded-2xl border border-neutral-800 backdrop-blur-sm w-[85vw] max-w-[320px]">
                    <button onClick={togglePlay} className="p-3 rounded-full bg-neutral-800 text-amber-500 hover:bg-neutral-700 transition-colors">
                        {isPlaying ? <span className="block w-4 h-4 bg-current rounded-sm" /> : <span className="block w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-current border-b-[8px] border-b-transparent ml-1" />}
                    </button>
                    <div className="flex-grow">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={progress}
                            onChange={handleSliderChange}
                            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
                        />
                    </div>
                </div>
            </Html>
        </>
    );
};

const WartSimulation = ({ type = 'general' }: { type?: 'general' | 'verruca' | 'genital' | 'skintag' | 'cyst' | 'lipoma' }) => {
    return (
        <div className="w-full h-full min-h-[500px] bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 relative group">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${type === 'verruca' ? 'bg-red-500' : 'bg-amber-500'} animate-pulse`}></div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold"> Interactive Model: {type}</span>
                </div>
            </div>
            <Canvas camera={{ position: [0, 2, 7.5], fov: 45 }}>
                <SimulationScene type={type} />
            </Canvas>
        </div>
    );
};

export default WartSimulation;
