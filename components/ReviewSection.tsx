import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Testimonial } from '../types';
import { TESTIMONIALS, SKINTAG_REVIEWS } from '../constants';

interface ReviewSectionProps {
    pageType?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ pageType }) => {
    // Select reviews based on page type
    const reviews = pageType === 'skintag' ? SKINTAG_REVIEWS : [...TESTIMONIALS];

    return (
        <div className="py-20 bg-neutral-900 border-t border-neutral-800">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center mb-12">
                    <div className="flex items-center space-x-2 mb-4 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                        <span className="text-white font-bold flex items-center gap-1"><span className="text-blue-500 font-serif text-lg">G</span> Google Reviews</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-amber-500 text-amber-500" />)}
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif text-white text-center italic mb-4">Patient Experiences</h2>
                    <p className="text-neutral-400 text-sm tracking-widest uppercase font-bold">4.9/5 Average Rating • Verified Patients</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-black border border-neutral-800 p-8 rounded-2xl relative group hover:border-amber-500/30 transition-all">
                            <div className="absolute top-8 right-8 text-neutral-700 group-hover:text-amber-500/20 transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            </div>

                            <div className="flex items-center space-x-1 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={14} className="fill-amber-500 text-amber-500" />
                                ))}
                            </div>

                            <p className="text-neutral-300 text-sm leading-relaxed mb-6 italic line-clamp-4">"{review.content}"</p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-xs uppercase tracking-wider">{review.name}</span>
                                    <div className="flex items-center mt-1">
                                        <CheckCircle size={10} className="text-blue-500 mr-1" />
                                        <span className="text-[10px] text-neutral-500">Verified Patient</span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-neutral-600 self-end">{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
