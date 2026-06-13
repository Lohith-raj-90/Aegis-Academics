import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashboardView } from "./DashboardView";
import { TabType } from "../types";

interface DashboardContainerProps {
  onNavigateToTab: (tab: TabType) => void;
  attendancePct: number;
  completedTasksCount: number;
  totalTasksCount: number;
  readinessScore: number;
  username: string;
  isDeepFocus?: boolean;
  activeHighlightKeyword?: string | null;
  highlightOpacity?: number;
  onClearHighlightKeyword?: () => void;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = (props) => {
  return (
    <motion.div
      layout
      className="w-full relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 220, damping: 26, mass: 1 }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={props.isDeepFocus ? "deep-focus-active" : "analytics-command-active"}
          initial={{ opacity: 0, scale: 0.985, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.985, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          <DashboardView {...props} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
