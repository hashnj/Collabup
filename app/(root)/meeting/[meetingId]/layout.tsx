import { Toaster } from '@/components/ui/sonner';
import { LiveKitProvider } from '@/providers/livekitProvider';
import { SocketProvider } from '@/providers/SocketProvider';

export default function MeetingLayout({ children }: { children: React.ReactNode }) {
  return (
    <LiveKitProvider>
      <SocketProvider>
      {children}
      </SocketProvider>
      {/* <Toaster position="top-right" richColors /> */}
    </LiveKitProvider>
  );
}
