
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ShieldCheck,
    Clock,
    CreditCard,
    Play,
    ChevronRight,
    Star,
    CheckCircle,
    Menu,
    X,
    Phone,
    Video,
    Lock,
    Heart,
    AlertCircle,
    UserCheck,
    Zap,
    Footprints,
    Sparkles,
    Tag,
    Stethoscope,
    Info
} from 'lucide-react';
import BookingForm from './BookingForm';
import SectionHeader from './SectionHeader';
import VoiceAgent from './VoiceAgent'; // Using the generic, location-aware agent
import WartSimulation from './WartSimulation';
import CystEmergencyGuide from './CystEmergencyGuide';
import SignatureTreatments from './SignatureTreatments';
import NhsVsPrivate from './NhsVsPrivate';
import VideoSection from './VideoSection';
import BeforeAfterSection from './BeforeAfterSection';
import FinancingSection from './FinancingSection';
import ReviewSection from './ReviewSection';
import MoleSimulation from './MoleSimulation';
import {
    GENERAL_FAQS,
    GENITAL_FAQS,
    VERRUCA_FAQS,
    SKIN_TAG_FAQS,
    ANAL_SKIN_TAG_FAQS,
    CYST_FAQS,
    LIPOMA_FAQS,
    MOLE_FAQS
} from '../constants';

import { locations } from '../src/data/locations';

type PageView = 'general' | 'verruca' | 'genital' | 'skintag' | 'analskintag' | 'cyst' | 'lipoma' | 'mole' | 'ganglion';

interface ClinicPageProps {
    locationId: 'london' | 'glasgow';
}

const ClinicPage: React.FC<ClinicPageProps> = ({ locationId }) => {
    // Determine activePage from URL initially or default to 'general'
    // This removes the need for a separate state that syncs partially.
    // However, keeping the state structure to minimize refactor risk, 
    // but initializing it correctly from useLocation is better.

    // Better approach: Sync state <-> URL properly using useEffect.
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize activePage based on current URL path
    const getInitialPage = (): PageView => {
        const path = location.pathname;
        if (path.includes('verruca')) return 'verruca';
        if (path.includes('genital')) return 'genital';
        if (path.includes('anal')) return 'analskintag';
        if (path.includes('skin-tag')) return 'skintag';
        // Check ganglion BEFORE cyst because ganglion URL likely contains 'cyst'
        if (path.includes('ganglion')) return 'ganglion';
        if (path.includes('cyst')) return 'cyst';
        if (path.includes('lipoma')) return 'lipoma';
        if (path.includes('mole')) return 'mole';
        return 'general';
    };

    const [activePage, setActivePage] = useState<PageView>(getInitialPage());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const locationData = locations[locationId];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        // Listen to location changes to update internal state (handling back button)
        const path = location.pathname;
        if (path.includes('verruca')) setActivePage('verruca');
        else if (path.includes('genital')) setActivePage('genital');
        else if (path.includes('anal')) setActivePage('analskintag');
        else if (path.includes('skin-tag')) setActivePage('skintag');
        // Check ganglion BEFORE cyst to prevent false positive match on 'cyst'
        else if (path.includes('ganglion')) setActivePage('ganglion');
        else if (path.includes('cyst')) setActivePage('cyst');
        else if (path.includes('lipoma')) setActivePage('lipoma');
        else if (path.includes('mole')) setActivePage('mole');
        else if (path === `/${locationId}` || path === `/${locationId}/`) setActivePage('general');

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname, locationId]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update URL when state changes
        let subPath = '';
        if (activePage === 'verruca') subPath = '/verruca-removal';
        if (activePage === 'genital') subPath = '/genital-warts';
        if (activePage === 'skintag') subPath = '/skin-tag-removal';
        if (activePage === 'analskintag') subPath = '/anal-skin-tags';
        if (activePage === 'cyst') subPath = '/cyst-removal';
        if (activePage === 'lipoma') subPath = '/lipoma-removal';
        if (activePage === 'mole') subPath = '/mole-removal';
        if (activePage === 'ganglion') subPath = '/ganglion-cyst';

        // Construct full path
        const targetPath = `/${locationId}${subPath}`;

        // Only navigate if the URL is different to prevent loops
        if (location.pathname !== targetPath) {
            navigate(targetPath, { replace: false });
        }
    }, [activePage, locationId, navigate, location.pathname]);

    const scrollToBooking = () => {
        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const navLinks = [
        { name: 'Treatments', href: '#treatments' },
        { name: 'Details', href: '#details' },
        { name: 'Expertise', href: '#team' },
        { name: 'FAQ', href: '#faq' },
    ];

    const getFaqs = () => {
        if (activePage === 'mole') return MOLE_FAQS;
        if (activePage === 'lipoma') return LIPOMA_FAQS;
        if (activePage === 'cyst') return CYST_FAQS;
        if (activePage === 'analskintag') return ANAL_SKIN_TAG_FAQS;
        if (activePage === 'genital') return GENITAL_FAQS;
        if (activePage === 'verruca') return VERRUCA_FAQS;
        if (activePage === 'skintag') return SKIN_TAG_FAQS;
        return GENERAL_FAQS;
    };

    const isSkinTagClinic = activePage === 'skintag' || activePage === 'analskintag' || activePage === 'mole';
    const isSurgicalClinic = activePage === 'cyst' || activePage === 'lipoma' || activePage === 'ganglion';

    const getPageConfig = () => {
        switch (activePage) {
            case 'ganglion':
                return {
                    title: "Ganglion Cyst Removal",
                    highlight: "Surgical Solution",
                    subtitle: `Expert removal of Ganglion Cysts in ${locationData.city}. We offer precise aspiration and surgical excision to relieve pain and restore function.`,
                    price: "£495",
                    label: `${locationData.city}'s Ganglion Cyst Specialists`,
                    icon: <Sparkles className="text-amber-500 w-4 h-4" />,
                    whatIsTitle: "What is a Ganglion Cyst?",
                    whatIsDesc: "Ganglion cysts are fluid-filled lumps that most commonly develop along the tendons or joints of your wrists or hands. They are non-cancerous but can cause pain or limit movement.",
                    whatIsPoints: [
                        { label: "Fluid-Filled", text: "Contains a thick, jelly-like fluid (synovial fluid)." },
                        { label: "Location", text: "Commonly appear on the back of the wrist of hand." },
                        { label: "Treatment", text: "Surgical removal is recommended for persistent or painful cysts." }
                    ],
                    treatment1Title: "Surgical Excision",
                    treatment1Desc: "The most effective method. Removing the cyst and its root (stalk) to minimize recurrence.",
                    treatment2Title: "Aspiration",
                    treatment2Desc: "Draining the fluid from the cyst with a needle. Less invasive but higher chance of recurrence.",
                    treatment3Title: "Clinical Assessment",
                    treatment3Desc: "Thorough examination to confirm diagnosis and plan the best removal approach."
                };
            case 'mole':
                return {
                    title: "Mole Removal &",
                    highlight: "Melanoma Checks",
                    subtitle: `Worried about a mole? We offer ${locationData.city}'s most advanced mole removal and checking services. From signature laser removal to surgical excision and ABCDE assessments.`,
                    price: "£250",
                    label: `Expert Mole Removal ${locationData.city}`,
                    icon: <ShieldCheck className="text-amber-500 w-4 h-4" />,
                    whatIsTitle: "Safe & Minimal Scarring",
                    whatIsDesc: "We prioritize two things: Your safety (ruling out melanoma) and your confidence (minimal scarring). Our signature laser technique achieves both for benign moles.",
                    whatIsPoints: [
                        { label: "Safety First", text: "Every mole is assessed for ABCD warning signs before removal." },
                        { label: "Minimal Scarring", text: "Our laser vaporizes the mole without cutting, leaving smooth skin." },
                        { label: "Histology", text: "We can send any tissue for lab testing if required." }
                    ],
                    treatment1Title: "Signature Laser Removal",
                    treatment1Desc: "The aesthetic gold standard. Precise vaporization for a scar-free finish.",
                    treatment2Title: "Surgical Excision",
                    treatment2Desc: "Complete removal for deep or recurring moles with stitches.",
                    treatment3Title: "Melanoma Check",
                    treatment3Desc: "Comprehensive skin assessment by a specialist doctor."
                };
            case 'lipoma':
                return {
                    title: "Quick & Painless",
                    highlight: "Lipoma Removal",
                    subtitle: `Looking for a discreet and effective way to remove a lipoma in ${locationData.city}? We offer state-of-the-art removal services using the latest techniques to ensure optimal results.`,
                    price: "£495",
                    label: `${locationData.city}'s Premier Lipoma Clinic`,
                    icon: <Zap className="text-amber-500 w-4 h-4" />,
                    whatIsTitle: "What are lipomas?",
                    whatIsDesc: "Lipomas are small, fatty lumps that grow under the skin. They are usually harmless and painless, but they can be bothersome if they are large or in a visible location.",
                    whatIsPoints: [
                        { label: "Fatty Tissue", text: "Lipomas are composed of fat cells and feel soft and doughy to the touch." },
                        { label: "Location", text: "They typically occur on the upper body, arms, shoulders, and neck." },
                        { label: "Symptoms", text: "Lipomas are usually painless and don’t cause any other symptoms." }
                    ],
                    treatment1Title: "Surgical Lipoma Removal",
                    treatment1Desc: "Advanced techniques for larger or deeper lipomas to minimize discomfort and scarring.",
                    treatment2Title: "Specialized Fat Dissolving Injection",
                    treatment2Desc: "Non-surgical alternative to dissolve fat cells within small lipomas gradually.",
                    treatment3Title: "Clinical Assessment",
                    treatment3Desc: "Comprehensive diagnosis by expert plastic surgeons to ensure the best course of action."
                };
            case 'cyst':
                return {
                    title: "Specialist Cyst Removal",
                    highlight: "Surgical Excellence",
                    subtitle: "Review by Expert Doctors. Surgical excision of Sebaceous & Epidermoid cysts with minimal scarring and expert closure.",
                    price: "£495",
                    label: "The UK’s Leading Cyst Removal Clinics",
                    icon: <Sparkles className="text-amber-500 w-4 h-4" />,
                    whatIsTitle: "What are Cysts?",
                    whatIsDesc: "Sebaceous and Epidermoid cysts represent the most common types of cysts. These are closed sacs found under the skin filled with cheese-like keratin.",
                    whatIsPoints: [
                        { label: "The Sac", text: "Crucial: The entire sac must be removed to prevent regrowth." },
                        { label: "Inflammation", text: "Red, angry cysts may need anti-inflammatory injections first." },
                        { label: "Expertise", text: "Requires surgical precision to avoid infection and scarring." }
                    ],
                    treatment1Title: "Surgical Excision",
                    treatment1Desc: "Complete removal of the cyst and sac under local anesthetic. Best for permanent removal.",
                    treatment2Title: "Kenalog Injection",
                    treatment2Desc: "Specialized anti-inflammatory injection to reduce inflammation in angry, red cysts.",
                    treatment3Title: "Clinical Assessment",
                    treatment3Desc: "Expert diagnosis to confirm the nature of the lump (Lipoma vs Cyst) before treatment."
                };
            case 'analskintag':
                return {
                    title: "Unleash Comfort and",
                    highlight: "Confidence",
                    subtitle: `Are you tired of the discomfort and self-consciousness caused by anal skin tags? Harley Street Medics offers safe, effective, and discreet solutions in ${locationData.city}.`,
                    price: "£495",
                    label: `Expert Anal Skin Tag Removal ${locationData.city}`,
                    icon: <Lock className="text-amber-500 w-4 h-4" />,
                    whatIsTitle: "Discreet Anal Care",
                    whatIsDesc: "Anal skin tags are harmless but can cause significant irritation. Our clinic provides a professional, private environment for removal.",
                    whatIsPoints: [
                        { label: "Privacy", text: "100% confidential clinical environment." },
                        { label: "Relief", text: "Wave goodbye to irritation and reclaim your freedom." },
                        { label: "Precision", text: "Focused laser energy for sensitive tissue." }
                    ],
                    treatment1Title: "CO2 Surgical Laser",
                    treatment1Desc: "Precision technology that vaporizes the tag with zero contact and minimal bleeding.",
                    treatment2Title: "Clinical Excision",
                    treatment2Desc: "Surgical removal for larger tags using precise instruments under local anesthesia.",
                    treatment3Title: "Aftercare Support",
                    treatment3Desc: "Comprehensive recovery plan to ensure fast healing and maximum comfort."
                };
            case 'skintag':
                return {
                    title: "Say Goodbye to Skin Tags",
                    highlight: "Expert Removal",
                    subtitle: "Struggling with unsightly skin tags? Experience safe, effective, and tailored removal with our revolutionary CO2 Surgical Laser Treatment.",
                    price: "£199",
                    label: `Skin Tag Removal ${locationData.city}`,
                    icon: <Tag className="text-amber-500 w-4 h-4" />,
                    whatIsTitle: "Skin Tag Insights",
                    whatIsDesc: "Skin tags are common, harmless growths but can be annoying. Our CO2 Surgical Laser is the gold standard for your skin type.",
                    whatIsPoints: [
                        { label: "Fast", text: "Most sessions take just minutes." },
                        { label: "Painless", text: "Virtually no discomfort during or after." },
                        { label: "No Downtime", text: "Get back to your routine immediately." }
                    ],
                    treatment1Title: "CO2 Surgical Laser",
                    treatment1Desc: "Rapid removal with pinpoint accuracy, leaving the surrounding skin untouched.",
                    treatment2Title: "Cryotherapy",
                    treatment2Desc: "Quick freezing of the skin tag to remove it with minimal discomfort.",
                    treatment3Title: "Clinical Excision",
                    treatment3Desc: "Precise surgical removal for larger tags to ensure smooth results."
                };
            case 'verruca':
                return {
                    title: "Step Towards",
                    highlight: "Pain-Free Living",
                    subtitle: `Harley Street Medics specializes in advanced, non-surgical verruca removal in ${locationData.city}. Our treatments focus on stopping recurrence so you can walk comfortably again.`,
                    price: "£149",
                    label: "Advanced Non-Surgical Verruca Removal",
                    icon: <Footprints className="text-amber-500 w-4 h-4" />,
                    whatIsTitle: "What are Verrucas?",
                    whatIsDesc: "Ever noticed a rough, raised bump on your foot? You might have a verruca. Verrucas are plantar warts caused by the HPV virus. Because of walking pressure, they grow inward and can cause significant pain with every step.",
                    whatIsPoints: [
                        { label: "Cause", text: "Strains of the human papillomavirus (HPV) that thrive in moist environments." },
                        { label: "Appearance", text: "Rough surfaces, often with tiny black dots (clotted blood vessels)." },
                        { label: "Impact", text: "Can cause severe discomfort when walking; highly contagious via direct contact." }
                    ],
                    treatment1Title: "Electrocautery",
                    treatment1Desc: "Precisely burning away plantar warts with targeted heat. Ideal for thicker, more established verrucas.",
                    treatment2Title: "Clinical Cryotherapy",
                    treatment2Desc: "Extreme cold freezes the tissue, causing the verruca to die off. Quick sessions with noticeable relief.",
                    treatment3Title: "Surgical Excision",
                    treatment3Desc: "Reserved for specific cases where verrucas are large or unresponsive to other treatments."
                };
            case 'genital':
                return {
                    title: "Find Relief and Restore",
                    highlight: "Confidence",
                    subtitle: `Are Genital Warts causing discomfort? Harley Street Medics offers expert, discreet removal services in ${locationData.city} with total confidentiality.`,
                    price: "£149",
                    label: "Private & Confidential Genital Care",
                    icon: <Lock className="text-amber-500 w-4 h-4" />,
                    whatIsTitle: "Understanding Genital Warts",
                    whatIsDesc: "Genital warts require specialized care. We offer same-day appointments and laser options not always available on the NHS.",
                    whatIsPoints: [
                        { label: "Confidential", text: "Private assessment from senior dermatologists." },
                        { label: "Efficient", text: "Rapid removal in a professional setting." },
                        { label: "Comfort", text: "Gentle techniques for delicate skin." }
                    ],
                    treatment1Title: "CO2 Surgical Laser",
                    treatment1Desc: "State-of-the-art vaporization for sensitive areas with rapid recovery.",
                    treatment2Title: "Cryotherapy",
                    treatment2Desc: "Controlled freezing treatment to manage and remove genital lesions effectively.",
                    treatment3Title: "Dermatological Review",
                    treatment3Desc: "Ongoing support to monitor viral activity and ensure complete clearance."
                };
            default:
                return {
                    title: "CO2 Surgical Laser Wart Removal",
                    highlight: "Stops Reoccurrence",
                    subtitle: "Experience the ultimate solution against stubborn warts. Our advanced laser technology not only removes warts effectively but targets the root cause to prevent them from coming back.",
                    price: "£149",
                    label: `${locationData.city}'s Leading Dermatology Clinic • 4.9/5 Google Rating`,
                    icon: <ShieldCheck className="text-amber-500 w-4 h-4" />,
                    whatIsTitle: "What are Warts?",
                    whatIsDesc: "Warts are benign epidermal proliferations caused by the Human Papillomavirus (HPV). The virus infects the basal layer of the epidermis, causing rapid cell division (hyperkeratosis) and forming a protective protein shell that evades the immune system.",
                    whatIsPoints: [
                        { label: "Viral Mechanism", text: "HPV hijacks keratinocyte DNA, forcing cells to replicate uncontrolled." },
                        { label: "Structure", text: "Hyperkeratosis creates the rough, thickened 'cauliflower' texture." },
                        { label: "Persistence", text: "The virus creates a low-inflammation environment to remain undetected by immunity." }
                    ],
                    treatment1Title: "CO2 Surgical Laser",
                    treatment1Desc: "Precision technology that targets and destroys tissue while minimizing damage to surrounding skin.",
                    treatment2Title: "Laser Prevention",
                    treatment2Desc: "Addresses the viral cause to provide long-term protection and peace of mind.",
                    treatment3Title: "Clinical Cryotherapy",
                    treatment3Desc: "Fast and effective freezing for various types of warts on hands and face."
                };
        }
    };

    const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);

    // ... (rest of standard variables)

    const getTreatmentForBooking = () => {
        switch (activePage) {
            case 'ganglion': return locationId === 'london' ? 'Ganglion Cyst Removal' : 'Cyst Removal';
            case 'mole': return 'Mole Removal';
            case 'lipoma': return 'Lipoma Removal';
            case 'cyst': return 'Cyst Removal';
            case 'analskintag': return 'Anal Skin Tag Removal';
            case 'skintag': return 'Skin Tag Removal';
            case 'verruca': return 'Verruca Removal';
            case 'genital': return 'Genital Warts Removal';
            default: return 'Warts Removal';
        }
    };

    const config = getPageConfig();
    const logoUrl = "https://github.com/faisaliqbalfaisal723-hub/harleystreemedics-image-source/blob/main/HSM%20LOGO.png?raw=true";

    return (
        <>
            {/* Consolidated Voice Agent */}
            <VoiceAgent
                mode={activePage}
                location={locationData.city}
                locationId={locationId}
                onNavigate={(page) => setActivePage(page)}
                onOpenCalendar={() => setIsBookingPopupOpen(true)}
            />

            {/* Floating Calendar Button */}
            <a
                href="https://link.harleystreetmedics.clinic/widget/bookings/lead-skin-consultant-n"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-8 left-4 md:bottom-8 md:left-8 z-[99999] bg-amber-500 gold-gradient text-black font-bold w-16 h-16 md:w-auto md:h-auto md:p-4 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-110 transition-all duration-300 flex items-center justify-center gap-2 border border-amber-400/50 group"
            >
                <Clock size={24} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden md:inline uppercase tracking-widest text-xs">Book Now</span>
            </a>

            <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">

                <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-md py-2 border-b border-amber-500/20' : 'bg-transparent py-4'}`}>
                    <div className="container mx-auto px-6 flex justify-between items-center">
                        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setActivePage('general')}>
                            <img src={logoUrl} alt="Harley Street Medics" className={`${scrolled ? 'h-10' : 'h-14'} w-auto transition-all duration-300 object-contain`} />
                        </div>
                        <div className="hidden lg:flex items-center space-x-8 text-[11px] uppercase tracking-widest font-bold">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} className="hover:text-amber-500 transition-colors">{link.name}</a>
                            ))}
                            <a href="#gallery" className="bg-amber-500/10 border border-amber-500/40 text-amber-500 px-6 py-3 rounded hover:bg-amber-500 hover:text-black transition-all">
                                Real Results
                            </a>
                            <button onClick={scrollToBooking} className="bg-amber-500/10 border border-amber-500/40 text-amber-500 px-6 py-3 rounded hover:bg-amber-500 hover:text-black transition-all">
                                Book Free Online Consultation
                            </button>
                        </div>
                        <button className="lg:hidden text-amber-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                    {isMenuOpen && (
                        <div className="lg:hidden absolute top-full left-0 w-full bg-neutral-950 border-b border-amber-500/20 p-8 flex flex-col space-y-6 text-center shadow-2xl">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-neutral-400 font-bold uppercase text-xs tracking-widest">{link.name}</a>
                            ))}
                            <button onClick={() => { setIsMenuOpen(false); document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }); }} className="gold-gradient text-black font-bold py-4 rounded uppercase text-xs tracking-widest">
                                Real Results
                            </button>
                            <button onClick={() => { setIsMenuOpen(false); scrollToBooking(); }} className="gold-gradient text-black font-bold py-4 rounded uppercase text-xs tracking-widest">
                                Book Free Online Consultation
                            </button>
                        </div>
                    )}
                </nav>

                <section className="relative min-h-screen flex flex-col pt-32 overflow-hidden">
                    {(locationId === 'london' || locationId === 'glasgow') && activePage === 'general' && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/warts%201.jpg"
                                alt={`Wart Removal ${locationData.city}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </div>
                    )}
                    {(locationId === 'london' || locationId === 'glasgow') && activePage === 'verruca' && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/verruca%201.jpg"
                                alt={`Verruca Removal ${locationData.city}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </div>
                    )}
                    {(locationId === 'london' || locationId === 'glasgow') && activePage === 'genital' && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/genital%20warts%201.jpg"
                                alt={`Genital Warts Removal ${locationData.city}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </div>
                    )}
                    {(locationId === 'london' || locationId === 'glasgow') && activePage === 'mole' && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/mole%201.jpg"
                                alt={`Mole Removal ${locationData.city}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </div>
                    )}
                    {(locationId === 'london' || locationId === 'glasgow') && activePage === 'skintag' && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/skin%20tags%201.jpeg"
                                alt={`Skin Tag Removal ${locationData.city}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </div>
                    )}
                    {(locationId === 'london' || locationId === 'glasgow') && activePage === 'analskintag' && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/skin%20tags%201.jpeg"
                                alt={`Anal Skin Tag Removal ${locationData.city}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </div>
                    )}
                    {(locationId === 'london' || locationId === 'glasgow') && activePage === 'cyst' && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/cyst%201.jpg"
                                alt={`Cyst Removal ${locationData.city}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </div>
                    )}
                    {(locationId === 'london' || locationId === 'glasgow') && activePage === 'lipoma' && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/cyst%201.jpg"
                                alt={`Lipoma Removal ${locationData.city}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </div>
                    )}
                    {(locationId === 'london' || locationId === 'glasgow') && activePage === 'ganglion' && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images-strategyguys.netlify.app/harleystreemedics-image-source-main/ganglion%20cyst%201.jpg"
                                alt={`Ganglion Cyst Removal ${locationData.city}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </div>
                    )}
                    <div className="container mx-auto px-6 mb-12 relative z-20">
                        <div className={`bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-lg overflow-hidden grid ${isSurgicalClinic ? (locationId === 'london' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2') : 'grid-cols-1 md:grid-cols-3'} divide-y md:divide-y-0 md:divide-x divide-neutral-800 max-w-4xl mx-auto`}>
                            {/* Note: I'm keeping the buttons as is, they just change state. No changes needed for Location here. */}
                            {isSkinTagClinic ? (
                                <>
                                    <button onClick={() => setActivePage('skintag')} className={`flex items-center p-4 md:p-6 transition-all duration-300 group ${activePage === 'skintag' ? 'bg-amber-500/5' : 'hover:bg-neutral-800/50'}`}>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 transition-all ${activePage === 'skintag' ? 'gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700'}`}>
                                            <Tag className={`w-5 h-5 md:w-6 md:h-6 ${activePage === 'skintag' ? 'text-black' : 'text-neutral-400'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none mb-1 transition-colors ${activePage === 'skintag' ? 'text-amber-500' : 'text-white'}`}>Skin Tags</p>
                                            <p className="hidden md:block text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Cosmetic</p>
                                        </div>
                                    </button>
                                    <button onClick={() => setActivePage('analskintag')} className={`flex items-center p-4 md:p-6 transition-all duration-300 group ${activePage === 'analskintag' ? 'bg-amber-500/5' : 'hover:bg-neutral-800/50'}`}>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 transition-all ${activePage === 'analskintag' ? 'gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700'}`}>
                                            <Lock className={`w-5 h-5 md:w-6 md:h-6 ${activePage === 'analskintag' ? 'text-black' : 'text-neutral-400'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none mb-1 transition-colors ${activePage === 'analskintag' ? 'text-amber-500' : 'text-white'}`}>Anal Skin Tags</p>
                                            <p className="hidden md:block text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Discreet</p>
                                        </div>
                                    </button>
                                    <button onClick={() => setActivePage('mole')} className={`flex items-center p-4 md:p-6 transition-all duration-300 group ${activePage === 'mole' ? 'bg-amber-500/5' : 'hover:bg-neutral-800/50'}`}>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 transition-all ${activePage === 'mole' ? 'gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700'}`}>
                                            <ShieldCheck className={`w-5 h-5 md:w-6 md:h-6 ${activePage === 'mole' ? 'text-black' : 'text-neutral-400'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none mb-1 transition-colors ${activePage === 'mole' ? 'text-amber-500' : 'text-white'}`}>Mole Removal</p>
                                            <p className="hidden md:block text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Expert</p>
                                        </div>
                                    </button>
                                </>
                            ) : isSurgicalClinic ? (
                                <>
                                    <button onClick={() => setActivePage('cyst')} className={`flex items-center p-4 md:p-6 transition-all duration-300 group ${activePage === 'cyst' ? 'bg-amber-500/5' : 'hover:bg-neutral-800/50'}`}>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 transition-all ${activePage === 'cyst' ? 'gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700'}`}>
                                            <Sparkles className={`w-5 h-5 md:w-6 md:h-6 ${activePage === 'cyst' ? 'text-black' : 'text-neutral-400'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none mb-1 transition-colors ${activePage === 'cyst' ? 'text-amber-500' : 'text-white'}`}>Cyst</p>
                                            <p className="hidden md:block text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Surgical</p>
                                        </div>
                                    </button>
                                    <button onClick={() => setActivePage('lipoma')} className={`flex items-center p-4 md:p-6 transition-all duration-300 group ${activePage === 'lipoma' ? 'bg-amber-500/5' : 'hover:bg-neutral-800/50'}`}>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 transition-all ${activePage === 'lipoma' ? 'gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700'}`}>
                                            <Zap className={`w-5 h-5 md:w-6 md:h-6 ${activePage === 'lipoma' ? 'text-black' : 'text-neutral-400'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none mb-1 transition-colors ${activePage === 'lipoma' ? 'text-amber-500' : 'text-white'}`}>Lipoma</p>
                                            <p className="hidden md:block text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Fatty Lump</p>
                                        </div>
                                    </button>
                                    {locationId === 'london' && (
                                        <button onClick={() => setActivePage('ganglion')} className={`flex items-center p-4 md:p-6 transition-all duration-300 group ${activePage === 'ganglion' ? 'bg-amber-500/5' : 'hover:bg-neutral-800/50'}`}>
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 transition-all ${activePage === 'ganglion' ? 'gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700'}`}>
                                                <Sparkles className={`w-5 h-5 md:w-6 md:h-6 ${activePage === 'ganglion' ? 'text-black' : 'text-neutral-400'}`} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none mb-1 transition-colors ${activePage === 'ganglion' ? 'text-amber-500' : 'text-white'}`}>Ganglion</p>
                                                <p className="hidden md:block text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Cyst</p>
                                            </div>
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setActivePage('general')} className={`flex items-center p-4 md:p-6 transition-all duration-300 group ${activePage === 'general' ? 'bg-amber-500/5' : 'hover:bg-neutral-800/50'}`}>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 transition-all ${activePage === 'general' ? 'gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700'}`}>
                                            <ShieldCheck className={`w-5 h-5 md:w-6 md:h-6 ${activePage === 'general' ? 'text-black' : 'text-neutral-400'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none mb-1 transition-colors ${activePage === 'general' ? 'text-amber-500' : 'text-white'}`}>Warts</p>
                                            <p className="hidden md:block text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Protocol</p>
                                        </div>
                                    </button>
                                    <button onClick={() => setActivePage('verruca')} className={`flex items-center p-4 md:p-6 transition-all duration-300 group ${activePage === 'verruca' ? 'bg-amber-500/5' : 'hover:bg-neutral-800/50'}`}>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 transition-all ${activePage === 'verruca' ? 'gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700'}`}>
                                            <Footprints className={`w-5 h-5 md:w-6 md:h-6 ${activePage === 'verruca' ? 'text-black' : 'text-neutral-400'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none mb-1 transition-colors ${activePage === 'verruca' ? 'text-amber-500' : 'text-white'}`}>Verruca</p>
                                            <p className="hidden md:block text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Plantar</p>
                                        </div>
                                    </button>
                                    <button onClick={() => setActivePage('genital')} className={`flex items-center p-4 md:p-6 transition-all duration-300 group ${activePage === 'genital' ? 'bg-amber-500/5' : 'hover:bg-neutral-800/50'}`}>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 transition-all ${activePage === 'genital' ? 'gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700'}`}>
                                            <Lock className={`w-5 h-5 md:w-6 md:h-6 ${activePage === 'genital' ? 'text-black' : 'text-neutral-400'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none mb-1 transition-colors ${activePage === 'genital' ? 'text-amber-500' : 'text-white'}`}>Genital</p>
                                            <p className="hidden md:block text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Sensitive</p>
                                        </div>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center flex-grow relative z-10">
                        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full mb-8">
                                {config.icon}
                                <span className="text-amber-500 text-[10px] uppercase tracking-widest font-bold">{config.label}</span>
                            </div>

                            <div className="flex items-center space-x-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                                <div className="flex text-amber-500">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <span className="text-white font-bold text-sm tracking-wide">4.9/5 Google Reviews</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-6 leading-tight">
                                {config.title} <br /> <span className="gold-text-gradient">{config.highlight}</span>
                            </h1>
                            <p className="text-base sm:text-xl text-neutral-400 mb-8 max-w-lg leading-relaxed font-light italic">{config.subtitle}</p>
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button onClick={scrollToBooking} className="gold-gradient text-black font-bold px-10 py-5 rounded-md shadow-2xl hover:brightness-110 transition-all flex items-center justify-center uppercase tracking-widest text-sm">
                                    Start Free Consultation
                                    <ChevronRight className="ml-2 w-4 h-4" />
                                </button>
                                <div className="text-left hidden sm:block border-l border-neutral-800 pl-6">
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Treatments From</p>
                                    <p className="text-3xl font-serif text-white">{config.price}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                                <div><span className="block text-2xl sm:text-3xl font-serif text-amber-500">10k+</span><span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest">Successes</span></div>
                                <div className="w-px h-8 sm:h-10 bg-neutral-800"></div>
                                <div><span className="block text-2xl sm:text-3xl font-serif text-amber-500">20+ Yrs</span><span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest">Experience</span></div>
                                <div className="w-px h-8 sm:h-10 bg-neutral-800"></div>
                                <div><span className="block text-2xl sm:text-3xl font-serif text-amber-500">Fast</span><span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest">Same-Day</span></div>
                            </div>
                        </div>
                        <div id="booking-section">
                            <BookingForm
                                initialTreatment={getTreatmentForBooking()}
                                locationId={locationId} // Pass locationId to BookingForm
                                isOpen={isBookingPopupOpen}
                                onOpenChange={setIsBookingPopupOpen}
                            />
                        </div>
                    </div>
                </section>

                <section id="details" className="py-24 bg-neutral-950/50">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <SectionHeader title={config.whatIsTitle} subtitle="Dermatology Insights" centered={false} />
                                <p className="text-neutral-400 mb-8 leading-relaxed font-light italic">{config.whatIsDesc}</p>
                                <div className="space-y-6">
                                    {config.whatIsPoints.map((point, i) => (
                                        <div key={i} className="flex space-x-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/30 transition-all">
                                            <div className="w-10 h-10 rounded-full gold-gradient flex-shrink-0 flex items-center justify-center">
                                                <Info className="text-black w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-amber-500 font-bold uppercase text-[10px] tracking-widest mb-1">{point.label}</h4>
                                                <p className="text-sm text-neutral-300 font-light">{point.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`relative group h-[500px] w-full`}>
                                {activePage === 'mole' ? (
                                    <MoleSimulation mode="compare" />
                                ) : (
                                    <WartSimulation type={activePage === 'cyst' || activePage === 'ganglion' ? 'cyst' : activePage === 'lipoma' ? 'lipoma' : activePage === 'verruca' ? 'verruca' : activePage === 'genital' ? 'genital' : activePage === 'skintag' || activePage === 'analskintag' ? 'skintag' : 'general'} />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Emergency Guide for Cysts */}
                {(activePage === 'cyst' || activePage === 'ganglion') && <CystEmergencyGuide />}

                {/* ABCDE Method Section for Moles */}
                {activePage === 'mole' && (
                    <section className="py-24 bg-neutral-900 border-b border-neutral-800">
                        <div className="container mx-auto px-6">
                            <SectionHeader title="The ABCDE Method" subtitle="Early Melanoma Detection" />
                            <div className="mb-12 text-center max-w-3xl mx-auto">
                                <p className="text-neutral-400 leading-relaxed">
                                    Detecting melanoma early saves lives. Use our interactive guide below to understand the 5 warning signs of malignant moles.
                                    If you notice ANY of these, book a consultation immediately.
                                </p>
                            </div>
                            <MoleSimulation mode="abcde" />
                        </div>
                    </section>
                )}

                <section id="treatments" className="py-24 bg-black">
                    <div className="container mx-auto px-6">
                        <SectionHeader title="Signature Treatment Options" subtitle="Proven Medical Excellence" />
                        <SignatureTreatments pageType={activePage === 'analskintag' ? 'skintag' : activePage} onBook={scrollToBooking} />
                    </div>
                </section>

                <section className="py-24 bg-neutral-900 border-y border-neutral-800">
                    <div className="container mx-auto px-6">
                        <NhsVsPrivate pageType={activePage === 'analskintag' ? 'skintag' : activePage === 'ganglion' ? 'cyst' : activePage} onBook={scrollToBooking} />
                    </div>
                </section>

                {/* VideoSection - Hidden for Skin Tags, Cysts, and Moles as requested */}
                {activePage !== 'skintag' && activePage !== 'cyst' && activePage !== 'mole' && activePage !== 'ganglion' && <VideoSection pageType={activePage} />}

                <div id="gallery"><BeforeAfterSection pageType={activePage === 'ganglion' ? 'cyst' : activePage} /></div>

                <div id="reviews"><ReviewSection pageType={activePage === 'ganglion' ? 'cyst' : activePage} reviews={locationData.reviews} /></div>

                <div id="financing"><FinancingSection /></div>

                <section className="py-24 bg-neutral-950">
                    <div className="container mx-auto px-6">
                        <SectionHeader
                            title={activePage === 'skintag' ? "Why Choose Harley Street Medics?" : "Why Choose Harley Street Medics?"}
                            subtitle="The Gold Standard"
                        />
                        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                            {(activePage === 'skintag' ? [
                                { title: "Unsightly", text: "Skin tags can affect your appearance and confidence. We remove them instantly." },
                                { title: "Irritating", text: "They often catch on clothing or jewellery, causing pain and bleeding." },
                                { title: "Stubborn", text: "DIY kits are dangerous and ineffective. trust our sterile, medical-grade removal." }
                            ] : [
                                { title: "Unsightly", text: "Skin growths cause self-consciousness. We restore your confidence." },
                                { title: "Painful", text: "Particularly on feet or in areas of friction, growths can be physically limiting." },
                                { title: "Stubborn", text: "Home remedies often fail. Our clinical methods provide definitive results." }
                            ]).map((p, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-4xl font-serif text-amber-500 mb-4 italic">#{i + 1}</div>
                                    <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-4">{p.title}</h4>
                                    <p className="text-neutral-500 text-sm font-light leading-relaxed italic">{p.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="team" className="py-24 bg-black">
                    <div className="container mx-auto px-6">
                        <SectionHeader title="Our Specialist Team" subtitle="Elite Medical Professionals" />
                        <div className="grid lg:grid-cols-3 gap-12">
                            {locationData.doctors.map((doc, i) => (
                                <div key={i} className="group">
                                    <div className="aspect-[4/5] bg-neutral-900 rounded-2xl overflow-hidden mb-6 border border-neutral-800 relative grayscale hover:grayscale-0 transition-all duration-700">
                                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                    </div>
                                    <h4 className="text-2xl font-serif text-amber-500 mb-1 italic">{doc.name}</h4>
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-4">{doc.title}</p>
                                    <p className="text-sm text-neutral-400 font-light leading-relaxed">{doc.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="faq" className="py-24 bg-neutral-950">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <SectionHeader title="Common Questions" subtitle="Patient Resources" />
                        <div className="space-y-4">
                            {getFaqs().map((faq, idx) => (
                                <details key={idx} className="group border border-neutral-800 rounded-lg p-6 bg-neutral-900/20 hover:border-amber-500/20 transition-all">
                                    <summary className="list-none flex justify-between items-center cursor-pointer font-bold uppercase tracking-widest text-[11px] text-neutral-300 group-open:text-amber-500 transition-colors">
                                        {faq.question}
                                        <ChevronRight size={16} className="text-amber-500 group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <p className="mt-6 text-neutral-500 text-sm leading-relaxed italic border-t border-neutral-800 pt-6">{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Dynamic Clinic Location Section */}
                <section className="py-16 md:py-24 bg-neutral-950">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
                            {/* Left Column - Clinic Info */}
                            <div className="flex flex-col justify-center">
                                <div className="mb-6 md:mb-8">
                                    <p className="text-amber-500 text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center">
                                        <span className="w-6 h-px bg-amber-500 mr-3"></span>
                                        Find Us
                                    </p>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight">
                                        Harley Street<br />
                                        <span className="gold-text-gradient">Medics</span>
                                    </h2>
                                    <p className="text-neutral-500 text-sm md:text-base mt-4 italic font-light max-w-md">
                                        Offers a private and luxurious environment for all your dermatology needs in {locationData.city}.
                                    </p>
                                </div>

                                {/* Info Cards */}
                                <div className="space-y-3 md:space-y-4">
                                    {/* Address Card */}
                                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 md:p-5 hover:border-amber-500/30 transition-all group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-amber-500 text-[9px] md:text-[10px] uppercase tracking-widest font-bold mb-1">{locationData.city} Clinic Location</p>
                                                <p className="text-white text-xs md:text-sm font-medium truncate">{locationData.address}</p>
                                            </div>
                                            <div className="ml-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-amber-500/10 transition-all flex-shrink-0">
                                                <ChevronRight className="w-4 h-4 text-amber-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Cards - 2 Column Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        {/* Reception Card */}
                                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 md:p-5 hover:border-amber-500/30 transition-all group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-amber-500 text-[9px] md:text-[10px] uppercase tracking-widest font-bold mb-1">Reception</p>
                                                    <p className="text-white text-xs md:text-sm font-medium">{locationData.phone}</p>
                                                </div>
                                                <div className="ml-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-amber-500/10 transition-all flex-shrink-0">
                                                    <Phone className="w-4 h-4 text-amber-500" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* WhatsApp Card */}
                                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 md:p-5 hover:border-amber-500/30 transition-all group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-amber-500 text-[9px] md:text-[10px] uppercase tracking-widest font-bold mb-1">WhatsApp Help</p>
                                                    <p className="text-white text-xs md:text-sm font-medium">{locationData.whatsapp}</p>
                                                </div>
                                                <div className="ml-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-green-500/10 transition-all flex-shrink-0">
                                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Opening Hours Card */}
                                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 md:p-5 hover:border-amber-500/30 transition-all group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-amber-500 text-[9px] md:text-[10px] uppercase tracking-widest font-bold mb-1">Opening Hours</p>
                                                <p className="text-white text-xs md:text-sm font-medium">Mon - Sat: 09:00 AM - 07:00 PM</p>
                                                <p className="text-neutral-500 text-[10px] md:text-xs mt-1">Sunday: Closed</p>
                                            </div>
                                            <div className="ml-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-amber-500/10 transition-all flex-shrink-0">
                                                <Clock className="w-4 h-4 text-amber-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Map - Dynamic Embed URL */}
                            <div className="relative rounded-xl overflow-hidden border border-neutral-800 h-[300px] sm:h-[400px] lg:h-full lg:min-h-[500px]">
                                <iframe
                                    src={locationData.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`${locationData.city} Clinic Location`}
                                    className="absolute inset-0"
                                ></iframe>
                                {/* Map Overlay for styling */}
                                <div className="absolute inset-0 pointer-events-none border border-neutral-700 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="bg-black py-24 border-t border-neutral-900">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-16">
                            <div className="col-span-2">
                                <img src={logoUrl} alt="Harley Street Medics" className="h-16 w-auto mb-8 object-contain" />
                                <p className="text-neutral-500 text-sm max-w-sm italic font-light mb-8">{locationData.city}'s leading dermatology and aesthetic clinic. Providing discreet, professional, and advanced medical care for over 20 years.</p>
                                <div className="flex items-center space-x-2 text-amber-500 text-sm font-bold tracking-widest">
                                    <Phone size={16} /> <span>{locationData.phone}</span>
                                </div>
                            </div>
                            <div>
                                <h5 className="text-amber-500 font-bold uppercase text-[10px] tracking-widest mb-8">Clinics</h5>
                                <ul className="space-y-4 text-xs text-neutral-500 uppercase tracking-widest font-bold">
                                    <li onClick={() => setActivePage('general')} className="cursor-pointer hover:text-white">Warts</li>
                                    <li onClick={() => setActivePage('verruca')} className="cursor-pointer hover:text-white">Verruca</li>
                                    <li onClick={() => setActivePage('genital')} className="cursor-pointer hover:text-white">Genital</li>
                                    <li onClick={() => setActivePage('skintag')} className="cursor-pointer hover:text-white">Skin Tags</li>
                                    <li onClick={() => setActivePage('cyst')} className="cursor-pointer hover:text-white">Cysts</li>
                                    <li onClick={() => setActivePage('lipoma')} className="cursor-pointer hover:text-white">Lipoma</li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-amber-500 font-bold uppercase text-[10px] tracking-widest mb-8">Reviews</h5>
                                {/* Dynamically list doctors from location data for footer reviews if needed, or just static titles */}
                                {locationData.doctors.map(d => (
                                    <p key={d.name} className="text-[11px] text-neutral-500 uppercase tracking-widest mb-4">{d.name}</p>
                                ))}
                            </div>
                        </div>
                        <div className="pt-8 border-t border-neutral-900 flex justify-between items-center text-[10px] text-neutral-600 uppercase tracking-widest">
                            <span>© {new Date().getFullYear()} Harley Street Medics {locationData.city}</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default ClinicPage;
