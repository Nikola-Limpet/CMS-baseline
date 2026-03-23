"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigationItems: {
    title: string
    href?: string
    items?: {
      title: string
      href: string
      description: string
    }[] | null
    highlight?: boolean
  }[]
}

export function MobileMenu({ isOpen, onClose, navigationItems }: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white/20 dark:bg-gray-900 z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  aria-label="Close menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
              </div>
              
              <div className="flex-1 p-4">
                <nav className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-2 mb-2 last:border-0">
                      {item.items ? (
                        <div>
                          <button
                            onClick={() => toggleExpand(index)}
                            className={cn(
                              "flex items-center justify-between w-full p-2 rounded-md text-left",
                              item.highlight ? "text-accent font-semibold" : "text-white",
                              expandedItems.includes(index) ? "bg-accent/10" : "hover:bg-accent/5"
                            )}
                          >
                            <span>{item.title}</span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="20" 
                              height="20" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className={cn(
                                "transition-transform duration-200",
                                expandedItems.includes(index) ? "rotate-180" : ""
                              )}
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                          
                          <AnimatePresence>
                            {expandedItems.includes(index) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 py-2 space-y-2">
                                  {item.items?.map((subItem, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      href={subItem.href}
                                      className="block p-2 rounded-md text-primary hover:bg-accent/5"
                                      onClick={onClose}
                                    >
                                      <div className="font-medium">{subItem.title}</div>
                                      <p className="text-sm text-muted-foreground">{subItem.description}</p>
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href || "#"}
                          className={cn(
                            "block p-2 rounded-md",
                            item.highlight ? "text-accent font-semibold" : "text-primary",
                            "hover:bg-accent/5"
                          )}
                          onClick={onClose}
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
