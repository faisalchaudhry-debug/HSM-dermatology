import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { Mic, Volume2, X, Info, ShieldCheck } from 'lucide-react';

interface GeneralWartVoiceAgentProps {
    onNavigate?: (page: 'general' | 'verruca' | 'genital') => void;
}

const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/31f48350-76cc-4bd6-8703-c5e964609b5c';

const SYSTEM_INSTRUCTION = `You are Sarah, a professional medical voice agent for Harley Street Medics London, specializing in general wart removal.

OPENING GREETING: Always start the conversation with: "Hello, this is Sarah from Harley Street Medics. How can I help you today with your wart treatment concern?"

Your training includes:
- Focus: Facial, hand, and body warts.
- Value Prop: 20+ years of experience, over 10,000 successful treatments.
- Technology: Advanced Signature Laser Removal (precision, minimal scarring).
- Tone: Reassuring, elite, professional, and efficient.
- Pricing: Starts from £149.

CONSULTATION GUIDANCE:
1. Listen to the user's concerns about their warts (location, duration, previous treatments).
2. Provide helpful information about our Signature Laser Treatment - painless, precise, minimal scarring.
3. Explain that we offer FREE consultations with our expert dermatologists.
4. After addressing their concerns, encourage them to book: "Would you like me to help you book a free consultation with one of our dermatologists?"

BOOKING & LEAD COLLECTION:
When the user agrees to book a consultation, say: "Wonderful! I can help you submit the booking form right now. All I need is your name, email address, and phone number."

1. ASK FOR NAME: "May I have your full name please?"
   - Verify by spelling it back alphabetically: "Let me confirm - that's [spell out name letter by letter]. Is that correct?"
   
2. ASK FOR EMAIL: "And what's the best email address to reach you?"
   - Verify by spelling it back: "Let me confirm your email - that's [spell out email]. Is that correct?"
   
3. ASK FOR PHONE: "Finally, what's your phone number?"
   - Verify by reading it back: "Let me confirm - your number is [read back number]. Is that correct?"

4. SUBMIT LEAD: Once all details are verified, use the submitLeadToWebhook tool with the collected name, email, and phone number to save the booking request.

5. CONFIRMATION: After submitting, say: "Perfect! I've submitted your booking request. Our team will contact you within 24 hours to schedule your free consultation. Is there anything else I can help you with today?"

IMPORTANT - PAGE NAVIGATION: If the user asks about verrucas (plantar warts on feet) or genital warts, use the navigateToPage tool:
- For verrucas/plantar warts on feet, navigate to "verruca"
- For genital warts or intimate area concerns, navigate to "genital"

IMPORTANT - SECTION SCROLLING: When discussing specific topics, use the scrollToSection tool:
- When discussing treatment options or procedures, scroll to "treatments"
- When showing before/after results or visual evidence, scroll to "gallery"
- When discussing patient experiences or testimonials, scroll to "reviews"
- When discussing payment options or monthly plans, scroll to "financing"
- When discussing our doctors or medical team, scroll to "team"
- When answering FAQs or questions, scroll to "faq"
- When ready for booking, scroll to "booking-section"`;

const GeneralWartVoiceAgent: React.FC<GeneralWartVoiceAgentProps> = ({ onNavigate }) => {
    const [isActive, setIsActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const inputContextRef = useRef<AudioContext | null>(null);
    const sessionRef = useRef<any>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);

    const decode = (base64: string) => {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    const encode = (bytes: Uint8Array) => {
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
        }
        return buffer;
    };

    const createBlob = (data: Float32Array): { data: string; mimeType: string } => {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        return {
            data: encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000',
        };
    };

    const getApiKey = () => {
        return 'AIza' + 'SyArUC63PhslqsopoeKhWUPa7WmXmZzcf1c';
    };

    const startSession = async () => {
        setIsConnecting(true);
        setError(null);
        try {
            const apiKey = getApiKey();
            if (!apiKey) {
                throw new Error("API Key not found.");
            }

            const ai = new GoogleGenAI({ apiKey });

            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                    },
                    systemInstruction: SYSTEM_INSTRUCTION,
                    tools: [
                        {
                            functionDeclarations: [
                                {
                                    name: 'scrollToSection',
                                    description: 'Scrolls the page to a specific section to guide the user\'s attention.',
                                    parameters: {
                                        type: Type.OBJECT,
                                        properties: {
                                            sectionId: {
                                                type: Type.STRING,
                                                description: 'The ID of the section to scroll to',
                                                enum: ['treatments', 'gallery', 'reviews', 'financing', 'team', 'faq', 'booking-section']
                                            }
                                        },
                                        required: ['sectionId']
                                    }
                                },
                                {
                                    name: 'navigateToPage',
                                    description: 'Navigates to a different treatment page.',
                                    parameters: {
                                        type: Type.OBJECT,
                                        properties: {
                                            pageId: {
                                                type: Type.STRING,
                                                description: 'The page to navigate to',
                                                enum: ['general', 'verruca', 'genital']
                                            }
                                        },
                                        required: ['pageId']
                                    }
                                },
                                {
                                    name: 'submitLeadToWebhook',
                                    description: 'Submits the collected lead information (name, email, phone) to book a consultation. Use this after verifying all contact details with the user.',
                                    parameters: {
                                        type: Type.OBJECT,
                                        properties: {
                                            name: {
                                                type: Type.STRING,
                                                description: 'The full name of the patient'
                                            },
                                            email: {
                                                type: Type.STRING,
                                                description: 'The email address of the patient'
                                            },
                                            phone: {
                                                type: Type.STRING,
                                                description: 'The phone number of the patient'
                                            }
                                        },
                                        required: ['name', 'email', 'phone']
                                    }
                                }
                            ]
                        }
                    ]
                },
                callbacks: {
                    onopen: () => {
                        setIsConnecting(false);
                        setIsActive(true);

                        const source = inputContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputContextRef.current!.destination);
                    },
                    onmessage: async (message) => {
                        const serverContent = message.serverContent as any;
                        const toolCall = message.toolCall as any;

                        const executeScroll = (sectionId: string, callId?: string) => {
                            console.log('GeneralWartVoiceAgent: Scrolling to section:', sectionId);
                            const element = document.getElementById(sectionId);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                            sessionPromise.then((session) => {
                                try {
                                    session.sendToolResponse({
                                        functionResponses: [{ id: callId || 'scroll-response', name: 'scrollToSection', response: { success: !!element, sectionId } }]
                                    });
                                } catch (e) { }
                            });
                        };

                        const executeNavigate = (pageId: string, callId?: string) => {
                            console.log('GeneralWartVoiceAgent: Navigating to page:', pageId);
                            if (onNavigate && ['general', 'verruca', 'genital'].includes(pageId)) {
                                onNavigate(pageId as 'general' | 'verruca' | 'genital');
                            }
                            sessionPromise.then((session) => {
                                try {
                                    session.sendToolResponse({
                                        functionResponses: [{ id: callId || 'navigate-response', name: 'navigateToPage', response: { success: true, pageId } }]
                                    });
                                } catch (e) { }
                            });
                        };

                        const executeWebhook = async (name: string, email: string, phone: string, callId?: string) => {
                            console.log('GeneralWartVoiceAgent: Submitting lead to webhook:', { name, email, phone });
                            try {
                                const response = await fetch(WEBHOOK_URL, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        name,
                                        email,
                                        phone,
                                        source: 'Voice Agent - Wart Removal',
                                        timestamp: new Date().toISOString()
                                    })
                                });
                                const success = response.ok;
                                console.log('Webhook response:', success);
                                sessionPromise.then((session) => {
                                    try {
                                        session.sendToolResponse({
                                            functionResponses: [{ id: callId || 'webhook-response', name: 'submitLeadToWebhook', response: { success, message: success ? 'Lead submitted successfully' : 'Failed to submit lead' } }]
                                        });
                                    } catch (e) { }
                                });
                            } catch (error) {
                                console.error('Webhook error:', error);
                                sessionPromise.then((session) => {
                                    try {
                                        session.sendToolResponse({
                                            functionResponses: [{ id: callId || 'webhook-response', name: 'submitLeadToWebhook', response: { success: false, message: 'Error submitting lead' } }]
                                        });
                                    } catch (e) { }
                                });
                            }
                        };

                        if (toolCall?.functionCalls) {
                            for (const fc of toolCall.functionCalls) {
                                if (fc.name === 'scrollToSection' && fc.args?.sectionId) executeScroll(fc.args.sectionId, fc.id);
                                if (fc.name === 'navigateToPage' && fc.args?.pageId) executeNavigate(fc.args.pageId, fc.id);
                                if (fc.name === 'submitLeadToWebhook' && fc.args?.name && fc.args?.email && fc.args?.phone) executeWebhook(fc.args.name, fc.args.email, fc.args.phone, fc.id);
                            }
                        }

                        if (serverContent?.toolCall?.functionCalls) {
                            for (const fc of serverContent.toolCall.functionCalls) {
                                if (fc.name === 'scrollToSection' && fc.args?.sectionId) executeScroll(fc.args.sectionId, fc.id);
                                if (fc.name === 'navigateToPage' && fc.args?.pageId) executeNavigate(fc.args.pageId, fc.id);
                                if (fc.name === 'submitLeadToWebhook' && fc.args?.name && fc.args?.email && fc.args?.phone) executeWebhook(fc.args.name, fc.args.email, fc.args.phone, fc.id);
                            }
                        }

                        if (serverContent?.modelTurn?.parts) {
                            for (const part of serverContent.modelTurn.parts) {
                                if (part.functionCall) {
                                    const { name, args, id } = part.functionCall;
                                    if (name === 'scrollToSection' && args?.sectionId) executeScroll(args.sectionId, id);
                                    if (name === 'navigateToPage' && args?.pageId) executeNavigate(args.pageId, id);
                                }
                            }
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            setIsTalking(true);
                            const ctx = audioContextRef.current!;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                            const source = ctx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(ctx.destination);
                            source.addEventListener('ended', () => {
                                sourcesRef.current.delete(source);
                                if (sourcesRef.current.size === 0) setIsTalking(false);
                            });
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                        if (message.serverContent?.interrupted) {
                            for (const s of sourcesRef.current) s.stop();
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                            setIsTalking(false);
                        }
                    },
                    onerror: (e) => {
                        console.error('GeneralWartVoiceAgent Error:', e);
                        setError('Connection error. Please check your microphone permissions.');
                        stopSession();
                    },
                    onclose: () => stopSession()
                }
            });

            sessionRef.current = await sessionPromise;
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Could not access microphone or connect to AI service.');
            setIsConnecting(false);
        }
    };

    const stopSession = () => {
        setIsActive(false);
        setIsConnecting(false);
        if (sessionRef.current) sessionRef.current.close();
        if (audioContextRef.current) audioContextRef.current.close();
        if (inputContextRef.current) inputContextRef.current.close();
        sessionRef.current = null;
        audioContextRef.current = null;
        inputContextRef.current = null;
    };

    return (
        <div
            className="fixed bottom-8 right-8 animate-fade-in"
            style={{
                zIndex: 99999,
                animation: 'fadeIn 0.3s ease-out'
            }}
        >
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            {!isActive && !isConnecting ? (
                <button
                    onClick={startSession}
                    className="group relative flex items-center justify-center w-16 h-16 bg-amber-500 gold-gradient rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
                >
                    <div className="absolute -inset-2 bg-amber-500/20 rounded-full animate-ping group-hover:bg-amber-500/40"></div>
                    <Mic className="text-black w-8 h-8" />
                    <span className="absolute right-full mr-4 bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Speak to Wart Expert AI
                    </span>
                </button>
            ) : (
                <div className="bg-neutral-900/95 backdrop-blur-xl border border-amber-500/30 w-80 rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                                {isConnecting ? 'Initializing...' : 'Wart Removal Agent'}
                            </span>
                        </div>
                        <button onClick={stopSession} className="text-neutral-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="relative">
                            <div className={`w-24 h-24 rounded-full border-2 border-amber-500/30 flex items-center justify-center transition-all duration-500 ${isTalking ? 'scale-110 border-amber-500 shadow-[0_0_30px_rgba(212,175,55,0.3)]' : ''}`}>
                                <ShieldCheck className="text-amber-500 w-10 h-10" />
                                {isTalking && <div className="absolute -inset-4 border border-amber-500/20 rounded-full animate-ping"></div>}
                            </div>
                            {isActive && (
                                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-neutral-900">
                                    <Volume2 className="text-white w-3 h-3" />
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 className="text-white font-serif text-lg">
                                {isConnecting ? 'Connecting...' : isTalking ? 'Assistant Speaking' : 'Listening...'}
                            </h4>
                            <p className="text-neutral-500 text-xs mt-2 italic px-4">
                                Ask about wart removal treatments, pricing, or book a consultation.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] p-3 rounded-lg flex items-center space-x-2">
                                <Info size={14} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex items-center space-x-2 w-full pt-4">
                            <div className="flex-grow h-1 bg-neutral-800 rounded-full overflow-hidden">
                                <div className={`h-full gold-gradient transition-all duration-300 ${isTalking || isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
                            </div>
                        </div>

                        <button onClick={stopSession} className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold hover:text-amber-500 transition-colors">
                            End Conversation
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneralWartVoiceAgent;
