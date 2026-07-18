import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Box, Button, Typography, Collapse, IconButton } from '@mui/material';
import { ExpandMore, Refresh } from '@mui/icons-material';

const isDev = import.meta.env.MODE === 'development';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
    const [showDetails, setShowDetails] = React.useState(false);

    return (
        <Box
            role="alert"
            sx={{
                p: 4,
                m: 2,
                border: '1px solid',
                borderColor: 'error.main',
                borderRadius: 2,
                textAlign: 'center',
                bgcolor: 'background.paper',
            }}
        >
            <Typography variant="h5" color="error" gutterBottom>
                Oops… Something went wrong
            </Typography>

            <Box my={2}>
                <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={resetErrorBoundary}
                >
                    Try Again
                </Button>
                <IconButton
                    aria-label="Toggle error details"
                    onClick={() => setShowDetails((v) => !v)}
                >
                    <ExpandMore
                        sx={{
                            transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                        }}
                    />
                </IconButton>
            </Box>

            {isDev && (
                <Collapse in={showDetails}>
                    <Box
                        textAlign="left"
                        mt={2}
                        p={2}
                        sx={{ bgcolor: 'grey.100', borderRadius: 1 }}
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            {error?.toString()}
                        </Typography>
                        <Typography
                            component="pre"
                            variant="caption"
                            sx={{ whiteSpace: 'pre-wrap' }}
                        >
                            {error?.stack}
                        </Typography>
                    </Box>
                </Collapse>
            )}
        </Box>
    );
};

const ErrorBoundary = ({ children }) => {
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
                console.error('ErrorBoundary caught:', error, info);
            }}
            onReset={() => {
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
};

export default ErrorBoundary;

