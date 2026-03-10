import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      className={cn(
        'glass p-6 rounded-xl transition-shadow',
        hover && 'cursor-pointer hover:shadow-lg',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
