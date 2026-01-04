import React, { useState } from 'react';
import { Zap, Snowflake, Activity, Shield, Check, Clock, AlertCircle, ChevronRight, Syringe, Scissors, Stethoscope } from 'lucide-react';

interface SignatureTreatmentsProps {
    pageType: 'general' | 'verruca' | 'genital' | 'skintag' | 'cyst' | 'lipoma' | 'mole' | 'ganglion';
    onBook: () => void;
}

const SignatureTreatments: React.FC<SignatureTreatmentsProps> = ({ pageType, onBook }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const getContent = () => {
        switch (pageType) {
            case 'verruca':
                return {
                    laser: {
                        title: "Deep-Pulse Laser Therapy",
                        desc: "Our high-intensity laser penetrates stubborn plantar skin to target the root blood supply of deep verrucas.",
                        benefit: "Ideal for long-standing resistant verrucas."
                    },
                    prevention: "Verruca Prevention Protocol: Sterilizes the surrounding tissue to stop satellite warts."
                };
            case 'genital':
                return {
                    laser: {
                        title: "Precision Laser Removal",
                        desc: "Ultra-targeted beam vaporizes wart tissue instantly without damaging sensitive surrounding skin. Contactless and hygienic.",
                        benefit: "Instant removal for peace of mind."
                    },
                    prevention: "Recurrence Block: targets viral reservoirs to prevent outbreaks."
                };
            case 'skintag':
                return {
                    laser: {
                        title: "CO2 Surgical Laser",
                        desc: "The comprehensive aesthetic solution. Vaporizes the stalk and smoothens the base in one pass.",
                        benefit: "Best for cosmetic results on face/neck."
                    },
                    prevention: "Complete stalk removal prevents regrowth."
                }
            case 'cyst':
                return {
                    laser: {
                        title: "Surgical Excision",
                        desc: "The Gold Standard. Complete removal of the cyst sac to ensure it never returns.",
                        benefit: "Permanent Solution with Histology."
                    },
                    prevention: "Sac Removal: The only way to stop recurrence."
                };
            default:
                return {
                    laser: {
                        title: "CO2 Surgical Laser",
                        desc: "The gold standard in aesthetic dermatology. Vaporizes wart tissue instantly while preserving healthy skin.",
                        benefit: "Scar-free potential with immediate cosmetic improvement."
                    },
                    prevention: "The Prevention Laser Program: Stops recurrence by neutralizing the viral root."
                };
        }
    };

    const content = getContent();

    // Custom Layout for Cysts (3 Options: Surgery, Injection, Scan)
    if (pageType === 'cyst' || pageType === 'lipoma') {
        const isLipoma = pageType === 'lipoma';
        return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
                {/* 1. Injection (Kenalog / Dissolving) */}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all flex flex-col group">
                    <div className="w-12 h-12 rounded-xl bg-blue-900/20 flex items-center justify-center text-blue-400 mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <Syringe size={24} />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-2 italic text-center text-balance">{isLipoma ? "Specialized Fat Dissolving Injection" : "Kenalog Injection"}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-4 text-center">{isLipoma ? "Non-Surgical" : "Anti-Inflammatory"}</p>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6 text-center text-balance">
                        {isLipoma ? "Gradually breaks down fat cells in smaller lipomas using specialized compounds." : "Reduces inflammation in angry, red cysts. Often the first step before surgical removal."}
                    </p>
                    <button onClick={onBook} className="mt-auto w-full py-3 rounded-lg bg-neutral-800 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-700 transition-all">
                        Check Suitability
                    </button>
                </div>

                {/* 2. Surgical Excision (Center Highlight) */}
                <div className="relative bg-neutral-900 border border-amber-500/50 rounded-2xl p-8 lg:-mt-4 lg:-mb-4 shadow-2xl shadow-amber-900/10 hover:shadow-amber-900/20 transition-all z-10 flex flex-col group">
                    <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                        <span className="px-6 py-2 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg shadow-amber-500/20">Gold Standard</span>
                    </div>
                    <div className="w-16 h-16 rounded-xl gold-gradient flex items-center justify-center text-black mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
                        <Scissors size={32} />
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2 italic text-center">{isLipoma ? "Surgical Lipoma Removal" : "Surgical Excision"}</h3>
                    <p className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-4 text-center">Complete Removal</p>
                    <p className="text-sm text-neutral-300 leading-relaxed font-light mb-6 text-center text-balance">
                        {isLipoma ? "Meticulous removal of the fatty lump through a minimal incision. Best for permanent clearance." : "Meticulous removal of the entire cyst sac under local anesthetic. Ensures the cyst does not return."}
                    </p>
                    <button onClick={onBook} className="mt-auto w-full py-4 rounded-xl gold-gradient text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-lg shadow-amber-500/10">
                        Consult Surgeon
                    </button>
                </div>

                {/* 3. Clinical Assessment */}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all flex flex-col group">
                    <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <Stethoscope size={24} />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-2 italic text-center">Clinical Assessment</h3>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-4 text-center">Expert Diagnosis</p>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6 text-center text-balance">
                        {isLipoma ? "Expert evaluation to confirm the lump is a benign lipoma and not another condition." : "Expert diagnosis to confirm the nature of the lump (Lipoma vs Cyst) before treatment."}
                    </p>
                    <button onClick={onBook} className="mt-auto w-full py-3 rounded-lg bg-neutral-800 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-700 transition-all">
                        Book Assessment
                    </button>
                </div>
            </div>
        );
    }

    // Custom Layout for Ganglion (Only Surgical Excision)
    if (pageType === 'ganglion') {
        return (
            <div className="flex justify-center max-w-7xl mx-auto">
                {/* Surgical Excision (Centered) */}
                <div className="relative bg-neutral-900 border border-amber-500/50 rounded-2xl p-8 shadow-2xl shadow-amber-900/10 hover:shadow-amber-900/20 transition-all z-10 flex flex-col group max-w-md w-full">
                    <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                        <span className="px-6 py-2 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg shadow-amber-500/20">Gold Standard</span>
                    </div>
                    <div className="w-16 h-16 rounded-xl gold-gradient flex items-center justify-center text-black mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
                        <Scissors size={32} />
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2 italic text-center">Surgical Excision</h3>
                    <p className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-4 text-center">Complete Removal</p>
                    <p className="text-sm text-neutral-300 leading-relaxed font-light mb-6 text-center text-balance">
                        Meticulous removal of the entire ganglion cyst sac under local anesthetic. Ensures the cyst does not return.
                    </p>
                    <button onClick={onBook} className="mt-auto w-full py-4 rounded-xl gold-gradient text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-lg shadow-amber-500/10">
                        Consult Surgeon
                    </button>
                </div>
            </div>
        )
    }

    // Custom Layout for Mole Removal (5 Options)
    if (pageType === 'mole') {
        return (
            <div className="max-w-7xl mx-auto">
                {/* Top Row: The USP (Laser) */}
                <div className="mb-8">
                    <div className="relative bg-neutral-900 border border-amber-500/50 rounded-2xl p-8 shadow-2xl shadow-amber-900/10 hover:shadow-amber-900/20 transition-all group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Zap size={120} className="text-amber-500" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-20 h-20 rounded-2xl gold-gradient flex items-center justify-center text-black shadow-lg shadow-amber-500/20 shrink-0">
                                <Zap size={40} />
                            </div>
                            <div className="text-center md:text-left flex-grow">
                                <div className="inline-block px-4 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                                    Signature Treatment
                                </div>
                                <h3 className="text-3xl font-serif text-white mb-2 italic">Specialized Laser Removal</h3>
                                <p className="text-sm text-neutral-300 leading-relaxed font-light max-w-2xl">
                                    Our minimal-scarring technique. High-precision laser vaporizes the mole layer-by-layer, leaving smooth, healthy skin underneath. Perfect for cosmetic face and neck moles.
                                </p>
                            </div>
                            <button onClick={onBook} className="whitespace-nowrap px-8 py-4 rounded-xl gold-gradient text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-lg shadow-amber-500/10">
                                Book Laser Consult
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Grid: 4 Other Options */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

                    {/* Shave Removal */}
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all flex flex-col group">
                        <div className="w-10 h-10 rounded-lg bg-blue-900/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                            <Scissors size={20} />
                        </div>
                        <h3 className="text-lg font-serif text-white mb-2 italic">Shave Removal</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                            For raised moles. We gently shave the mole flush with the skin. Fast healing with excellent cosmetic results.
                        </p>
                    </div>

                    {/* Punch Removal */}
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all flex flex-col group">
                        <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                            <Activity size={20} />
                        </div>
                        <h3 className="text-lg font-serif text-white mb-2 italic">Punch Removal</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                            For flat, smaller moles. A precise device removes the mole core. Requires a tiny stitch but ensures complete removal.
                        </p>
                    </div>

                    {/* Surgical Excision */}
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all flex flex-col group">
                        <div className="w-10 h-10 rounded-lg bg-green-900/20 flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition-transform">
                            <Shield size={20} />
                        </div>
                        <h3 className="text-lg font-serif text-white mb-2 italic">Surgical Excision</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                            For deep or larger moles. The entire mole and root are cut out. Best for preventing regrowth or testing for histology.
                        </p>
                    </div>

                    {/* Melanoma Check */}
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all flex flex-col group">
                        <div className="w-10 h-10 rounded-lg bg-red-900/20 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="text-lg font-serif text-white mb-2 italic">Melanoma Check</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                            Worried about a mole? ABCD assessment and specialist review. We can perform a biopsy if anything looks suspicious.
                        </p>
                    </div>
                </div>
            </div>
        );
    }



    // Custom Layout for Skin Tags (4 Options)
    if (pageType === 'skintag') {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
                {/* 1. Signature Laser - Recommended (First) */}
                <div
                    className="group relative bg-neutral-900 border border-amber-500/50 rounded-2xl p-6 shadow-2xl shadow-amber-900/10 hover:shadow-amber-900/20 transition-all duration-300 flex flex-col z-10"
                    onMouseEnter={() => setHoveredIndex(0)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                        <span className="px-4 py-1 bg-amber-500 text-black text-[9px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg shadow-amber-500/20">Signature Choice</span>
                    </div>

                    <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center text-black mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <Zap size={24} fill="currentColor" />
                    </div>

                    <h3 className="text-xl font-serif text-white mb-2 italic text-center">CO2 Surgical Laser</h3>
                    <p className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-4 text-center">15 Min Procedure • Minimal Scarring</p>

                    <p className="text-xs text-neutral-300 leading-relaxed font-light mb-6 text-center">
                        Our most recommended option. Instantly vaporizes the tag at the base, sealing the skin for a smooth, blemish-free finish.
                    </p>

                    <button onClick={onBook} className="mt-auto w-full py-3 rounded-lg gold-gradient hover:bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center shadow-lg shadow-amber-500/10 hover:shadow-amber-500/30">
                        Book Free Consultation <ChevronRight size={14} className="ml-1" />
                    </button>
                </div>

                {/* 2. Cauterization */}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-orange-900/20 flex items-center justify-center text-orange-500 mb-6 mx-auto">
                        <Activity size={24} />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-2 italic text-center">Medical Cautery</h3>
                    <p className="text-[10px] uppercase tracking-widest text-orange-500 font-bold mb-4 text-center">Heat-Based Removal</p>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6 text-center">
                        Uses heat to seal the stalk. Effective for larger tags but may leave a small temporary scab.
                    </p>
                    <button onClick={onBook} className="mt-auto w-full py-3 rounded-lg bg-neutral-800 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-700 transition-all">
                        Check Suitability
                    </button>
                </div>

                {/* 3. Cryosurgery */}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-blue-900/20 flex items-center justify-center text-blue-400 mb-6 mx-auto">
                        <Snowflake size={24} />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-2 italic text-center">Cryosurgery</h3>
                    <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-4 text-center">Liquid Nitrogen Freeze</p>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6 text-center">
                        Freezes the tag until it falls off. Simple but less precise than laser for facial areas.
                    </p>
                    <button onClick={onBook} className="mt-auto w-full py-3 rounded-lg bg-neutral-800 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-700 transition-all">
                        Check Suitability
                    </button>
                </div>

                {/* 4. Surgical Excision */}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 mb-6 mx-auto">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-2 italic text-center">Surgical Excision</h3>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-4 text-center">For Large/Complex Tags</p>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6 text-center">
                        Physical removal with a scalpel under local anesthetic. Best for giant tags.
                    </p>
                    <button onClick={onBook} className="mt-auto w-full py-3 rounded-lg bg-neutral-800 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-700 transition-all">
                        Consult Surgeon
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {/* 1. Cryotherapy - Cost Effective */}
            <div
                className="group relative bg-neutral-900/40 border border-neutral-800 rounded-2xl p-8 hover:border-neutral-600 transition-all duration-300 flex flex-col"
                onMouseEnter={() => setHoveredIndex(0)}
                onMouseLeave={() => setHoveredIndex(null)}
            >
                <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-neutral-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-400 border border-neutral-700">Cost Effective</span>
                </div>

                <div className="w-14 h-14 rounded-xl bg-blue-900/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                    <Snowflake size={28} />
                </div>

                <h3 className="text-2xl font-serif text-white mb-2 italic">Clinical Cryotherapy</h3>
                <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-6">Standard Freeze Treatment</p>

                <p className="text-sm text-neutral-400 leading-relaxed font-light mb-8">
                    A targeted burst of liquid nitrogen freezes the wart structure. This disruption allows your immune system to clear the treated tissue.
                </p>

                <div className="space-y-3 mb-8 border-t border-neutral-800 pt-6">
                    <li className="flex items-start text-xs text-neutral-500">
                        <Check size={14} className="mr-2 text-blue-500 flex-shrink-0" />
                        <span>Quick 10-15 minute appointment</span>
                    </li>
                    <li className="flex items-start text-xs text-neutral-500">
                        <Check size={14} className="mr-2 text-blue-500 flex-shrink-0" />
                        <span>Ideally suited for new or small superficial warts</span>
                    </li>
                </div>

                <button onClick={onBook} className="mt-auto w-full py-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center group-hover:bg-blue-900/30 group-hover:text-blue-200">
                    Check Suitability <ChevronRight size={14} className="ml-2 opacity-50" />
                </button>
            </div>

            {/* 2. Signature Laser - Recommended (Center/Larger) */}
            <div
                className="group relative bg-neutral-900 border border-amber-500/50 rounded-2xl p-8 lg:-mt-6 lg:-mb-6 shadow-2xl shadow-amber-900/10 hover:shadow-amber-900/20 transition-all duration-300 flex flex-col z-10"
                onMouseEnter={() => setHoveredIndex(1)}
                onMouseLeave={() => setHoveredIndex(null)}
            >
                <div className="absolute -inset-[1px] bg-gradient-to-b from-amber-500/50 to-transparent rounded-2xl opacity-20 pointer-events-none"></div>

                <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                    <span className="px-6 py-2 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg shadow-amber-500/20">Signature Choice</span>
                </div>

                <div className="w-16 h-16 rounded-xl gold-gradient flex items-center justify-center text-black mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20 mx-auto lg:mx-0">
                    <Zap size={32} fill="currentColor" />
                </div>

                <h3 className="text-3xl font-serif text-white mb-2 italic">{content.laser.title}</h3>
                <p className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-6">Advanced Medical Laser</p>

                <p className="text-sm text-neutral-300 leading-relaxed font-light mb-8">
                    {content.laser.desc} <span className="text-white font-medium block mt-2">{content.laser.benefit}</span>
                </p>

                {/* Prevention Program Highlight */}
                <div className="bg-gradient-to-br from-amber-950/40 to-black border border-amber-500/30 rounded-xl p-5 mb-8 relative overflow-hidden group-hover:border-amber-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-2 opacity-30">
                        <Shield size={64} className="text-amber-500" />
                    </div>
                    <div className="relative z-10">
                        <h5 className="flex items-center text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                            <Shield size={14} className="mr-2" /> Anti-Reoccurrence
                        </h5>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            <strong>Prevention Laser Program:</strong> Specifically targets the viral DNA in the surrounding tissue margin to stop the wart from coming back.
                        </p>
                    </div>
                </div>

                <button onClick={onBook} className="mt-auto w-full py-5 rounded-xl gold-gradient hover:bg-white text-black text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center shadow-lg shadow-amber-500/10 hover:shadow-amber-500/30">
                    Book Laser Treatment <ChevronRight size={16} className="ml-2" />
                </button>
            </div>

            {/* 3. Surgical Excision - Reserved */}
            <div
                className="group relative bg-neutral-900/40 border border-neutral-800 rounded-2xl p-8 hover:border-neutral-600 transition-all duration-300 flex flex-col"
                onMouseEnter={() => setHoveredIndex(2)}
                onMouseLeave={() => setHoveredIndex(null)}
            >
                <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-neutral-900 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-500 border border-neutral-800">Special Cases</span>
                </div>

                <div className="w-14 h-14 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 mb-6 group-hover:scale-110 transition-transform">
                    <Activity size={28} />
                </div>

                <h3 className="text-2xl font-serif text-white mb-2 italic">Surgical Excision</h3>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-6">Reserved for Complex Growth</p>

                <p className="text-sm text-neutral-400 leading-relaxed font-light mb-8">
                    A definitive medical procedure performed under local anesthesia. Physically removes the growth entirely in one session.
                </p>

                <div className="space-y-3 mb-8 border-t border-neutral-800 pt-6">
                    <li className="flex items-start text-xs text-neutral-500">
                        <AlertCircle size={14} className="mr-2 text-neutral-400 flex-shrink-0" />
                        <span>Reserved for resistant/large growths</span>
                    </li>
                    <li className="flex items-start text-xs text-neutral-500">
                        <Clock size={14} className="mr-2 text-neutral-400 flex-shrink-0" />
                        <span>Requires healing & recovery time</span>
                    </li>
                </div>

                <button onClick={onBook} className="mt-auto w-full py-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center">
                    Consult Surgeon <ChevronRight size={14} className="ml-2 opacity-50" />
                </button>
            </div>
        </div>
    );
};

export default SignatureTreatments;
