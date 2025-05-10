import { useState } from "react";
import AlertDialogComponent from "@/components/AlertDialog";

interface useAlertDialogState {
  title?: string;
  description: string;
  cancelText?: string;
  actionText?: string;
}

export default function useAlertDialog() {
  const [open, setOpen] = useState(false);
  const [alertDialogProps, setAlertDialogProps] = useState<useAlertDialogState>(
    {
      title: "",
      description: "",
      cancelText: "取消",
      actionText: "确定",
    }
  );
  const [resolvePromise, setResolvePromise] =
    useState<(value: boolean) => void>();

  const showAlertDialog = (alertDialogState: useAlertDialogState) => {
    setAlertDialogProps(alertDialogState);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const closeAlertDialog = () => {
    setOpen(false);
    setTimeout(() => (document.body.style.pointerEvents = ""), 20);
  };

  const handleAction = () => {
    closeAlertDialog();
    resolvePromise?.(true); // 用户点击确定
  };

  const handleCancel = () => {
    closeAlertDialog();
    resolvePromise?.(false); // 用户点击取消
  };

  const AlertDialog = () => (
    <>
      {open && (
        <AlertDialogComponent
          open={true}
          title={alertDialogProps.title}
          description={alertDialogProps.description}
          cancelText={alertDialogProps.cancelText}
          actionText={alertDialogProps.actionText}
          onAction={handleAction}
          onCancel={handleCancel}
        ></AlertDialogComponent>
      )}
    </>
  );

  return { showAlertDialog, AlertDialog };
}
