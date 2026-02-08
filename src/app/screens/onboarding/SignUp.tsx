import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { Card } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Target, 
  Zap, 
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface SignUpProps {
  onComplete: () => void;
}

export function SignUp({ onComplete }: SignUpProps) {
  const [view, setView] = useState<'landing' | 'auth'>('landing');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003C66] via-[#003C66]/95 to-[#FC8936]/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FC8936] to-[#003C66] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Sporgates</h1>
            </div>
            <Button 
              onClick={() => setView('auth')}
              variant="outline"
              className="border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-4">
              <Sparkles className="w-4 h-4 text-secondary" />
              AI-Powered Sports Platform
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              Connect. Move. Achieve.
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              The complete platform connecting athletes, organizers, and sponsors around sports and healthy lifestyles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg"
                onClick={() => setView('auth')}
                className="h-14 px-8 bg-gradient-to-r from-[#FC8936] to-[#FC8936]/80 hover:from-[#FC8936]/90 hover:to-[#FC8936]/70 text-white shadow-2xl"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="h-14 px-8 border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {/* For Athletes */}
            <Card className="bg-white/95 backdrop-blur-xl p-6 space-y-4 border-2 border-white/20 hover:border-[#FC8936]/50 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FC8936] to-[#FC8936]/70 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary">For Athletes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover activities, join events, track your fitness goals with AI, and connect with like-minded athletes
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>AI-powered goal tracking</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Find activities & facilities nearby</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Join squads & compete in events</span>
                </li>
              </ul>
            </Card>

            {/* For Organizers */}
            <Card className="bg-white/95 backdrop-blur-xl p-6 space-y-4 border-2 border-[#FC8936] hover:shadow-2xl transition-all md:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#003C66] to-[#003C66]/70 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary">For Organizers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create events, manage facilities, run sponsorship campaigns, and grow your sports business
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Create & manage activities</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Launch sponsorship campaigns</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Team & resource management</span>
                </li>
              </ul>
            </Card>

            {/* For Sponsors */}
            <Card className="bg-white/95 backdrop-blur-xl p-6 space-y-4 border-2 border-white/20 hover:border-[#FC8936]/50 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FC8936] to-[#003C66] rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary">For Sponsors</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect with athletes, sponsor events, and maximize your brand impact with detailed analytics
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Discover sponsorship opportunities</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Real-time campaign analytics</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Direct athlete collaboration</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Platform Features */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-2">
                Everything in one platform
              </h3>
              <p className="text-muted-foreground">
                Powered by AI and built for the sports community
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">AI Goal Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Smart recommendations and progress insights
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Sponsored Events</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect businesses with athletes seamlessly
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Complete Marketplace</h4>
                  <p className="text-sm text-muted-foreground">
                    Activities, facilities, products & services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003C66] via-[#003C66]/95 to-[#FC8936]/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Back button */}
        <button
          onClick={() => setView('landing')}
          className="text-white/80 hover:text-white text-sm flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </button>

        {/* Logo/Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FC8936] to-[#003C66] rounded-3xl mb-4 shadow-xl">
            <span className="text-4xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Sporgates
          </h1>
          <p className="text-white/80 text-lg">
            Connect. Move. Achieve.
          </p>
        </div>

        {/* Auth Form with Tabs */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1">
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
              <TabsTrigger 
                value="signin"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                Sign In
              </TabsTrigger>
            </TabsList>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="p-8 space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-primary">Create your account</h2>
                <p className="text-sm text-muted-foreground">
                  Join the sports community today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-primary">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11 border-gray-200 focus:border-[#FC8936] focus:ring-[#FC8936]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-primary">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-11 border-gray-200 focus:border-[#FC8936] focus:ring-[#FC8936]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-primary">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-11 border-gray-200 focus:border-[#FC8936] focus:ring-[#FC8936]"
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters with a mix of letters and numbers
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-[#003C66] to-[#FC8936] hover:opacity-90 transition-opacity shadow-lg text-white font-medium"
                >
                  Create Account & Continue
                </Button>
              </form>

              <div className="relative">
                <Separator className="bg-gray-200" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full h-11 border-gray-200 hover:border-[#FC8936] hover:bg-secondary/5 transition-colors" type="button">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                
                <Button variant="outline" className="w-full h-11 border-gray-200 hover:border-[#FC8936] hover:bg-secondary/5 transition-colors" type="button">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  Continue with GitHub
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground pt-2">
                By signing up, you agree to our{' '}
                <button className="text-primary hover:underline">Terms</button>
                {' '}and{' '}
                <button className="text-primary hover:underline">Privacy Policy</button>
              </p>
            </TabsContent>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="p-8 space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-primary">Welcome back</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to continue your fitness journey
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-primary">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="h-11 border-gray-200 focus:border-[#FC8936] focus:ring-[#FC8936]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password" className="text-primary">Password</Label>
                    <button 
                      type="button"
                      className="text-xs text-primary hover:text-secondary transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    className="h-11 border-gray-200 focus:border-[#FC8936] focus:ring-[#FC8936]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-[#003C66] to-[#FC8936] hover:opacity-90 transition-opacity shadow-lg text-white font-medium"
                >
                  Sign In
                </Button>
              </form>

              <div className="relative">
                <Separator className="bg-gray-200" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full h-11 border-gray-200 hover:border-[#FC8936] hover:bg-secondary/5 transition-colors" type="button">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                
                <Button variant="outline" className="w-full h-11 border-gray-200 hover:border-[#FC8936] hover:bg-secondary/5 transition-colors" type="button">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  Continue with GitHub
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}