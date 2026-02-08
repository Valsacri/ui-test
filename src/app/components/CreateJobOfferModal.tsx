import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface CreateJobOfferModalProps {
  onClose: () => void;
}

export function CreateJobOfferModal({ onClose }: CreateJobOfferModalProps) {
  const [jobType, setJobType] = useState<'Full-Time' | 'Part-Time' | 'Contract'>('Full-Time');
  const [isRemote, setIsRemote] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Creating new job offer');
    toast.success('Job offer created successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create Job Offer</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Job Title */}
            <div>
              <Label htmlFor="job-title">Job Title *</Label>
              <Input 
                id="job-title" 
                placeholder="e.g., Personal Trainer" 
                required 
              />
            </div>

            {/* Job Type and Remote */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job-type">Job Type *</Label>
                <select
                  id="job-type"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <Label htmlFor="remote">Work Location *</Label>
                <select
                  id="remote"
                  value={isRemote ? 'remote' : 'onsite'}
                  onChange={(e) => setIsRemote(e.target.value === 'remote')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Location */}
            {!isRemote && (
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input 
                  id="location" 
                  placeholder="e.g., Manhattan, NYC" 
                  required={!isRemote}
                />
              </div>
            )}

            {/* Salary */}
            <div>
              <Label htmlFor="salary">Salary/Pay Range *</Label>
              <Input 
                id="salary" 
                placeholder="e.g., $45,000 - $65,000 or $30 - $50/hour" 
                required 
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={4}
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea 
                id="requirements" 
                placeholder="List qualifications, certifications, experience needed..."
                rows={3}
              />
            </div>

            {/* Benefits */}
            <div>
              <Label htmlFor="benefits">Benefits (optional)</Label>
              <Textarea 
                id="benefits" 
                placeholder="Health insurance, gym membership, flexible hours..."
                rows={2}
              />
            </div>

            {/* Contact Email */}
            <div>
              <Label htmlFor="contact-email">Contact Email *</Label>
              <Input 
                id="contact-email" 
                type="email"
                placeholder="jobs@yourcompany.com" 
                required 
              />
            </div>

            {/* Application Deadline */}
            <div>
              <Label htmlFor="deadline">Application Deadline (optional)</Label>
              <Input 
                id="deadline" 
                type="date"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#003C66] hover:bg-[#002A4A]">
                Create Job Offer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
