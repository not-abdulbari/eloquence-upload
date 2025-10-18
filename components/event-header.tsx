'use client';

import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export function EventHeader() {
  return (
    <div className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 
              className="text-xl font-bold text-foreground" 
              style={{ fontFamily: 'Decaydence', alignItems: 'center', display: 'flex' }}
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
          className="text-sm sm:text-xl font-semibold text-primary mb-1 uppercase"
          style={{ fontFamily: 'Helvetica' }}
        >
          C. Abdul Hakeem College of Engineering and Technology
        </p>
        <p 
          className="text-sm sm:text-xl text-primary mb-1"
          style={{ fontFamily: 'Helvetica' }}
        >
          Department of Computer Science and Engineering
        </p>
        <p 
          className="text-sm sm:text-xl text-primary mb-2"
          style={{ fontFamily: 'Monotype Corsiva, cursive' }}
        >
          proudly presents
        </p>

        <h1
          className="font-black text-foreground mb-3 tracking-tight align-items-center flex justify-center"
          style={{
            fontFamily: 'Decaydence',
            letterSpacing: '0.07em', // preserve previous tracking
            // Fluid responsive size (smaller): min 1.75rem, scales with viewport, max 3.25rem
            fontSize: 'clamp(1.7rem, 4.5vw, 3.25rem)',
            alignItems: 'center',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          ELOQUENCE'25
        </h1>

        <p 
          className="text-sm sm:text-xl font-semibold text-primary mb-4"
          style={{ fontFamily: 'Helvetica' }}
        >
          8th National Level Technical Symposium
        </p>

        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base"
          style={{ fontFamily: 'Helvetica' }}
        >
          </div>
      </div>
    </div>
  );
}