import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ActivityTable } from './ActivityTable'

interface SearchModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * SearchModal component displays a dialog containing the ActivityTable.
 * It includes gradient fade effects at the top and bottom for visual appeal.
 * @param isOpen - Controls whether the dialog is open.
 * @param onOpenChange - Callback function to handle changes in the dialog's open state.
 */
export function SearchModal({ isOpen, onOpenChange }: SearchModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[90vh] md:h-[85vh] flex flex-col">
        {/* Container for the table with relative positioning for gradient overlays */}
        <div className="p-6 relative flex-grow overflow-hidden">
          {/* ActivityTable displays the searchable content */}
          <ActivityTable />
          {/* Top Gradient fade effect for better scrolling visibility */}
          <div className="absolute top-6 left-6 right-6 h-16 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
          {/* Bottom Gradient fade effect for better scrolling visibility */}
          <div className="absolute bottom-6 left-6 right-6 h-16 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
        </div>
      </DialogContent>
    </Dialog>
  )
} 