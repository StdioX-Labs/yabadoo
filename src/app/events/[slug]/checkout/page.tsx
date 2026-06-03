'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { CreditCard, Phone, Shield, Check, X, Loader2, ChevronLeft, Tag } from 'lucide-react';

interface Event {
  id: number;
  eventName: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  date: string;
  time: string;
  currency: string;
}

interface TicketData {
  ticketId: number;
  ticketName: string;
  quantity: number;
  price: number;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  mobileNumber: string;
}

interface FormErrors {
  [key: string]: string;
}

function EventCheckoutContent() {
    const searchParams = useSearchParams();
    const params = useParams();
    const slug = params.slug as string;

    const [eventData, setEventData] = useState<Event | null>(null);
    const [ticketsData, setTicketsData] = useState<TicketData[]>([]);


    // Step management
    const [step, setStep] = useState(1);
    const totalSteps = 2;
    const [progressAnimation, setProgressAnimation] = useState(0);

    // Form data
    const [formData, setFormData] = useState<FormData>({
        first_name: '',
        last_name: '',
        email: '',
        mobileNumber: '',
    });
    const [countryCode, setCountryCode] = useState('+254');
    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const [mpesaNumber, setMpesaNumber] = useState('');
    const [disclaimerChecked, setDisclaimerChecked] = useState(false);

    // Promo code
    const [showPromoField, setShowPromoField] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [promoCodeApplied, setPromoCodeApplied] = useState(false);
    const [promoDiscount, setPromoDiscount] = useState(0);

    // States
    const [errors, setErrors] = useState<FormErrors>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState<'success' | 'error' | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    const countryCodes = [
        { code: '+254', country: 'Kenya' },
        { code: '+27', country: 'SA' },
        { code: '+256', country: 'Uganda' },
    ];

    useEffect(() => {
        const fetchEvent = async () => {
            // The slug param is actually the event ID
            const response = await fetch(`/api/events/${slug}?eventId=${slug}`);
            const data = await response.json();
            if (data.success) {
                setEventData(data.event);
            }
        };

        const tickets = searchParams.get('tickets');
        if (tickets) {
            setTicketsData(JSON.parse(tickets));
        }

        fetchEvent();
        setTimeout(() => setProgressAnimation((1 / totalSteps) * 100), 100);
    }, [searchParams, slug, totalSteps]);

    useEffect(() => {
        setProgressAnimation((step / totalSteps) * 100);
    }, [step]);

    const calculateSubtotal = () => {
        return ticketsData.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);
    };

    const calculateDiscount = () => {
        if (!promoCodeApplied) return 0;
        return (calculateSubtotal() * promoDiscount) / 100;
    };

    const calculateFinalTotal = () => calculateSubtotal() - calculateDiscount();


    const handleInputChange = (name: string, value: string) => {
        if (name === 'mobileNumber') {
            const formattedValue = value.replace(/\D/g, '').slice(0, 9);
            if (formattedValue.startsWith('0')) {
                setErrors({ ...errors, mobileNumber: 'Please enter number without leading zero' });
            } else {
                setFormData({ ...formData, [name]: formattedValue });
                setErrors({ ...errors, [name]: '' });
            }
        } else {
            setFormData({ ...formData, [name]: value });
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleMpesaNumberChange = (value: string) => {
        const formattedValue = value.replace(/\D/g, '').slice(0, 9);
        setMpesaNumber(formattedValue);
        setErrors({ ...errors, mpesaNumber: '' });
    };

    const applyPromoCode = async () => {
        if (!promoCode.trim()) {
            setErrors({ ...errors, promoCode: 'Please enter a promo code' });
            return;
        }

        try {
            const response = await fetch(`/api/promocodes/validate/${promoCode}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const resData = await response.json();

            if (response.ok && resData.status && resData.data?.isValid) {
                const { discountType, discountValue } = resData.data;
                if (discountType === 'PERCENTAGE') {
                    setPromoCodeApplied(true);
                    setPromoDiscount(discountValue);
                } else {
                    const discountPct = (discountValue / calculateSubtotal()) * 100;
                    setPromoCodeApplied(true);
                    setPromoDiscount(discountPct);
                }
                setErrors({ ...errors, promoCode: '' });
            } else {
                setPromoCodeApplied(false);
                setPromoDiscount(0);
                setErrors({ ...errors, promoCode: 'Invalid promo code' });
            }
        } catch {
            setErrors({ ...errors, promoCode: 'Failed to validate promo code' });
        }
    };

    const removePromoCode = () => {
        setPromoCode('');
        setPromoCodeApplied(false);
        setPromoDiscount(0);
    };

    const validateStep = () => {
        const newErrors: FormErrors = {};

        if (step === 1) {
            if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
            if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
            if (!formData.mobileNumber.trim()) {
                newErrors.mobileNumber = 'Mobile number is required';
            } else if (!/^\d{9}$/.test(formData.mobileNumber)) {
                newErrors.mobileNumber = 'Please enter a valid 9-digit mobile number';
            }
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email is invalid';
            }
        } else if (step === 2) {
            if (paymentMethod === 'mpesa') {
                if (!mpesaNumber.trim()) {
                    newErrors.mpesaNumber = 'Mobile number is required';
                } else if (!/^\d{9}$/.test(mpesaNumber)) {
                    newErrors.mpesaNumber = 'Please enter a valid 9-digit mobile number';
                }
            }
            if (!disclaimerChecked) {
                newErrors.disclaimer = 'You must accept the terms to continue';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            if (step < totalSteps) {
                setStep(step + 1);
            } else {
                processPayment();
            }
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const buildPayload = (channel: 'mpesa' | 'card') => {
        const mobileNumber = channel === 'mpesa' ? mpesaNumber : formData.mobileNumber;
        const customer = {
            mobile_number: `${countryCode}${mobileNumber}`.replace(/\+/g, ''),
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
        };
        return {
            eventId: eventData?.id,
            amountDisplayed: calculateSubtotal(),
            coupon_code: promoCode,
            channel,
            customer,
            customers: [customer],
            tickets: ticketsData.map((ticket) => ({
                ticketId: ticket.ticketId,
                quantity: ticket.quantity,
            })),
        };
    };

    const handlePaystackPayment = async () => {
        try {
            const payload = buildPayload('card');
            const response = await fetch('/api/tickets/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (response.ok && data.status === true) {
                if (data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                } else {
                    setTimeout(() => {
                        window.location.href = `/payments/callback?trxref=${data.ticketGroup}&reference=${data.ticketGroup}`;
                    }, 2000);
                    setTransactionStatus('success');
                    setIsProcessing(false);
                }
            } else {
                setTransactionStatus('error');
                setErrorMessage(data.message || 'Payment failed. Please try again.');
                setIsProcessing(false);
            }
        } catch {
            setTransactionStatus('error');
            setErrorMessage('Failed to initiate payment. Please try again.');
            setIsProcessing(false);
        }
    };

    const handleMpesaPayment = async () => {
        try {
            const payload = buildPayload('mpesa');
            const response = await fetch('/api/tickets/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (response.ok && data.status === true) {
                const ticketGroup = data.ticketGroup;
                const amount = data.amountCharged || calculateFinalTotal();
                const currency = eventData?.currency || 'KES';
                setTimeout(() => {
                    window.location.href = `/payments/callback?trxref=${ticketGroup}&reference=${ticketGroup}&amount=${amount}&currency=${encodeURIComponent(currency)}`;
                }, 2000);
                setTransactionStatus('success');
            } else {
                setTransactionStatus('error');
                setErrorMessage(data.message || 'M-Pesa transaction failed. Please try again.');
            }
        } catch {
            setTransactionStatus('error');
            setErrorMessage('Failed to initiate payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const processPayment = () => {
        setIsProcessing(true);
        if (paymentMethod === 'mpesa') {
            handleMpesaPayment();
        } else {
            handlePaystackPayment();
        }
    };

    const handleRetry = () => {
        setTransactionStatus(null);
        setErrorMessage('');
        setIsProcessing(false);
    };

    if (!eventData) {
        return (
            <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#708238] animate-spin" />
            </div>
        );
    }

    if (isProcessing) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0F0D]">
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-[#708238]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-[#708238] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-[#708238] animate-spin" />
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#F0FFF0]">Processing Payment</h3>
                <p className="text-[#F0FFF0]/60 text-center max-w-xs">
                    {paymentMethod === 'mpesa'
                        ? 'Check your phone for the M-Pesa prompt...'
                        : 'Please wait while we process your payment...'}
                </p>
            </div>
        );
    }

    if (transactionStatus === 'success') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F0D] p-4">
                <div className="bg-[#0D1311] border border-[#708238] rounded-lg p-8 max-w-md w-full">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-[#708238]/20 flex items-center justify-center mb-6">
                            <Check className="w-10 h-10 text-[#708238]" />
                        </div>
                        <h3 className="text-3xl font-bold mb-2 text-[#F0FFF0]">PURCHASE INITIATED!</h3>
                        <p className="text-[#F0FFF0]/60 mb-8">
                            Your tickets for {eventData.eventName} will be sent to {formData.email}
                            {paymentMethod === 'mpesa' && ` and ${countryCode}${mpesaNumber.slice(0, -3)}XXX`}
                        </p>
                        <Link
                            href={`/events/${slug}`}
                            className="w-full px-6 py-4 bg-[#708238] text-[#0A0F0D] font-bold rounded-lg hover:bg-[#F0FFF0] transition-all text-center"
                        >
                            BACK TO EVENT
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (transactionStatus === 'error') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F0D] p-4">
                <div className="bg-[#0D1311] border border-red-500 rounded-lg p-8 max-w-md w-full">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                            <X className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-3xl font-bold mb-2 text-[#F0FFF0]">PAYMENT FAILED</h3>
                        <p className="text-[#F0FFF0]/60 mb-8">{errorMessage || 'Something went wrong. Please try again.'}</p>
                        <div className="flex gap-4 w-full">
                            <Link
                                href={`/events/${slug}`}
                                className="flex-1 px-6 py-4 border border-[#708238] text-[#F0FFF0] font-bold rounded-lg hover:bg-[#708238]/10 transition-all text-center"
                            >
                                CANCEL
                            </Link>
                            <button
                                onClick={handleRetry}
                                className="flex-1 px-6 py-4 bg-[#708238] text-[#0A0F0D] font-bold rounded-lg hover:bg-[#F0FFF0] transition-all"
                            >
                                TRY AGAIN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0F0D] text-[#F0FFF0]">
            {/* Header */}
                <div className="sticky top-0 z-40 bg-[#0A0F0D]/95 backdrop-blur-xl border-b border-[#708238]/30">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href={`/events/${slug}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                                <ChevronLeft size={20} />
                                <span className="text-sm">Back</span>
                            </Link>
                            <Image src="/images/logo/yaba_logo.png" alt="YABA" width={40} height={40} className="rounded-full" />
                            <div className="w-16" />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-[#1A2421]">
                        <div
                            className="h-full bg-gradient-to-r from-[#708238] to-[#F0FFF0] transition-all duration-500"
                            style={{ width: `${progressAnimation}%` }}
                        />
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-[1fr,400px] gap-8">
                        {/* Main Content */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
                            <p className="text-[#F0FFF0]/60 mb-8">
                                Step {step} of {totalSteps}
                            </p>

                            {/* Step 1: Personal Information */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold mb-4">Personal Information</h2>

                                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">First Name *</label>
                                                <input
                                                    type="text"
                                                    value={formData.first_name}
                                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                                    className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:border-[#708238] focus:outline-none transition-colors"
                                                    placeholder="John"
                                                />
                                                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">Last Name *</label>
                                                <input
                                                    type="text"
                                                    value={formData.last_name}
                                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                                    className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:border-[#708238] focus:outline-none transition-colors"
                                                    placeholder="Doe"
                                                />
                                                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-2">Email Address *</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:border-[#708238] focus:outline-none transition-colors"
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Mobile Number *</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={countryCode}
                                                    onChange={(e) => setCountryCode(e.target.value)}
                                                    className="px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:border-[#708238] focus:outline-none"
                                                >
                                                    {countryCodes.map((c) => (
                                                        <option key={c.code} value={c.code}>
                                                            {c.code} {c.country}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="tel"
                                                    value={formData.mobileNumber}
                                                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                                    className="flex-1 px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:border-[#708238] focus:outline-none transition-colors"
                                                    placeholder="712345678"
                                                />
                                            </div>
                                            {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                            <button
                                                onClick={() => setPaymentMethod('mpesa')}
                                                className={`p-6 border-2 rounded-lg transition-all ${
                                                    paymentMethod === 'mpesa'
                                                        ? 'border-[#708238] bg-[#708238]/10'
                                                        : 'border-[#708238]/30 hover:border-[#708238]/50'
                                                }`}
                                            >
                                                <Phone className="w-8 h-8 mb-2 text-[#708238]" />
                                                <h3 className="font-bold mb-1">M-Pesa</h3>
                                                <p className="text-sm text-[#F0FFF0]/60">Pay with M-Pesa STK Push</p>
                                            </button>

                                            <button
                                                onClick={() => setPaymentMethod('card')}
                                                className={`p-6 border-2 rounded-lg transition-all ${
                                                    paymentMethod === 'card'
                                                        ? 'border-[#708238] bg-[#708238]/10'
                                                        : 'border-[#708238]/30 hover:border-[#708238]/50'
                                                }`}
                                            >
                                                <CreditCard className="w-8 h-8 mb-2 text-[#708238]" />
                                                <h3 className="font-bold mb-1">Card</h3>
                                                <p className="text-sm text-[#F0FFF0]/60">Pay with Debit/Credit Card</p>
                                            </button>
                                        </div>

                                        {paymentMethod === 'mpesa' && (
                                            <div>
                                                <label className="block text-sm font-medium mb-2">M-Pesa Number *</label>
                                                <div className="flex gap-2">
                                                    <select
                                                        value={countryCode}
                                                        onChange={(e) => setCountryCode(e.target.value)}
                                                        className="px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:border-[#708238] focus:outline-none"
                                                    >
                                                        {countryCodes.map((c) => (
                                                            <option key={c.code} value={c.code}>
                                                                {c.code}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="tel"
                                                        value={mpesaNumber}
                                                        onChange={(e) => handleMpesaNumberChange(e.target.value)}
                                                        className="flex-1 px-4 py-3 bg-[#1A2421] border border-[#708238]/30 rounded-lg focus:border-[#708238] focus:outline-none transition-colors"
                                                        placeholder="712345678"
                                                    />
                                                </div>
                                                {errors.mpesaNumber && <p className="text-red-500 text-sm mt-1">{errors.mpesaNumber}</p>}
                                            </div>
                                        )}

                                        {paymentMethod === 'card' && (
                                            <div className="p-4 bg-[#708238]/10 border border-[#708238]/30 rounded-lg">
                                                <p className="text-sm text-[#F0FFF0]/80">
                                                    You&apos;ll be redirected to Paystack to complete your card payment securely.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={disclaimerChecked}
                                            onChange={(e) => {
                                                setDisclaimerChecked(e.target.checked);
                                                setErrors({ ...errors, disclaimer: '' });
                                            }}
                                            className="mt-1"
                                        />
                                        <label className="text-sm text-[#F0FFF0]/80">
                                            I agree to the{' '}
                                            <Link href="/terms" className="text-[#708238] hover:underline">
                                                terms and conditions
                                            </Link>{' '}
                                            and understand that tickets are non-refundable.
                                        </label>
                                    </div>
                                    {errors.disclaimer && <p className="text-red-500 text-sm">{errors.disclaimer}</p>}
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 mt-8">
                                {step > 1 && (
                                    <button
                                        onClick={prevStep}
                                        className="px-6 py-3 border border-[#708238]/30 rounded-lg hover:bg-[#708238]/10 transition-all"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={nextStep}
                                    className="flex-1 px-6 py-3 bg-[#708238] text-[#0A0F0D] font-bold rounded-lg hover:bg-[#F0FFF0] transition-all"
                                >
                                    {step === totalSteps ? 'Complete Payment' : 'Continue'}
                                </button>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:sticky lg:top-24 h-fit">
                            <div className="bg-[#1A2421] border border-[#708238]/30 rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Order Summary</h3>

                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">{eventData.eventName}</h4>
                                    <p className="text-sm text-[#F0FFF0]/60">{eventData.eventLocation}</p>
                                    <p className="text-sm text-[#F0FFF0]/60">{eventData.date} • {eventData.time}</p>
                                </div>

                                <div className="space-y-2 mb-4 pb-4 border-b border-[#708238]/30">
                                    {ticketsData.map((ticket, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>
                                                {ticket.ticketName} x {ticket.quantity}
                                            </span>
                                            <span>{eventData.currency} {(ticket.price * ticket.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Promo Code */}
                                {!promoCodeApplied && (
                                    <button
                                        onClick={() => setShowPromoField(!showPromoField)}
                                        className="flex items-center gap-2 text-sm text-[#708238] hover:underline mb-4"
                                    >
                                        <Tag size={16} />
                                        Have a promo code?
                                    </button>
                                )}

                                {showPromoField && !promoCodeApplied && (
                                    <div className="mb-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => {
                                                    setPromoCode(e.target.value.toUpperCase());
                                                    setErrors({ ...errors, promoCode: '' });
                                                }}
                                                placeholder="Enter code"
                                                className="flex-1 px-3 py-2 bg-[#0A0F0D] border border-[#708238]/30 rounded-lg text-sm"
                                            />
                                            <button
                                                onClick={applyPromoCode}
                                                className="px-4 py-2 bg-[#708238] text-[#0A0F0D] rounded-lg text-sm font-medium hover:bg-[#F0FFF0] transition-all"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {errors.promoCode && <p className="text-red-500 text-xs mt-1">{errors.promoCode}</p>}
                                    </div>
                                )}

                                {promoCodeApplied && (
                                    <div className="mb-4 p-3 bg-[#708238]/10 border border-[#708238]/30 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[#708238] font-medium">
                                                Code: {promoCode} (-{promoDiscount}%)
                                            </span>
                                            <button onClick={removePromoCode} className="text-[#F0FFF0]/60 hover:text-[#F0FFF0]">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2 mb-4 pb-4 border-b border-[#708238]/30">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>{eventData.currency} {calculateSubtotal().toLocaleString()}</span>
                                    </div>
                                    {promoCodeApplied && (
                                        <div className="flex justify-between text-sm text-[#708238]">
                                            <span>Discount ({promoDiscount}%)</span>
                                            <span>-{eventData.currency} {calculateDiscount().toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-[#708238]">{eventData.currency} {calculateFinalTotal().toLocaleString()}</span>
                                </div>

                                <div className="mt-6 p-4 bg-[#708238]/10 border border-[#708238]/30 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <Shield className="w-5 h-5 text-[#708238] flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-[#F0FFF0]/80">
                                            Your payment is secured with industry-standard encryption
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default function EventCheckout() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-[#708238] animate-spin" />
                </div>
            }
        >
            <EventCheckoutContent />
        </Suspense>
    );
}

