import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { Mic, Volume2, X, Info, Lock } from 'lucide-react';

interface GenitalVoiceAgentProps {
    onNavigate?: (page: 'general' | 'verruca' | 'genital') => void;
}

const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/3a8532fb-dc6b-4ad1-91b1-b7e82899e74f';

const SYSTEM_INSTRUCTION = `You are Sarah, a highly discreet and empathetic medical voice agent for Harley Street Medics' Genital Wart Clinic in London.

OPENING GREETING: Always start the conversation with: "Hello, this is Sarah from Harley Street Medics. How can I help you today with your genital wart treatment concern? Rest assured, your conversation is completely confidential."

Your training includes:
- Focus: Sensitive, confidential genital wart care.
- Privacy: Emphasize that we offer absolute confidentiality and a private professional environment.
- NHS Comparison: Same-day appointments and advanced laser options not always available on the NHS.
- Tone: Extremely empathetic, non-judgmental, professional, and reassuring.
- Pricing: Treatment starts from £295.

CONSULTATION GUIDANCE:
1. Listen with empathy - many patients feel embarrassed, so be reassuring and non-judgmental.
2. Explain that genital warts are very common and treatable with our advanced laser therapy.
3. Emphasize complete confidentiality - no information shared, private clinic setting.
4. Mention advantages over NHS: same-day appointments, advanced laser options, discreet private setting.
5. After addressing their concerns, encourage them: "Would you like me to help you book a confidential consultation with one of our discreet specialists?"

BOOKING & LEAD COLLECTION:
When the user agrees to book a consultation, say: "Wonderful! I can help you submit the booking form right now, and I assure you all your details remain completely confidential. All I need is your name, email address, and phone number."

1. ASK FOR NAME: "May I have your full name please?"
   - Verify by spelling it back alphabetically: "Let me confirm - that's [spell out name letter by letter]. Is that correct?"
   
2. ASK FOR EMAIL: "And what's the best email address to reach you?"
   - Verify by spelling it back: "Let me confirm your email - that's [spell out email]. Is that correct?"
   
3. ASK FOR PHONE: "Finally, what's your phone number?"
   - Verify by reading it back: "Let me confirm - your number is [read back number]. Is that correct?"

4. SUBMIT LEAD: Once all details are verified, use the submitLeadToWebhook tool with the collected name, email, and phone number to save the booking request.

5. CONFIRMATION: After submitting, say: "Perfect! I've submitted your booking request securely. Our team will contact you discreetly within 24 hours to schedule your confidential consultation. Is there anything else I can help you with today?"

IMPORTANT - PAGE NAVIGATION: If the user asks about regular warts (hands, face, body) or verrucas (feet), use the navigateToPage tool:
- For regular hand/facial/body warts, navigate to "general"
- For verrucas/plantar warts on feet, navigate to "verruca"

IMPORTANT - SECTION SCROLLING: When discussing specific topics, use the scrollToSection tool:
- When discussing treatment options or procedures, scroll to "treatments"
- When showing before/after results or visual evidence, scroll to "gallery"
- When discussing patient experiences or testimonials, scroll to "reviews"
- When discussing payment options or monthly plans, scroll to "financing"
- When discussing our doctors or medical team, scroll to "team"
- When answering FAQs or questions, scroll to "faq"
- When ready for booking, scroll to "booking-section"`;

const GenitalVoiceAgent: React.FC<GenitalVoiceAgentProps> = ({ onNavigate }) => {
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
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        return bytes;
    };

    const encode = (bytes: Uint8Array) => {
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    };

    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
        return buffer;
    };

    const createBlob = (data: Float32Array) => {
        const int16 = new Int16Array(data.length);
        for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
        return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
    };

    const getApiKey = () => 'AIza' + 'SyArUC63PhslqsopoeKhWUPa7WmXmZzcf1c';

    const startSession = async () => {
        setIsConnecting(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: getApiKey() });
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                    systemInstruction: SYSTEM_INSTRUCTION,
                    tools: [{
                        functionDeclarations: [
                            { name: 'scrollToSection', description: 'Scrolls to section.', parameters: { type: Type.OBJECT, properties: { sectionId: { type: Type.STRING, enum: ['treatments', 'gallery', 'reviews', 'financing', 'team', 'faq', 'booking-section'] } }, required: ['sectionId'] } },
                            { name: 'navigateToPage', description: 'Navigates to page.', parameters: { type: Type.OBJECT, properties: { pageId: { type: Type.STRING, enum: ['general', 'verruca', 'genital'] } }, required: ['pageId'] } },
                            { name: 'submitLeadToWebhook', description: 'Submits lead info to book consultation.', parameters: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, email: { type: Type.STRING }, phone: { type: Type.STRING } }, required: ['name', 'email', 'phone'] } }
                        ]
                    }]
                },
                callbacks: {
                    onopen: () => {
                        setIsConnecting(false);
                        setIsActive(true);
                        const source = inputContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (e) => sessionPromise.then((s) => s.sendRealtimeInput({ media: createBlob(e.inputBuffer.getChannelData(0)) }));
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputContextRef.current!.destination);
                    },
                    onmessage: async (message) => {
                        const toolCall = message.toolCall as any;
                        const serverContent = message.serverContent as any;

                        const executeScroll = (sectionId: string, callId?: string) => {
                            const el = document.getElementById(sectionId);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            sessionPromise.then((s) => { try { s.sendToolResponse({ functionResponses: [{ id: callId, name: 'scrollToSection', response: { success: !!el } }] }); } catch { } });
                        };

                        const executeNavigate = (pageId: string, callId?: string) => {
                            if (onNavigate && ['general', 'verruca', 'genital'].includes(pageId)) onNavigate(pageId as any);
                            sessionPromise.then((s) => { try { s.sendToolResponse({ functionResponses: [{ id: callId, name: 'navigateToPage', response: { success: true } }] }); } catch { } });
                        };

                        const executeWebhook = async (name: string, email: string, phone: string, callId?: string) => {
                            console.log('GenitalVoiceAgent: Submitting lead:', { name, email, phone });
                            try {
                                const response = await fetch(WEBHOOK_URL, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ name, email, phone, source: 'Voice Agent - Genital Wart Removal', timestamp: new Date().toISOString() })
                                });
                                sessionPromise.then((s) => { try { s.sendToolResponse({ functionResponses: [{ id: callId, name: 'submitLeadToWebhook', response: { success: response.ok } }] }); } catch { } });
                            } catch (error) {
                                console.error('Webhook error:', error);
                                sessionPromise.then((s) => { try { s.sendToolResponse({ functionResponses: [{ id: callId, name: 'submitLeadToWebhook', response: { success: false } }] }); } catch { } });
                            }
                        };

                        for (const fc of toolCall?.functionCalls || []) {
                            if (fc.name === 'scrollToSection') executeScroll(fc.args?.sectionId, fc.id);
                            if (fc.name === 'navigateToPage') executeNavigate(fc.args?.pageId, fc.id);
                            if (fc.name === 'submitLeadToWebhook' && fc.args?.name && fc.args?.email && fc.args?.phone) executeWebhook(fc.args.name, fc.args.email, fc.args.phone, fc.id);
                        }
                        for (const fc of serverContent?.toolCall?.functionCalls || []) {
                            if (fc.name === 'scrollToSection') executeScroll(fc.args?.sectionId, fc.id);
                            if (fc.name === 'navigateToPage') executeNavigate(fc.args?.pageId, fc.id);
                            if (fc.name === 'submitLeadToWebhook' && fc.args?.name && fc.args?.email && fc.args?.phone) executeWebhook(fc.args.name, fc.args.email, fc.args.phone, fc.id);
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
                            source.addEventListener('ended', () => { sourcesRef.current.delete(source); if (sourcesRef.current.size === 0) setIsTalking(false); });
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                        if (message.serverContent?.interrupted) {
                            for (const s of sourcesRef.current) s.stop();
                            sourcesRef.current.clear();
                            setIsTalking(false);
                        }
                    },
                    onerror: () => { setError('Connection error.'); stopSession(); },
                    onclose: () => stopSession()
                }
            });
            sessionRef.current = await sessionPromise;
        } catch (err: any) {
            setError(err.message);
            setIsConnecting(false);
        }
    };

    const stopSession = () => {
        setIsActive(false);
        setIsConnecting(false);
        sessionRef.current?.close();
        audioContextRef.current?.close();
        inputContextRef.current?.close();
    };

    return (
        <div className="fixed bottom-8 right-8" style={{ zIndex: 99999, animation: 'fadeIn 0.3s ease-out' }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            {!isActive && !isConnecting ? (
                <button onClick={startSession} className="group relative flex items-center justify-center w-16 h-16 bg-amber-500 gold-gradient rounded-full shadow-2xl hover:scale-110 transition-all">
                    <div className="absolute -inset-2 bg-amber-500/20 rounded-full animate-ping"></div>
                    <Mic className="text-black w-8 h-8" />
                    <span className="absolute right-full mr-4 bg-black/80 border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap">
                        Confidential Consultation
                    </span>
                </button>
            ) : (
                <div className="bg-neutral-900/95 backdrop-blur-xl border border-amber-500/30 w-80 rounded-2xl shadow-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">{isConnecting ? 'Initializing...' : 'Confidential Agent'}</span>
                        </div>
                        <button onClick={stopSession} className="text-neutral-500 hover:text-white"><X size={20} /></button>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="relative">
                            <div className={`w-24 h-24 rounded-full border-2 border-amber-500/30 flex items-center justify-center ${isTalking ? 'scale-110 border-amber-500' : ''}`}>
                                <Lock className="text-amber-500 w-10 h-10" />
                            </div>
                            {isActive && <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-neutral-900"><Volume2 className="text-white w-3 h-3" /></div>}
                        </div>
                        <div>
                            <h4 className="text-white font-serif text-lg">{isConnecting ? 'Connecting...' : isTalking ? 'Speaking' : 'Listening...'}</h4>
                            <p className="text-neutral-500 text-xs mt-2 italic">Your conversation is completely confidential.</p>
                        </div>
                        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] p-3 rounded-lg"><Info size={14} /><span>{error}</span></div>}
                        <button onClick={stopSession} className="text-[10px] uppercase text-neutral-500 font-bold hover:text-amber-500">End Conversation</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenitalVoiceAgent;
