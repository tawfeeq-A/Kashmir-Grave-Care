import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChevronRight, ChevronLeft, Check, Sparkles, Calendar, User, MapPin, ClipboardCheck, ArrowRight, Heart } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { supabase } from "@/lib/supabase";
import ScrollReveal from "@/components/ScrollReveal";

export default function Contact() {
  const router = useRouter();
  const { settings } = useSite();
  const content = settings?.content_json || {};
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    package: "Routine Care (Standard)",
    frequency: "annual",
    deceasedName: "",
    deceasedYear: "",
    cemetery: "Malkhah Cemetery, Srinagar",
    customCemetery: "",
    landmarks: "",
    applicantName: "",
    relationship: "",
    email: "",
    phone: "",
    country: "United States",
    notes: "",
  });

  // Load query params if passed from services page
  useEffect(() => {
    if (router.isReady) {
      const queryPackage = router.query.package as string;
      const queryCycle = router.query.cycle as string;
      if (queryPackage) {
        setFormData((prev) => ({ ...prev, package: queryPackage }));
      }
      if (queryCycle) {
        setFormData((prev) => ({
          ...prev,
          frequency: queryCycle === "one-time" ? "one-time" : queryCycle === "quarterly" ? "quarterly" : "annual",
        }));
      }
    }
  }, [router.isReady, router.query]);

  // Per-field length caps to prevent oversized payloads reaching Supabase
  const FIELD_LIMITS: Record<string, number> = {
    deceasedName: 120,
    deceasedYear: 40,
    customCemetery: 160,
    landmarks: 500,
    applicantName: 120,
    relationship: 80,
    email: 160,
    phone: 40,
    country: 80,
    notes: 800,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const limit = FIELD_LIMITS[name];
    const safeValue = limit ? value.slice(0, limit) : value;
    setFormData((prev) => ({ ...prev, [name]: safeValue }));
  };

  const nextStep = () => {
    // Basic validation per step
    if (step === 2 && !formData.deceasedName) {
      alert("Please enter the name of the deceased loved one.");
      return;
    }
    if (step === 3 && !formData.frequency) {
      alert("Please select a frequency.");
      return;
    }
    setStep((prev) => Math.min(4, prev + 1));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `*New Service Request*
*Service:* ${formData.package}
*Frequency:* ${formData.frequency}

*Deceased Details*
*Name:* ${formData.deceasedName}
*Year:* ${formData.deceasedYear || 'Not specified'}

*Location*
*Cemetery:* ${formData.cemetery === 'Other / Private graveyard' ? formData.customCemetery : formData.cemetery}
*Landmarks:* ${formData.landmarks || 'None'}

*Applicant Details*
*Name:* ${formData.applicantName}
*Relationship:* ${formData.relationship || 'Not specified'}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Country:* ${formData.country}

*Notes:* ${formData.notes || 'None'}`;

    try {
      // Save submission to Supabase first to prevent silent lead loss
      const { error } = await supabase.from('contact_submissions').insert([
        {
          package: formData.package,
          frequency: formData.frequency,
          deceased_name: formData.deceasedName,
          deceased_year: formData.deceasedYear,
          cemetery: formData.cemetery === 'Other / Private graveyard' ? formData.customCemetery : formData.cemetery,
          landmarks: formData.landmarks,
          applicant_name: formData.applicantName,
          relationship: formData.relationship,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          notes: formData.notes
        }
      ]);

      if (error) {
        console.error("Supabase submission error:", error.message);
      }
    } catch (err) {
      console.error("Failed to save lead in database:", err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      const method = settings?.content_json?.form_submit_method || 'whatsapp';
      
      if (method === 'email') {
        const adminEmail = settings?.content_json?.admin_email || '';
        if (adminEmail) {
          window.location.href = `mailto:${adminEmail}?subject=New Booking from ${formData.applicantName}&body=${encodeURIComponent(message)}`;
        } else {
          // If no admin email is configured, fallback to WhatsApp
          const phone = (settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '');
          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        }
      } else {
        const phone = (settings?.whatsapp_number || "917006830501").replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
      }
    }, 800);
  };

  const stepsHeader = [
    { title: "Select Service", icon: Sparkles },
    { title: "Location Details", icon: MapPin },
    { title: "Care Schedule", icon: Calendar },
    { title: "Contact Info", icon: User },
  ];

  return (
    <>
      <Head>
        <title>Book a Service | Grave Care Kashmir</title>
        <meta
          name="description"
          content="Coordinate grave maintenance services or request custom restorations. Use our step-by-step booking portal."
        />
      </Head>

      <div className="bg-background/95 md:bg-background/80 md:backdrop-blur-md pt-28 pb-20 min-h-screen flex flex-col justify-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          {/* Header */}
          <ScrollReveal direction="up">
            <div className="text-center mb-10">
              <h1 className="font-serif text-3xl font-extrabold text-foreground sm:text-4xl">
                {content.contactHeading || "Caretaker Request Portal"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {content.contactSubtext || "Provide details below. Our Srinagar coordinator will inspect the grave site and prepare a visual proposal."}
              </p>
            </div>
          </ScrollReveal>

          {/* Form Container */}
          <ScrollReveal direction="up" delay={0.15}>
            <div className="bg-background border border-border/80 shadow-md rounded-3xl p-6 md:p-10 relative overflow-hidden glass-card">
              {/* Subtle gradient border glow */}
              <div className="absolute -top-px -left-px -right-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              
              {submitted ? (
                /* Success Screen */
                <div className="text-center py-10 space-y-6 animate-fadeInUp">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto border border-primary/20 animate-pulseGlow">
                    <Check className="h-8 w-8 stroke-[3]" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl font-bold text-foreground">
                      Request Lodged Successfully
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Thank you, <span className="font-semibold text-foreground">{formData.applicantName}</span>. Your request for <span className="font-semibold text-foreground">{formData.deceasedName}</span>&apos;s resting place has been received.
                    </p>
                  </div>

                  <div className="bg-secondary/25 p-5 rounded-2xl text-left text-xs space-y-2.5 border border-border/50 max-w-md mx-auto">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chosen Package:</span>
                      <span className="font-semibold">{formData.package}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cemetery Site:</span>
                      <span className="font-semibold">
                        {formData.cemetery === "Other / Private graveyard"
                          ? formData.customCemetery
                          : formData.cemetery}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deceased:</span>
                      <span className="font-semibold">{formData.deceasedName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact Email:</span>
                      <span className="font-semibold">{formData.email}</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground max-w-md mx-auto space-y-4 pt-4">
                    <div className="flex items-start space-x-3 text-left">
                      <span className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                      <p className="text-xs">A Srinagar-based caretaker will visit the cemetery within 48 hours to pinpoint the precise coordinates of the grave.</p>
                    </div>
                    <div className="flex items-start space-x-3 text-left">
                      <span className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                      <p className="text-xs">We will email you the pre-service inspection photos, verify details on WhatsApp, and finalize scheduling.</p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setStep(1);
                        setFormData({
                          package: "Routine Care (Standard)",
                          frequency: "annual",
                          deceasedName: "",
                          deceasedYear: "",
                          cemetery: "Malkhah Cemetery, Srinagar",
                          customCemetery: "",
                          landmarks: "",
                          applicantName: "",
                          relationship: "",
                          email: "",
                          phone: "",
                          country: "United States",
                          notes: "",
                        });
                      }}
                      className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/95 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                /* Multi-step Form */
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step Indicators */}
                  <div className="grid grid-cols-4 gap-2 border-b border-border/40 pb-6">
                    {stepsHeader.map((s, idx) => {
                      const stepNum = idx + 1;
                      const Icon = s.icon;
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center text-center space-y-1.5 transition-all duration-300 ${
                            step >= stepNum ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                              step === stepNum
                                ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                                : step > stepNum
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {step > stepNum ? <Check className="h-4 w-4 stroke-[2.5]" /> : stepNum}
                          </div>
                          <span className="text-[10px] sm:text-xs font-medium hidden sm:inline">{s.title}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Step 1: Package Selection */}
                  {step === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                      <h3 className="text-lg font-bold text-foreground">Step 1: Select Care Package</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          {
                            name: "Routine Care (Standard)",
                            desc: "Bi-monthly cleaning, weeding, grass mowing, and photography reports.",
                          },
                          {
                            name: "Premium Restoration",
                            desc: "Full deep chemical-free scrub, lettering repainting, and turf renovation.",
                          },
                          {
                            name: "Dua & Floral Tribute",
                            desc: "Regular upkeep, general cleaning, and streaming prayer recitations.",
                          },
                          {
                            name: "Custom / Bespoke Care",
                            desc: "Structural repairs, ground leveling, or unique commemorative tributes.",
                          },
                        ].map((pkg) => (
                          <label
                            key={pkg.name}
                            className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-all duration-300 premium-card ${
                              formData.package === pkg.name
                                ? "border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10"
                                : "border-border/80 bg-background hover:border-primary/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name="package"
                              value={pkg.name}
                              checked={formData.package === pkg.name}
                              onChange={handleInputChange}
                              className="mt-1 mr-3 h-4 w-4 text-primary focus:ring-primary accent-primary"
                            />
                            <div>
                              <span className="block font-semibold text-foreground text-sm">{pkg.name}</span>
                              <span className="block text-xs text-muted-foreground mt-0.5">{pkg.desc}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Location and Loved One Details */}
                  {step === 2 && (
                    <div className="space-y-5 animate-fadeIn">
                      <h3 className="text-lg font-bold text-foreground">Step 2: Loved One & Location details</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="deceasedName" className="block text-xs font-semibold text-muted-foreground uppercase">
                            Deceased Loved One&apos;s Name *
                          </label>
                          <input
                            type="text"
                            id="deceasedName"
                            name="deceasedName"
                            value={formData.deceasedName}
                            onChange={handleInputChange}
                            placeholder="e.g. Late Mohammad Amin"
                            className="w-full px-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="deceasedYear" className="block text-xs font-semibold text-muted-foreground uppercase">
                            Year of Demise (Approximate)
                          </label>
                          <input
                            type="text"
                            id="deceasedYear"
                            name="deceasedYear"
                            value={formData.deceasedYear}
                            onChange={handleInputChange}
                            placeholder="e.g. 2012 or Late 90s"
                            className="w-full px-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="cemetery" className="block text-xs font-semibold text-muted-foreground uppercase">
                          Cemetery / Location
                        </label>
                        <select
                          id="cemetery"
                          name="cemetery"
                          value={formData.cemetery}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        >
                          <option value={content.bookingCemetery1 || "Malkhah Cemetery, Srinagar"}>{content.bookingCemetery1 || "Malkhah Cemetery, Srinagar"} (Eidgah/Rainawari)</option>
                          <option value={content.bookingCemetery2 || "Hazratbal Shrine Graveyard"}>{content.bookingCemetery2 || "Hazratbal Shrine Graveyard"}, Srinagar</option>
                          <option value={content.bookingCemetery3 || "Sheikh-ul-Alam Cemetery, Budgam"}>{content.bookingCemetery3 || "Sheikh-ul-Alam Cemetery, Budgam"}</option>
                          <option value={content.bookingCemetery4 || "Naqshband Sahib Cemetery, Srinagar"}>{content.bookingCemetery4 || "Naqshband Sahib Cemetery, Srinagar"}</option>
                          <option value="Other / Private graveyard">Other / Local District Cemetery (Specify below)</option>
                        </select>
                      </div>

                      {formData.cemetery === "Other / Private graveyard" && (
                        <div className="space-y-1.5 animate-fadeIn">
                          <label htmlFor="customCemetery" className="block text-xs font-semibold text-muted-foreground uppercase">
                            Specify Graveyard Name and Tehsil/Village
                          </label>
                          <input
                            type="text"
                            id="customCemetery"
                            name="customCemetery"
                            value={formData.customCemetery}
                            onChange={handleInputChange}
                            placeholder="e.g. Village Graveyard near Masjid, Tral, Pulwama"
                            className="w-full px-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            required
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label htmlFor="landmarks" className="block text-xs font-semibold text-muted-foreground uppercase">
                          Coordinates / Landmarks / Description
                        </label>
                        <textarea
                          id="landmarks"
                          name="landmarks"
                          value={formData.landmarks}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="e.g. Near the large Chinar tree on the south side, or adjacent to the brick wall of the mosque."
                          className="w-full px-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Care Schedule / Frequency */}
                  {step === 3 && (
                    <div className="space-y-6 animate-fadeIn">
                      <h3 className="text-lg font-bold text-foreground">Step 3: Choose Care Cycle</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          {
                            val: "annual",
                            name: "Annual Plan",
                            desc: "Bi-monthly recurring care sessions for ongoing serenity.",
                          },
                          {
                            val: "quarterly",
                            name: "Quarterly Plan",
                            desc: "Four deep care sessions per year timed with seasonal shifts.",
                          },
                          {
                            val: "one-time",
                            name: "One-Time Service",
                            desc: "A single complete restoration assessment and deep clean.",
                          },
                        ].map((freq) => (
                          <label
                            key={freq.val}
                            className={`flex flex-col justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 premium-card ${
                              formData.frequency === freq.val
                                ? "border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10"
                                : "border-border/80 bg-background hover:border-primary/30"
                            }`}
                          >
                            <div className="space-y-2">
                              <input
                                type="radio"
                                name="frequency"
                                value={freq.val}
                                checked={formData.frequency === freq.val}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-primary focus:ring-primary accent-primary self-start"
                              />
                              <div>
                                <span className="block font-semibold text-foreground text-sm">{freq.name}</span>
                                <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">{freq.desc}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Contact & Diaspora Details */}
                  {step === 4 && (
                    <div className="space-y-5 animate-fadeIn">
                      <h3 className="text-lg font-bold text-foreground">Step 4: Applicant & Diaspora details</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="applicantName" className="block text-xs font-semibold text-muted-foreground uppercase">
                            Your Name (Applicant) *
                          </label>
                          <input
                            type="text"
                            id="applicantName"
                            name="applicantName"
                            value={formData.applicantName}
                            onChange={handleInputChange}
                            placeholder="e.g. Tawfeeq Ahmad"
                            className="w-full px-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="relationship" className="block text-xs font-semibold text-muted-foreground uppercase">
                            Relationship to Deceased
                          </label>
                          <input
                            type="text"
                            id="relationship"
                            name="relationship"
                            value={formData.relationship}
                            onChange={handleInputChange}
                            placeholder="e.g. Son, Daughter, Grandchild"
                            className="w-full px-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground uppercase">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g. customer@example.com"
                            className="w-full px-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="phone" className="block text-xs font-semibold text-muted-foreground uppercase">
                            WhatsApp / Phone Number *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="e.g. +44 7911 123456"
                            className="w-full px-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="country" className="block text-xs font-semibold text-muted-foreground uppercase">
                          Your Current Country of Residence
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="e.g. United Kingdom, UAE, United States"
                          className="w-full px-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="notes" className="block text-xs font-semibold text-muted-foreground uppercase">
                          Special requests or custom wishes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="e.g. Please send the photo reports directly to my aunt in Srinagar too, or recite Surah Ya-sin on their anniversary date."
                          className="w-full px-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Form Navigation Controls */}
                  <div className="flex justify-between items-center pt-6 border-t border-border/40 mt-4">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-all hover:-translate-y-0.5"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1.5" /> Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-xs ml-auto hover:-translate-y-0.5 hover:shadow-md"
                      >
                        Continue <ChevronRight className="h-4 w-4 ml-1.5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-6 py-2.5 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Booking Request <Check className="h-4 w-4 ml-1.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
