'use client';
import React from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function ChatInput({ question, onChange, onSubmit }) {
    return (
        <Box padding="20px">
            <TextField
                sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                        color: '#E8DFCA', // Text color
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#E8DFCA', // Default border color
                        },
                        '&:hover fieldset': {
                            borderColor: '#E8DFCA', // Border color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#E8DFCA', // Border color when focused
                        },
                        backgroundColor: '#1A4D2E', // Background color
                    },
                    '& .MuiInputLabel-root': {
                        color: '#E8DFCA', // Label color
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#E8DFCA', // Label color when focused
                    },
                }}
                placeholder="Type your question"
                value={question}
                onChange={onChange}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        onSubmit();
                    }
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SendIcon
                                sx={{ color: '#E8DFCA', cursor: 'pointer' }}
                                onClick={onSubmit}
                            />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
}
