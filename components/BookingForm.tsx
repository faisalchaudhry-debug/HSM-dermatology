
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, CheckCircle } from 'lucide-react';
import { locations } from '../src/data/locations';

interface BookingFormProps {
  initialTreatment?: string;
  locationId?: 'london' | 'glasgow';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CALENDAR_URL = 'https://link.harleystreetmedics.clinic/widget/bookings/lead-skin-consultant-n';

// Helper to convert treatment name to slug format (e.g., "Warts Removal" -> "warts-removal")
const getTreatmentSlug = (treatment: string): string => {
  return treatment.toLowerCase().replace(/\s+/g, '-');
};

const BookingForm: React.FC<BookingFormProps> = ({
  initialTreatment = 'Warts Removal',
  locationId = 'london',
  isOpen,
  onOpenChange
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    treatment: initialTreatment
  });

  // Generate dynamic form class name based on treatment and location
  const formClassName = `space-y-4 space-y-4-${getTreatmentSlug(initialTreatment)}-${locationId}`;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [internalShowPopup, setInternalShowPopup] = useState(false);

  const showCalendarPopup = isOpen !== undefined ? isOpen : internalShowPopup;

  const setShowCalendarPopup = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalShowPopup(open);
    }
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, treatment: initialTreatment }));
  }, [initialTreatment]);

  // Fallback map if location data is missing (e.g. during initial render or error)
  const defaultWebhooks: Record<string, string> = {
    'Warts Removal': 'https://services.leadconnectorhq.com/hooks/Q7V3TZrLpPnz6GYN6Qyt/webhook-trigger/NjrTANqQtrgMk7FyXx2X'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const locationData = locations[locationId];
      // Lookup URL from location data, fall back to London/Generic if specific one is missing
      const treatmentKey = formData.treatment;

      // Safety check: sometimes locationData might be undefined if key is wrong
      const webhooks = locationData?.webhooks?.form;

      const webhookUrl = webhooks?.[treatmentKey] ||
        webhooks?.['Warts Removal'] ||
        defaultWebhooks['Warts Removal'];

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          treatment: formData.treatment,
          location: locationId, // Added location field to payload
          source: 'Website Form',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSubmitStatus('success');

        // Push event to GTM dataLayer
        window.dataLayer = window.dataLayer || [];
        const gtmEventData = {
          event: 'form_submit',
          formLocation: locationId,
          formTreatment: formData.treatment,
          formClass: formClassName
        };
        window.dataLayer.push(gtmEventData);
        console.log('GTM Event Pushed:', gtmEventData);

        setShowCalendarPopup(true);
        setFormData({ name: '', email: '', phone: '', treatment: initialTreatment });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showCalendarPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; // or '' to reset
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showCalendarPopup]);

  const closeCalendarPopup = () => {
    setShowCalendarPopup(false);
  };

  return (
    <>
      {/* Calendar Popup Modal */}
      {showCalendarPopup && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeCalendarPopup}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-neutral-900 border border-amber-500/50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-4 sm:p-6">
              <button
                onClick={closeCalendarPopup}
                className="absolute top-4 right-4 text-black/70 hover:text-black transition-colors"
              >
                <X size={28} />
              </button>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-black/20 p-2 sm:p-3 rounded-full">
                  <CheckCircle size={24} className="sm:w-8 sm:h-8 text-black" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif text-black font-bold">Thank You!</h2>
                  <p className="text-black/80 text-xs sm:text-sm">Your request has been submitted successfully</p>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="p-4 sm:p-6 bg-neutral-800 border-b border-neutral-700">
              <div className="flex items-start gap-4">
                <Calendar size={24} className="text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Book Your Appointment Now</h3>
                  <p className="text-neutral-400 text-sm">
                    Would you like to schedule your free consultation right away?
                    Select a convenient time slot from the calendar below, or our team will contact you within 24 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Calendar iframe */}
            <div className="h-[300px] sm:h-[400px] md:h-[500px] bg-white">
              <iframe
                src={CALENDAR_URL}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Book Appointment"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 bg-neutral-800 border-t border-neutral-700 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
              <p className="text-neutral-500 text-[10px] sm:text-xs text-center sm:text-left">
                Can't find a suitable time? We'll call you within 24 hours.
              </p>
              <button
                onClick={closeCalendarPopup}
                className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Form Section */}
      <div className="bg-neutral-900 border border-amber-500/30 p-8 rounded-lg shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 gold-gradient opacity-70 group-hover:opacity-100 transition-opacity"></div>

        <h3 className="text-2xl font-serif text-amber-500 mb-2">Book Your Free Tele-Consultation</h3>
        <p className="text-neutral-400 text-sm mb-6 font-light uppercase tracking-widest">{locationId === 'glasgow' ? 'Glasgow' : 'London'} Skin Clinic</p>

        {submitStatus === 'success' && !showCalendarPopup && (
          <div className="mb-4 p-4 bg-green-900/50 border border-green-500/50 rounded text-green-400 text-sm">
            ✓ Thank you! Your booking request has been submitted. Our team will contact you shortly.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500/50 rounded text-red-400 text-sm">
            ✗ Something went wrong. Please try again or call us directly.
          </div>
        )}

        <form onSubmit={handleSubmit} className={formClassName}>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1 ml-1">Name</label>
            <input
              type="text"
              required
              className="w-full bg-black border border-neutral-800 focus:border-amber-500/50 outline-none p-3 text-white transition-all rounded"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1 ml-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-black border border-neutral-800 focus:border-amber-500/50 outline-none p-3 text-white transition-all rounded"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1 ml-1">Phone</label>
            <input
              type="tel"
              required
              className="w-full bg-black border border-neutral-800 focus:border-amber-500/50 outline-none p-3 text-white transition-all rounded"
              placeholder="+44 0000 000000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1 ml-1">Treatment Interest</label>
            <select
              className="w-full bg-black border border-neutral-800 focus:border-amber-500/50 outline-none p-3 text-white transition-all rounded"
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              disabled={isSubmitting}
            >
              <option value="Warts Removal">Warts Removal</option>
              <option value="Verruca Removal">Verruca Removal</option>
              <option value="Skin Tag Removal">Skin Tag Removal</option>
              <option value="Anal Skin Tag Removal">Anal Skin Tag Removal</option>
              <option value="Mole Removal">Mole Removal</option>
              <option value="Cyst Removal">Cyst Removal</option>
              <option value="Lipoma Removal">Lipoma Removal</option>
              <option value="Genital Warts Removal">Genital Warts Removal</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full gold-gradient text-black font-bold py-4 px-6 rounded hover:brightness-110 transition-all transform active:scale-[0.98] uppercase tracking-widest text-sm ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-neutral-500">
          By submitting, you agree to our privacy policy and terms of service.
        </p>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default BookingForm;
