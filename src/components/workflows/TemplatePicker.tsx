import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Paper,
    Typography,
    Chip,
} from '@mui/material';
import { workflowTemplates, WorkflowTemplate } from '@/utils/workflowTemplates';

interface TemplatePickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (template: WorkflowTemplate) => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({ open, onClose, onSelect }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleConfirm = () => {
        const template = workflowTemplates.find((t) => t.id === selectedId);
        if (template) {
            onSelect(template);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle>
                <Typography variant="h5" component="span" className="font-bold">
                    Choose a Template
                </Typography>
                <Typography variant="body2" className="text-gray-500 mt-1">
                    Start with a pre-built workflow template or create from scratch
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2}>
                    {workflowTemplates.map((template) => (
                        <Grid item xs={12} sm={6} key={template.id}>
                            <Paper
                                elevation={selectedId === template.id ? 4 : 1}
                                onClick={() => setSelectedId(template.id)}
                                sx={{
                                    p: 2.5,
                                    cursor: 'pointer',
                                    borderRadius: 3,
                                    border: '2px solid',
                                    borderColor: selectedId === template.id ? 'primary.main' : 'transparent',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.light',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                                role="button"
                                tabIndex={0}
                                aria-pressed={selectedId === template.id}
                                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedId(template.id); }}
                            >
                                <div className="flex items-start gap-3">
                                    <span style={{ fontSize: 32 }}>{template.icon}</span>
                                    <div className="flex-1">
                                        <Typography variant="subtitle1" className="font-semibold">
                                            {template.name}
                                        </Typography>
                                        <Typography variant="caption" className="text-gray-500 block mb-2">
                                            {template.category} &middot; {template.steps.length} steps
                                        </Typography>
                                        <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-2">
                                            {template.description}
                                        </Typography>
                                        <div className="flex gap-1 flex-wrap">
                                            {template.tags.map((tag) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontSize: 10, height: 20 }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cancel
                </Button>
                <Button onClick={onClose} variant="outlined">
                    Start from Scratch
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!selectedId}
                >
                    Use Template
                </Button>
            </DialogActions>
        </Dialog>
    );
};
