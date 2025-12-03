<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rentify -  Rental Commerce</title>
    
    <!-- Fonts: Inter & Space Grotesk for that "Tech/Premium" feel -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Tailwind Config for specific colors/fonts -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif'],
                    },
                    colors: {
                        rentify: {
                            dark: '#0f172a',
                            accent: '#3b82f6', // Electric Blue
                            glass: 'rgba(255, 255, 255, 0.08)',
                            glassBorder: 'rgba(255, 255, 255, 0.1)',
                        }
                    },
                    animation: {
                        'float': 'float 8s ease-in-out infinite',
                        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-20px)' },
                        }
                    }
                }
            }
        }
    </script>

    <style>
        /* Custom Premium Styles */
        body {
            background-color: #020617; /* Deepest Slate */
            color: #ffffff;
            overflow-x: hidden;
        }

        /* Glassmorphism */
        .glass-panel {
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        /* Form Inputs */
        .input-premium {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            transition: all 0.3s ease;
        }
        .input-premium:focus {
            outline: none;
            border-color: #3b82f6;
            background: rgba(0, 0, 0, 0.6);
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        /* Video Background Styles */
        .video-background {
            position: fixed;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            z-index: -10;
            transform: translate(-50%, -50%);
            object-fit: cover;
        }

        /* Cinematic Vignette Overlay */
        .cinematic-overlay {
            position: fixed;
            inset: 0;
            z-index: -5;
            background: radial-gradient(circle at 50% 50%, rgba(2, 6, 23, 0.3) 0%, rgba(2, 6, 23, 0.85) 90%);
            pointer-events: none;
        }
        
        /* Subtle Glow Spots */
        .glow-spot {
            position: fixed;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
            border-radius: 50%;
            filter: blur(80px);
            z-index: -6;
            animation: pulse-slow 8s infinite;
        }

        /* ========================================= */
        /* SUPER ANIMATED VALIDATION STYLES START */
        /* ========================================= */

        @keyframes shake-ultra {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        @keyframes popup-bounce-in {
            0% { opacity: 0; transform: translateY(15px) scale(0.8) perspective(500px) rotateX(-20deg); }
            60% { opacity: 1; transform: translateY(-5px) scale(1.05) perspective(500px) rotateX(0deg); }
            80% { transform: translateY(2px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Error state for Input */
        .input-error {
            border-color: #f87171 !important; /* Red 400 */
            background: rgba(239, 68, 68, 0.1) !important;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2), 0 0 20px rgba(239, 68, 68, 0.15) !important;
            animation: shake-ultra 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        /* 3D Glass Tooltip */
        .validation-tooltip {
            position: absolute;
            bottom: 100%;
            left: 0;
            margin-bottom: 12px;
            background: rgba(20, 20, 30, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(248, 113, 113, 0.5);
            color: #fca5a5; /* Red 300 */
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(239, 68, 68, 0.2);
            z-index: 60;
            display: flex;
            align-items: center;
            gap: 10px;
            pointer-events: none;
            transform-origin: bottom left;
            animation: popup-bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .validation-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 20px;
            border-width: 6px;
            border-style: solid;
            border-color: rgba(248, 113, 113, 0.5) transparent transparent transparent;
        }

        .validation-icon-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            border-radius: 6px;
            font-size: 10px;
            box-shadow: 0 2px 5px rgba(220, 38, 38, 0.4);
        }

        /* Make parent relative so tooltip positions correctly */
        .input-group-relative {
            position: relative;
        }

        /* ========================================= */
        /* SUPER ANIMATED VALIDATION STYLES END */
        /* ========================================= */

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
    </style>
</head>
<body class="antialiased min-h-screen flex flex-col relative selection:bg-blue-500 selection:text-white">

    <!-- 1. VIDEO BACKGROUND -->
    <video autoplay muted loop playsinline class="video-background" id="bg-video">
        <source src="Video_Generation_Request.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>

    <!-- Cinematic Overlays -->
    <div class="cinematic-overlay"></div>
    <div class="glow-spot" style="top: -20%; left: 20%;"></div>
    <div class="glow-spot" style="bottom: -20%; right: 20%; background: radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, transparent 70%); animation-delay: 2s;"></div>

    <!-- 2. MAIN INTERFACE -->
    <main class="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-12 w-full max-w-7xl mx-auto">
        
        <!-- Central UI Container -->
        <div id="ui-container" class="w-full max-w-2xl relative transition-all duration-500 ease-in-out">
            
            <!-- VIEW A: HERO & EMAIL CAPTURE -->
            <div id="view-hero" class="text-center transition-all duration-500">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider mb-6 backdrop-blur-md">
                    <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Premium Rental Marketplace
                </div>
                
                <!-- CENTERED RENTIFY TEXT (No Logo Icon) -->
                <h1 class="font-display text-6xl md:text-8xl font-bold leading-tight mb-4 tracking-tighter drop-shadow-2xl">
                    <span class="text-white">RENTIFY</span>
                </h1>
                
                <!-- Subheadline -->
                <p class="font-sans text-xl md:text-2xl text-slate-300/90 mb-10 max-w-lg mx-auto font-light leading-relaxed drop-shadow-lg tracking-wide">
                    Rent Anything. Anytime.
                </p>

                <!-- Email Form -->
                <form id="hero-email-form" class="relative max-w-md mx-auto group" novalidate>
                    <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                    <div class="relative flex items-center glass-panel rounded-full p-1.5 pl-6 bg-[#0f172a]/80 input-group-relative">
                        <i class="fa-regular fa-envelope text-slate-400 mr-3"></i>
                        <input type="email" id="hero-email" required placeholder="Enter your email address" 
                            class="bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 w-full text-base outline-none h-12">
                        <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 group/btn shadow-lg shadow-blue-600/20">
                            <span>Start</span>
                            <i class="fa-solid fa-arrow-right group-hover/btn:translate-x-1 transition-transform"></i>
                        </button>
                    </div>
                </form>

                <div class="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
                    <div class="flex items-center gap-1.5">
                        <i class="fa-solid fa-shield-halved text-blue-500"></i>
                        <span>Insured Rentals</span>
                    </div>
                    <div class="w-1 h-1 rounded-full bg-slate-700"></div>
                    <div class="flex items-center gap-1.5">
                        <i class="fa-solid fa-bolt text-yellow-500"></i>
                        <span>Instant Booking</span>
                    </div>
                </div>
            </div>

            <!-- VIEW B: ROLE SELECTION MODAL -->
            <div id="view-role" class="hidden glass-panel rounded-[28px] p-8 md:p-12 text-center animate-fade-in-up border border-white/10 shadow-2xl">
                <h2 class="font-display text-3xl font-bold mb-2">Welcome to Rentify</h2>
                <p class="text-slate-400 mb-8">How would you like to proceed with <span id="display-email" class="text-blue-400"></span>?</p>

                <div class="grid md:grid-cols-2 gap-4">
                    <!-- Partner Option -->
                    <button onclick="app.setRole('partner')" class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all text-left hover:border-blue-500/50">
                        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-briefcase text-xl"></i>
                        </div>
                        <h3 class="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">Partner / Owner</h3>
                        <p class="text-sm text-slate-400">List electronics, tools, and manage inventory.</p>
                    </button>

                    <!-- Customer Option -->
                    <button onclick="app.setRole('customer')" class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all text-left hover:border-teal-500/50">
                        <div class="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div class="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-user text-xl"></i>
                        </div>
                        <h3 class="font-bold text-lg mb-1 group-hover:text-teal-400 transition-colors">Customer</h3>
                        <p class="text-sm text-slate-400">Rent verified equipment for your next project.</p>
                    </button>
                </div>
                
                <button onclick="app.goBack('hero')" class="mt-8 text-sm text-slate-500 hover:text-white transition-colors flex items-center justify-center mx-auto gap-2">
                    <i class="fa-solid fa-arrow-left"></i> Back to email
                </button>
            </div>
        </div>
    </main>

    <!-- 3. FULL SCREEN PARTNER ONBOARDING OVERLAY -->
    <div id="partner-overlay" class="fixed inset-0 z-50 bg-[#020617] hidden flex-col">
        <!-- Header -->
        <header class="h-20 border-b border-white/10 flex items-center justify-between px-6 md:px-12 bg-[#020617]/90 backdrop-blur-md sticky top-0 z-50">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">R</div>
                <span class="text-slate-400 text-sm hidden md:block">Partner Onboarding</span>
            </div>
            
            <!-- Progress Steps -->
            <div class="flex items-center gap-2 md:gap-4">
                <div class="flex items-center gap-2">
                    <span id="step-indicator-1" class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span id="step-indicator-2" class="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                    <span id="step-indicator-3" class="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                    <span id="step-indicator-4" class="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                </div>
                <span class="text-xs text-slate-500 ml-2 font-mono"><span id="step-number">1</span>/4</span>
            </div>

            <button onclick="app.closePartnerFlow()" class="text-slate-400 hover:text-white transition-colors">
                <i class="fa-solid fa-xmark text-xl"></i>
            </button>
        </header>

        <!-- Main Content Scroll Area -->
        <div class="flex-grow overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#020617] to-[#0f172a]">
            <div class="max-w-3xl mx-auto px-6 py-12">
                
                <form id="partner-form" novalidate>
                    
                    <!-- STEP 1: PROFILE -->
                    <div id="step-1" class="step-content animate-fade-in-up">
                        <h2 class="font-display text-3xl font-bold mb-2">Create your Partner Profile</h2>
                        <p class="text-slate-400 mb-8">Let's get your account set up for payouts and trust verification.</p>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Full Name</label>
                                <input type="text" name="fullname" required class="w-full h-12 rounded-lg px-4 input-premium">
                            </div>
                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Phone Number</label>
                                <input type="tel" name="phone" required class="w-full h-12 rounded-lg px-4 input-premium">
                            </div>
                            <div class="col-span-2">
                                <label class="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Address Line 1</label>
                                <input type="text" name="address1" required class="w-full h-12 rounded-lg px-4 input-premium mb-4">
                                <div class="grid grid-cols-3 gap-4">
                                    <input type="text" name="city" placeholder="City" class="w-full h-12 rounded-lg px-4 input-premium">
                                    <input type="text" name="state" placeholder="State" class="w-full h-12 rounded-lg px-4 input-premium">
                                    <input type="text" name="pin" placeholder="PIN/Zip" class="w-full h-12 rounded-lg px-4 input-premium">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- STEP 2: BUSINESS SNAPSHOT -->
                    <div id="step-2" class="step-content hidden animate-fade-in-up">
                        <h2 class="font-display text-3xl font-bold mb-2">Business Snapshot</h2>
                        <p class="text-slate-400 mb-8">Tell us about your rental operations.</p>

                        <div class="mb-8">
                            <label class="block text-sm text-white mb-4">Do you currently run a registered rental business?</label>
                            <div class="flex gap-4">
                                <label class="cursor-pointer">
                                    <input type="radio" name="has_business" value="yes" class="peer sr-only" checked onchange="app.toggleBusinessFields(true)">
                                    <div class="px-6 py-3 rounded-lg border border-white/10 bg-white/5 peer-checked:bg-blue-600 peer-checked:border-blue-500 peer-checked:text-white text-slate-400 transition-all">
                                        Yes, I do
                                    </div>
                                </label>
                                <label class="cursor-pointer">
                                    <input type="radio" name="has_business" value="no" class="peer sr-only" onchange="app.toggleBusinessFields(false)">
                                    <div class="px-6 py-3 rounded-lg border border-white/10 bg-white/5 peer-checked:bg-blue-600 peer-checked:border-blue-500 peer-checked:text-white text-slate-400 transition-all">
                                        No, Individual
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div id="business-fields" class="space-y-6 border-l-2 border-white/10 pl-6 transition-all">
                            <div>
                                <label class="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Business Legal Name</label>
                                <input type="text" name="biz_name" class="w-full h-12 rounded-lg px-4 input-premium">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Years in Operation</label>
                                <select name="biz_years" class="w-full h-12 rounded-lg px-4 input-premium appearance-none">
                                    <option value="0-1">Less than 1 year</option>
                                    <option value="1-3">1 - 3 years</option>
                                    <option value="3+">3+ years</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- STEP 3: PLANS & VERIFICATION -->
                    <div id="step-3" class="step-content hidden animate-fade-in-up">
                        <h2 class="font-display text-3xl font-bold mb-2">Select Plan & Verify</h2>
                        <p class="text-slate-400 mb-8">Secure your account with identity verification.</p>

                        <!-- Plans -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            <!-- Free -->
                            <label class="cursor-pointer group">
                                <input type="radio" name="plan" value="free" class="peer sr-only">
                                <div class="p-6 rounded-xl border border-white/10 bg-white/5 peer-checked:border-blue-500 peer-checked:bg-blue-500/10 transition-all h-full hover:bg-white/10">
                                    <div class="text-xs font-bold text-slate-500 uppercase mb-2">Starter</div>
                                    <div class="text-2xl font-bold mb-2">Free</div>
                                    <ul class="text-sm text-slate-400 space-y-2">
                                        <li><i class="fa-solid fa-check text-green-500 mr-2"></i>Up to 10 products</li>
                                        <li><i class="fa-solid fa-check text-green-500 mr-2"></i>Basic Analytics</li>
                                        <li><i class="fa-solid fa-check text-green-500 mr-2"></i>Standard Support</li>
                                    </ul>
                                </div>
                            </label>
                            <!-- Pro -->
                            <label class="cursor-pointer group">
                                <input type="radio" name="plan" value="pro" class="peer sr-only" checked>
                                <div class="relative p-6 rounded-xl border border-blue-500 bg-blue-500/10 transition-all h-full shadow-lg shadow-blue-500/10">
                                    <div class="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">POPULAR</div>
                                    <div class="text-xs font-bold text-blue-400 uppercase mb-2">Professional</div>
                                    <div class="text-2xl font-bold mb-2">$29<span class="text-sm font-normal text-slate-400">/mo</span></div>
                                    <ul class="text-sm text-slate-300 space-y-2">
                                        <li><i class="fa-solid fa-check text-blue-400 mr-2"></i>Up to 50 products</li>
                                        <li><i class="fa-solid fa-check text-blue-400 mr-2"></i>Verified Badge</li>
                                        <li><i class="fa-solid fa-check text-blue-400 mr-2"></i>Priority Support</li>
                                    </ul>
                                </div>
                            </label>
                        </div>

                        <!-- Uploads -->
                        <div class="space-y-6">
                            <h3 class="text-lg font-bold text-white border-b border-white/10 pb-2">Required Documents</h3>
                            
                            <!-- ID Card Upload -->
                            <div>
                                <label class="block text-sm text-slate-400 mb-2">Government ID / National ID</label>
                                <div class="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors relative" id="drop-zone-id">
                                    <input type="file" id="file-id" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onchange="app.handleFilePreview(this, 'preview-id')">
                                    <div id="preview-id-content">
                                        <i class="fa-solid fa-id-card text-3xl text-slate-500 mb-3"></i>
                                        <p class="text-sm font-medium">Drag & drop or click to upload</p>
                                        <p class="text-xs text-slate-500 mt-1">PDF, JPG up to 5MB</p>
                                    </div>
                                    <div id="preview-id" class="hidden flex items-center justify-center gap-3 text-green-400">
                                        <i class="fa-solid fa-check-circle"></i> <span class="filename text-sm truncate max-w-[200px]"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- STEP 4: STORE SETUP -->
                    <div id="step-4" class="step-content hidden animate-fade-in-up">
                        <h2 class="font-display text-3xl font-bold mb-2">Launch your Store</h2>
                        <p class="text-slate-400 mb-8">Choose a starting template for your storefront.</p>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <label class="cursor-pointer group">
                                <input type="radio" name="template" value="modern" class="peer sr-only" checked>
                                <div class="rounded-xl overflow-hidden border border-white/10 peer-checked:border-blue-500 peer-checked:ring-2 ring-blue-500/20 transition-all">
                                    <div class="h-32 bg-slate-800 relative">
                                        <!-- Mockup of template -->
                                        <div class="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800"></div>
                                        <div class="absolute bottom-3 left-3 right-3 h-4 bg-white/10 rounded"></div>
                                        <div class="absolute bottom-9 left-3 w-1/2 h-4 bg-white/10 rounded"></div>
                                    </div>
                                    <div class="p-4 bg-white/5">
                                        <div class="font-bold text-white">Modern Grid</div>
                                        <div class="text-xs text-slate-400">Best for electronics & gadgets</div>
                                    </div>
                                </div>
                            </label>
                            
                            <label class="cursor-pointer group">
                                <input type="radio" name="template" value="minimal" class="peer sr-only">
                                <div class="rounded-xl overflow-hidden border border-white/10 peer-checked:border-blue-500 peer-checked:ring-2 ring-blue-500/20 transition-all">
                                    <div class="h-32 bg-slate-800 relative">
                                        <div class="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-700"></div>
                                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 text-4xl font-display">Aa</div>
                                    </div>
                                    <div class="p-4 bg-white/5">
                                        <div class="font-bold text-white">Editorial Minimal</div>
                                        <div class="text-xs text-slate-400">Best for fashion & furniture</div>
                                    </div>
                                </div>
                            </label>
                        </div>
                        
                        <div class="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-8">
                            <input type="checkbox" name="dev_assist" id="dev_assist" class="mt-1 bg-transparent border-white/20 rounded text-blue-500 focus:ring-offset-0 focus:ring-0">
                            <label for="dev_assist" class="text-sm text-slate-300">
                                <span class="text-white font-medium block">Need Developer Assistance?</span>
                                I want the Rentify team to help migrate my existing inventory via API/CSV.
                            </label>
                        </div>
                    </div>

                </form>
            </div>
        </div>

        <!-- Footer Actions -->
        <footer class="h-24 border-t border-white/10 bg-[#020617] flex items-center justify-between px-6 md:px-12 sticky bottom-0 z-50">
            <button onclick="app.prevStep()" id="btn-prev" class="px-6 py-3 rounded-lg text-slate-400 hover:text-white font-medium transition-colors invisible">
                Back
            </button>
            <button onclick="app.nextStep()" id="btn-next" class="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-lg shadow-white/10">
                <span>Continue</span>
                <i class="fa-solid fa-arrow-right"></i>
            </button>
        </footer>
    </div>

    <!-- JAVASCRIPT LOGIC -->
    <script>
        const app = {
            state: {
                email: '',
                role: null,
                step: 1,
                totalSteps: 4
            },

            init() {
                // Video wallpaper is handled by HTML video tag now
                this.setupEmailForm();
            },

            // --- UI Transitions ---
            
            setupEmailForm() {
                const form = document.getElementById('hero-email-form');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    const emailInput = document.getElementById('hero-email');
                    
                    // Manual Validation for Hero Form
                    if(!emailInput.value.trim() || !emailInput.checkValidity()) {
                        this.showError(emailInput, "Please enter a valid email address");
                        return;
                    }

                    const email = emailInput.value;
                    if(email) {
                        this.state.email = email;
                        document.getElementById('display-email').textContent = email;
                        
                        // Submit to fake API
                        this.simulateApiCall('signup_email.php', { email }).then(() => {
                            this.transitionView('view-hero', 'view-role');
                        });
                    }
                });
            },

            setRole(role) {
                this.state.role = role;
                if(role === 'partner') {
                    document.getElementById('partner-overlay').classList.remove('hidden');
                    document.getElementById('partner-overlay').classList.add('flex');
                } else {
                    // Customer logic would go here
                    alert("Customer Registration path selected (Demo End)");
                }
            },

            closePartnerFlow() {
                // Confirm logic usually here
                document.getElementById('partner-overlay').classList.add('hidden');
                document.getElementById('partner-overlay').classList.remove('flex');
            },

            transitionView(fromId, toId) {
                const from = document.getElementById(fromId);
                const to = document.getElementById(toId);
                
                from.classList.add('opacity-0', '-translate-y-4');
                setTimeout(() => {
                    from.classList.add('hidden');
                    to.classList.remove('hidden');
                    // Trigger reflow
                    void to.offsetWidth; 
                    to.classList.remove('opacity-0', 'translate-y-4');
                }, 500);
            },

            goBack(viewId) {
                if(viewId === 'hero') {
                    const from = document.getElementById('view-role');
                    const to = document.getElementById('view-hero');
                    
                    from.classList.add('hidden'); // Simplified back transition
                    to.classList.remove('hidden', 'opacity-0', '-translate-y-4');
                }
            },

            // --- ULTRA VALIDATION LOGIC ---

            validateStep(stepIndex) {
                const stepContent = document.getElementById(`step-${stepIndex}`);
                // Select inputs that are required AND visible
                const inputs = stepContent.querySelectorAll('input[required]:not(.hidden), select[required]:not(.hidden)');
                let isValid = true;

                // Remove existing errors first to prevent duplicates
                stepContent.querySelectorAll('.validation-tooltip').forEach(el => el.remove());
                stepContent.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        // Focus the first invalid input
                        if(document.activeElement === document.body) input.focus();
                        this.showError(input, "Please fill out this field");
                    }
                });

                return isValid;
            },

            showError(input, message) {
                // 1. Add Neon Shake Error Class
                input.classList.add('input-error');
                
                // 2. Add Relative Positioning to Parent (needed for tooltip)
                if(input.parentElement) {
                    input.parentElement.classList.add('input-group-relative');
                }
                
                // 3. Create 3D Tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'validation-tooltip';
                tooltip.innerHTML = `
                    <div class="validation-icon-box"><i class="fa-solid fa-exclamation"></i></div>
                    <span>${message}</span>
                `;
                
                // 4. Insert Tooltip
                input.parentElement.appendChild(tooltip);

                // 5. Auto-remove on typing
                const clearHandler = () => {
                    input.classList.remove('input-error');
                    tooltip.style.opacity = '0';
                    tooltip.style.transform = 'translateY(10px) scale(0.9)';
                    setTimeout(() => tooltip.remove(), 300); // Wait for fade out
                    input.removeEventListener('input', clearHandler);
                };
                
                input.addEventListener('input', clearHandler, { once: true });
            },

            // --- Multi-step Wizard Logic ---

            updateStepUI() {
                // Hide all contents
                document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
                // Show current
                document.getElementById(`step-${this.state.step}`).classList.remove('hidden');
                
                // Update Indicators
                for(let i=1; i<=4; i++) {
                    const dot = document.getElementById(`step-indicator-${i}`);
                    if(i <= this.state.step) {
                        dot.classList.remove('bg-slate-700');
                        dot.classList.add('bg-blue-500');
                    } else {
                        dot.classList.add('bg-slate-700');
                        dot.classList.remove('bg-blue-500');
                    }
                }
                document.getElementById('step-number').textContent = this.state.step;

                // Buttons
                const btnPrev = document.getElementById('btn-prev');
                const btnNext = document.getElementById('btn-next');
                
                btnPrev.classList.toggle('invisible', this.state.step === 1);
                
                if(this.state.step === this.state.totalSteps) {
                    btnNext.innerHTML = `<span>Submit Application</span> <i class="fa-solid fa-check"></i>`;
                    btnNext.classList.remove('bg-white', 'text-black');
                    btnNext.classList.add('bg-blue-600', 'text-white');
                } else {
                    btnNext.innerHTML = `<span>Continue</span> <i class="fa-solid fa-arrow-right"></i>`;
                    btnNext.classList.add('bg-white', 'text-black');
                    btnNext.classList.remove('bg-blue-600', 'text-white');
                }
            },

            nextStep() {
                // WRAPPED IN VALIDATION CHECK
                if(this.validateStep(this.state.step)) {
                    if(this.state.step < this.state.totalSteps) {
                        this.state.step++;
                        this.updateStepUI();
                    } else {
                        this.submitApplication();
                    }
                }
            },

            prevStep() {
                if(this.state.step > 1) {
                    this.state.step--;
                    this.updateStepUI();
                }
            },

            toggleBusinessFields(show) {
                const fields = document.getElementById('business-fields');
                if(show) {
                    fields.classList.remove('opacity-50', 'pointer-events-none');
                    // Enable required attributes for validation
                    fields.querySelectorAll('input, select').forEach(el => el.setAttribute('required', ''));
                } else {
                    fields.classList.add('opacity-50', 'pointer-events-none');
                    // Disable required attributes so validation skips them
                    fields.querySelectorAll('input, select').forEach(el => el.removeAttribute('required'));
                }
            },

            handleFilePreview(input, previewId) {
                if (input.files && input.files[0]) {
                    const file = input.files[0];
                    const contentDiv = document.getElementById(previewId + '-content');
                    const previewDiv = document.getElementById(previewId);
                    
                    contentDiv.classList.add('hidden');
                    previewDiv.classList.remove('hidden');
                    previewDiv.querySelector('.filename').textContent = file.name;
                }
            },

            async submitApplication() {
                const btn = document.getElementById('btn-next');
                btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing`;
                
                // Gather data
                const formData = new FormData(document.getElementById('partner-form'));
                formData.append('email', this.state.email);
                
                // Mock Network Delay
                await new Promise(r => setTimeout(r, 2000));
                
                alert("Application Submitted! Check your email (simulated).");
                window.location.reload();
            },
            
            async simulateApiCall(url, data) {
                // Placeholder for real fetch
                return new Promise(resolve => setTimeout(resolve, 600));
            }
        };

        // Initialize App
        document.addEventListener('DOMContentLoaded', () => app.init());

    </script>
</body>
</html>