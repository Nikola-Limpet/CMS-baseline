"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ContactChat = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Show the button after a short delay when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Hide on dashboard routes (must be after all hooks)
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  // Split text into words for animation
  const text = "Contact us via Telegram";
  const words = text.split(" ");

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    }
  };

  // Animation variants for each word
  const wordVariants: import('framer-motion').Variants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.8,
      transition: {
        duration: 0.1
      }
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-9 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
        >
          <div className="relative">
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute bottom-full mb-4 bg-white text-primary text-xs px-1 py-2 rounded-lg shadow-xl border border-gray-100"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    transform: "translateX(-50%)",
                    left: "50%"
                  }}
                >
                  <motion.div 
                    className="font-medium flex flex-wrap gap-1 whitespace-nowrap"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {words.map((word, index) => (
                      <motion.span 
                        key={index} 
                        variants={wordVariants}
                        className="inline-block"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45"></div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Button */}
            <motion.a
              href="https://t.me/MOVECambodia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-300"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="Contact us on Telegram"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={24} />
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactChat;