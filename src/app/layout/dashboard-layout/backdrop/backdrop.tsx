import { useSidebar } from '@/shadcn/components/ui/sidebar';

/**
 * Mobile sidebar overlay (kept for parity with the Angular project;
 * the shadcn sidebar renders its own mobile overlay).
 */
export function Backdrop() {
  const { openMobile, setOpenMobile } = useSidebar();

  if (!openMobile) {
    return null;
  }

  return (
    <button
      type="button"
      className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
      onClick={() => setOpenMobile(false)}
      aria-label="Close sidebar overlay"
    ></button>
  );
}
