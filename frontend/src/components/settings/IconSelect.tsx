import React from 'react';
import Select, { components, OptionProps, SingleValueProps, StylesConfig, ActionMeta } from 'react-select';
import { Box, useTheme } from '@mui/material';

interface Option {
    value: string;
    label: string;
    icon: React.ReactNode;
}

interface IconSelectProps {
    options: Option[];
    value?: Option | null;
    onChange?: (option: Option | null) => void;
    placeholder?: string;
    className?: string;
}

// Custom Option component with icon
const OptionComponent = (props: OptionProps<Option>) => (
    <components.Option {...props}>
        <Box display="flex" alignItems="center" gap={2}>
            {props.data.icon}
            <span>{props.data.label}</span>
        </Box>
    </components.Option>
);

// Custom SingleValue component with icon
const SingleValueComponent = (props: SingleValueProps<Option>) => (
    <components.SingleValue {...props}>
        <Box display="flex" alignItems="center" gap={2}>
            {props.data.icon}
            <span>{props.data.label}</span>
        </Box>
    </components.SingleValue>
);

export const IconSelect: React.FC<IconSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select an option...",
    className = "",
}) => {
    const theme = useTheme();

    const handleChange = (selectedOption: Option | null, _actionMeta: ActionMeta<Option>) => {
        if (onChange) {
            onChange(selectedOption);
        }
    };

    const customStyles: StylesConfig<Option, false> = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '8px',
            borderColor: state.isFocused ? theme.palette.primary.main : theme.palette.divider,
            boxShadow: state.isFocused ? `0 0 0 1px ${theme.palette.primary.main}` : 'none',
            '&:hover': {
                borderColor: state.isFocused ? theme.palette.primary.main : theme.palette.action.hover,
            },
            backgroundColor: theme.palette.background.paper,
            minHeight: '40px',
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '8px',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[4],
            backgroundColor: theme.palette.background.paper,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? theme.palette.primary.main
                : state.isFocused
                    ? theme.palette.action.hover
                    : theme.palette.background.paper,
            color: state.isSelected
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
            '&:active': {
                backgroundColor: state.isSelected
                    ? theme.palette.primary.dark
                    : theme.palette.action.selected,
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: theme.palette.text.primary,
        }),
        placeholder: (provided) => ({
            ...provided,
            color: theme.palette.text.secondary,
        }),
    };

    return (
        <Select
            options={options}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={className}
            styles={customStyles}
            components={{
                Option: OptionComponent,
                SingleValue: SingleValueComponent,
            }}
            isSearchable={false}
        />
    );
};