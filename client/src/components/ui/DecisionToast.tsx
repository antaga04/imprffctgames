import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const DecisionToast = ({
    title,
    body,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    confirmClassName = 'px-4 py-1 rounded-md font-semibold bg-black text-white hover:bg-gray-900 transition',
    cancelClassName = 'px-4 py-1 rounded-md font-semibold text-gray-700 border border-gray-300 hover:bg-gray-100 transition',
}: DecisionToastProps) => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);

    const finalConfirmText = confirmText ?? t('globals.confirm');
    const finalCancelText = cancelText ?? t('globals.cancel');

    useEffect(() => {
        containerRef.current?.focus();
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                onConfirm();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onCancel, onConfirm]);

    return (
        <div
            ref={containerRef}
            tabIndex={-1}
            className="min-w-[320px] flex flex-col gap-3 select-none outline-none"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="decision-toast-title"
            aria-describedby="decision-toast-desc"
        >
            <div id="decision-toast-title" className="font-semibold text-base text-gray-900">
                {title}
            </div>
            <div id="decision-toast-desc" className="text-sm text-gray-600 mt-2">
                {body}
            </div>
            <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={onCancel} className={cancelClassName}>
                    {finalCancelText}
                </button>
                <button type="button" onClick={onConfirm} className={confirmClassName}>
                    {finalConfirmText}
                </button>
            </div>
        </div>
    );
};

export default DecisionToast;
