import React, { useRef, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Alert,
    Tabs,
    Tab,
    Box,
    TextField,
} from '@mui/material';
import { Download as DownloadIcon, Upload as UploadIcon, ContentCopy } from '@mui/icons-material';
import { Workflow } from '@/features/workflows/types';

interface ImportExportDialogProps {
    open: boolean;
    onClose: () => void;
    workflow?: Workflow | null;
    onImport: (workflow: Workflow) => void;
}

export const ImportExportDialog: React.FC<ImportExportDialogProps> = ({
    open,
    onClose,
    workflow,
    onImport,
}) => {
    const [tab, setTab] = useState(0);
    const [importData, setImportData] = useState('');
    const [importError, setImportError] = useState('');
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const exportJson = workflow
        ? JSON.stringify(
              {
                  name: workflow.name,
                  description: workflow.description,
                  steps: workflow.steps,
                  tags: workflow.tags,
                  exportedAt: new Date().toISOString(),
                  version: workflow.currentVersion,
              },
              null,
              2
          )
        : '';

    const handleExportDownload = () => {
        if (!workflow) return;
        const blob = new Blob([exportJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${workflow.name.replace(/\s+/g, '-').toLowerCase()}-v${workflow.currentVersion}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(exportJson);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleImport = () => {
        setImportError('');
        try {
            const parsed = JSON.parse(importData);
            if (!parsed.name || !parsed.steps || !Array.isArray(parsed.steps)) {
                setImportError('Invalid workflow format: missing name or steps');
                return;
            }
            const imported: Workflow = {
                id: `wf-imported-${Date.now()}`,
                name: parsed.name,
                description: parsed.description || '',
                steps: parsed.steps,
                status: 'DRAFT' as Workflow['status'],
                currentVersion: 1,
                versions: [],
                environments: [],
                createdAt: new Date().toISOString(),
                createdBy: 'Imported',
                updatedAt: new Date().toISOString(),
                updatedBy: 'Imported',
                tags: parsed.tags || [],
            };
            onImport(imported);
            onClose();
        } catch {
            setImportError('Invalid JSON format');
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            setImportError('Please select a JSON file');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setImportData(text);
        };
        reader.readAsText(file);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle>Import / Export Workflow</DialogTitle>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3 }}>
                <Tab label="Export" icon={<DownloadIcon />} iconPosition="start" />
                <Tab label="Import" icon={<UploadIcon />} iconPosition="start" />
            </Tabs>

            <DialogContent>
                {tab === 0 ? (
                    <Box>
                        {workflow ? (
                            <>
                                <Typography variant="body2" className="mb-3 text-gray-600">
                                    Export "{workflow.name}" as JSON
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={10}
                                    value={exportJson}
                                    InputProps={{ readOnly: true, sx: { fontFamily: 'monospace', fontSize: 12 } }}
                                />
                                <div className="flex gap-2 mt-3">
                                    <Button
                                        variant="contained"
                                        startIcon={<DownloadIcon />}
                                        onClick={handleExportDownload}
                                    >
                                        Download JSON
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ContentCopy />}
                                        onClick={handleCopy}
                                    >
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Alert severity="info">Select a workflow to export</Alert>
                        )}
                    </Box>
                ) : (
                    <Box>
                        <Typography variant="body2" className="mb-3 text-gray-600">
                            Import a workflow from a JSON file or paste JSON data
                        </Typography>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />

                        <Button
                            variant="outlined"
                            startIcon={<UploadIcon />}
                            onClick={() => fileInputRef.current?.click()}
                            className="mb-3"
                            fullWidth
                        >
                            Choose JSON File
                        </Button>

                        <Typography variant="caption" className="text-gray-500 block mb-2">
                            Or paste JSON below:
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={importData}
                            onChange={(e) => { setImportData(e.target.value); setImportError(''); }}
                            placeholder='{"name": "...", "steps": [...]}'
                            InputProps={{ sx: { fontFamily: 'monospace', fontSize: 12 } }}
                        />

                        {importError && (
                            <Alert severity="error" className="mt-2">
                                {importError}
                            </Alert>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Close
                </Button>
                {tab === 1 && (
                    <Button
                        onClick={handleImport}
                        variant="contained"
                        disabled={!importData.trim()}
                    >
                        Import Workflow
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
