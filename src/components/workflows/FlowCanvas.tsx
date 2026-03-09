import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    MiniMap,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    MarkerType,
    NodeTypes,
    Handle,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { WorkflowStep, StepType } from '@/features/workflows/types';
import { Paper, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import {
    Input as InputIcon,
    Psychology as ModelIcon,
    VerifiedUser as ValidationIcon,
    Output as OutputIcon,
    Delete as DeleteIcon,
    Settings as ConfigIcon,
} from '@mui/icons-material';
import { useTheme } from '@/hooks/useTheme';

const stepTypeConfig = {
    [StepType.INPUT]: {
        icon: InputIcon,
        color: '#3b82f6',
        bgColor: '#eff6ff',
        darkBgColor: '#1e3a5f',
        label: 'Input',
    },
    [StepType.MODEL]: {
        icon: ModelIcon,
        color: '#8b5cf6',
        bgColor: '#f5f3ff',
        darkBgColor: '#3b1f6e',
        label: 'AI Model',
    },
    [StepType.VALIDATION]: {
        icon: ValidationIcon,
        color: '#10b981',
        bgColor: '#ecfdf5',
        darkBgColor: '#1a3a2a',
        label: 'Validation',
    },
    [StepType.OUTPUT]: {
        icon: OutputIcon,
        color: '#f59e0b',
        bgColor: '#fffbeb',
        darkBgColor: '#3d3114',
        label: 'Output',
    },
};

interface StepNodeData {
    step: WorkflowStep;
    onDelete?: (id: string) => void;
    onConfigure?: (step: WorkflowStep) => void;
    readOnly?: boolean;
    isDark?: boolean;
}

const StepNode: React.FC<{ data: StepNodeData }> = ({ data }) => {
    const { step, onDelete, onConfigure, readOnly, isDark } = data;
    const config = stepTypeConfig[step.type];
    const Icon = config.icon;

    return (
        <div
            style={{
                background: isDark ? config.darkBgColor : config.bgColor,
                border: `2px solid ${config.color}`,
                borderRadius: 12,
                padding: 0,
                minWidth: 220,
                boxShadow: `0 4px 12px ${config.color}33`,
            }}
        >
            <Handle
                type="target"
                position={Position.Top}
                style={{
                    background: config.color,
                    width: 10,
                    height: 10,
                    border: '2px solid white',
                }}
            />

            <div
                style={{
                    background: config.color,
                    padding: '8px 16px',
                    borderRadius: '10px 10px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon style={{ color: 'white', fontSize: 18 }} />
                    <Typography
                        variant="caption"
                        style={{ color: 'white', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
                    >
                        {config.label}
                    </Typography>
                </div>
                {!readOnly && (
                    <div style={{ display: 'flex', gap: 2 }}>
                        <Tooltip title="Configure">
                            <IconButton
                                size="small"
                                onClick={() => onConfigure?.(step)}
                                style={{ color: 'white', padding: 2 }}
                                aria-label={`Configure ${step.name}`}
                            >
                                <ConfigIcon style={{ fontSize: 14 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                onClick={() => onDelete?.(step.id)}
                                style={{ color: 'white', padding: 2 }}
                                aria-label={`Delete ${step.name}`}
                            >
                                <DeleteIcon style={{ fontSize: 14 }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}
            </div>

            <div style={{ padding: '12px 16px' }}>
                <Typography
                    variant="subtitle2"
                    style={{ fontWeight: 600, marginBottom: 4, color: isDark ? '#f1f5f9' : '#1e293b' }}
                >
                    {step.name}
                </Typography>
                {step.description && (
                    <Typography
                        variant="caption"
                        style={{ color: isDark ? '#94a3b8' : '#64748b', display: 'block', marginBottom: 8 }}
                    >
                        {step.description}
                    </Typography>
                )}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Chip
                        label={`Order: ${step.order + 1}`}
                        size="small"
                        variant="outlined"
                        style={{ fontSize: 10, height: 20, borderColor: config.color, color: config.color }}
                    />
                    {step.type === StepType.MODEL && 'modelName' in step.config && (
                        <Chip
                            label={step.config.modelName || 'No model'}
                            size="small"
                            style={{ fontSize: 10, height: 20, backgroundColor: config.color, color: 'white' }}
                        />
                    )}
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                style={{
                    background: config.color,
                    width: 10,
                    height: 10,
                    border: '2px solid white',
                }}
            />
        </div>
    );
};

const nodeTypes: NodeTypes = {
    stepNode: StepNode,
};

interface FlowCanvasProps {
    steps: WorkflowStep[];
    onStepDelete?: (id: string) => void;
    onStepConfigure?: (step: WorkflowStep) => void;
    readOnly?: boolean;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
    steps,
    onStepDelete,
    onStepConfigure,
    readOnly = false,
}) => {
    const { isDark } = useTheme();

    const initialNodes: Node[] = useMemo(
        () =>
            steps.map((step, index) => ({
                id: step.id,
                type: 'stepNode',
                position: { x: 250, y: index * 180 },
                data: {
                    step,
                    onDelete: onStepDelete,
                    onConfigure: onStepConfigure,
                    readOnly,
                    isDark,
                },
            })),
        [steps, onStepDelete, onStepConfigure, readOnly, isDark]
    );

    const initialEdges: Edge[] = useMemo(
        () =>
            steps.slice(0, -1).map((step, index) => ({
                id: `e-${step.id}-${steps[index + 1].id}`,
                source: step.id,
                target: steps[index + 1].id,
                animated: true,
                style: {
                    stroke: stepTypeConfig[step.type].color,
                    strokeWidth: 2,
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: stepTypeConfig[steps[index + 1].type].color,
                },
            })),
        [steps]
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges]
    );

    // Sync when steps change
    React.useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [steps, initialNodes, initialEdges, setNodes, setEdges]);

    return (
        <Paper
            elevation={2}
            style={{
                height: Math.max(400, steps.length * 180 + 100),
                borderRadius: 12,
                overflow: 'hidden',
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={readOnly ? undefined : onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                proOptions={{ hideAttribution: true }}
                style={{
                    background: isDark ? '#0f172a' : '#fafbfc',
                }}
            >
                <Controls
                    style={{
                        background: isDark ? '#1e293b' : '#ffffff',
                        borderRadius: 8,
                        border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    }}
                />
                <MiniMap
                    style={{
                        background: isDark ? '#1e293b' : '#ffffff',
                        borderRadius: 8,
                    }}
                    nodeColor={(node) => {
                        const step = node.data?.step as WorkflowStep | undefined;
                        if (step) return stepTypeConfig[step.type].color;
                        return '#94a3b8';
                    }}
                />
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color={isDark ? '#334155' : '#e2e8f0'}
                />
            </ReactFlow>
        </Paper>
    );
};
