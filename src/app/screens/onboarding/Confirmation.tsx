import { Button } from '@/app/components/ui/button';
import { Activity, ArrowRight, Target, Calendar, TrendingUp, Sparkles } from 'lucide-react';

interface ConfirmationProps {
  onComplete: () => void;
}

const STEPS = [
  { label: 'Sports', active: true },
  { label: 'Goals', active: true },
  { label: 'Ready', active: true },
];

export function Confirmation({ onComplete }: ConfirmationProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">Sporgates</span>
            </div>
          </div>

          {/* Step indicator - all complete */}
          <div className="flex items-center gap-2">
            {STEPS.map((step) => (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="h-1.5 w-full rounded-full bg-primary transition-colors" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 py-12 pb-32 w-full">
          {/* Success icon */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
              You are all set!
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
              We have created a personalized plan based on your sports and goals. Here is what is ready for you.
            </p>
          </div>

          {/* Plan preview card */}
          <div className="rounded-2xl border-2 border-border bg-card p-6 space-y-5 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Your Personalized Plan</h3>
                <p className="text-xs text-muted-foreground">AI-powered, ready to go</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Calendar,
                  title: 'Weekly Activity Plan',
                  desc: '3 activities matched to your sports and availability',
                  color: 'text-primary',
                },
                {
                  icon: TrendingUp,
                  title: 'Progress Tracking',
                  desc: 'Smart milestones and performance insights',
                  color: 'text-secondary',
                },
                {
                  icon: Sparkles,
                  title: 'AI Recommendations',
                  desc: 'Workouts and events tailored to your goals',
                  color: 'text-primary',
                },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '12+', label: 'Activities nearby', color: 'text-primary' },
              { value: '5', label: 'Goals tracked', color: 'text-secondary' },
              { value: '24', label: 'Milestones set', color: 'text-primary' },
            ].map(({ value, label, color }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border p-4 z-20">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={onComplete}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
