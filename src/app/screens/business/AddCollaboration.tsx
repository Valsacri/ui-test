import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { 
  ArrowLeft, Calendar, DollarSign, FileText, 
  CheckCircle2, Target, TrendingUp, Users,
  Handshake, Upload, X
} from 'lucide-react';

interface AddCollaborationProps {
  onBack: () => void;
  partnerData?: any; // athlete or business data
  partnerType: 'athlete' | 'business';
}

export function AddCollaboration({ onBack, partnerData, partnerType }: AddCollaborationProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    startDate: '',
    endDate: '',
    budget: '',
    objectives: '',
    deliverables: '',
    terms: '',
    paymentStructure: 'fixed',
    paymentAmount: '',
    attachments: [] as File[],
  });

  const collabTypes = partnerType === 'athlete' 
    ? [
        'Brand Ambassador',
        'Event Partnership',
        'Social Media Campaign',
        'Product Endorsement',
        'Content Creation',
        'Workshop/Training',
      ]
    : [
        'Co-Marketing',
        'Joint Event',
        'Cross-Promotion',
        'Referral Partnership',
        'Service Integration',
        'Bundled Offering',
      ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ 
      ...prev, 
      attachments: [...prev.attachments, ...files] 
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    // Handle collaboration submission
    console.log('Collaboration data:', formData);
    onBack();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Collaboration Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Summer Fitness Campaign 2026"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Collaboration Type *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {collabTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleInputChange('type', type)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.type === type
                            ? 'border-[#003C66] bg-primary text-white'
                            : 'border-gray-200 hover:border-[#003C66]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the collaboration goals, activities, and expected outcomes..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Objectives & Deliverables</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="objectives">Collaboration Objectives *</Label>
                  <Textarea
                    id="objectives"
                    placeholder="List your main objectives for this collaboration..."
                    value={formData.objectives}
                    onChange={(e) => handleInputChange('objectives', e.target.value)}
                    className="mt-1 min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Example: Increase brand awareness, reach new audience, generate leads
                  </p>
                </div>

                <div>
                  <Label htmlFor="deliverables">Expected Deliverables *</Label>
                  <Textarea
                    id="deliverables"
                    placeholder="List what you expect from this partnership..."
                    value={formData.deliverables}
                    onChange={(e) => handleInputChange('deliverables', e.target.value)}
                    className="mt-1 min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {partnerType === 'athlete' 
                      ? 'Example: 10 Instagram posts, 2 YouTube videos, 1 live event appearance'
                      : 'Example: Co-branded marketing materials, joint social media posts, shared customer referrals'
                    }
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Success Metrics
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Define how you'll measure success
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <Input placeholder="Metric 1" className="bg-white" />
                    <Input placeholder="Metric 2" className="bg-white" />
                    <Input placeholder="Metric 3" className="bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Budget & Terms</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paymentStructure">Payment Structure *</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      { value: 'fixed', label: 'Fixed Fee' },
                      { value: 'performance', label: 'Performance-Based' },
                      { value: 'hybrid', label: 'Hybrid' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('paymentStructure', option.value)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.paymentStructure === option.value
                            ? 'border-[#003C66] bg-primary text-white'
                            : 'border-gray-200 hover:border-[#003C66]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="budget">Total Budget *</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="budget"
                      type="number"
                      placeholder="5000"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    placeholder="Add any specific terms, conditions, or requirements..."
                    value={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.value)}
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Attachments</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#003C66] transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload contracts, briefs, or supporting documents
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span>Choose Files</span>
                      </Button>
                    </label>
                  </div>
                  {formData.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
              
              {/* Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-base">Collaboration Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="font-semibold">{formData.title || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <Badge>{formData.type || 'Not specified'}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">
                        {formData.startDate && formData.endDate
                          ? `${formData.startDate} to ${formData.endDate}`
                          : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-semibold text-green-600">
                        ${formData.budget || '0'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{formData.description || 'Not specified'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Objectives</p>
                    <p className="text-sm">{formData.objectives || 'Not specified'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Deliverables</p>
                    <p className="text-sm">{formData.deliverables || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Success message preview */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold text-lg mb-2">Ready to Submit</h3>
                <p className="text-sm text-gray-600">
                  Your collaboration proposal will be sent to {partnerData?.name || 'the partner'} for review
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-start gap-4">
          {partnerData && (
            <Avatar className="w-16 h-16 border-2 border-gray-200">
              <AvatarImage src={partnerData.avatar} />
              <AvatarFallback>{partnerData.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              New {partnerType === 'athlete' ? 'Athlete' : 'Business'} Collaboration
            </h1>
            {partnerData && (
              <p className="text-sm text-muted-foreground mt-1">
                Proposing collaboration with {partnerData.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[
            { num: 1, label: 'Basic Info' },
            { num: 2, label: 'Objectives' },
            { num: 3, label: 'Budget & Terms' },
            { num: 4, label: 'Review' },
          ].map((s, index) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step >= s.num
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s.num}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    step >= s.num ? 'text-primary font-medium' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </p>
              </div>
              {index < 3 && (
                <div
                  className={`h-1 flex-1 -mx-2 ${
                    step > s.num ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>
        {step < 4 ? (
          <Button
            onClick={() => setStep(Math.min(4, step + 1))}
            className="bg-primary hover:bg-primary/90"
          >
            Next Step
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-secondary hover:bg-[#E67A2F]"
          >
            <Handshake className="w-4 h-4 mr-2" />
            Submit Proposal
          </Button>
        )}
      </div>
    </div>
  );
}
