import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogCompoentProps {
  open: boolean;
  children: React.ReactElement;
  title: string;
  onAction?: () => void;
  onCancel?: () => void;
  actionDisabled?: boolean;
  actionText?: string;
  cancelText?: string;
}

export default function DialogCompoent({
  open,
  children,
  title,
  onAction,
  onCancel,
  actionText = "确定",
  cancelText = "取消",
  actionDisabled,
}: DialogCompoentProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
        hideClose
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter className="justify-end flex flex-row">
          <Button type="submit" variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button type="submit" disabled={actionDisabled} onClick={onAction}>
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
