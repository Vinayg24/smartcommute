import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-8xl mb-6">
          🚗💨
        </motion.div>
        <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Looks like this route doesn't exist!</p>
        <Button asChild className="gradient-primary text-primary-foreground">
          <Link to="/dashboard"><Home className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </motion.div>
    </div>
  );
}
