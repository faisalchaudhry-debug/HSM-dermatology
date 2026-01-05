
import { Clock, Phone } from 'lucide-react';

export interface LocationData {
  id: 'london' | 'glasgow';
  city: string;
  clinicName: string;
  address: string;
  phone: string;
  whatsapp: string;
  mapEmbedUrl: string;
  doctors: {
    name: string;
    title: string;
    description: string;
    image: string;
  }[];
  heroTitle: string;
  heroSubtitle: string;
  reviews: {
    name: string;
    date: string;
    content: string;
    rating: number;
  }[];
  webhooks: {
    form: Record<string, string>;
    agent: Record<string, string>;
  };
}

export const locations: Record<'london' | 'glasgow', LocationData> = {
  london: {
    id: 'london',
    city: 'London',
    clinicName: 'Harley Street Medics London',
    address: '1-5 Portpool Ln, London EC1N 7UU, United Kingdom',
    phone: '020 4536 6000',
    whatsapp: '020 4536 6000',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.577590769762!2d-0.1144842235292171!3d51.5209651718164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b0b8241008f%3A0x81b5e10acd58ba8d!2sHarley%20Street%20Medics!5e0!3m2!1sen!2s!4v1767320927198!5m2!1sen!2s',
    heroTitle: 'Wart Removal London',
    heroSubtitle: "Worried about a mole? We offer London's most advanced mole removal and checking services.",
    doctors: [
      {
        name: "Dr. Mehdi",
        title: "Board Certified Plastic Surgeon",
        description: "A double board-certified plastic surgeon with over 20 years of experience in complex reconstructive and aesthetic procedures. Expert in scar-free excision.",
        image: "https://images-strategyguys.netlify.app/harley-street-wellness-main/dr%20mehdi.webp"
      },
      {
        name: "Dr. Ayda Soltanzadeh",
        title: "Board Certified Dermatologist",
        description: "Specialist in laser dermatology and skin pathology. Dr. Soltanzadeh combines medical precision with aesthetic care to treat stubborn verrucas and warts.",
        image: "https://images-strategyguys.netlify.app/harley-street-wellness-main/dr.%20ayda%20soltanzadeh.webp"
      },
      {
        name: "Dr. Humera Faisal",
        title: "Board Certified Dermatologist",
        description: "Renowned for his work in dermatological surgery and mucosal treatments. Dedicated to providing discreet and effective care for sensitive conditions.",
        image: "https://images-strategyguys.netlify.app/harley-street-wellness-main/dr%20humera%201.webp"
      }
    ],
    reviews: [
      {
        name: "Phillip MacDonald",
        date: "1 year ago",
        content: "The team at the surgery are great. This is my second trip and would highly recommend anyone else to see the team here. Professional, meticulous, friendly and welcoming.",
        rating: 5
      },
      {
        name: "Roisin Mackenzie",
        date: "1 year ago",
        content: "Excellent service from the Harley Street team in London for 2 cyst removals. All staff were friendly and welcoming including surgeon (Dr Kabeya) and Fraser. Procedure was painfree. Stitches healed up really well and I'm really happy with how it looks.",
        rating: 5
      },
      {
        name: "Steve Rudland",
        date: "1 year ago",
        content: "Excellent service. Very skilled surgeon. No fuss. Very efficient admin and no price creep.",
        rating: 5
      },
      {
        name: "Kathryn McVey",
        date: "1 year ago",
        content: "Absolutely blown away with the service. Could not recommend Harley Street Medics enough! They were super kind and supportive from beginning to end.",
        rating: 5
      }
    ],
    webhooks: {
      form: {
        'Warts Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/zpa5nc8IINTWoZzB6azW',
        'Genital Warts Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/913esX2WbVIxPTLPcdeU',
        'Verruca Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/pJYCVhM1TGW7MjcLxMNO',
        'Skin Tag Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/xqSdhHHkIenm59SffD9Z',
        'Anal Skin Tag Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/ZGmLJjneN1ehPfCsdSWX',
        'Mole Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/hSY3FKpJzscKFlQD9S7u',
        'Cyst Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/NTlpN1cCkg5OkWEnfuUr',
        'Lipoma Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/TzbLHg71GNgTqEHBcXUV',
        'Ganglion Cyst Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/XW3C7S0D1u15VVdbfWXH',
      },
      agent: {
        'general': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/s9XBN0fmOz7Kt9GIG351',
        'verruca': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/mid8AoAJD7kab7s7DdGE',
        'genital': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/e3bUpVvCkQRnwsEkod1D',
        'skintag': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/DsNJdfhPgE2GiGFJSgN2',
        'analskintag': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/J6DViWpi9H1p22PGKoZ2',
        'mole': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/Lq2G7TEQf3i75n6aN7gy',
        'cyst': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/YNzqONrdDUjoe1ICerah',
        'lipoma': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/9ZEgACXOAeLL3lLYgTLQ',
        'ganglion': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/GlBsKPoMIk0SnLWfkGgR',
      }
    }
  },
  glasgow: {
    id: 'glasgow',
    city: 'Glasgow',
    clinicName: 'Harley Street Medics Glasgow',
    address: 'Glasgow Day Surgery Centre, 154 Clyde Street, G1 4EX',
    phone: '0141 488 8985',
    whatsapp: '0141 488 8985',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2239.4366323065437!2d-4.2521816!3d55.8550905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4888473b07208639%3A0x1ad5dc1b4f68112e!2sHarley%20Street%20Medics!5e0!3m2!1sen!2s!4v1767254106397!5m2!1sen!2s',
    heroTitle: 'Wart Removal Glasgow',
    heroSubtitle: "Worried about a mole? We offer Glasgow's most advanced mole removal and checking services.",
    doctors: [
      {
        name: "Dr. Khalil Al-Nakib",
        title: "Board Certified Plastic Surgeon",
        description: "A double board-certified plastic surgeon with over 20 years of experience in complex reconstructive and aesthetic procedures. Expert in scar-free excision.",
        image: "https://images-strategyguys.netlify.app/harley-street-wellness-main/dr%20khalil%20al%20nakib.webp"
      },
      {
        name: "Dr. Ayda Soltanzadeh",
        title: "Board Certified Dermatologist",
        description: "Specialist in laser dermatology and skin pathology. Dr. Soltanzadeh combines medical precision with aesthetic care to treat stubborn verrucas and warts.",
        image: "https://images-strategyguys.netlify.app/harley-street-wellness-main/dr.%20ayda%20soltanzadeh.webp"
      },
      {
        name: "Dr. Ala Sakr",
        title: "Board Certified Dermatologist",
        description: "Renowned for his work in dermatological surgery and mucosal treatments. Dedicated to providing discreet and effective care for sensitive conditions.",
        image: "https://images-strategyguys.netlify.app/harley-street-wellness-main/dr%20ala%20sakr.webp"
      }
    ],
    reviews: [
      {
        name: "Phillip MacDonald",
        date: "1 year ago",
        content: "The team at the surgery are great. This is my second trip and would highly recommend anyone else to see the team here. Professional, meticulous, friendly and welcoming.",
        rating: 5
      },
      {
        name: "Roisin Mackenzie",
        date: "1 year ago",
        content: "Excellent service from the Harley Street team in Glasgow for 2 cyst removals. All staff were friendly and welcoming including surgeon (Dr Kabeya) and Fraser. Procedure was painfree. Stitches healed up really well and I'm really happy with how it looks.",
        rating: 5
      },
      {
        name: "Steve Rudland",
        date: "1 year ago",
        content: "Excellent service. Very skilled surgeon. No fuss. Very efficient admin and no price creep.",
        rating: 5
      },
      {
        name: "Kathryn McVey",
        date: "1 year ago",
        content: "Absolutely blown away with the service. Could not recommend Harley Street Medics enough! They were super kind and supportive from beginning to end.",
        rating: 5
      }
    ],
    webhooks: {
      form: {
        'Warts Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/NjrTANqQtrgMk7FyXx2X',
        'Genital Warts Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/h6fxPwa5piIH0nhtjcVL',
        'Verruca Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/qTRCmMTmmvzZWsThuw5L',
        'Skin Tag Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/HeWOt7r5X1B5E6APai83',
        'Anal Skin Tag Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/a3clwZfVL8GHNBWQ8RYY',
        'Mole Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/j84CHeM7wLGsGYPiwqc5',
        'Cyst Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/jppMj42SGxI5wfxqQrjq',
        'Lipoma Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/sgx33cQ13RCHVE2JLVBS',
      },
      agent: {
        'general': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/31f48350-76cc-4bd6-8703-c5e964609b5c',
        'genital': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/3a8532fb-dc6b-4ad1-91b1-b7e82899e74f',
        'verruca': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/b7874daf-9057-4220-be5d-d6a2da87146c',
        'mole': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/2368349d-bfa7-4a1c-9a26-8498c3c3985b',
        'skintag': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/e40236e4-67ea-4590-84dd-8fb375feeeed',
        'analskintag': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/de0b4ae1-b049-41bf-92d4-474f15e25b12',
        'cyst': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/170377de-64c0-4591-bd2f-37ada1ec4559',
        'lipoma': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/be7b91bc-c243-4f56-8db2-358c97744b29',
        'ganglion': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/GlBsKPoMIk0SnLWfkGgR',
      }
    }
  }
};
