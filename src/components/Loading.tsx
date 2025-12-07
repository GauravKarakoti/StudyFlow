import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-50 animate-pulse" />
        <div className="relative bg-card p-8 rounded-2xl border border-border/50 shadow-2xl flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" />
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <p className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-pulse">
            Loading StudyFlow...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
