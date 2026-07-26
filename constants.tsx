
import { Testimonial, FAQItem } from './types';

/**
 * FAQ and review copy is identical across clinics apart from the city name and
 * the lead surgeon, so it is templated here rather than duplicated per location.
 * Call these with values from `locations[locationId]` so every clinic renders
 * its own city, doctors and pricing context.
 */

export const getGeneralFaqs = (city: string): FAQItem[] => [
  {
    question: `Where can I find professional wart removal near me in ${city}?`,
    answer: `Harley Street Medics is conveniently located in ${city} city center. We are the leading clinic for 'wart removal near me', serving patients from across ${city} and surrounding areas with advanced laser treatments.`
  },
  {
    question: `Why choose Harley Street Medics for wart removal in ${city}?`,
    answer: `We offer ${city}'s most advanced wart removal treatments, including our Signature Laser Clearance and Prevention Program. Unlike home remedies, our medical-grade procedures are designed to completely eliminate warts and prevent reoccurrence.`
  },
  {
    question: "What are warts and verrucas, and what causes them?",
    answer: `Warts and verrucas are bacterial skin growths caused by the human papillomavirus (HPV). Our ${city} clinic treats all types, including common warts, plantar warts (verrucas), and filiform warts.`
  },
  {
    question: "How does laser wart removal work?",
    answer: `Our specialized laser targets the blood supply feeding the wart, destroying the virus at its root. This makes it one of the most effective methods for wart removal in ${city}, with high success rates.`
  },
  {
    question: "How much does wart removal cost in the UK?",
    answer: `Costs vary depending on the method. At our ${city} clinic, professional wart removal starts from £149. We offer transparent pricing for all our standard and advanced laser options.`
  }
];

export const getGenitalFaqs = (city: string): FAQItem[] => [
  {
    question: "Is genital wart removal confidential?",
    answer: `Absolutely. We understand the sensitive nature of genital warts. Our ${city} clinic provides a strictly confidential, non-judgmental environment for genital wart removal, prioritizing your privacy and comfort.`
  },
  {
    question: "What is the best treatment for genital wart removal?",
    answer: "We recommend our Precision Mucosal Laser for genital wart removal. It is designed for sensitive skin, offering a fast, effective, and minimally invasive solution to clear warts without causing extensive damage to healthy tissue."
  },
  {
    question: `Can I get same-day genital wart removal in ${city}?`,
    answer: `Yes, we often offer same-day consultations and treatments. If you are looking for 'genital wart removal near me' or in ${city}, contact us immediately to check availability for urgent care.`
  },
  {
    question: "Does the treatment prevent genital warts from coming back?",
    answer: "Our Signature Laser treatment includes a Prevention Protocol that targets the viral reservoir in the surrounding skin, significantly reducing the risk of recurrence compared to standard freezing creams."
  }
];

export const getVerrucaFaqs = (city: string): FAQItem[] => [
  {
    question: `What is the most effective verruca removal in ${city}?`,
    answer: `For stubborn verrucas that resist over-the-counter treatments, our Deep-Pulse Laser Therapy is generally considered the most effective verruca removal option in ${city}. It penetrates deep into the plantar skin to destroy the root.`
  },
  {
    question: "What is the difference between a wart and a verruca?",
    answer: `A verruca is simply a wart found on the sole of the foot. They are often flatter and more painful due to walking pressure. Our verruca removal ${city} services are specifically tailored to treat these deep-rooted growths.`
  },
  {
    question: "Is verruca removal painful?",
    answer: "Deep verrucas can be tender, but we use local anesthesia for our surgical and deep laser treatments to ensure your verruca removal experience is as comfortable as possible."
  },
  {
    question: "Do you treat children for verruca removal?",
    answer: "Yes, we treat patients of all ages. If you are looking for verruca removal near me for your child, our team is experienced in providing gentle, effective care for younger patients."
  }
];

export const getSkinTagFaqs = (city: string): FAQItem[] => [
  {
    question: `Where can I get expert skin tag removal near me in ${city}?`,
    answer: `Harley Street Medics offers premium skin tag removal at our ${city} city center clinic. We use advanced laser technology for 'near me' convenience with world-class results.`
  },
  {
    question: `How much does skin tag removal cost in ${city}?`,
    answer: `Our skin tag removal in ${city} starts from £150. We offer clear, transparent pricing and a free initial consultation to assess your needs.`
  },
  {
    question: "Is laser skin tag removal better than freezing?",
    answer: "Yes, our Signature Laser treatment is generally superior to freezing (cryotherapy) for skin tags, as it instantly vaporizes the stalk with minimal risk of scarring or pigmentation changes."
  },
  {
    question: `Can I get same-day skin tag removal in ${city}?`,
    answer: "Yes, we prioritize 'same day skin tag removal' appointments. You can often have your consultation and treatment in a single 30-minute visit."
  }
];

export const getAnalSkinTagFaqs = (city: string): FAQItem[] => [
  {
    question: "Is anal skin tag removal painful?",
    answer: "We use local anesthesia to ensuring the procedure is completely pain-free. Post-procedure discomfort is minimal and manageable."
  },
  {
    question: "How long is the recovery for anal skin tag removal?",
    answer: "Most patients return to normal activities within 24-48 hours. Complete healing takes 1-2 weeks."
  },
  {
    question: `Is the consultation at your ${city} clinic confidential?`,
    answer: "Absolutely. We provide a discreet, non-judgmental environment for all our patients."
  }
];

export const getCystFaqs = (city: string, leadDoctor: string): FAQItem[] => [
  {
    question: `Where can I find cyst removal near me in ${city}?`,
    answer: `Harley Street Medics is centrally located in ${city}, making us the top choice for 'cyst removal near me'. Our clinic offers same-day diagnosis and removal for sebaceous and epidermoid cysts.`
  },
  {
    question: `Who is the best doctor for cyst removal in ${city}?`,
    answer: `Our clinic is led by top-tier dermatologists and plastic surgeons, including ${leadDoctor}. We are widely considered the best doctors for cyst removal due to our scar-minimizing surgical techniques and complete sac removal guarantee.`
  },
  {
    question: `How much does cyst removal cost in ${city}?`,
    answer: `Private cyst removal at our ${city} clinic starts from £350. This includes surgical excision, local anesthesia, and follow-up care. We provide a fixed-price quote during your free consultation.`
  },
  {
    question: "Can I get cyst removal on the NHS?",
    answer: "The NHS considers most cysts cosmetic and rarely funds their removal unless infected or causing significant pain. Waiting lists can be over 18 months. Our private service offers immediate removal with no wait times."
  },
  {
    question: "Do you remove the cyst sac?",
    answer: "Yes. Simply popping a cyst leaves the sac behind, leading to regrowth. Our surgical excision completely removes the cyst sac (capsule) to ensure it does not come back."
  }
];

export const getGanglionFaqs = (city: string, leadDoctor: string): FAQItem[] => [
  {
    question: `Where can I get a ganglion cyst removed in ${city}?`,
    answer: `Harley Street Medics treats ganglion cysts at our ${city} clinic. We offer both needle aspiration and full surgical excision, with same-week appointments and no NHS waiting list.`
  },
  {
    question: `Who performs ganglion cyst surgery in ${city}?`,
    answer: `Ganglion excisions at our ${city} clinic are performed by our senior surgical team, including ${leadDoctor}, using techniques that remove the cyst stalk to minimize recurrence.`
  },
  {
    question: "Should I have my ganglion aspirated or surgically removed?",
    answer: "Aspiration drains the fluid and is less invasive, but the cyst returns in a significant number of cases. Surgical excision removes the sac and its root, and is the recommended option for painful or persistent ganglions."
  },
  {
    question: `How much does ganglion cyst removal cost in ${city}?`,
    answer: `Surgical removal at our ${city} clinic starts from £495, covering the assessment, the procedure under local anesthetic, and follow-up care.`
  },
  {
    question: "Is ganglion cyst removal painful?",
    answer: "The procedure is performed under local anesthetic, so you will not feel pain during the removal. Mild soreness for a few days afterwards is normal and managed with simple pain relief."
  }
];

export const getLipomaFaqs = (city: string): FAQItem[] => [
  {
    question: "How are lipomas removed?",
    answer: "Lipomas are removed via a small incision under local anesthesia. The fatty lump is essentially popped out and the skin sutured."
  },
  {
    question: "Is lipoma removal covered by insurance?",
    answer: "We are a private clinic, but many insurance providers do cover lipoma removal. We can provide invoices for your claim."
  },
  {
    question: "What are lipoma dissolving injections?",
    answer: "For suitable candidates, we can inject a fat-dissolving solution into small lipomas. This leads to gradual shrinkage and potentially the complete elimination of the lump without surgery."
  },
  {
    question: "Is there downtime after lipoma removal?",
    answer: "Most patients return to their normal activities within a few days. Surgical excision may require keeping the area clean, while injections have practically zero downtime."
  },
  {
    question: `How much does lipoma removal cost in ${city}?`,
    answer: `Pricing at our ${city} clinic starts from £495, which covers the assessment and the procedure itself.`
  }
];

export const getMoleFaqs = (city: string): FAQItem[] => [
  {
    question: `How much does mole removal cost in ${city}?`,
    answer: "Our mole removal starts from £250. This depends on the method (Laser, Shave, or Excision). We offer a free initial consultation to give you an exact quote."
  },
  {
    question: "Is laser mole removal safe?",
    answer: "Yes, our Signature Laser technique is extremely safe and precise. It is ideal for benign moles where cosmetic result is the priority as it leaves minimal to no scarring."
  },
  {
    question: `Do you offer melanoma checks in ${city}?`,
    answer: "Yes, we provide comprehensive mole checks. If a mole looks suspicious (ABCD criteria), we can perform a biopsy or histopathology to rule out melanoma or other skin cancers."
  },
  {
    question: "Will there be a scar after mole removal?",
    answer: "Our goal is always minimal scarring. Laser removal typically leaves the best cosmetic result. Surgical excision will leave a small linear scar, which fades significantly over time."
  },
  {
    question: "Can I get mole removal on the NHS?",
    answer: "The NHS generally does not remove benign moles for cosmetic reasons. We offer immediate private removal for any mole that is bothering you."
  }
];

/**
 * Skin tag pages show treatment-specific testimonials rather than the clinic's
 * general reviews, so they are templated here instead of living in locations.ts.
 */
export const getSkinTagReviews = (city: string): Testimonial[] => [
  {
    name: "Sarah Jenkins",
    date: "2 months ago",
    content: "I had several skin tags on my neck that made me self-conscious. Dr. Ayda removed them in minutes with the laser. Completely painless and healed perfectly!",
    rating: 5
  },
  {
    name: "David Ross",
    date: "1 month ago",
    content: `Excellent service for skin tag removal in ${city}. No waiting list like the NHS. Worth every penny for the confidence boost.`,
    rating: 5
  },
  {
    name: "Emma Wilson",
    date: "3 weeks ago",
    content: "Unbelievable results. I was worried about scarring but you can't even tell where they were. Highly recommend the laser treatment.",
    rating: 5
  },
  {
    name: "James Miller",
    date: "5 months ago",
    content: "Very professional clinic. The doctor explained everything clearly. The cauterization was quick and effective.",
    rating: 5
  }
];
