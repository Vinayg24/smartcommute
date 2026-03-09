import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppNavbar from '@/components/AppNavbar';
import GlassCard from '@/components/GlassCard';
import StatusBadge from '@/components/StatusBadge';
import Timeline from '@/components/Timeline';
import MatchCard from '@/components/MatchCard';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, Info, Sparkles, Loader2 } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';

const OFFICES = [
  { id: '1', name: 'Head Office', crowd: 85, address: 'Connaught Place, Delhi' },
  { id: '2', name: 'Tech Hub', crowd: 60, address: 'Cyber City, Gurugram' },
  { id: '3', name: 'Operations', crowd: 25, address: 'Sector 18, Noida' },
  { id: '4', name: 'South Branch', crowd: 15, address: 'Faridabad' },
  { id: '5', name: 'East Office', crowd: 45, address: 'Laxmi Nagar, Delhi' },
];

export default function NewRequestPage() {
  const { user } = useAuth();
  const geo = useGeolocation();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [matchFound, setMatchFound] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    employeeId: user?.employeeId || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    location: '',
    office: '',
    date: '',
    time: '',
    purpose: '',
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const steps: { label: string; status: 'completed' | 'active' | 'upcoming' }[] = [
    { label: 'Personal Info', status: step > 1 ? 'completed' : step === 1 ? 'active' : 'upcoming' },
    { label: 'Travel Details', status: step > 2 ? 'completed' : step === 2 ? 'active' : 'upcoming' },
    { label: 'Review', status: step === 3 ? 'active' : 'upcoming' },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setSubmitted(true);
    setMatchFound(Math.random() > 0.4);
    toast.success('Request submitted!');
  };

  const selectedOffice = OFFICES.find((o) => o.id === form.office);

  return (
    <>
      <AppNavbar title="New Travel Request" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress */}
          <GlassCard>
            <Timeline steps={steps} />
          </GlassCard>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {step === 1 && (
                  <GlassCard>
                    <h3 className="text-lg font-bold text-foreground mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => update('name', e.target.value)} className="bg-muted/50" /></div>
                      <div className="space-y-1.5"><Label>Employee ID</Label><Input value={form.employeeId} onChange={(e) => update('employeeId', e.target.value)} className="bg-muted/50" /></div>
                      <div className="space-y-1.5"><Label>Email</Label><Input value={form.email} className="bg-muted/50" readOnly /></div>
                      <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} className="bg-muted/50" readOnly /></div>
                      <div className="space-y-1.5 sm:col-span-2"><Label>Department</Label><Input value={form.department} className="bg-muted/50" readOnly /></div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button onClick={() => setStep(2)} className="gradient-primary text-primary-foreground">Next Step →</Button>
                    </div>
                  </GlassCard>
                )}

                {step === 2 && (
                  <GlassCard>
                    <h3 className="text-lg font-bold text-foreground mb-4">Travel Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label>Current Location</Label>
                        <div className="flex gap-2">
                          <Input placeholder="e.g. Lajpat Nagar, Delhi" value={form.location} onChange={(e) => update('location', e.target.value)} className="bg-muted/50" />
                          <Button variant="outline" onClick={() => { geo.getLocation(); if (geo.address) update('location', geo.address); }}
                            className={geo.loading ? 'animate-pulse-glow' : ''}>
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Select Office</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {OFFICES.map((o) => (
                            <button key={o.id} onClick={() => update('office', o.id)}
                              className={`p-3 rounded-lg border text-left transition-all ${form.office === o.id ? 'border-primary bg-primary/10 glow-primary' : 'border-border bg-muted/30 hover:bg-muted/50'}`}>
                              <p className="font-medium text-foreground text-sm">{o.name}</p>
                              <p className="text-xs text-muted-foreground">{o.address}</p>
                              <StatusBadge status={o.crowd >= 70 ? 'HIGH' : o.crowd >= 40 ? 'MEDIUM' : 'LOW'} className="mt-1" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5"><Label>Travel Date</Label><Input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className="bg-muted/50" /></div>
                        <div className="space-y-1.5"><Label>Travel Time</Label><Input type="time" value={form.time} onChange={(e) => update('time', e.target.value)} className="bg-muted/50" /></div>
                      </div>

                      <div className="space-y-1.5"><Label>Purpose (optional)</Label><Input placeholder="Team meeting, client visit..." value={form.purpose} onChange={(e) => update('purpose', e.target.value)} className="bg-muted/50" /></div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                      <Button onClick={() => setStep(3)} className="gradient-primary text-primary-foreground" disabled={!form.location || !form.office || !form.date || !form.time}>Next Step →</Button>
                    </div>
                  </GlassCard>
                )}

                {step === 3 && (
                  <GlassCard>
                    <h3 className="text-lg font-bold text-foreground mb-4">Review Your Request</h3>
                    <div className="space-y-3 mb-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded-lg bg-muted/50"><p className="text-muted-foreground text-xs">From</p><p className="font-medium text-foreground">{form.location}</p></div>
                        <div className="p-3 rounded-lg bg-muted/50"><p className="text-muted-foreground text-xs">To</p><p className="font-medium text-foreground">{selectedOffice?.name}</p></div>
                        <div className="p-3 rounded-lg bg-muted/50"><p className="text-muted-foreground text-xs">Date</p><p className="font-medium text-foreground">{form.date}</p></div>
                        <div className="p-3 rounded-lg bg-muted/50"><p className="text-muted-foreground text-xs">Time</p><p className="font-medium text-foreground">{form.time}</p></div>
                      </div>
                      <div className="flex gap-3">
                        <div className="p-3 rounded-lg bg-muted/50 flex-1"><p className="text-muted-foreground text-xs">Est. Distance</p><p className="font-medium text-foreground">~18 km</p></div>
                        <div className="p-3 rounded-lg bg-muted/50 flex-1"><p className="text-muted-foreground text-xs">ETA</p><p className="font-medium text-foreground">~35 min</p></div>
                        <div className="p-3 rounded-lg bg-muted/50 flex-1"><p className="text-muted-foreground text-xs">Crowd Level</p><StatusBadge status={selectedOffice && selectedOffice.crowd >= 70 ? 'HIGH' : 'MEDIUM'} /></div>
                      </div>
                    </div>

                    {/* AI Suggestions */}
                    <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 mb-4">
                      <div className="flex items-center gap-2 mb-2"><Sparkles className="h-4 w-4 text-primary" /><span className="font-semibold text-foreground text-sm">AI Suggestions</span></div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 3 colleagues going same route today</li>
                        <li>• High traffic expected between 8:30-9:30 AM, leave early</li>
                      </ul>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
                      <Button onClick={handleSubmit} disabled={submitting} className="gradient-primary text-primary-foreground min-w-32">
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Request'}
                      </Button>
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                {matchFound ? (
                  <MatchCard matchedPerson="Sneha Patel" pickupPoint="Rohini Metro Station" office={selectedOffice?.name || 'Tech Hub'} time={form.time}
                    onAccept={() => { toast.success('Ride accepted!'); }} onDecline={() => { setMatchFound(false); }} />
                ) : (
                  <GlassCard>
                    <div className="text-center py-6">
                      <div className="text-4xl mb-3">🚗</div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Solo Travel</h3>
                      <p className="text-muted-foreground mb-4">No matches found right now. We'll keep looking!</p>
                      <label className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <input type="checkbox" defaultChecked className="rounded" />
                        Notify me when a match is found
                      </label>
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
