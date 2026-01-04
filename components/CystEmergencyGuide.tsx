import React, { useState } from 'react';
import { AlertTriangle, ThermometerSnowflake, Ban, Syringe, ShieldAlert, CheckCircle2 } from 'lucide-react';

const CystEmergencyGuide = () => {
    const [activeSide, setActiveSide] = useState<'do' | 'dont' | null>(null);

    return (
        <div className="w-full bg-neutral-950 py-12 border-y border-neutral-900 relative overflow-hidden group">
            {/* Background Ambience */}
            <div className={`absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-red-900/10 transition-opacity duration-700 ${activeSide === 'do' ? 'opacity-0' : activeSide === 'dont' ? 'opacity-0' : 'opacity-100'}`} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center space-x-2 bg-red-900/20 text-red-500 px-3 py-1 rounded-full border border-red-500/20 mb-4 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Medical Alert</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">Cyst Suddenly Inflamed?</h2>
                    <p className="text-neutral-400 font-light max-w-xl mx-auto">
                        A sebaceous cyst can turn from a small lump to a painful abscess in <span className="text-white font-bold">under 4 hours</span>. Your actions right now determine the outcome.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* THE DO'S - CALM SIDE */}
                    <div
                        onMouseEnter={() => setActiveSide('do')}
                        onMouseLeave={() => setActiveSide(null)}
                        className={`relative rounded-3xl p-8 transition-all duration-500 border overflow-hidden ${activeSide === 'dont' ? 'opacity-40 scale-95 blur-[1px]' : 'opacity-100 scale-100'
                            } ${activeSide === 'do'
                                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.15)] transform -translate-y-2'
                                : 'bg-neutral-900/50 border-neutral-800'
                            }`}
                    >
                        {/* Status Light */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-emerald-500/50 rounded-b-xl blur-md transition-all duration-500 ${activeSide === 'do' ? 'opacity-100 w-32' : 'opacity-0'}`} />

                        <div className="flex flex-col h-full">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${activeSide === 'do' ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-emerald-500'}`}>
                                    <ThermometerSnowflake className="w-5 h-5" />
                                </div>
                                <h3 className={`text-xl font-bold uppercase tracking-widest transition-colors ${activeSide === 'do' ? 'text-emerald-400' : 'text-neutral-300'}`}>
                                    Protocol: Calm
                                </h3>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start space-x-3 text-sm text-neutral-300">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span><strong className="text-white block">Cold Compress Only.</strong> Apply ice (wrapped in cloth) for 10-15 mins. This constricts vessels and reduces thumping pain.</span>
                                </li>
                                <li className="flex items-start space-x-3 text-sm text-neutral-300">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span><strong className="text-white block">Anti-Inflammatories.</strong> Ibuprofen (if safe for you) helps halt the inflammatory cascade internally.</span>
                                </li>
                                <li className="flex items-start space-x-3 text-sm text-neutral-300">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span><strong className="text-white block">Emergency Kenalog.</strong> The gold standard. A steroid injection can flatten a cyst in 24 hours.</span>
                                </li>
                            </ul>

                            <a href="#booking-section" className={`w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs text-center border transition-all ${activeSide === 'do'
                                    ? 'bg-emerald-500 text-black border-emerald-500 hover:bg-emerald-400'
                                    : 'bg-transparent text-emerald-500 border-emerald-900/50 hover:border-emerald-500/50'
                                }`}>
                                Book Emergency Injection
                            </a>
                        </div>
                    </div>

                    {/* THE DON'TS - DANGER SIDE */}
                    <div
                        onMouseEnter={() => setActiveSide('dont')}
                        onMouseLeave={() => setActiveSide(null)}
                        className={`relative rounded-3xl p-8 transition-all duration-500 border overflow-hidden ${activeSide === 'do' ? 'opacity-40 scale-95 blur-[1px]' : 'opacity-100 scale-100'
                            } ${activeSide === 'dont'
                                ? 'bg-red-950/30 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.15)] transform -translate-y-2'
                                : 'bg-neutral-900/50 border-neutral-800'
                            }`}
                    >
                        {/* Status Light */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-red-500/50 rounded-b-xl blur-md transition-all duration-500 ${activeSide === 'dont' ? 'opacity-100 w-32' : 'opacity-0'}`} />

                        <div className="flex flex-col h-full">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${activeSide === 'dont' ? 'bg-red-500 text-black' : 'bg-neutral-800 text-red-500'}`}>
                                    <Ban className="w-5 h-5" />
                                </div>
                                <h3 className={`text-xl font-bold uppercase tracking-widest transition-colors ${activeSide === 'dont' ? 'text-red-400' : 'text-neutral-300'}`}>
                                    Danger Zone
                                </h3>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start space-x-3 text-sm text-neutral-300">
                                    <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span><strong className="text-white block">NEVER Squeeze.</strong> The sac walls are fragile. Squeezing ruptures the cyst <i>inwards</i>, spreading bacteria deep into tissue.</span>
                                </li>
                                <li className="flex items-start space-x-3 text-sm text-neutral-300">
                                    <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span><strong className="text-white block">NO Hot Compresses.</strong> Heat increases blood flow, which feeds the inflammation and swelling.</span>
                                </li>
                                <li className="flex items-start space-x-3 text-sm text-neutral-300">
                                    <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span><strong className="text-white block">Avoid Home Remedies.</strong> Tea tree oil or cider vinegar can burn inflamed skin, making surgery harder later.</span>
                                </li>
                            </ul>

                            <button disabled className="w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs text-center border bg-transparent text-neutral-600 border-neutral-800 cursor-not-allowed">
                                Avoid Permanent Scarring
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CystEmergencyGuide;
