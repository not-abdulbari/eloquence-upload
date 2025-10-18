import { User, Calendar, Users, CheckCircle } from 'lucide-react';

const steps = [
  { icon: User, label: 'Personal' },
  { icon: Calendar, label: 'Events' },
  { icon: Users, label: 'Team' },
  { icon: CheckCircle, label: 'Pay & Confirm' },
];

export function ProgressIndicator() {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground text-center">
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="h-[2px] bg-border flex-1 mx-2 mt-[-20px]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
