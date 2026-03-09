import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import UserAvatar from './UserAvatar';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface MatchCardProps {
  matchedPerson: string;
  pickupPoint: string;
  office: string;
  time: string;
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function MatchCard({ matchedPerson, pickupPoint, office, time, onAccept, onDecline }: MatchCardProps) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
      <GlassCard className="glow-success">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-3xl">🎉</div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Ride Share Available!</h3>
            <p className="text-sm text-muted-foreground">A colleague is heading the same way</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted/50">
          <UserAvatar name={matchedPerson} />
          <div>
            <p className="font-semibold text-foreground">{matchedPerson}</p>
            <p className="text-sm text-muted-foreground">Pickup: {pickupPoint}</p>
            <p className="text-sm text-muted-foreground">{office} · {time}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={onAccept} className="flex-1 gradient-primary">
            <Check className="mr-2 h-4 w-4" /> Accept
          </Button>
          <Button onClick={onDecline} variant="outline" className="flex-1">
            <X className="mr-2 h-4 w-4" /> Decline
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
