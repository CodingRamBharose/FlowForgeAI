import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'sm',
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
            {title && (
                <DialogTitle className="flex items-center justify-between">
                    <span className="text-xl font-semibold">{title}</span>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
            )}
            <DialogContent>{children}</DialogContent>
            {actions && <DialogActions className="px-6 pb-4">{actions}</DialogActions>}
        </Dialog>
    );
};
