/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Instagram, Twitter, ChevronDown, MessageCircle, Star, Globe, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect, ReactNode, MouseEvent } from 'react';
import Lenis from 'lenis';

// --- DATA ---
const LUXURY_EASE = [0.22, 1, 0.36, 1];
const LUXURY_DURATION = 1.2;

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: LUXURY_DURATION,
      ease: LUXURY_EASE
    }
  })
};

const COLLECTION = [
  { id: '01', name: 'THE ARCHIVAL BRIDAL', type: 'COUTURE', image: new URL('../image/category/SaveClip.App_487699408_18067932913933297_9045431423588660882_n.jpg', import.meta.url).href },
  { id: '02', name: 'EVENING SILK', type: 'RESORT 26', image: new URL('../image/category/SaveClip.App_488496415_18024582311669172_6376672514427570374_n.jpg', import.meta.url).href },
  { id: '03', name: 'SIGNATURE VEIL', type: 'ACCESSORY', image: new URL('../image/category/SaveClip.App_488964906_18024582290669172_6004545392008781104_n.jpg', import.meta.url).href },
  { id: '04', name: 'MOONLIGHT VELVET', type: 'EVENINGWEAR', image: new URL('../image/category/SaveClip.App_489037234_18024582254669172_5603528417912204920_n.jpg', import.meta.url).href },
];

const PRESS = [
  { name: 'VOGUE', quote: 'Bridal couture tailored beyond expectation.' },
  { name: 'Bazaar', quote: 'Elegance that feels deeply personal.' },
  { name: 'Wallpaper*', quote: 'Exquisite pieces for unforgettable entrances.' },
];

const PROCESS = [
  { id: '01', title: 'VISION', desc: 'Describe your ideal silhouette and dream bridal concept.' },
  { id: '02', title: 'CRAFTSMANSHIP', desc: 'Tailoring with precision, artistry, and luxury craftsmanship.' },
  { id: '03', title: 'THE SILHOUETTE', desc: 'A curated expression of elegance and timeless femininity.' },
];

const REVIEWS = [
  { name: 'ELEANOR R.', role: 'Couture Client', quote: 'The attention to detail is unmatched. My gown was not just a dress, it was a work of art that told my story.' },
  { name: 'SOPHIA L.', role: 'Eveningwear', quote: 'A truly cinematic experience from the first consultation to the final fitting. Pure luxury.' },
  { name: 'ISABELLA M.', role: 'Bridal Archive', quote: 'Timeless elegance that felt deeply personal. I have never felt more present in a garment.' },
];

const SERVICES = [
  {
    title: 'BRIDAL',
    headline: 'Bridal Pieces Designed for Your Big Day',
    body: 'Every bride deserves a dress that feels unforgettable. We create elegant bridal pieces tailored to your style, body, and vision.',
    cta: 'Book Bridal Consultation',
    image: new URL('../image/category/SaveClip.App_482116242_18020163959669172_9097049101855516725_n.jpg', import.meta.url).href
  },
  {
    title: 'EVENINGWEAR',
    headline: 'Elegant Pieces for Special Occasions',
    body: 'Sophisticated eveningwear crafted for weddings, receptions, celebrations, and unforgettable entrances.',
    cta: 'Explore Eveningwear',
    image: new URL('../image/category/SaveClip.App_488496415_18024582311669172_6376672514427570374_n.jpg', import.meta.url).href
  },
  {
    title: 'BESPOKE',
    headline: 'Tailored Exclusively for You',
    body: 'Every design is made with attention to detail, premium finishing, and a perfect fit that reflects your elegance.',
    cta: 'Begin Your Custom Order',
    image: new URL('../image/category/SaveClip.App_684453512_18070993691669172_491418981219494528_n.jpg', import.meta.url).href
  }
];

// --- COMPONENTS ---

const GrainOverlay = () => <div className="grain" />;

const AmbientBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="ambient-orb" style={{ top: '-10%', left: '-10%' }} />
    <div className="ambient-orb" style={{ bottom: '-10%', right: '-10%', animationDelay: '-5s' }} />
  </div>
);

const TextReveal = ({ children, className = "", delay = 0 }: { children: string, className?: string, delay?: number }) => {
  return (
    <div className={`text-mask ${className}`}>
      <motion.span
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 1.2, ease: LUXURY_EASE }}
        className="block"
      >
        {children}
      </motion.span>
    </div>
  );
};

const WordReveal = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const words = text.split(" ");
  return (
    <div className={`flex flex-wrap justify-center sm:justify-start overflow-hidden py-2 ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="mr-[0.25em] last:mr-0 overflow-hidden inline-flex">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: delay + (i * 0.1), duration: 2, ease: LUXURY_EASE }}
            className="block"
          >
            {word === "&" ? "\u0026" : word}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

const ImageReveal = ({ src, alt, className = "", containerClassName = "" }: { src: string, alt: string, className?: string, containerClassName?: string }) => {
  return (
    <motion.div 
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.5, ease: LUXURY_EASE }}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <motion.img 
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 1.5, ease: LUXURY_EASE }}
        src={src} 
        alt={alt}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover transition-all duration-1000 ${className}`}
      />
    </motion.div>
  );
};

interface LuxuryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'glass' | 'editorial' | 'outline';
  className?: string;
  icon?: ReactNode;
}

const LuxuryButton = ({ children, onClick, variant = 'primary', className = "", icon }: LuxuryButtonProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x: x * 0.15, y: y * 0.15 });
  };

  const variants = {
    primary: "bg-white text-[#1a2e40] border-transparent hover:bg-opacity-95",
    ghost: "bg-transparent text-white border-white/10 hover:bg-white/5",
    glass: "glass text-white",
    editorial: "bg-transparent text-white border-white/20 hover:bg-white hover:text-black",
    outline: "bg-transparent text-white border-white/30 hover:bg-white/5",
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      animate={{
        x: mousePos.x,
        y: mousePos.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.1 }}
      className={`
        relative flex items-center justify-center gap-3 px-6 py-2.5 min-h-[44px] 
        text-sm font-sans font-medium rounded-xl transition-all shadow-sm
        duration-300 cursor-none ${variants[variant]} ${className}
      `}
    >
      <span className="relative z-10 flex items-center gap-3">
        {children}
        {icon && (
          <motion.span
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.5, ease: LUXURY_EASE }}
          >
            {icon}
          </motion.span>
        )}
      </span>
      {variant === 'primary' && (
        <motion.div 
          initial={false}
          animate={{ opacity: isHovered ? 0.05 : 0 }}
          className="absolute inset-0 bg-black"
        />
      )}
    </motion.button>
  );
};

const WhatsAppCTA = () => (
  <motion.a
    href="https://wa.me/#"
    target="_blank"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 3, duration: 1 }}
    whileHover={{ scale: 1.1 }}
    className="fixed bottom-8 left-8 z-40 p-4 rounded-full glass border border-white/10 hover:border-white/30 transition-colors group"
  >
    <MessageCircle size={20} strokeWidth={1} className="group-hover:text-green-400/50 transition-colors" />
    <span className="absolute left-16 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">MESSAGE THE ATELIER</span>
  </motion.a>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);
  
  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 2, ease: LUXURY_EASE }}
        className={`fixed top-0 left-0 w-full z-50 p-6 sm:p-10 flex justify-between items-center transition-all duration-700 ${
          isScrolled ? 'py-4 backdrop-blur-xl bg-black/20 border-b border-white/5' : ''
        }`}
      >
        <span className="text-[10px] tracking-[0.6em] font-light mix-blend-difference">SENGANEWO OFFICIAL</span>
        <motion.button 
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          className="group relative flex items-center gap-4 cursor-none p-2 mix-blend-difference"
        >
          <div className="flex flex-col gap-1.5 items-end">
            <motion.div 
              animate={{ width: isScrolled ? 16 : 24 }}
              className="h-[1px] bg-white transition-all duration-500" 
            />
            <motion.div 
              animate={{ width: isScrolled ? 24 : 16 }}
              className="h-[1px] bg-white transition-all duration-500" 
            />
          </div>
          <span className="text-[8px] tracking-[0.6em] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 font-sans font-light">INDEX</span>
        </motion.button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: LUXURY_DURATION, ease: LUXURY_EASE }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center font-sans"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 p-4 hover:scale-110 transition-transform"
            >
              <X size={24} strokeWidth={1} />
            </button>
            <div className="flex flex-col gap-8 text-center px-8">
              {['COLLECTIONS', 'THE MANIFESTO', 'ARCHIVE', 'PROCESS', 'CONTACT'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: LUXURY_DURATION, ease: LUXURY_EASE }}
                  className="text-3xl sm:text-5xl font-kugile tracking-tighter hover:opacity-50 transition-opacity"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
            </div>
            <div className="absolute bottom-12 flex gap-8">
              <Instagram size={18} strokeWidth={1} className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
              <Twitter size={18} strokeWidth={1} className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('.group')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-[100] mix-blend-difference hidden sm:block"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
      }}
      transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.5 }}
    />
  );
};

export default function App() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);

  // Lenis Smooth Scroll Integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });
  const finalSectionOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[100]">
        <div className="flex flex-col items-center gap-6 overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1, ease: LUXURY_EASE }}
          >
            <span className="text-[10px] tracking-[1.5em] font-light font-kugile">SENGANEWO</span>
          </motion.div>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ delay: 0.5, duration: 1.5, ease: LUXURY_EASE }}
            className="h-[1px] bg-white/20"
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative selection:bg-white selection:text-black bg-[#050505]">
      <CustomCursor />
      <AmbientBackground />
      <GrainOverlay />
      <Navbar />
      <WhatsAppCTA />

      {/* --- HERO --- */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.45 }}
          transition={{ duration: 4, ease: LUXURY_EASE }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${new URL('../image/hero page/hero page.jpg', import.meta.url).href})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#050505]" />
        
        <div className="relative z-10 text-center sm:text-left px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 2, ease: LUXURY_EASE }}
            className="mb-8"
          >
            <span className="text-[9px] tracking-[1em] uppercase opacity-40 block font-sans font-light">COLLECTION — ARCHIVE NO. 26</span>
          </motion.div>
          
          <WordReveal text="LUXURY BRIDAL & BESPOKE." className="text-4xl sm:text-7xl font-kugile tracking-tighter leading-none" />
          <WordReveal text="CRAFTED IN LAGOS." className="text-4xl sm:text-7xl font-kugile tracking-tighter leading-none italic font-light opacity-50" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2.5, duration: 2.5, ease: LUXURY_EASE }}
            className="mt-16 text-[9px] tracking-[0.5em] max-w-sm mx-auto sm:ml-0 leading-relaxed uppercase font-sans font-extralight"
          >
            Custom bridal and eveningwear made for women who appreciate luxury, detail, and exceptional finishing.
          </motion.div>
          <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-6 mt-12">
            <LuxuryButton 
              variant="primary"
              className="w-full sm:w-auto"
            >
              BOOK CONSULTATION
            </LuxuryButton>
            <LuxuryButton 
              variant="editorial"
              className="w-full sm:w-auto"
            >
              VIEW COLLECTIONS
            </LuxuryButton>
          </div>
        </div>

        <motion.div 
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute bottom-12 flex flex-col items-center gap-4 opacity-20"
        >
          <span className="text-[9px] tracking-[0.5em] uppercase font-sans">DESCEND</span>
          <ChevronDown size={14} strokeWidth={1} />
        </motion.div>
      </section>

      {/* --- EDITORIAL QUOTE --- */}
      <section className="min-h-[60vh] flex items-center justify-center py-40 px-8 bg-[#050505]">
        <div className="max-w-3xl text-center space-y-16">
          <h2 className="text-xl sm:text-4xl font-armeli italic leading-relaxed tracking-tight text-white/90">
            <TextReveal delay={0.1}>"Elegance Is Not Worn.</TextReveal>
            <TextReveal delay={0.3}>It Is Embodied."</TextReveal>
          </h2>
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: '40px', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 2, ease: LUXURY_EASE }}
            className="h-[1px] bg-white/20 mx-auto"
          />
        </div>
      </section>

      {/* --- BRAND STORY: THE MANIFESTO --- */}
      <section id="the manifesto" className="py-40 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="bg-[#262626] p-6 aspect-[4/5] flex flex-col justify-between items-center text-white font-sans rounded-sm">
          <div className="text-[10px] tracking-[0.5em] uppercase opacity-80 font-light">MANIFESTO</div>
          <div className="w-[92%] h-[88%] overflow-hidden border border-white/5 shadow-sm">
            <img 
              src={new URL('../image/category/SaveClip.App_482116242_18020163959669172_9097049101855516725_n.jpg', import.meta.url).href}
              alt="Craftsmanship" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-[8px] tracking-[0.3em] uppercase opacity-60 text-center font-light">
            SENGANEWO OFFICIAL — ARCHIVE NO. 26
          </div>
        </div>
        
        <div className="space-y-12">
          <div className="space-y-4">
             <TextReveal className="text-[10px] tracking-[0.5em] opacity-40 uppercase font-sans font-light">
               EDITORIAL
             </TextReveal>
             <h3 className="text-5xl sm:text-7xl font-kugile tracking-tighter leading-none">
               <TextReveal delay={0.1}>THE ART</TextReveal>
               <TextReveal delay={0.2} className="italic font-light text-white/70">OF PRESENCE</TextReveal>
             </h3>
          </div>
          <motion.p 
            custom={2}
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            className="text-lg font-sans font-extralight leading-relaxed opacity-60 max-w-lg"
          >
            Senganewo Official creates garments that leave lasting impressions 
            for women who wear elegance like identity. Every piece is designed 
            to embody confidence, sophistication, and unforgettable femininity.
          </motion.p>
          <div className="flex flex-col gap-6 pt-8 border-t border-white/10">
            {PROCESS.map((p, i) => (
              <motion.div 
                key={p.id}
                custom={3 + i}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-sans opacity-20">{p.id}</span>
                  <span className="text-sm tracking-[0.2em] group-hover:tracking-[0.4em] transition-all duration-700 font-sans font-light">{p.title}</span>
                </div>
                <p className="pl-[38px] pt-2 text-xs opacity-0 h-0 group-hover:opacity-40 group-hover:h-auto transition-all duration-500 overflow-hidden leading-relaxed font-sans font-extralight">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- COLLECTION SELECTION --- */}
      <section id="services" className="py-40 bg-[#070707] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-16">
            <h2 className="text-xl font-kugile tracking-tighter">COLLECTION</h2>
            <span className="text-sm font-sans opacity-50">CATEGORIES</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {SERVICES.map((item, i) => (
              <div key={i} className="bg-[#0a0a0a] rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-1000 hover:scale-105"
                  />
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="glass px-3 py-1.5 text-[8px] tracking-[0.2em] uppercase font-sans font-light rounded-full border border-white/10">
                      {item.title}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4 flex flex-col justify-between flex-grow">
                  <div className="space-y-2">
                    <h3 className="text-xl font-kugile tracking-tight">{item.headline}</h3>
                    <p className="text-xs opacity-60 leading-relaxed font-sans font-light">{item.body}</p>
                  </div>
                  <div className="pt-4">
                    <LuxuryButton variant="outline" className="w-full">
                      {item.cta.toUpperCase()}
                    </LuxuryButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- COLLECTION CAROUSEL --- */}
      <section id="collections" className="py-40 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-16">
          <motion.h2 
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xl font-kugile tracking-tighter"
          >
            THE EDIT 01
          </motion.h2>
          <span className="text-sm font-sans opacity-50">
            0{activeIndex + 1}/0{COLLECTION.length}
          </span>
        </div>

        <div className="relative flex justify-center items-center gap-4 py-10 overflow-hidden">
          {/* Left Arrow */}
          <button 
            onClick={() => setActiveIndex((prev) => (prev === 0 ? COLLECTION.length - 1 : prev - 1))}
            className="absolute left-4 z-20 p-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition-colors duration-500"
          >
            <ChevronLeft size={20} strokeWidth={1} />
          </button>

          <div className="flex justify-center items-center gap-8 w-full max-w-5xl">
            {COLLECTION.map((item, i) => {
              const isActive = i === activeIndex;
              const isPrev = i === activeIndex - 1 || (activeIndex === 0 && i === COLLECTION.length - 1);
              const isNext = i === activeIndex + 1 || (activeIndex === COLLECTION.length - 1 && i === 0);

              // Only show active and adjacent items for a clean carousel look
              if (!isActive && !isPrev && !isNext) return null;

              return (
                <motion.div
                  key={item.id}
                  animate={{
                    scale: isActive ? 1 : 0.8,
                    opacity: isActive ? 1 : 0.4,
                    zIndex: isActive ? 10 : 1,
                  }}
                  transition={{ duration: 0.8, ease: LUXURY_EASE }}
                  className={`relative cursor-pointer transition-all duration-700 ${
                    isActive ? 'w-[80vw] sm:w-[350px] h-[450px]' : 'w-[60vw] sm:w-[250px] h-[350px]'
                  } rounded-3xl overflow-hidden bg-[#0a0a0a]`}
                  onClick={() => setActiveIndex(i)}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-all duration-1000"
                  />

                </motion.div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => setActiveIndex((prev) => (prev === COLLECTION.length - 1 ? 0 : prev + 1))}
            className="absolute right-4 z-20 p-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition-colors duration-500"
          >
            <ChevronRight size={20} strokeWidth={1} />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {COLLECTION.map((_, i) => (
            <div
              key={i}
              className={`h-[1px] transition-all duration-500 ${
                i === activeIndex ? 'w-8 bg-white' : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>
      </section>

      {/* --- PRESS / SOCIAL PROOF --- */}
      <section className="py-40 bg-[#070707] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
          {PRESS.map((item, i) => (
            <motion.div 
              key={item.name}
              custom={i}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center space-y-6"
            >
              <span className="text-xs tracking-[0.8em] font-sans font-light uppercase opacity-20 block">{item.name}</span>
              <p className="text-lg font-armeli italic opacity-60">“{item.quote}”</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- CRAFTSMANSHIP / PROCESS --- */}
      <section id="process" className="relative py-60 px-8 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-24">
           <div className="space-y-4">
             <TextReveal className="text-[10px] tracking-[0.8em] opacity-30 uppercase font-sans">THE JOURNEY</TextReveal>
             <h2 className="text-3xl sm:text-5xl font-kugile tracking-tighter leading-none">
               <TextReveal delay={0.1}>CRAFTED EXCLUSIVELY</TextReveal>
               <TextReveal delay={0.2} className="italic font-light opacity-50">AROUND YOU</TextReveal>
             </h2>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-left">
              {[
                { icon: Globe, title: 'GLOBAL SOURCING', text: 'Traveling to the edges of the map to find fibers and laces that have no name.' },
                { icon: ShieldCheck, title: 'ARCHIVAL CARE', text: 'Every stitch is laboratory tested for longevity across generations.' },
                { icon: Star, title: 'LIFETIME REFINERY', text: 'We offer complimentary adjustments for every garment, forever.' }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.15, duration: LUXURY_DURATION, ease: LUXURY_EASE }}
                  className="space-y-6 group"
                >
                  <item.icon size={24} strokeWidth={1} className="opacity-20 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700" />
                  <h4 className="text-sm tracking-[0.2em] font-medium font-sans">{item.title}</h4>
                  <p className="text-xs opacity-40 leading-relaxed font-sans font-extralight">{item.text}</p>
                </motion.div>
              ))}
           </div>
           <div className="flex justify-center pt-8">
             <LuxuryButton 
              variant="editorial"
              className="w-full sm:w-auto"
             >
              INQUIRE PRIVATELY
             </LuxuryButton>
           </div>
        </div>
      </section>

      {/* --- REVIEWS --- */}
      <section className="py-40 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-16">
            <h2 className="text-xl font-kugile tracking-tighter">THE REVIEWS</h2>
            <span className="text-sm font-sans opacity-50">VOICES</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {REVIEWS.map((item, i) => (
              <div key={i} className="space-y-6">
                <div className="flex gap-1 text-white/40">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" stroke="none" />)}
                </div>
                <p className="text-xl font-armeli italic text-white/90 leading-relaxed">“{item.quote}”</p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium">{item.name}</p>
                  <p className="text-[8px] tracking-[0.1em] uppercase font-sans opacity-40 mt-1">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section id="contact" className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-[#050505] m-8 rounded-3xl">
        <div 
          className="absolute inset-0 bg-fixed bg-cover bg-center opacity-20" 
          style={{ backgroundImage: `url(${new URL('../image/category/SaveClip.App_658963460_18088318916191022_5496672212479365089_n.jpg', import.meta.url).href})` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        
        <div className="relative z-10 px-8 text-center space-y-16">
          <div className="space-y-6">
            <TextReveal className="text-[10px] tracking-[1em] uppercase opacity-30 font-sans">FINALE</TextReveal>
            <h2 className="text-4xl sm:text-7xl font-kugile tracking-tighter leading-tight max-w-5xl mx-auto">
               <TextReveal delay={0.1}>LET’S BRING YOUR</TextReveal>
               <TextReveal delay={0.2} className="italic font-light opacity-50">DREAM OUTFIT TO LIFE.</TextReveal>
            </h2>
            <p className="text-sm opacity-60 max-w-xl mx-auto font-sans font-light mt-4">
              Chat directly with us to discuss your bridal or bespoke outfit.
            </p>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.5, ease: LUXURY_EASE }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <LuxuryButton 
              variant="primary"
              className="w-full sm:w-auto min-w-[200px]"
              icon={<ArrowRight size={14} />}
            >
              MESSAGE US ON WHATSAPP
            </LuxuryButton>
            <LuxuryButton 
              variant="editorial"
              className="w-full sm:w-auto min-w-[200px]"
            >
              VIEW COLLECTIONS
            </LuxuryButton>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-32 px-8 border-t border-white/5 flex flex-col items-center gap-16 bg-[#050505]">
        <div className="text-[11px] tracking-[1.5em] font-kugile font-light">SENGANEWO OFFICIAL</div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 text-center w-full max-w-6xl opacity-30 text-[9px] tracking-[0.4em] uppercase font-sans">
          <a href="#" className="hover:opacity-100 transition-opacity">STOCKISTS</a>
          <a href="#" className="hover:opacity-100 transition-opacity">CARE GUIDE</a>
          <a href="#" className="hover:opacity-100 transition-opacity">SHIPPING</a>
          <a href="#" className="hover:opacity-100 transition-opacity">PRIVACY</a>
          <a href="#" className="hover:opacity-100 transition-opacity">TERMS</a>
        </div>
        <div className="flex flex-col items-center gap-4 text-[9px] tracking-widest opacity-20 uppercase font-sans">
          <span>SENGANEWO GLOBAL STUDIO / LAGOS, NIGERIA / 6.5244° N, 3.3792° E</span>
          <span>© 2026 HOUSE OF SENGANEWO</span>
        </div>
      </footer>
    </div>
  );
}
