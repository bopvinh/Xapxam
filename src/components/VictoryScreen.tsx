import React from 'react';
import { motion } from 'framer-motion';

interface VictoryScreenProps {
  winner: string;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ winner }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="victory-screen"
    >
      <h1>VICTORY</h1>
      <p>{winner} Wins!</p>
    </motion.div>
  );
};

export default VictoryScreen;
