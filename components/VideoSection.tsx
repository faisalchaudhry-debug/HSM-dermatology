
import React from 'react';
import { Play } from 'lucide-react';

interface VideoSectionProps {
    pageType?: 'general' | 'verruca' | 'genital' | 'analskintag' | 'lipoma';
}

// YouTube video URLs for each page type
const VIDEO_URLS: Record<string, string> = {
    'general': 'https://www.youtube.com/embed/ZXB52Sk8eDQ',
    'verruca': 'https://www.youtube.com/embed/ZXB52Sk8eDQ',
    'genital': 'https://www.youtube.com/embed/ZXB52Sk8eDQ',
    'analskintag': 'https://www.youtube.com/embed/zJoGopbaTs8',
    'lipoma': 'https://www.youtube.com/embed/rhafhEm7iiM',
};

const VideoSection: React.FC<VideoSectionProps> = ({ pageType = 'general' }) => {
    const videoUrl = VIDEO_URLS[pageType] || VIDEO_URLS['general'];

    return (
        <div className="py-24 bg-neutral-950 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black opacity-50"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <span className="h-[1px] w-8 bg-amber-500"></span>
                            <span className="text-amber-500 font-bold uppercase text-xs tracking-[0.2em]">Watch The Procedure</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-white italic mb-6 leading-tight">
                            Precision in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Action</span>
                        </h2>
                        <p className="text-neutral-400 leading-relaxed mb-8 font-light text-lg">
                            See our Medical Director, <strong className="text-white font-medium">Dr. Ahmad</strong>, demonstrate our specialized laser removal technique. Unlike traditional methods, our proprietary laser protocol targets the root supply immediately, ensuring complete removal with minimal downtime.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center mt-1 mr-4">
                                    <span className="text-amber-500 font-bold text-xs">1</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-serif italic text-lg">Targeted Vaporization</h4>
                                    <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Precise tissue destruction</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center mt-1 mr-4">
                                    <span className="text-amber-500 font-bold text-xs">2</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-serif italic text-lg">No Bleeding or Stitches</h4>
                                    <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Instant cauterization</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Embed */}
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-amber-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="aspect-video bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden relative shadow-2xl">
                            {/* YouTube Embed */}
                            <iframe
                                src={videoUrl}
                                title="Treatment Procedure Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <p className="text-center text-[10px] text-neutral-600 uppercase tracking-widest mt-4">For privacy, some scenes may be simulated</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoSection;

