
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import SectionHeader from './SectionHeader';

interface SliderProps {
    before: string;
    after: string;
    label: string;
}

const CompareSlider: React.FC<SliderProps> = ({ before, after, label }) => {
    const [position, setPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDrag = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

        // Calculate position as percentage
        const newPos = ((x - rect.left) / rect.width) * 100;
        setPosition(Math.min(Math.max(newPos, 0), 100));
    };

    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (isDragging) handleDrag(e);
        };
        const handleUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchend', handleUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDragging]);


    return (
        <div className="relative group rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 select-none">
            {/* Labels */}
            <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Before</span>
            </div>
            <div className="absolute top-4 right-4 z-20 bg-amber-500/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg">
                <span className="text-[10px] text-black font-bold uppercase tracking-widest">After</span>
            </div>

            <div
                ref={containerRef}
                className="relative h-[400px] w-full cursor-col-resize"
                onMouseDown={(e) => { setIsDragging(true); handleDrag(e); }}
                onTouchStart={(e) => { setIsDragging(true); handleDrag(e); }}
            >
                {/* After Image (Background) */}
                <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

                {/* Before Image (Clipped) */}
                <div
                    className="absolute inset-0 overflow-hidden pointer-events-none border-r border-white/20"
                    style={{ width: `${position}%` }}
                >
                    <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: '100% !important' }} />
                    {/* Note: In standard CSS logic for this slider, inner img needs to be the width of the container, not the clipped div. 
                 Using styled max-w-none and explicit width usually works. Let's ensure standard 'h-full w-full' refers to container size. 
                 Or better: explicit width relative to parent. 
             */}
                    {/* Fix: use container width for standard comparison */}
                    <div className="absolute inset-0 h-full w-[1000%] max-w-[unset]" style={{ width: `${100 * (100 / position)}%` }}>
                        {/* This approach is complex for inline styles. Better approach: */}
                    </div>
                </div>

                {/* Re-doing the image logic for stability */}
                <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
                >
                    <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
                </div>

                {/* Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center"
                    style={{ left: `${position}%` }}
                >
                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-lg transform -translate-x-[0.5px]">
                        <ArrowLeftRight size={14} className="text-black" />
                    </div>
                </div>
            </div>

            <div className="p-6 bg-neutral-900 border-t border-neutral-800">
                <h4 className="text-white font-serif italic text-xl mb-1">{label}</h4>
                <div className="flex items-center space-x-2">
                    <div className="h-1 w-12 bg-amber-500 rounded-full"></div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">1 Session • Healed in 7 Days</p>
                </div>
            </div>
        </div>
    );
};

interface BeforeAfterSectionProps {
    pageType: string;
}

const BeforeAfterSection: React.FC<BeforeAfterSectionProps> = ({ pageType }) => {
    return (
        <div className="py-24 bg-black">
            <div className="container mx-auto px-6">
                <SectionHeader title="Real Clinical Results" subtitle="Board Certified Precision" />

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Dynamic Logic for Images */}
                    {(() => {
                        let b1, a1, l1, b2, a2, l2;

                        if (pageType === 'cyst' || pageType === 'lipoma') {
                            b1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/cyst%20before%20sclap.webp";
                            a1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/cyst%20after%20sclap.webp";
                            l1 = "Scalp Reconstruction";

                            b2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/cyst%20before.webp";
                            a2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/cyst%20face%20after.webp";
                            l2 = "Facial Excision";
                        } else if (pageType === 'verruca') {
                            b1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/verruca%20before%20(1).webp";
                            a1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/verruca%20after%20(2).webp";
                            l1 = "Targeted Laser Removal";

                            b2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/moasic%20wart%20before.webp";
                            a2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/moasic%20after.webp";
                            l2 = "Mosaic Verruca Clearance";
                        } else if (pageType === 'mole') {
                            b1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/mole%20removal%20case%2001%20before.webp";
                            a1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/mole%20removal%20case%20after%2001.webp";
                            l1 = "Cosmetic Laser Removal";

                            b2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/mole%20removal%20case%2002%20before.webp";
                            a2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/mole%20removal%20case02%20after.webp";
                            l2 = "Surgical Excision Result";
                        } else if (pageType === 'general') {
                            b1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/warts%201%20before.webp";
                            a1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/warts%201%20after.webp";
                            l1 = "Deep Stalk Removal";

                            b2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/warts%202%20before.webp";
                            a2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/warts%202%20after.webp";
                            l2 = "Laser Vaporization";
                        } else if (pageType === 'genital') {
                            b1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/genital%20warts%201%20before.webp";
                            a1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/genital%20warts%201%20after.webp";
                            l1 = "Complex Viral Clearance";

                            b2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/genital%20warts%202%20before.webp";
                            a2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/genital%20warts%202%20after.webp";
                            l2 = "Laser Vaporization";
                        } else if (pageType === 'skintag' || pageType === 'analskintag') {
                            b1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/skin%20taf%20before.webp";
                            a1 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/skin%20tag%20after.webp";
                            l1 = "Deep Stalk Removal";

                            b2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/skin%20tag%201%20before.webp";
                            a2 = "https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/skin%20tag%201%20after.webp";
                            l2 = "Laser Vaporization";
                        } else {
                            // Default / Placeholder for other pages
                            b1 = `https://picsum.photos/seed/${pageType}-before1/600/600?grayscale`;
                            a1 = `https://picsum.photos/seed/${pageType}-after1/600/600`;
                            l1 = pageType === 'genital' ? "Complex Viral Clearance" : pageType === 'mole' ? "Cosmetic Laser Removal" : "Deep Stalk Removal";

                            b2 = `https://picsum.photos/seed/${pageType}-before2/600/600?grayscale`;
                            a2 = `https://picsum.photos/seed/${pageType}-after2/600/600`;
                            l2 = pageType === 'verruca' ? "Mosaic Verruca Treatment" : pageType === 'mole' ? "Surgical Excision Result" : "Laser Vaporization";
                        }

                        return (
                            <>
                                <CompareSlider before={b1} after={a1} label={l1} />
                                <CompareSlider before={b2} after={a2} label={l2} />
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

export default BeforeAfterSection;
