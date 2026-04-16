"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  User,
  FileText,
  CreditCard,
  CheckCircle2,
  Trash2,
  Upload,
  X,
  AlertCircle,
  Lock,
  Building2,
  GraduationCap,
  Clock,
  Banknote,
  Shield,
  Info,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Hash,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  useApplicationCart,
  SERVICE_FEE,
  MAX_APPLICATIONS,
} from "@/hooks/useApplicationCart";
import { cn } from "@/utils/cn";

// ─── University application fee reference ─────────────────────────────────
const UNI_APP_FEES: Record<string, { fee: number; note: string }> = {
  uct: { fee: 100, note: "Paid directly to UCT" },
  wits: { fee: 100, note: "Paid directly to Wits" },
  up: { fee: 0, note: "Free application" },
  stellenbosch: { fee: 100, note: "Paid directly to SU" },
  uj: { fee: 200, note: "Paid directly to UJ" },
  ukzn: { fee: 0, note: "Free application" },
  nwu: { fee: 0, note: "Free application" },
  unisa: { fee: 0, note: "Free application" },
  tut: { fee: 0, note: "Free application" },
  ufs: { fee: 0, note: "Free application" },
  rhodes: { fee: 100, note: "Paid directly to Rhodes" },
  cput: { fee: 0, note: "Free application" },
  dut: { fee: 0, note: "Free application" },
  uwc: { fee: 100, note: "Paid directly to UWC" },
};

const STEPS = [
  { id: "cart", label: "Your Applications", icon: ShoppingCart },
  { id: "personal", label: "Personal Info", icon: User },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "done", label: "Confirmed", icon: CheckCircle2 },
];

interface PersonalInfo {
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelationship: string;
}

interface UploadedDoc {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

interface Documents {
  matricResults?: UploadedDoc;
  idDocument?: UploadedDoc;
  proofOfAddress?: UploadedDoc;
  passport?: UploadedDoc;
}

const REQUIRED_DOCS = [
  {
    key: "matricResults" as keyof Documents,
    label: "Matric Results / Statement of Results",
    required: true,
    hint: "Your latest school report or NSC results",
  },
  {
    key: "idDocument" as keyof Documents,
    label: "South African ID Document / Smart Card",
    required: true,
    hint: "Clear copy of both sides",
  },
  {
    key: "proofOfAddress" as keyof Documents,
    label: "Proof of Address",
    required: true,
    hint: "Utility bill or bank statement (not older than 3 months)",
  },
  {
    key: "passport" as keyof Documents,
    label: "Passport Photo",
    required: false,
    hint: "Recent passport-size photo (optional but recommended)",
  },
];

const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatZAR(n: number) {
  return `R ${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

// ─── Demo payment simulation ──────────────────────────────────────────────────
function simulatePayment(
  cardNumber: string,
  expiry: string,
  cvv: string,
): Promise<{ success: boolean; ref: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Fail specific test card
      if (cardNumber.replace(/\s/g, "").startsWith("4000000000000002")) {
        resolve({ success: false, ref: "" });
      } else {
        resolve({
          success: true,
          ref: `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        });
      }
    }, 2200);
  });
}

export default function ApplyPage() {
  const router = useRouter();
  const { items, removeItem, clearCart } = useApplicationCart();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    idNumber: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    guardianName: "",
    guardianPhone: "",
    guardianRelationship: "",
  });

  const [documents, setDocuments] = useState<Documents>({});
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [appRef, setAppRef] = useState("");

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const total = SERVICE_FEE;

  const updateField = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo((p) => ({ ...p, [field]: value }));
  };

  const handleDocUpload = (key: keyof Documents, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setDocuments((prev) => ({
        ...prev,
        [key]: {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: e.target?.result as string,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const formatCard = (val: string) => {
    return val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const validateStep = (): boolean => {
    const errs: string[] = [];

    if (step === 0) {
      if (items.length === 0)
        errs.push(
          "Please add at least one application to your cart from the AI Course Finder.",
        );
    }

    if (step === 1) {
      if (!personalInfo.fullName.trim()) errs.push("Full name is required.");
      if (!/^\d{13}$/.test(personalInfo.idNumber.replace(/\s/g, "")))
        errs.push("Enter a valid 13-digit SA ID number.");
      if (!personalInfo.email.includes("@"))
        errs.push("Enter a valid email address.");
      if (personalInfo.phone.replace(/\D/g, "").length < 10)
        errs.push("Enter a valid phone number.");
      if (!personalInfo.address.trim()) errs.push("Address is required.");
      if (!personalInfo.province) errs.push("Province is required.");
    }

    if (step === 2) {
      const requiredMissing = REQUIRED_DOCS.filter(
        (d) => d.required && !documents[d.key],
      );
      if (requiredMissing.length > 0) {
        errs.push(
          `Please upload: ${requiredMissing.map((d) => d.label).join(", ")}`,
        );
      }
    }

    if (step === 3) {
      if (cardNumber.replace(/\s/g, "").length < 16)
        errs.push("Enter a valid 16-digit card number.");
      if (!cardName.trim()) errs.push("Cardholder name is required.");
      if (expiry.length < 5) errs.push("Enter a valid expiry date (MM/YY).");
      if (cvv.length < 3) errs.push("Enter a valid CVV.");
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const handlePayment = async () => {
    if (!validateStep()) return;
    setPaymentLoading(true);
    setPaymentError("");

    try {
      const { success, ref } = await simulatePayment(cardNumber, expiry, cvv);
      if (!success) {
        setPaymentError(
          "Payment declined. Please check your card details and try again.",
        );
        setPaymentLoading(false);
        return;
      }
      setRefNumber(ref);

      // Submit application to API
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalInfo,
          selectedApplications: items.map((i) => ({
            title: i.recommendation.title,
            universityName: i.recommendation.universityName,
            degree: i.recommendation.degree,
            faculty: i.recommendation.faculty,
          })),
          documents: Object.fromEntries(
            Object.entries(documents).map(([k, v]) => [
              k,
              { name: v?.name, size: v?.size },
            ]),
          ),
          paymentRef: ref,
          totalPaid: total,
        }),
      });
      const data = await res.json();
      setAppRef(data.refNumber ?? ref);
      clearCart();
      setStep(4);
    } catch {
      setPaymentError("An error occurred. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step === 3) {
      handlePayment();
    } else {
      setErrors([]);
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Back */}
        {step < 4 && (
          <Link
            href="/results"
            className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#CAFF00] transition-colors mb-8"
          >
            <ArrowLeft size={15} /> Back to Results
          </Link>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            {step === 4 ? "🎉 Application Submitted!" : "Apply for Courses"}
          </h1>
          <p className="text-[#666]">
            {step === 4
              ? "Your application has been received. We'll be in touch within 3 business days."
              : "We handle your university applications for you — one flat fee, no stress."}
          </p>
        </motion.div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center gap-0 mb-10 overflow-x-auto pb-2">
            {STEPS.slice(0, 4).map((s, i) => (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-all",
                    i === step
                      ? "bg-[#CAFF00]/10 text-[#CAFF00]"
                      : i < step
                        ? "text-[#888]"
                        : "text-[#444]",
                  )}
                >
                  <s.icon size={15} />
                  <span className="text-xs font-medium hidden sm:inline whitespace-nowrap">
                    {s.label}
                  </span>
                </div>
                {i < 3 && (
                  <div
                    className={cn(
                      "w-6 h-px mx-1 transition-colors",
                      i < step ? "bg-[#CAFF00]/30" : "bg-white/6",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* ── Main panel ── */}
          <AnimatePresence mode="wait">
            {/* STEP 0: Cart */}
            {step === 0 && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-white mb-2">
                  Your Selected Applications
                </h2>
                <p className="text-sm text-[#666] mb-6">
                  You can apply to up to {MAX_APPLICATIONS} universities. Remove
                  any you don't want.
                </p>

                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart
                      size={40}
                      className="text-[#333] mx-auto mb-4"
                    />
                    <p className="text-[#666] mb-4">No courses selected yet.</p>
                    <Link
                      href="/results"
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      Go choose courses
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item, i) => {
                      const uniId = item.recommendation.universityId;
                      const appFee = UNI_APP_FEES[uniId];
                      return (
                        <motion.div
                          key={item.recommendation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-4 rounded-xl border border-white/8 bg-white/2 flex items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
                              {item.recommendation.emoji}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">
                                {item.recommendation.title}
                              </p>
                              <p className="text-xs text-[#666] flex items-center gap-1 mt-0.5">
                                <Building2 size={10} />
                                {item.recommendation.universityName}
                              </p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[10px] text-[#555] flex items-center gap-1">
                                  <GraduationCap size={9} />
                                  {item.recommendation.degree}
                                </span>
                                <span className="text-[10px] text-[#555] flex items-center gap-1">
                                  <Clock size={9} />
                                  {item.recommendation.duration}
                                </span>
                              </div>
                              {appFee && (
                                <p className="text-[10px] mt-1.5 text-amber-400/80">
                                  ⚠ University fee:{" "}
                                  {appFee.fee === 0 ? "Free" : `R${appFee.fee}`}{" "}
                                  — {appFee.note}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.recommendation.id)}
                            className="p-1.5 rounded-lg text-[#444] hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </motion.div>
                      );
                    })}

                    {/* University fee disclaimer */}
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2">
                      <Info
                        size={14}
                        className="text-amber-400 flex-shrink-0 mt-0.5"
                      />
                      <p className="text-[11px] text-[#777] leading-relaxed">
                        <span className="text-amber-400 font-semibold">
                          Note on university fees:
                        </span>{" "}
                        Some universities charge their own application fee
                        (shown above). These are paid directly to the university
                        and are separate from our service fee. We will guide you
                        through these payments as part of the service.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-white mb-2">
                  Personal Information
                </h2>
                <p className="text-sm text-[#666] mb-6">
                  This information will be used to complete your university
                  applications.
                </p>

                <div className="space-y-5">
                  {/* Student details */}
                  <div>
                    <h3 className="text-xs text-[#555] uppercase tracking-wider mb-3">
                      Student Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-[#777] mb-1.5">
                          Full Name (as on ID) *
                        </label>
                        <div className="relative">
                          <User
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
                          />
                          <input
                            type="text"
                            value={personalInfo.fullName}
                            onChange={(e) =>
                              updateField("fullName", e.target.value)
                            }
                            placeholder="e.g. Sipho Thabo Dlamini"
                            className="input-field pl-9"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-[#777] mb-1.5">
                          SA ID Number *
                        </label>
                        <div className="relative">
                          <Hash
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
                          />
                          <input
                            type="text"
                            value={personalInfo.idNumber}
                            onChange={(e) =>
                              updateField(
                                "idNumber",
                                e.target.value.replace(/\D/g, "").slice(0, 13),
                              )
                            }
                            placeholder="13-digit ID number"
                            className="input-field pl-9 font-mono"
                            maxLength={13}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-[#777] mb-1.5">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          value={personalInfo.dateOfBirth}
                          onChange={(e) =>
                            updateField("dateOfBirth", e.target.value)
                          }
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#777] mb-1.5">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
                          />
                          <input
                            type="email"
                            value={personalInfo.email}
                            onChange={(e) =>
                              updateField("email", e.target.value)
                            }
                            placeholder="you@email.com"
                            className="input-field pl-9"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-[#777] mb-1.5">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
                          />
                          <input
                            type="tel"
                            value={personalInfo.phone}
                            onChange={(e) =>
                              updateField("phone", e.target.value)
                            }
                            placeholder="e.g. 082 000 0000"
                            className="input-field pl-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-xs text-[#555] uppercase tracking-wider mb-3">
                      Home Address
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-[#777] mb-1.5">
                          Street Address *
                        </label>
                        <div className="relative">
                          <MapPin
                            size={14}
                            className="absolute left-3 top-3 text-[#555]"
                          />
                          <input
                            type="text"
                            value={personalInfo.address}
                            onChange={(e) =>
                              updateField("address", e.target.value)
                            }
                            placeholder="e.g. 12 Mthembu Street"
                            className="input-field pl-9"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-[#777] mb-1.5">
                          City/Town *
                        </label>
                        <input
                          type="text"
                          value={personalInfo.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          placeholder="e.g. Durban"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#777] mb-1.5">
                          Province *
                        </label>
                        <select
                          value={personalInfo.province}
                          onChange={(e) =>
                            updateField("province", e.target.value)
                          }
                          className="input-field"
                        >
                          <option value="">Select province</option>
                          {SA_PROVINCES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-[#777] mb-1.5">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={personalInfo.postalCode}
                          onChange={(e) =>
                            updateField(
                              "postalCode",
                              e.target.value.replace(/\D/g, "").slice(0, 4),
                            )
                          }
                          placeholder="e.g. 4001"
                          className="input-field font-mono"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guardian */}
                  <div>
                    <h3 className="text-xs text-[#555] uppercase tracking-wider mb-3">
                      Parent / Guardian (Optional but Recommended)
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[#777] mb-1.5">
                          Guardian Full Name
                        </label>
                        <input
                          type="text"
                          value={personalInfo.guardianName}
                          onChange={(e) =>
                            updateField("guardianName", e.target.value)
                          }
                          placeholder="e.g. Nomvula Dlamini"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#777] mb-1.5">
                          Guardian Phone
                        </label>
                        <input
                          type="tel"
                          value={personalInfo.guardianPhone}
                          onChange={(e) =>
                            updateField("guardianPhone", e.target.value)
                          }
                          placeholder="e.g. 071 000 0000"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#777] mb-1.5">
                          Relationship
                        </label>
                        <select
                          value={personalInfo.guardianRelationship}
                          onChange={(e) =>
                            updateField("guardianRelationship", e.target.value)
                          }
                          className="input-field"
                        >
                          <option value="">Select relationship</option>
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Grandmother">Grandmother</option>
                          <option value="Grandfather">Grandfather</option>
                          <option value="Aunt">Aunt</option>
                          <option value="Uncle">Uncle</option>
                          <option value="Guardian">Legal Guardian</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Documents */}
            {step === 2 && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-white mb-2">
                  Upload Documents
                </h2>
                <p className="text-sm text-[#666] mb-6">
                  Upload clear copies of your documents. Accepted formats: PDF,
                  JPG, PNG (max 5MB each).
                </p>

                <div className="space-y-4">
                  {REQUIRED_DOCS.map((doc) => {
                    const uploaded = documents[doc.key];
                    return (
                      <div key={doc.key}>
                        <div className="flex items-start justify-between mb-1.5">
                          <label className="text-sm text-white font-medium">
                            {doc.label}{" "}
                            {doc.required && (
                              <span className="text-red-400 ml-0.5">*</span>
                            )}
                          </label>
                          {!doc.required && (
                            <span className="text-[10px] text-[#555] bg-white/5 px-2 py-0.5 rounded-full">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#555] mb-2">
                          {doc.hint}
                        </p>

                        {uploaded ? (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-[#CAFF00]/5 border border-[#CAFF00]/20">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#CAFF00]/10 flex items-center justify-center">
                                <FileText
                                  size={14}
                                  className="text-[#CAFF00]"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-white font-medium truncate max-w-[200px]">
                                  {uploaded.name}
                                </p>
                                <p className="text-[10px] text-[#555]">
                                  {formatSize(uploaded.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                setDocuments((prev) => {
                                  const next = { ...prev };
                                  delete next[doc.key];
                                  return next;
                                })
                              }
                              className="p-1.5 rounded-lg text-[#444] hover:text-red-400 hover:bg-red-400/10 transition-all"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              fileInputRefs.current[doc.key]?.click()
                            }
                            className="w-full border-2 border-dashed border-white/10 hover:border-[#CAFF00]/30 rounded-xl p-5 text-center transition-all group"
                          >
                            <Upload
                              size={20}
                              className="mx-auto mb-2 text-[#444] group-hover:text-[#CAFF00] transition-colors"
                            />
                            <p className="text-xs text-[#666] group-hover:text-[#999] transition-colors">
                              Click to upload or drag & drop
                            </p>
                          </button>
                        )}

                        <input
                          ref={(el) => {
                            fileInputRefs.current[doc.key] = el;
                          }}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocUpload(doc.key, file);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Security note */}
                <div className="mt-6 p-3 rounded-xl bg-white/3 border border-white/5 flex items-start gap-2">
                  <Shield
                    size={14}
                    className="text-[#CAFF00] flex-shrink-0 mt-0.5"
                  />
                  <p className="text-[11px] text-[#666] leading-relaxed">
                    Your documents are encrypted and stored securely. They will
                    only be used for your university application submissions and
                    deleted after 90 days.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-6 sm:p-8"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-white">Payment</h2>
                  <span className="text-[10px] bg-[#CAFF00]/10 text-[#CAFF00] border border-[#CAFF00]/20 px-2 py-0.5 rounded-full font-semibold">
                    DEMO MODE
                  </span>
                </div>
                <p className="text-sm text-[#666] mb-6">
                  This is a demo payment. Use any card number except{" "}
                  <span className="font-mono text-[#CAFF00]">
                    4000 0000 0000 0002
                  </span>{" "}
                  to simulate success.
                </p>

                {/* Order summary in payment */}
                <div className="p-4 rounded-xl bg-white/3 border border-white/5 mb-6">
                  <p className="text-xs text-[#555] uppercase tracking-wider mb-3">
                    Order Summary
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#888]">
                        PathFinder SA Application Service
                      </span>
                      <span className="text-white font-semibold">
                        {formatZAR(SERVICE_FEE)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#888]">
                        Universities ({items.length})
                      </span>
                      <span className="text-[#666]">
                        {items
                          .map((i) => i.recommendation.universityName)
                          .join(", ")}
                      </span>
                    </div>
                    <div className="border-t border-white/5 pt-2 mt-2 flex justify-between">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-[#CAFF00] font-bold text-lg">
                        {formatZAR(SERVICE_FEE)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#777] mb-1.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
                      />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCard(e.target.value))
                        }
                        placeholder="0000 0000 0000 0000"
                        className="input-field pl-9 font-mono tracking-wider"
                        maxLength={19}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#777] mb-1.5">
                      Cardholder Name
                    </label>
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
                      />
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on card"
                        className="input-field pl-9 uppercase"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#777] mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) =>
                          setExpiry(formatExpiry(e.target.value))
                        }
                        placeholder="MM/YY"
                        className="input-field font-mono"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#777] mb-1.5">
                        CVV
                      </label>
                      <div className="relative">
                        <Lock
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
                        />
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 4),
                            )
                          }
                          placeholder="•••"
                          className="input-field pl-9 font-mono"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {paymentError && (
                  <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle
                      size={14}
                      className="text-red-400 flex-shrink-0"
                    />
                    <p className="text-xs text-red-400">{paymentError}</p>
                  </div>
                )}

                {/* PayFast note */}
                <div className="mt-5 flex items-center gap-2 text-[#444]">
                  <Lock size={12} />
                  <p className="text-[11px]">
                    Secured by demo gateway · Production version will use{" "}
                    <span className="text-[#CAFF00]">PayFast</span> (SA-based
                    payment provider)
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Confirmation */}
            {step === 4 && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-8 sm:p-12 text-center lg:col-span-2"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-[#CAFF00]/15 border border-[#CAFF00]/30 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 size={36} className="text-[#CAFF00]" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  Application Received!
                </h2>
                <p className="text-[#666] mb-8 max-w-lg mx-auto">
                  Thank you! We've received your application and will begin
                  processing it within
                  <span className="text-white font-semibold">
                    {" "}
                    3 business days
                  </span>
                  . You'll receive updates via email and WhatsApp.
                </p>

                {/* Reference numbers */}
                <div className="inline-flex flex-col items-center gap-3 mb-8">
                  <div className="px-6 py-3 rounded-xl bg-white/4 border border-white/8">
                    <p className="text-xs text-[#555] mb-1">
                      Application Reference
                    </p>
                    <p className="font-mono font-bold text-[#CAFF00] text-lg">
                      {appRef}
                    </p>
                  </div>
                  <div className="px-6 py-3 rounded-xl bg-white/4 border border-white/8">
                    <p className="text-xs text-[#555] mb-1">
                      Payment Reference
                    </p>
                    <p className="font-mono font-bold text-white">
                      {refNumber}
                    </p>
                  </div>
                </div>

                {/* What happens next */}
                <div className="text-left max-w-md mx-auto mb-8">
                  <p className="text-xs text-[#555] uppercase tracking-wider mb-4 text-center">
                    What happens next
                  </p>
                  {[
                    {
                      step: "1",
                      text: "We review your documents and matric results (1 business day)",
                    },
                    {
                      step: "2",
                      text: "We complete your applications on each university's online portal",
                    },
                    {
                      step: "3",
                      text: "We send you confirmation emails and track application status",
                    },
                    {
                      step: "4",
                      text: "You receive offer letters directly from the universities",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="flex items-start gap-3 mb-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#CAFF00]/10 border border-[#CAFF00]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-[#CAFF00]">
                          {item.step}
                        </span>
                      </div>
                      <p className="text-sm text-[#777]">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/results"
                    className="btn-secondary flex items-center gap-2 justify-center"
                  >
                    <ArrowLeft size={15} /> Back to Results
                  </Link>
                  <Link
                    href="/"
                    className="btn-primary flex items-center gap-2 justify-center"
                  >
                    Go to Home
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Right sidebar: Order summary ── */}
          {step < 4 && (
            <div className="space-y-4">
              {/* Summary card */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-5"
              >
                <h3 className="text-xs text-[#555] uppercase tracking-wider mb-4">
                  Order Summary
                </h3>

                {items.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div
                        key={item.recommendation.id}
                        className="flex items-start gap-2.5"
                      >
                        <span className="text-base">
                          {item.recommendation.emoji}
                        </span>
                        <div>
                          <p className="text-xs text-white font-medium leading-tight">
                            {item.recommendation.title}
                          </p>
                          <p className="text-[10px] text-[#555]">
                            {item.recommendation.universityName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#555] mb-4 italic">
                    No courses selected
                  </p>
                )}

                <div className="border-t border-white/5 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">
                      Applications ({items.length})
                    </span>
                    <span className="text-[#666]">
                      {items.length}/{MAX_APPLICATIONS} max
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">Service fee</span>
                    <span className="text-white font-semibold">
                      {formatZAR(SERVICE_FEE)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="font-bold text-white">Total</span>
                    <span className="text-[#CAFF00] font-bold text-xl">
                      {formatZAR(total)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* What's included */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-5"
              >
                <h3 className="text-xs text-[#555] uppercase tracking-wider mb-3">
                  What's Included
                </h3>
                <div className="space-y-2.5">
                  {[
                    "Applications to up to 3 universities",
                    "Document verification & formatting",
                    "Application portal submissions",
                    "Progress tracking & updates",
                    "WhatsApp & email support",
                    "Status alerts when results are out",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2
                        size={12}
                        className="text-[#CAFF00] flex-shrink-0 mt-0.5"
                      />
                      <span className="text-xs text-[#777]">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Navigation */}
              {step < 4 && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleNext}
                    disabled={paymentLoading || items.length === 0}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Processing payment…
                      </>
                    ) : step === 3 ? (
                      <>
                        <Lock size={15} />
                        Pay {formatZAR(total)}
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                  {step > 0 && (
                    <button
                      onClick={() => {
                        setErrors([]);
                        setStep((s) => s - 1);
                      }}
                      className="btn-secondary w-full"
                      disabled={paymentLoading}
                    >
                      ← Back
                    </button>
                  )}
                </div>
              )}

              {/* Error messages */}
              <AnimatePresence>
                {errors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3 rounded-xl bg-red-500/5 border border-red-500/20"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        size={14}
                        className="text-red-400 flex-shrink-0 mt-0.5"
                      />
                      <div className="space-y-1">
                        {errors.map((e, i) => (
                          <p key={i} className="text-xs text-red-400">
                            {e}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
