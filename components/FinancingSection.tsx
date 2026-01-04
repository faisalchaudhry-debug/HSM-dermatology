import React from 'react';
import { CreditCard, Calendar, Clock, CheckCircle } from 'lucide-react';

const FinancingSection = () => {
    return (
        <section className="py-24 bg-neutral-900 border-y border-neutral-800">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif text-white italic mb-6">Invest in Yourself</h2>
                    <p className="text-neutral-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
                        Achieving your aesthetic goals shouldn't be a financial burden. We offer a range of seamless payment options tailored to your lifestyle.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Klarna */}
                    <div className="bg-black border border-neutral-800 rounded-2xl p-8 relative group hover:border-pink-500/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-pink-500 bg-pink-500/10 px-2 py-1 rounded">0% Interest</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-2 italic">Klarna.</h3>
                        <p className="text-pink-500 font-bold text-xs uppercase tracking-widest mb-6">Pay in 3</p>
                        <p className="text-neutral-400 text-sm font-light leading-relaxed mb-8 min-h-[60px]">
                            Spread the cost of your treatment over 3 interest-free instalments. No fees, no interest.
                        </p>
                        <div className="flex items-center text-neutral-500 text-xs font-medium border-t border-neutral-800 pt-4">
                            <CheckCircle size={14} className="text-green-500 mr-2" />
                            Available at Checkout
                        </div>
                    </div>

                    {/* Clearpay */}
                    <div className="bg-black border border-neutral-800 rounded-2xl p-8 relative group hover:border-blue-400/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Always Interest Free</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-2 italic">Clearpay</h3>
                        <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-6">Pay in 4</p>
                        <p className="text-neutral-400 text-sm font-light leading-relaxed mb-8 min-h-[60px]">
                            Shop now and pay over 6 weeks. 4 equal payments, due every 2 weeks.
                        </p>
                        <div className="flex items-center text-neutral-500 text-xs font-medium border-t border-neutral-800 pt-4">
                            <CheckCircle size={14} className="text-green-500 mr-2" />
                            Available at Checkout
                        </div>
                    </div>

                    {/* Ideal 4 Finance */}
                    <div className="bg-black border border-neutral-800 rounded-2xl p-8 relative group hover:border-amber-500/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Apply in Minutes</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-2 italic">Ideal 4 Finance</h3>
                        <p className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-6">Medical Loans</p>
                        <p className="text-neutral-400 text-sm font-light leading-relaxed mb-8 min-h-[60px]">
                            Flexible loans for treatments over £500. Competitive rates and fast decisions.
                        </p>
                        <button className="w-full py-3 rounded bg-amber-500 hover:bg-white text-black text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinancingSection;
