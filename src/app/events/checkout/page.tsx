'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CreditCard, Phone, Shield, Check, X, Loader2, ChevronLeft, Tag } from 'lucide-react';

const EVENT_PRICE = 6500;
const EVENT_DATA = {
    id: 1,
    eventName: 'THE FUN CLUB',
    eventLocation: 'Gatimaiyu Forest, Kiambu',
    eventStartDate: '2026-04-04T12:00:00',
    eventEndDate: '2026-04-05T14:00:00',
    eventPosterUrl: '/images/fun-club.jpeg',
    currency: 'KES',
};

interface FormErrors {
    [key: string]: string;
}

function EventCheckoutContent() {
    const searchParams = useSearchParams();

    // Step management
    const [step, setStep] = useState(1);
    const totalSteps = 2;
    const [progressAnimation, setProgressAnimation] = useState(0);

    // Form data
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [formData, setFormData] = useState({
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
        const quantity = searchParams.get('quantity');
        if (quantity) {
            setTicketQuantity(parseInt(quantity, 10));
        }
        setTimeout(() => {
            setProgressAnimation((1 / totalSteps) * 100);
        }, 100);
    }, [searchParams]);

    useEffect(() => {
        setProgressAnimation((step / totalSteps) * 100);
    }, [step]);

    const totalPrice = EVENT_PRICE * ticketQuantity;

    const calculateSubtotal = () => totalPrice;
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
            eventId: EVENT_DATA.id,
            amountDisplayed: calculateSubtotal(),
            coupon_code: promoCode,
            channel,
            customer,
            customers: [customer],
            tickets: [{ ticketId: 1, quantity: ticketQuantity }],
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
                setTimeout(() => {
                    window.location.href = `/payments/callback?trxref=${ticketGroup}&reference=${ticketGroup}&amount=${amount}&currency=${encodeURIComponent(EVENT_DATA.currency)}`;
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
                    Please wait while we process your payment...
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
                            Your tickets for {EVENT_DATA.eventName} will be sent to {formData.email}
                            {paymentMethod === 'mpesa' && ` and ${countryCode}${mpesaNumber.slice(0, -3)}XXX`}
                        </p>
                        <Link
                            href="/events"
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
                <div className="bg-[#0D1311] border border-red-500/30 rounded-lg p-8 max-w-md w-full">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                            <X className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-3xl font-bold mb-2 text-[#F0FFF0]">PAYMENT FAILED</h3>
                        <p className="text-[#F0FFF0]/60 mb-8">
                            {errorMessage || 'There was an issue processing your payment.'}
                        </p>
                        <button
                            onClick={handleRetry}
                            className="w-full px-6 py-4 bg-[#708238] text-[#0A0F0D] font-bold rounded-lg hover:bg-[#F0FFF0] transition-all"
                        >
                            TRY AGAIN
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="relative min-h-screen bg-[#0A0F0D]">
                {/* Header */}
                <header className="sticky top-0 left-0 right-0 z-40 bg-[#0A0F0D]/95 backdrop-blur-xl border-b border-[#708238]/20">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <Link href="/events" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <ChevronLeft className="w-5 h-5 text-[#708238]" />
                            <span className="text-[#F0FFF0] text-sm">Back to Event</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Image src="/images/logo/yaba_logo.png" alt="YABA" width={40} height={40} className="rounded-full" />
                            <span className="text-[#F0FFF0] font-bold">YABA</span>
                        </div>
                    </div>
                </header>

                {/* Progress Bar */}
                <div className="w-full h-[2px] bg-[#708238]/20">
                    <div
                        className="h-full bg-[#708238] transition-all duration-700 ease-out"
                        style={{ width: `${progressAnimation}%` }}
                    />
                </div>

                {/* Main Content */}
                <div className="pt-8 pb-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Step Header */}
                        <div className="mb-8 flex items-center">
                            {step > 1 && (
                                <button
                                    onClick={prevStep}
                                    className="p-2 mr-3 rounded-full hover:bg-[#708238]/10 transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#F0FFF0]">
                                    {step === 1 ? 'CUSTOMER INFORMATION' : 'PAYMENT DETAILS'}
                                </h2>
                                <p className="text-sm text-[#F0FFF0]/60 mt-1">
                                    Step {step} of {totalSteps}
                                </p>
                            </div>
                        </div>

                        {/* Step 1: Customer Information */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                                            placeholder="First Name"
                                            className={`w-full px-4 py-3 bg-[#0D1311] border ${errors.first_name ? 'border-red-500' : 'border-[#708238]/30'
                                                } rounded-lg focus:border-[#708238] text-[#F0FFF0] placeholder-[#F0FFF0]/30 outline-none`}
                                        />
                                        {errors.first_name && (
                                            <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                                            placeholder="Last Name"
                                            className={`w-full px-4 py-3 bg-[#0D1311] border ${errors.last_name ? 'border-red-500' : 'border-[#708238]/30'
                                                } rounded-lg focus:border-[#708238] text-[#F0FFF0] placeholder-[#F0FFF0]/30 outline-none`}
                                        />
                                        {errors.last_name && (
                                            <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center mb-2">
                                        <Phone className="w-5 h-5 mr-2 text-[#708238]" />
                                        <span className="text-sm font-medium text-[#F0FFF0]">Mobile Number</span>
                                    </div>
                                    <div className="flex">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="h-full py-3 pl-3 pr-8 border border-[#708238]/30 bg-[#0D1311] text-[#F0FFF0] rounded-l-lg outline-none"
                                        >
                                            {countryCodes.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.code}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={formData.mobileNumber}
                                            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                            placeholder="7XX XXX XXX"
                                            maxLength={9}
                                            className={`flex-1 px-4 py-3 bg-[#0D1311] border border-l-0 ${errors.mobileNumber ? 'border-red-500' : 'border-[#708238]/30'
                                                } rounded-r-lg focus:border-[#708238] text-[#F0FFF0] placeholder-[#F0FFF0]/30 outline-none`}
                                        />
                                    </div>
                                    {errors.mobileNumber && (
                                        <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="Email Address"
                                        className={`w-full px-4 py-3 bg-[#0D1311] border ${errors.email ? 'border-red-500' : 'border-[#708238]/30'
                                            } rounded-lg focus:border-[#708238] text-[#F0FFF0] placeholder-[#F0FFF0]/30 outline-none`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                {/* Order Summary */}
                                <div className="border-t border-[#708238]/30 pt-6 mt-8">
                                    <h4 className="font-bold mb-4 text-[#F0FFF0]">ORDER SUMMARY</h4>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm text-[#F0FFF0]/80">
                                            <span>{ticketQuantity}x General Admission</span>
                                            <span>{EVENT_DATA.currency} {totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between font-bold text-xl text-[#F0FFF0]">
                                        <span>TOTAL</span>
                                        <span className="text-[#708238]">
                                            {EVENT_DATA.currency} {totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment Details */}
                        {step === 2 && (
                            <div className="space-y-6">
                                {/* Payment Method Tabs */}
                                <div>
                                    <div className="flex border-b border-[#708238]/30 mb-6">
                                        <button
                                            className={`relative flex items-center px-6 py-3 text-sm font-medium transition-all ${paymentMethod === 'mpesa' ? 'text-[#F0FFF0]' : 'text-[#F0FFF0]/50'
                                                }`}
                                            onClick={() => {
                                                setPaymentMethod('mpesa');
                                                setDisclaimerChecked(false);
                                            }}
                                        >
                                            <Phone className="w-4 h-4 mr-2" />
                                            M-Pesa
                                            {paymentMethod === 'mpesa' && (
                                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#708238]"></div>
                                            )}
                                        </button>
                                        <button
                                            className={`relative flex items-center px-6 py-3 text-sm font-medium transition-all ${paymentMethod === 'card' ? 'text-[#F0FFF0]' : 'text-[#F0FFF0]/50'
                                                }`}
                                            onClick={() => {
                                                setPaymentMethod('card');
                                                setDisclaimerChecked(false);
                                            }}
                                        >
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Card
                                            {paymentMethod === 'card' && (
                                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#708238]"></div>
                                            )}
                                        </button>
                                    </div>

                                    {/* M-Pesa Form */}
                                    {paymentMethod === 'mpesa' && (
                                        <div className="space-y-6">
                                            <div className="bg-[#708238]/10 border border-[#708238]/30 rounded-lg p-6">
                                                <div className="flex items-start">
                                                    <div className="mr-4 mt-1">
                                                        <div className="w-10 h-10 rounded-full bg-[#708238]/30 flex items-center justify-center">
                                                            <Phone className="w-5 h-5 text-[#708238]" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold mb-2 text-[#F0FFF0]">M-Pesa Payment</h4>
                                                        <p className="text-sm text-[#F0FFF0]/70">
                                                            You will receive a prompt on your phone to complete the payment.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex items-center mb-2">
                                                    <Phone className="w-5 h-5 mr-2 text-[#708238]" />
                                                    <span className="text-sm font-medium text-[#F0FFF0]">M-Pesa Number</span>
                                                </div>
                                                <div className="flex">
                                                    <select
                                                        value={countryCode}
                                                        onChange={(e) => setCountryCode(e.target.value)}
                                                        className="h-full py-3 pl-3 pr-8 border border-[#708238]/30 bg-[#0D1311] text-[#F0FFF0] rounded-l-lg outline-none"
                                                    >
                                                        {countryCodes.map((country) => (
                                                            <option key={country.code} value={country.code}>
                                                                {country.code}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        value={mpesaNumber}
                                                        onChange={(e) => handleMpesaNumberChange(e.target.value)}
                                                        placeholder="7XX XXX XXX"
                                                        maxLength={9}
                                                        className={`flex-1 px-4 py-3 bg-[#0D1311] border border-l-0 ${errors.mpesaNumber ? 'border-red-500' : 'border-[#708238]/30'
                                                            } rounded-r-lg focus:border-[#708238] text-[#F0FFF0] placeholder-[#F0FFF0]/30 outline-none`}
                                                    />
                                                </div>
                                                {errors.mpesaNumber && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.mpesaNumber}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Form */}
                                    {paymentMethod === 'card' && (
                                        <div className="bg-[#708238]/10 border border-[#708238]/30 rounded-lg p-6">
                                            <div className="flex items-start">
                                                <div className="mr-4 mt-1">
                                                    <div className="w-10 h-10 rounded-full bg-[#708238]/30 flex items-center justify-center">
                                                        <CreditCard className="w-5 h-5 text-[#708238]" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold mb-2 text-[#F0FFF0]">Card Payment</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Secure card payment via Paystack. You&apos;ll be redirected to complete payment.
                                            </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Promo Code */}
                                <div>
                                    {!showPromoField ? (
                                        <button
                                            onClick={() => setShowPromoField(true)}
                                            className="flex items-center text-sm text-[#F0FFF0]/60 hover:text-[#708238] transition-colors"
                                        >
                                            <Tag className="w-4 h-4 mr-2" />
                                            Add promo code
                                        </button>
                                    ) : (
                                        <div className="border border-[#708238]/30 rounded-lg p-4 bg-[#0D1311]">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-medium flex items-center text-[#F0FFF0]">
                                                    <Tag className="w-4 h-4 mr-2" />
                                                    Promo Code
                                                </h4>
                                                <button
                                                    onClick={() => setShowPromoField(false)}
                                                    className="text-xs text-[#F0FFF0]/50 hover:text-[#F0FFF0]"
                                                >
                                                    Hide
                                                </button>
                                            </div>

                                            {promoCodeApplied ? (
                                                <div className="flex items-center justify-between bg-[#708238]/10 p-3 rounded-lg">
                                                    <div className="flex items-center">
                                                        <Check className="w-4 h-4 text-[#708238] mr-2" />
                                                        <div>
                                                            <p className="text-sm font-medium text-[#F0FFF0]">
                                                                {promoCode.toUpperCase()}
                                                            </p>
                                                            <p className="text-xs text-[#708238]">
                                                                {promoDiscount}% discount applied
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={removePromoCode}
                                                        className="text-xs text-[#F0FFF0]/50 hover:text-red-500"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <input
                                                        type="text"
                                                        value={promoCode}
                                                        onChange={(e) => setPromoCode(e.target.value)}
                                                        placeholder="Enter promo code"
                                                        className={`flex-1 px-4 py-3 bg-transparent border ${errors.promoCode ? 'border-red-500' : 'border-[#708238]/30'
                                                            } rounded-l-lg focus:border-[#708238] text-[#F0FFF0] placeholder-[#F0FFF0]/30 outline-none`}
                                                    />
                                                    <button
                                                        onClick={applyPromoCode}
                                                        className="px-4 py-3 bg-[#708238] text-[#0A0F0D] rounded-r-lg text-sm font-bold hover:bg-[#F0FFF0] transition-all"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            )}
                                            {errors.promoCode && (
                                                <p className="mt-1 text-sm text-red-500">{errors.promoCode}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Order Summary */}
                                <div className="border-t border-[#708238]/30 pt-6">
                                    <h4 className="font-bold mb-4 text-[#F0FFF0]">ORDER SUMMARY</h4>
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm text-[#F0FFF0]/80">
                                            <span>{ticketQuantity}x General Admission</span>
                                            <span>{EVENT_DATA.currency} {totalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="border-t border-[#708238]/20 pt-2">
                                            <div className="flex justify-between text-sm text-[#F0FFF0]/80">
                                                <span>Subtotal</span>
                                                <span>{EVENT_DATA.currency} {calculateSubtotal().toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {promoCodeApplied && (
                                            <div className="flex justify-between text-sm text-[#708238]">
                                                <span>Discount ({promoDiscount}%)</span>
                                                <span>-{EVENT_DATA.currency} {calculateDiscount().toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between font-bold text-xl pt-2 border-t border-[#708238]/30 text-[#F0FFF0]">
                                        <span>TOTAL</span>
                                        <span className="text-[#708238]">
                                            {EVENT_DATA.currency} {calculateFinalTotal().toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Disclaimer */}
                                <div className="flex items-start p-4 border border-[#708238]/20 rounded-lg bg-[#708238]/5">
                                    <input
                                        id="disclaimer"
                                        type="checkbox"
                                        checked={disclaimerChecked}
                                        onChange={(e) => setDisclaimerChecked(e.target.checked)}
                                        className="w-4 h-4 mt-0.5 border border-[#708238]/30 rounded bg-transparent cursor-pointer"
                                    />
                                    <label htmlFor="disclaimer" className="ml-3 text-sm text-[#F0FFF0]/70 cursor-pointer">
                                        I agree to the{' '}
                                        <a
                                            href="https://soldoutafrica.com/terms"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#708238] hover:underline"
                                        >
                                            terms and conditions
                                        </a>
                                        .
                                        {paymentMethod === 'mpesa'
                                            ? ' A payment prompt will be sent to my phone.'
                                            : ' I will be redirected to complete payment securely.'}
                                    </label>
                                </div>
                                {errors.disclaimer && (
                                    <p className="text-sm text-red-500">{errors.disclaimer}</p>
                                )}

                                <div className="flex items-center gap-2 text-sm text-[#F0FFF0]/50">
                                    <Shield className="w-4 h-4" />
                                    <span>Your payment information is secure and encrypted</span>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={nextStep}
                                disabled={
                                    (step === 2 && !disclaimerChecked) ||
                                    (step === 2 && paymentMethod === 'mpesa' && !mpesaNumber)
                                }
                                className={`px-10 py-4 rounded-lg text-sm font-bold uppercase transition-all ${(step === 2 && !disclaimerChecked) ||
                                    (step === 2 && paymentMethod === 'mpesa' && !mpesaNumber)
                                    ? 'bg-[#708238]/20 text-[#F0FFF0]/40 cursor-not-allowed'
                                    : 'bg-[#708238] text-[#0A0F0D] hover:bg-[#F0FFF0] shadow-lg shadow-[#708238]/50'
                                    }`}
                            >
                                {step < totalSteps ? 'CONTINUE' : 'COMPLETE PAYMENT'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-8 text-center text-[#F0FFF0]/50 text-sm border-t border-[#708238]/20">
                    <p>© 2026 YABA. All rights reserved.</p>
                    <p className="mt-2">
                        Powered by{' '}
                        <a
                            href="https://soldoutafrica.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#708238] hover:text-[#F0FFF0] transition-colors underline"
                        >
                            SoldOutAfrica
                        </a>
                    </p>
                </footer>
            </div>
        </>
    );
}

export default function EventCheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0A0F0D] text-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#708238]" />
                    <p className="text-white/70">Loading checkout...</p>
                </div>
            </div>
        }>
            <EventCheckoutContent />
        </Suspense>
    );
}
