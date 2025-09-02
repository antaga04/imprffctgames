import DecisionToast from '@/components/ui/DecisionToast';
import { toast } from 'sonner';

export function decisionToast({
    title,
    body,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    confirmClassName,
    cancelClassName,
    duration = Infinity,
}: DecisionToastOptions) {
    const wrappedOnCancel = () => {
        toast.dismiss();
        onCancel();
    };

    const wrappedOnConfirm = () => {
        toast.dismiss();
        onConfirm();
    };

    return toast(
        <DecisionToast
            title={title}
            body={body}
            onCancel={wrappedOnCancel}
            onConfirm={wrappedOnConfirm}
            confirmText={confirmText}
            cancelText={cancelText}
            confirmClassName={confirmClassName}
            cancelClassName={cancelClassName}
        />,
        {
            duration,
        },
    );
}
