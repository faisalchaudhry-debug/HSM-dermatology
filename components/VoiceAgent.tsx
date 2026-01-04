
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { Mic, MicOff, Volume2, X, Info, ShieldCheck, Lock, Footprints, Tag, UserCheck, Sparkles, Zap } from 'lucide-react';
import { locations } from '../src/data/locations';

// NOTE: Ensure your location IDs here match the keys in 'locations' object from data/locations.ts
type LocationId = 'london' | 'glasgow';

interface VoiceAgentProps {
  mode: 'general' | 'verruca' | 'genital' | 'skintag' | 'analskintag' | 'cyst' | 'lipoma' | 'mole' | 'ganglion';
  location: string; // Display name "London"/"Glasgow"
  // We might want to pass locationId specifically for data lookup, but we can infer it or update prop
  // For safety, let's look it up by name or update props. 
  // Ideally, ClinicPage should pass locationId.
  locationId?: LocationId;
  onNavigate?: (page: 'general' | 'verruca' | 'genital' | 'skintag' | 'analskintag' | 'mole' | 'cyst' | 'lipoma' | 'ganglion') => void;
  onOpenCalendar?: () => void;
}


const GET_SYSTEM_INSTRUCTIONS = (location: string) => ({
  general: `Start the conversation with exactly: "Welcome to Harley Street Medics, this is Sarah how can i help you with your warts treatment concern."
  You are a professional medical voice agent for Harley Street Medics ${location}, specializing in general wart removal. 
  Your training includes:
  - Focus: Facial, hand, and body warts.
  - Value Prop: 20+ years of experience, over 10,000 successful treatments.
  - Technology: Advanced Signature Laser Removal (precision, minimal scarring).
  - Call to Action: Encourage the patient to book a free online assessment. 
  - Tone: Reassuring, elite, professional, and efficient.
  - Pricing: Starts from £149.
  
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
  - When ready for booking, scroll to "booking-section"
  
  IMPORTANT - BOOKING FLOW:
  1. Ask for their Name, Email, and Phone.
  2. Use the submitLeadToWebhook tool to submit the details.
  3. IMMEDIATELY after submitting, use the openCalendarPopup tool.
  4. Say: "Our team will get in touch with you in 24 hours, although you can book the meeting right away by booking the time on this calendar."`,

  genital: `Start the conversation with exactly: "Welcome to Harley Street Medics, this is Sarah how can i help you with your genital warts concern."
  You are a highly discreet and empathetic medical voice agent for Harley Street Medics' Genital Wart Clinic in ${location}.
  Your training includes:
  - Focus: Sensitive, confidential genital wart care.
  - Privacy: Emphasize that we offer absolute confidentiality and a private professional environment.
  - NHS Comparison: Mention that we offer same-day appointments and advanced laser options not always available on the NHS.
  - Tone: Extremely empathetic, non-judgmental, professional, and reassuring.
  - Call to Action: Book a confidential video assessment.
  
  IMPORTANT - PAGE NAVIGATION: If the user asks about regular warts (hands, face, body) or verrucas (feet), use the navigateToPage tool:
  - For regular hand/facial/body warts, navigate to "general"
  - For verrucas/plantar warts on feet, navigate to "verruca"
  
  IMPORTANT - BOOKING FLOW:
  1. Ask for their Name, Email, and Phone.
  2. Use the submitLeadToWebhook tool to submit the details.
  3. IMMEDIATELY after submitting, use the openCalendarPopup tool.
  4. Say: "Our team will get in touch with you in 24 hours, although you can book the meeting right away by booking the time on this calendar."`,

  verruca: `Start the conversation with exactly: "Welcome to Harley Street Medics, this is Sarah how can i help you with your verruca concern."
  You are a foot health specialist voice agent for Harley Street Medics ${location}, focusing on Verruca (Plantar Wart) removal.
  Your training includes:
  - Focus: Painful verrucas on the soles of feet.
  - Benefit: Walking comfortably again.
  - Technology: Laser prevention therapy that stops recurrence by addressing the viral cause.
  - Tone: Focused on relief, mobility, and medical expertise.
  - Call to Action: Schedule a free verruca assessment.
  
  IMPORTANT - PAGE NAVIGATION: If the user asks about regular warts (hands, face, body) or genital warts, use the navigateToPage tool:
  - For regular hand/facial/body warts, navigate to "general"
  - For genital warts or intimate area concerns, navigate to "genital"
  
  IMPORTANT - BOOKING FLOW:
  1. Ask for their Name, Email, and Phone.
  2. Use the submitLeadToWebhook tool to submit the details.
  3. IMMEDIATELY after submitting, use the openCalendarPopup tool.
  4. Say: "Our team will get in touch with you in 24 hours, although you can book the meeting right away by booking the time on this calendar."`,

  skintag: `Start the conversation with exactly: "Welcome to Harley Street Medics, this is Sarah how can i help you with your skin tag concern."
  You are a cosmetic dermatology specialist voice agent for Harley Street Medics ${location}, focusing on Skin Tag removal.
  Your training includes:
  - Focus: Face, neck, underarms, eyelids.
  - Value Prop: Signature Laser Treatment - fast, painless, no downtime, scar-free.
  - Pricing: Starts from £199.
  - Tone: Aesthetic-focused, professional, results-oriented, and reassuring.
  - Call to Action: Book a free online skin tag assessment.
  
  IMPORTANT - PAGE NAVIGATION: If the user asks about anal skin tags or moles, use the navigateToPage tool:
  - For anal skin tags (intimate/sensitive area), navigate to "analskintag"
  - For moles or mole checks, navigate to "mole"
  
  IMPORTANT - BOOKING FLOW:
  1. Ask for their Name, Email, and Phone.
  2. Use the submitLeadToWebhook tool to submit the details.
  3. IMMEDIATELY after submitting, use the openCalendarPopup tool.
  4. Say: "Our team will get in touch with you in 24 hours, although you can book the meeting right away by booking the time on this calendar."`,

  analskintag: `Start the conversation with exactly: "Welcome to Harley Street Medics, this is Sarah how can i help you with your anal skin tag concern."
  You are a specialist medical voice agent for Harley Street Medics ${location}, focusing on Anal Skin Tag removal.
  Your training includes:
  - Focus: Discreet and safe removal of tags in the anal region.
  - Value Prop: Signature Laser Treatment - zero discomfort, no downtime, precision perfection for sensitive areas.
  - Privacy: Emphasize complete clinical discretion and privacy.
  - Pricing: Starts from £495.
  - Tone: Highly medical, professional, discreet, and comforting.
  - Call to Action: Book a free confidential teleconsultation.
  
  IMPORTANT - PAGE NAVIGATION: If the user asks about regular skin tags or moles, use the navigateToPage tool:
  - For regular skin tags (face, neck, underarms), navigate to "skintag"
  - For moles or mole checks, navigate to "mole"
  
  IMPORTANT - BOOKING FLOW:
  1. Ask for their Name, Email, and Phone.
  2. Use the submitLeadToWebhook tool to submit the details.
  3. IMMEDIATELY after submitting, use the openCalendarPopup tool.
  4. Say: "Our team will get in touch with you in 24 hours, although you can book the meeting right away by booking the time on this calendar."`,

  cyst: `Start the conversation with exactly: "Welcome to Harley Street Medics, this is Sarah how can i help you with your cyst removal concern."
  You are an expert dermatology voice agent for Harley Street Medics ${location}, specializing in Cyst and Lipoma removal.
  Your training includes:
  - Focus: Sebaceous cysts, Epidermoid cysts, Pilar cysts, and Acne cysts.
  - Technology: Minimally invasive Laser removal vs. Surgical excision.
  - Value Prop: Meticulous approach, prioritizing aesthetics and minimal scarring.
  - Tone: Highly medical, expert, reassuring, and thorough.
  - Pricing: Starts from £495.
  - Call to Action: Schedule a free online cyst assessment.
  
  IMPORTANT - PAGE NAVIGATION: If the user asks about lipomas (fatty lumps), use the navigateToPage tool:
  - For lipomas (fatty tissue lumps), navigate to "lipoma"
  
  IMPORTANT - BOOKING FLOW:
  1. Ask for their Name, Email, and Phone.
  2. Use the submitLeadToWebhook tool to submit the details.
  3. IMMEDIATELY after submitting, use the openCalendarPopup tool.
  4. Say: "Our team will get in touch with you in 24 hours, although you can book the meeting right away by booking the time on this calendar."`,

  lipoma: `Start the conversation with exactly: "Welcome to Harley Street Medics, this is Sarah how can i help you with your lipoma removal concern."
  You are a specialist voice agent for Harley Street Medics ${location}, focusing on Lipoma Removal.
  Your training includes:
  - Focus: Fatty tissue lumps (lipomas) on the arms, shoulders, neck, and torso.
  - Technology: Surgical Excision and Lipoma Dissolving Injections (less invasive alternative).
  - Value Prop: 20+ years of exceptional care, expert plastic surgeons (Dr. Mehdi), and personalized treatment plans.
  - Tone: Clear, expert, reassuring, and helpful.
  - Pricing: Starts from £495.
  - Call to Action: Book a free online lipoma assessment.
  
  IMPORTANT - PAGE NAVIGATION: If the user asks about cysts, use the navigateToPage tool:
  - For cysts (sebaceous, epidermoid, pilar cysts), navigate to "cyst"
  
  IMPORTANT - BOOKING FLOW:
  1. Ask for their Name, Email, and Phone.
  2. Use the submitLeadToWebhook tool to submit the details.
  3. IMMEDIATELY after submitting, use the openCalendarPopup tool.
  4. Say: "Our team will get in touch with you in 24 hours, although you can book the meeting right away by booking the time on this calendar."`,

  mole: `Start the conversation with exactly: "Welcome to Harley Street Medics, this is Sarah how can i help you with your mole removal concern."
  You are an expert skin cancer screening and mole removal voice agent for Harley Street Medics ${location}.
  Your training includes:
  - Focus: Mole checks (ABCDE method) and cosmetic mole removal.
  - Technology: Signature Laser Removal (minimal scarring) vs Surgical Excision (for histology).
  - Value Prop: Safety first (ruling out melanoma) followed by aesthetic excellence.
  - Tone: Highly professional, vigilant, and reassuring.
  - Pricing: Starts from £250.
  - Call to Action: Book a free online mole consultation.
  
  IMPORTANT - PAGE NAVIGATION: If the user asks about skin tags, use the navigateToPage tool:
  - For regular skin tags (face, neck, underarms), navigate to "skintag"
  - For anal skin tags (intimate/sensitive area), navigate to "analskintag"
  
  IMPORTANT - BOOKING FLOW:
  1. Ask for their Name, Email, and Phone.
  2. Use the submitLeadToWebhook tool to submit the details.
  3. IMMEDIATELY after submitting, use the openCalendarPopup tool.
  4. Say: "Our team will get in touch with you in 24 hours, although you can book the meeting right away by booking the time on this calendar."`,

  ganglion: `Start the conversation with exactly: "Welcome to Harley Street Medics, this is Sarah how can i help you with your ganglion cyst concern."
  You are a specialist medical voice agent for Harley Street Medics ${location}, focusing on Ganglion Cyst (Wrist/Hand) removal.
  Your training includes:
  - Focus: Fluid-filled lumps on wrists or hands.
  - Technology: Surgical Excision (gold standard) or Aspiration (draining).
  - Value Prop: Quick, effective relief from pain and restricted movement.
  - Tone: Clinical, precise, and solution-focused.
  - Pricing: Starts from £495.
  - Call to Action: Book a free online ganglion assessment.
  
  IMPORTANT - BOOKING FLOW:
  1. Ask for their Name, Email, and Phone.
  2. Use the submitLeadToWebhook tool to submit the details.
  3. IMMEDIATELY after submitting, use the openCalendarPopup tool.
  4. Say: "Our team will get in touch with you in 24 hours, although you can book the meeting right away by booking the time on this calendar."`
});

const VoiceAgent: React.FC<VoiceAgentProps> = ({ mode, location, locationId, onNavigate, onOpenCalendar }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  // Fallback if locationId isn't passed yet (it will be missing until ClinicPage updates)
  // We can try to guess from the location string 'London' or 'Glasgow'
  const computedLocationId: LocationId = locationId || (location.toLowerCase().includes('glasgow') ? 'glasgow' : 'london');

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
        throw new Error("API Key not found in environment.");
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
            voiceConfig: { prebuiltVoiceConfig: { voiceName: mode === 'genital' || mode === 'analskintag' ? 'Kore' : 'Zephyr' } },
          },

          systemInstruction: GET_SYSTEM_INSTRUCTIONS(location)[mode],
          tools: [
            {
              functionDeclarations: [
                {
                  name: 'scrollToSection',
                  description: 'Scrolls the page to a specific section to guide the user\'s attention. Use this when discussing relevant topics.',
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
                  description: 'Navigates to a different treatment page when the user asks about a different condition. Use for navigating between wart types (general/verruca/genital), skin condition types (skintag/analskintag/mole), or surgical types (cyst/lipoma).',
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      pageId: {
                        type: Type.STRING,
                        description: 'The page to navigate to: general (hand/face/body warts), verruca (plantar warts on feet), genital (genital warts), skintag (regular skin tags), analskintag (anal skin tags), mole (mole removal/checks), cyst (cyst removal), lipoma (lipoma removal)',
                        enum: ['general', 'verruca', 'genital', 'skintag', 'analskintag', 'mole', 'cyst', 'lipoma']
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
                },
                {
                  name: 'openCalendarPopup',
                  description: 'Opens the calendar popup so the user can book a convenient time slot immediately. Use this IMMEDIATELY after submitting the lead.',
                  parameters: {
                    type: Type.OBJECT,
                    properties: {},
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

            // Helper function to execute scroll
            const executeScroll = (sectionId: string, callId?: string) => {
              console.log('Voice Agent: Scrolling to section:', sectionId);
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

            // Helper function to execute page navigation
            const executeNavigate = (pageId: string, callId?: string) => {
              console.log('Voice Agent: Navigating to page:', pageId);
              const validPages = ['general', 'verruca', 'genital', 'skintag', 'analskintag', 'mole', 'cyst', 'lipoma'];
              if (onNavigate && validPages.includes(pageId)) {
                onNavigate(pageId as 'general' | 'verruca' | 'genital' | 'skintag' | 'analskintag' | 'mole' | 'cyst' | 'lipoma');
              }
              sessionPromise.then((session) => {
                try {
                  session.sendToolResponse({
                    functionResponses: [{ id: callId || 'navigate-response', name: 'navigateToPage', response: { success: true, pageId } }]
                  });
                } catch (e) { }
              });
            };

            // Helper function to execute webhook submission
            const executeWebhook = async (name: string, email: string, phone: string, callId?: string) => {
              console.log('Voice Agent: Submitting lead to webhook:', { name, email, phone });
              try {
                // Logic to select the correct webhook based on location and mode
                const locationData = locations[computedLocationId];
                // Fallback to general London webhook if specific one is missing
                const webhookUrl = locationData?.webhooks?.agent[mode] || locationData?.webhooks?.agent['general'];

                if (!webhookUrl) throw new Error("Webhook URL not found for this location/mode");

                const response = await fetch(webhookUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name,
                    email,
                    phone,
                    // Send location and mode as metadata
                    location: computedLocationId,
                    treatment_interest: mode,
                    source: 'Voice Agent',
                    timestamp: new Date().toISOString()
                  })
                });
                const success = response.ok;

                sessionPromise.then((session) => {
                  try {
                    session.sendToolResponse({
                      functionResponses: [{
                        id: callId || 'webhook-response',
                        name: 'submitLeadToWebhook',
                        response: { success, message: success ? 'Lead submitted successfully' : 'Failed to submit lead' }
                      }]
                    });
                  } catch (e) { }
                });
              } catch (error) {
                console.error('Webhook error:', error);
                sessionPromise.then((session) => {
                  try {
                    session.sendToolResponse({
                      functionResponses: [{
                        id: callId || 'webhook-response',
                        name: 'submitLeadToWebhook',
                        response: { success: false, message: 'Error submitting lead' }
                      }]
                    });
                  } catch (e) { }
                });
              }
            };

            // Helper function to execute calendar popup
            const executeOpenCalendarPopup = (callId?: string) => {
              console.log('Voice Agent: Opening Calendar Popup');
              if (onOpenCalendar) {
                onOpenCalendar();
              }
              sessionPromise.then((session) => {
                try {
                  session.sendToolResponse({
                    functionResponses: [{ id: callId || 'calendar-response', name: 'openCalendarPopup', response: { success: true } }]
                  });
                } catch (e) { }
              });
            };

            // Process tool calls (Structure 1: Live API)
            if (toolCall?.functionCalls) {
              for (const fc of toolCall.functionCalls) {
                if (fc.name === 'scrollToSection' && fc.args?.sectionId) executeScroll(fc.args.sectionId, fc.id);
                if (fc.name === 'navigateToPage' && fc.args?.pageId) executeNavigate(fc.args.pageId, fc.id);
                if (fc.name === 'submitLeadToWebhook' && fc.args?.name && fc.args?.email && fc.args?.phone) executeWebhook(fc.args.name, fc.args.email, fc.args.phone, fc.id);
                if (fc.name === 'openCalendarPopup') executeOpenCalendarPopup(fc.id);
              }
            }

            // Process tool calls (Structure 2: Fallback)
            if (serverContent?.toolCall?.functionCalls) {
              for (const fc of serverContent.toolCall.functionCalls) {
                if (fc.name === 'scrollToSection' && fc.args?.sectionId) executeScroll(fc.args.sectionId, fc.id);
                if (fc.name === 'navigateToPage' && fc.args?.pageId) executeNavigate(fc.args.pageId, fc.id);
                if (fc.name === 'submitLeadToWebhook' && fc.args?.name && fc.args?.email && fc.args?.phone) executeWebhook(fc.args.name, fc.args.email, fc.args.phone, fc.id);
                if (fc.name === 'openCalendarPopup') executeOpenCalendarPopup(fc.id);
              }
            }

            // Process tool calls (Structure 3: Model Turn)
            if (serverContent?.modelTurn?.parts) {
              for (const part of serverContent.modelTurn.parts) {
                if (part.functionCall) {
                  const { name, args, id } = part.functionCall;
                  if (name === 'scrollToSection' && args?.sectionId) executeScroll(args.sectionId, id);
                  if (name === 'navigateToPage' && args?.pageId) executeNavigate(args.pageId, id);
                  if (name === 'submitLeadToWebhook' && args?.name && args?.email && args?.phone) executeWebhook(args.name, args.email, args.phone, id);
                  if (name === 'openCalendarPopup') executeOpenCalendarPopup(id);
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
            console.error('Live API Error:', e);
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

  const getAgentIcon = () => {
    switch (mode) {
      case 'lipoma': return <Zap className="text-amber-500 w-10 h-10" />;
      case 'cyst': return <Sparkles className="text-amber-500 w-10 h-10" />;
      case 'analskintag': return <Tag className="text-amber-500 w-10 h-10" />;
      case 'skintag': return <Tag className="text-amber-500 w-10 h-10" />;
      case 'genital': return <Lock className="text-amber-500 w-10 h-10" />;
      case 'verruca': return <Footprints className="text-amber-500 w-10 h-10" />;
      case 'mole': return <ShieldCheck className="text-amber-500 w-10 h-10" />;
      case 'ganglion': return <Sparkles className="text-amber-500 w-10 h-10" />;
      default: return <ShieldCheck className="text-amber-500 w-10 h-10" />;
    }
  };

  return (
    <div className="fixed bottom-8 right-8" style={{ zIndex: 99999 }}>
      {!isActive && !isConnecting ? (
        <button
          onClick={startSession}
          className="group relative flex items-center justify-center w-16 h-16 bg-amber-500 gold-gradient rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
        >
          <div className="absolute -inset-2 bg-amber-500/20 rounded-full animate-ping group-hover:bg-amber-500/40"></div>
          <Mic className="text-black w-8 h-8" />
          <span className="absolute right-full mr-4 bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Speak to {mode === 'lipoma' ? 'Lipoma Expert' : mode === 'cyst' ? 'Cyst Specialist' : mode === 'mole' ? 'Mole Expert' : mode === 'ganglion' ? 'Ganglion Expert' : 'Expert'} AI
          </span>
        </button>
      ) : (
        <div className="bg-neutral-900/95 backdrop-blur-xl border border-amber-500/30 w-80 rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                {isConnecting ? 'Initializing Elite AI...' : `${location} Voice Agent`}
              </span>
            </div>
            <button onClick={stopSession} className="text-neutral-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full border-2 border-amber-500/30 flex items-center justify-center transition-all duration-500 ${isTalking ? 'scale-110 border-amber-500 shadow-[0_0_30px_rgba(212,175,55,0.3)]' : ''}`}>
                {getAgentIcon()}
                {isTalking && (
                  <div className="absolute -inset-4 border border-amber-500/20 rounded-full animate-ping"></div>
                )}
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
                {mode === 'lipoma'
                  ? "Ask about fatty lumps, surgical excision, or dissolving injections."
                  : mode === 'ganglion'
                    ? "Ask about hand/wrist lumps, aspiration, or surgical removal."
                    : "Ask our expert AI about your treatment concerns."}
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

            <button
              onClick={stopSession}
              className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold hover:text-amber-500 transition-colors"
            >
              End Conversation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAgent;
