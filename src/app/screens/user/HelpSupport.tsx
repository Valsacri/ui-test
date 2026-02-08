import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { ChevronLeft, HelpCircle, MessageCircle, Mail, Phone, Search } from 'lucide-react';
import { toast } from 'sonner';

interface HelpSupportProps {
  onBack?: () => void;
}

const FAQ_ITEMS = [
  {
    category: 'Account & Profile',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button on the homepage and follow the registration process. You\'ll need to provide your email, create a password, and verify your email address.',
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to reset your password.',
      },
      {
        question: 'Can I change my username?',
        answer: 'Yes, you can change your username in Settings > Profile Information. Note that your username must be unique.',
      },
    ],
  },
  {
    category: 'Activities & Events',
    questions: [
      {
        question: 'How do I join an activity?',
        answer: 'Browse activities in the Explore section, click on one that interests you, and press the "Join" button. Some activities may require payment or approval from the organizer.',
      },
      {
        question: 'Can I cancel after joining an activity?',
        answer: 'Yes, you can cancel your participation. Refund eligibility depends on the activity organizer\'s cancellation policy and timing.',
      },
      {
        question: 'How do I create my own activity?',
        answer: 'If you have a business account, navigate to the Business Dashboard and click "Create Activity". Fill in the details, set the date/time, and publish.',
      },
    ],
  },
  {
    category: 'Payments & Wallet',
    questions: [
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept major credit cards (Visa, Mastercard, American Express), debit cards, and digital wallets. You can also top up your Sporgates wallet for faster transactions.',
      },
      {
        question: 'How do refunds work?',
        answer: 'Refunds are processed according to each activity or business\'s refund policy. Approved refunds are typically returned to your original payment method within 5-10 business days.',
      },
      {
        question: 'What is the Sporgates wallet?',
        answer: 'The wallet is a digital balance you can maintain on Sporgates for quick payments. Add funds to your wallet and use them for activities, facilities, and products.',
      },
    ],
  },
  {
    category: 'Privacy & Security',
    questions: [
      {
        question: 'How is my data protected?',
        answer: 'We use industry-standard encryption and security measures to protect your data. See our Privacy Policy for detailed information.',
      },
      {
        question: 'Can I make my profile private?',
        answer: 'Yes, go to Settings > Privacy Settings to control who can see your profile, activities, and other information.',
      },
      {
        question: 'How do I block someone?',
        answer: 'Visit their profile and click the three-dot menu, then select "Block User". You can manage blocked users in Settings > Blocked Users.',
      },
    ],
  },
];

export function HelpSupport({ onBack }: HelpSupportProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmitContact = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Your message has been sent! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const filteredFAQs = FAQ_ITEMS.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Find answers to common questions or contact our support team
            </p>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-[#003C66]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-2">
                support@sporgates.com
              </p>
              <p className="text-xs text-gray-500">Response within 24 hours</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Chat with our team
              </p>
              <p className="text-xs text-gray-500">Available 9 AM - 6 PM EST</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-[#FC8936]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
              <p className="text-sm text-muted-foreground mb-2">
                +1 (555) 123-4567
              </p>
              <p className="text-xs text-gray-500">Mon-Fri, 9 AM - 6 PM EST</p>
            </CardContent>
          </Card>
        </div>

        {/* Search FAQ */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* FAQ Sections */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#003C66]" />
            <h2 className="text-xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No results found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try a different search term or contact support
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.questions.map((item, questionIndex) => {
                    const itemKey = `${categoryIndex}-${questionIndex}`;
                    const isExpanded = expandedIndex === itemKey;
                    
                    return (
                      <div
                        key={questionIndex}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? null : itemKey)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 text-left">
                            {item.question}
                          </span>
                          <span className="text-gray-400 ml-4">
                            {isExpanded ? '−' : '+'}
                          </span>
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-0 text-sm text-gray-700 bg-gray-50">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#003C66]" />
              Still Need Help? Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="What is this about?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Describe your issue or question in detail..."
                rows={6}
              />
            </div>

            <Button
              className="w-full bg-primary hover:bg-[#002A4A]"
              onClick={handleSubmitContact}
            >
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
