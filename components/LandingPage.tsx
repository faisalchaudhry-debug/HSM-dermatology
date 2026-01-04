
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';

const LandingPage: React.FC = () => {
    const logoUrl = "https://github.com/faisaliqbalfaisal723-hub/harleystreemedics-image-source/blob/main/HSM%20LOGO.png?raw=true";

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-50 z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl z-0"></div>

            <div className="relative z-10 container mx-auto px-6 text-center">
                {/* Logo */}
                <div className="mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
                    <img src={logoUrl} alt="Harley Street Medics" className="h-20 sm:h-24 w-auto mx-auto object-contain" />
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif mb-6 leading-tight animate-in fade-in zoom-in duration-1000 delay-150">
                    Select Your <span className="gold-text-gradient">Clinic</span>
                </h1>
                <p className="text-neutral-400 text-lg sm:text-xl font-light italic mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                    Expert Dermatology & Wart Removal Services
                </p>

                {/* Cards Container */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                    {/* London Card */}
                    <Link to="/london" className="group">
                        <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-8 sm:p-12 hover:border-amber-500/50 transition-all duration-500 h-full flex flex-col items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-500"></div>

                            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:gold-gradient">
                                <MapPin className="w-8 h-8 text-neutral-400 group-hover:text-black transition-colors duration-500" />
                            </div>

                            <h2 className="text-3xl font-serif text-white mb-2 group-hover:text-amber-500 transition-colors">London</h2>
                            <p className="text-neutral-500 text-sm uppercase tracking-widest font-bold mb-6">Harley Street</p>

                            <span className="inline-flex items-center text-amber-500 text-xs font-bold uppercase tracking-widest hover:underline decoration-amber-500/50 underline-offset-4">
                                Enter Clinic <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </div>
                    </Link>

                    {/* Glasgow Card */}
                    <Link to="/glasgow" className="group">
                        <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-8 sm:p-12 hover:border-amber-500/50 transition-all duration-500 h-full flex flex-col items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-500"></div>

                            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:gold-gradient">
                                <MapPin className="w-8 h-8 text-neutral-400 group-hover:text-black transition-colors duration-500" />
                            </div>

                            <h2 className="text-3xl font-serif text-white mb-2 group-hover:text-amber-500 transition-colors">Glasgow</h2>
                            <p className="text-neutral-500 text-sm uppercase tracking-widest font-bold mb-6">Clyde Street</p>

                            <span className="inline-flex items-center text-amber-500 text-xs font-bold uppercase tracking-widest hover:underline decoration-amber-500/50 underline-offset-4">
                                Enter Clinic <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="mt-16 text-neutral-600 text-xs uppercase tracking-widest font-bold animate-in fade-in duration-1000 delay-700">
                    © {new Date().getFullYear()} Harley Street Medics
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
