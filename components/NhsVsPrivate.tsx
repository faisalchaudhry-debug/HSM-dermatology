
import React, { useState } from 'react';
import { X, Check, Clock, Zap, Shield, AlertTriangle, ArrowRight } from 'lucide-react';

interface NhsVsPrivateProps {
    pageType: 'general' | 'verruca' | 'genital' | 'skintag' | 'cyst' | 'lipoma' | 'mole';
    onBook: () => void;
}

const NhsVsPrivate: React.FC<NhsVsPrivateProps> = ({ pageType, onBook }) => {
    const [activeSide, setActiveSide] = useState<'nhs' | 'private' | null>(null);

    const getContent = () => {
        switch (pageType) {
            case 'verruca':
                return {
                    title: "The Treatment Gap: Verrucas",
                    nhs: {
                        method: "Liquid Nitrogen (Cryo) & Creams",
                        issue: "Often fails to penetrate thick plantar skin.",
                        time: "Months of painful repeat freeze sessions.",
                        result: "High recurrence rate due to deep roots remaining."
                    },
                    private: {
                        method: "Deep-Pulse Laser",
                        benefit: "Penetrates callus to destroy root blood supply.",
                        time: "Often cleared in 1-2 sessions.",
                        result: "Prevention Protocol sterilizes area to stop regrowth."
                    }
                };
            case 'genital':
                return {
                    title: "The Treatment Gap: Sensitive Care",
                    nhs: {
                        method: "Topical Acids or Freezing",
                        issue: "Can be painful and cause irritation to sensitive skin.",
                        time: "Long waiting lists at sexual health clinics.",
                        result: "Stressful, drawn-out process with visual reminders."
                    },
                    private: {
                        method: "CO2 Surgical Laser",
                        benefit: "Instant vaporization with minimal contact.",
                        time: "Same-day appointment. Immediate removal.",
                        result: "Discreet, fast healing, and peace of mind."
                    }
                };
            case 'skintag':
                return {
                    title: "The Treatment Gap: Skin Tags",
                    nhs: {
                        method: "Home Remedies / DIY Kits",
                        issue: "High risk of infection and scarring.",
                        time: "Weeks of failed attempts.",
                        result: "Often leaves stalk or causes bleeding."
                    },
                    private: {
                        method: "Signature Laser / Excision",
                        benefit: "Instant removal with sterile technique.",
                        time: "Gone in minutes.",
                        result: "Smooth, blemish-free finish."
                    }
                };
            case 'mole':
                return {
                    title: "The Treatment Gap: Moles",
                    nhs: {
                        method: "Strictly Medical Necessity",
                        issue: "Benign moles are considered cosmetic and NOT treated.",
                        wait: "No appointment for cosmetic concerns.",
                        outcome: "Patients often left with visible moles affecting confidence."
                    },
                    private: {
                        method: "Signature Laser or Surgical Excision",
                        benefit: "Immediate removal for Any Mole.",
                        wait: "Same Day / Next Day Appointments.",
                        outcome: "Scar-free potential & Histology for peace of mind."
                    }
                };
            case 'cyst':
                return {
                    title: "The Treatment Gap: Cysts",
                    nhs: {
                        method: "Standard GP Care",
                        issue: "Benign lumps often ignored.",
                        time: "Antibiotics offered, but no removal.",
                        result: "Recurrent inflammation and infection risk."
                    },
                    private: {
                        method: "Surgical Excision",
                        benefit: "Complete removal of sac & histology.",
                        time: "Immediate relief and cosmetic closure.",
                        result: "Permanent removal and peace of mind."
                    }
                };
            default: // General Warts
                return {
                    title: "The Treatment Gap: Warts",
                    nhs: {
                        method: "Standard Cryotherapy",
                        issue: "Generalized approach ('Wait and See').",
                        time: "Referral waits can take months.",
                        result: "Multi-session treatments with risk of scarring."
                    },
                    private: {
                        method: "CO2 Surgical Laser",
                        benefit: "Aesthetic-focused removal preserving healthy skin.",
                        time: "Walk in with warts, walk out without them.",
                        result: "Root destruction prevents future outbreaks."
                    }
                };
        }
    };

    const content = getContent();

    return (
        <div className="w-full">
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-4xl font-serif text-white italic mb-4">{content.title}</h2>
                <p className="text-neutral-400 text-sm md:text-base font-light">Why specialized care makes the difference.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 lg:gap-8 max-w-6xl mx-auto">

                {/* NHS Card - The Problem */}
                <div
                    className={`relative bg-neutral-900/30 border ${activeSide === 'nhs' ? 'border-neutral-600' : 'border-neutral-800'} rounded-3xl p-8 transition-all duration-500 overflow-hidden group`}
                    onMouseEnter={() => setActiveSide('nhs')}
                    onMouseLeave={() => setActiveSide(null)}
                >
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Clock size={120} className="text-neutral-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                                <span className="font-bold text-neutral-500 text-xs">NHS</span>
                            </div>
                            <h3 className="text-xl text-neutral-300 font-serif italic">Standard Care</h3>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center space-x-2 text-neutral-500 text-xs font-bold uppercase tracking-widest mb-2">
                                    <AlertTriangle size={12} />
                                    <span>Method</span>
                                </div>
                                <p className="text-neutral-400 font-light">{content.nhs.method}</p>
                                <p className="text-red-900/80 text-xs mt-1 font-medium">{content.nhs.issue}</p>
                            </div>

                            <div>
                                <div className="flex items-center space-x-2 text-neutral-500 text-xs font-bold uppercase tracking-widest mb-2">
                                    <Clock size={12} />
                                    <span>Timeline</span>
                                </div>
                                <p className="text-neutral-400 font-light">{content.nhs.time}</p>
                            </div>

                            <div>
                                <div className="flex items-center space-x-2 text-neutral-500 text-xs font-bold uppercase tracking-widest mb-2">
                                    <X size={12} className="text-red-500" />
                                    <span>The Outcome</span>
                                </div>
                                <p className="text-neutral-400 font-light border-l-2 border-neutral-800 pl-3">{content.nhs.result}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Private Card - The Solution */}
                <div
                    className={`relative bg-neutral-900 border ${activeSide === 'private' ? 'border-amber-500' : 'border-amber-500/30'} rounded-3xl p-8 transition-all duration-500 overflow-hidden group shadow-2xl shadow-amber-900/10`}
                    onMouseEnter={() => setActiveSide('private')}
                    onMouseLeave={() => setActiveSide(null)}
                >
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap size={120} className="text-amber-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50"></div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="h-10 w-10 rounded-full gold-gradient flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <Zap size={18} className="text-black" />
                            </div>
                            <h3 className="text-xl text-white font-serif italic">Harley Street Medics</h3>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
                                    <Zap size={12} />
                                    <span>Specialized Method</span>
                                </div>
                                <p className="text-white font-medium">{content.private.method}</p>
                                <p className="text-amber-500/80 text-xs mt-1 font-medium">{content.private.benefit}</p>
                            </div>

                            <div>
                                <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
                                    <Clock size={12} />
                                    <span>Timeline</span>
                                </div>
                                <p className="text-neutral-200 font-light">{content.private.time}</p>
                            </div>

                            <div className="bg-amber-950/20 rounded-xl p-4 border border-amber-500/20">
                                <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
                                    <Shield size={12} />
                                    <span>The Outcome</span>
                                </div>
                                <p className="text-white font-light text-sm">{content.private.result}</p>
                            </div>
                        </div>

                        <button onClick={onBook} className="w-full mt-8 py-4 rounded-xl gold-gradient hover:bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-[1.02]">
                            Choose Gold Standard <ArrowRight size={14} className="ml-2" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NhsVsPrivate;
