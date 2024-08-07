'use client';
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function ChatBox({ currentChat }) {
    return (
        <Box
            id="chat-box"
            flexGrow={1}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'flex-start'}
            padding="20px"
            overflow="auto"
        >
            <Box display={'flex'}
                justifyContent={'center'}>
                <Typography
                    variant="h3"
                    width="28%"
                    borderBottom={'3px solid #E8DFCA'}
                    textAlign={'center'}
                    color={'#E8DFCA'}
                    marginBottom="20px"
                >
                    <b>Chat Box</b>
                </Typography>
            </Box>

            {/* Display chat history */}
            <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'flex-start'}
                width="100%"
            >
                {currentChat.map((message, index) => (
                    <Paper
                        key={index}
                        sx={{
                            padding: '10px 15px',
                            marginBottom: '10px',
                            maxWidth: '70%',
                            alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: message.type === 'user' ? '#E8DFCA' : '#1A4D2E',
                            color: message.type === 'user' ? '#1A4D2E' : '#E8DFCA',
                            border: message.type === 'user' ? '1px solid #1A4D2E' : 'none',
                        }}
                    >
                        {message.text}
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}
