import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Plus, X, Upload, Link as LinkIcon, Image as ImageIcon, FileText, TrendingUp, Users, Eye, MapPin, Calendar } from 'lucide-react';

interface PastEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  metrics: {
    attendance: number;
    mediaReach: number;
    engagementRate: number;
    geographicReach: string[];
  };
  proof: {
    photos: string[];
    mediaLinks: string[];
    socialMediaLinks: string[];
    documents: string[];
  };
  testimonials: Array<{
    author: string;
    role: string;
    text: string;
  }>;
}

interface OrganizerPortfolioProps {
  onClose?: () => void;
}

export function OrganizerPortfolio({ onClose }: OrganizerPortfolioProps) {
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([
    {
      id: '1',
      name: 'Summer Basketball Championship 2025',
      date: '2025-06-15',
      location: 'Downtown Sports Arena',
      metrics: {
        attendance: 2500,
        mediaReach: 150000,
        engagementRate: 12.5,
        geographicReach: ['New York', 'New Jersey', 'Connecticut']
      },
      proof: {
        photos: ['event1-photo1.jpg', 'event1-photo2.jpg', 'event1-photo3.jpg'],
        mediaLinks: ['https://localnews.com/basketball-championship', 'https://sportsdaily.com/summer-event'],
        socialMediaLinks: ['https://instagram.com/post1', 'https://twitter.com/post1'],
        documents: ['attendance-report.pdf', 'event-summary.pdf']
      },
      testimonials: [
        {
          author: 'Nike NYC',
          role: 'Event Sponsor',
          text: 'Exceptional event organization and impressive turnout. The engagement metrics exceeded our expectations.'
        }
      ]
    },
    {
      id: '2',
      name: 'Youth Soccer League - Spring Season',
      date: '2025-04-20',
      location: 'Central Park Fields',
      metrics: {
        attendance: 1800,
        mediaReach: 85000,
        engagementRate: 15.2,
        geographicReach: ['Manhattan', 'Brooklyn', 'Queens']
      },
      proof: {
        photos: ['event2-photo1.jpg', 'event2-photo2.jpg'],
        mediaLinks: ['https://nycsports.com/youth-soccer'],
        socialMediaLinks: ['https://facebook.com/post1'],
        documents: ['league-results.pdf']
      },
      testimonials: [
        {
          author: 'Adidas Youth Sports',
          role: 'Title Sponsor',
          text: 'Well-organized league with strong community engagement. Great partnership opportunity.'
        }
      ]
    }
  ]);

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Organizer Portfolio</h1>
          <p className="text-sm text-gray-500 mt-0.5">Showcase your track record to sponsors</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Overview Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Total Events</span>
                </div>
                <p className="text-2xl font-semibold text-primary">{pastEvents.length}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Users className="h-4 w-4" />
                  <span>Total Attendance</span>
                </div>
                <p className="text-2xl font-semibold text-primary">
                  {formatNumber(pastEvents.reduce((sum, event) => sum + event.metrics.attendance, 0))}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Eye className="h-4 w-4" />
                  <span>Media Reach</span>
                </div>
                <p className="text-2xl font-semibold text-primary">
                  {formatNumber(pastEvents.reduce((sum, event) => sum + event.metrics.mediaReach, 0))}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>Avg Engagement</span>
                </div>
                <p className="text-2xl font-semibold text-primary">
                  {(pastEvents.reduce((sum, event) => sum + event.metrics.engagementRate, 0) / pastEvents.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Past Events */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Past Events</h2>
          <Button
            onClick={() => setIsAddingEvent(true)}
            className="bg-secondary hover:bg-[#e07830]"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        {pastEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{event.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                >
                  {expandedEvent === event.id ? 'Hide Details' : 'View Details'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Users className="h-3 w-3" />
                    Attendance
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNumber(event.metrics.attendance)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Eye className="h-3 w-3" />
                    Media Reach
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNumber(event.metrics.mediaReach)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <TrendingUp className="h-3 w-3" />
                    Engagement
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {event.metrics.engagementRate}%
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedEvent === event.id && (
                <div className="space-y-4 pt-4 border-t">
                  {/* Geographic Reach */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Geographic Reach</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.metrics.geographicReach.map((location, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Proof Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Event Proof</h4>
                    
                    {/* Photos */}
                    {event.proof.photos.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <ImageIcon className="h-4 w-4" />
                          <span>{event.proof.photos.length} Photos</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {event.proof.photos.slice(0, 3).map((photo, idx) => (
                            <div key={idx} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Media Links */}
                    {event.proof.mediaLinks.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <LinkIcon className="h-4 w-4" />
                          <span>Media Coverage ({event.proof.mediaLinks.length})</span>
                        </div>
                        <div className="space-y-2">
                          {event.proof.mediaLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm text-primary hover:underline truncate"
                            >
                              {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents */}
                    {event.proof.documents.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <FileText className="h-4 w-4" />
                          <span>Documents ({event.proof.documents.length})</span>
                        </div>
                        <div className="space-y-2">
                          {event.proof.documents.map((doc, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm"
                            >
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Testimonials */}
                  {event.testimonials.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Testimonials</h4>
                      <div className="space-y-3">
                        {event.testimonials.map((testimonial, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700 mb-2">"{testimonial.text}"</p>
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">{testimonial.author}</span>
                              {' · '}
                              <span>{testimonial.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Add Event Form (placeholder) */}
        {isAddingEvent && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Add Past Event</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsAddingEvent(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Summer Basketball Championship"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Venue name"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Event Metrics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Attendance</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Media Reach</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Engagement Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Upload Proof</h4>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photos
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Add Media Links
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setIsAddingEvent(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-[#002a4a]"
                  >
                    Add Event
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}