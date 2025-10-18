'use client';

import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Calendar, Clock } from 'lucide-react';

export function EventHeader() {
  return (
    <div className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 
              className="text-xl font-bold text-foreground" 
              style={{ fontFamily: 'Decaydence' }}
            >
              ELOQUENCE'25
            </h1>
            <nav className="hidden md:flex gap-6">
              <a 
                href="#events" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: 'Helvetica' }}
              >
                Events
              </a>
              <a 
                href="#location" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: 'Helvetica' }}
              >
                Location
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground"
              style={{ fontFamily: 'Helvetica' }}
            >
              Register
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventBanner() {
  return (
    <div className="w-full py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p 
          className="text-sm sm:text-base font-medium text-muted-foreground uppercase tracking-wide mb-2"
          style={{ fontFamily: 'Helvetica' }}
        >
          C. Abdul Hakeem College of Engineering and Technology
        </p>
        <p 
          className="text-xs sm:text-sm text-muted-foreground mb-1"
          style={{ fontFamily: 'Helvetica' }}
        >
          Department of Computer Science and Engineering
        </p>
        <p 
          className="text-xs sm:text-sm italic text-muted-foreground mb-6"
          style={{ fontFamily: 'Monotype Corsiva, cursive' }}
        >
          proudly presents
        </p>

        <h1 
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-3 tracking-tight"
          style={{ 
            fontFamily: 'Decaydence',
            letterSpacing: '0.07em' // Added similar tracking from your example
          }}
        >
          ELOQUENCE'25
        </h1>

        <p 
          className="text-lg sm:text-xl font-semibold text-primary mb-8"
          style={{ fontFamily: 'Helvetica' }}
        >
          8th National Level Technical Symposium
        </p>

        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base"
          style={{ fontFamily: 'Helvetica' }}
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium">November 1, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-medium">9:00 AM - 5:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}