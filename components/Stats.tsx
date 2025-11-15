'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from '@mui/material';

import {
  School,
  Favorite,
  CheckCircle,
  TrendingUp,
  Psychology,
  Book,
} from '@mui/icons-material';
import { Stats } from '../types';
import { answersApi } from '../services/api';

export const StatsComponent: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [todayWordsJson, setTodayWordsJson] = useState<string>('');
  const [snackbarState, setSnackbarState] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await answersApi.getStats();
      setStats(statsData);
    } catch (err: unknown) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleClearAnswers = async () => {
    try {
      setActionLoading(true);
      const { deletedCount } = await answersApi.clearAll();
      setSnackbarState({
        open: true,
        message: deletedCount ? `Cleared ${deletedCount} answers.` : 'No answers to clear.',
        severity: 'success',
      });
      setConfirmOpen(false);
      await loadStats();
    } catch (err: unknown) {
      setSnackbarState({
        open: true,
        message: 'Failed to clear answers',
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleShowTodayCorrectWords = async () => {
    setJsonLoading(true);
    setJsonError(null);
    setTodayWordsJson('');
    try {
      const words = await answersApi.getTodayCorrectWords();
      setTodayWordsJson(JSON.stringify(words, null, 2));
    } catch (err: unknown) {
      console.error('Failed to fetch today correct words', err);
      const message = err instanceof Error ? err.message : 'Failed to fetch today correct words';
      setJsonError(message);
    } finally {
      setJsonLoading(false);
      setJsonDialogOpen(true);
    }
  };

  const handleCopyTodayWordsJson = async () => {
    const textToCopy = todayWordsJson || '[]';
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API unavailable');
      }
      await navigator.clipboard.writeText(textToCopy);
      setSnackbarState({
        open: true,
        message: 'JSON copied to clipboard',
        severity: 'success',
      });
    } catch (err: unknown) {
      console.error('Failed to copy today words JSON', err);
      setSnackbarState({
        open: true,
        message: 'Failed to copy JSON',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Words',
      value: stats.totalWords,
      icon: <Book color="primary" />,
      color: '#1976d2',
    },
    {
      title: 'Learned Words',
      value: stats.learnedWords,
      icon: <School color="success" />,
      color: '#2e7d32',
    },
    {
      title: 'Favorite Words',
      value: stats.favoriteWords,
      icon: <Favorite color="error" />,
      color: '#d32f2f',
    },
    {
      title: 'Total Answers',
      value: stats.totalAnswers,
      icon: <Psychology color="info" />,
      color: '#0288d1',
    },
    {
      title: 'Correct Answers',
      value: stats.correctAnswers,
      icon: <CheckCircle color="success" />,
      color: '#2e7d32',
    },
    {
      title: 'Accuracy',
      value: `${stats.accuracy}%`,
      icon: <TrendingUp color="warning" />,
      color: '#ed6c02',
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Learning Statistics
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={handleShowTodayCorrectWords}
            disabled={jsonLoading}
          >
            {jsonLoading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={18} />
                Fetching...
              </Box>
            ) : (
              'Today Correct Words'
            )}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setConfirmOpen(true)}
            disabled={loading || actionLoading || stats.totalAnswers === 0}
          >
            Clear Answers
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {statCards.map((card, index) => (
          <Card key={index} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                {card.icon}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {card.title}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ color: card.color }}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {stats.totalWords > 0 && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Progress Overview
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Box flex={1} mr={2}>
              <Box
                sx={{
                  width: '100%',
                  height: 20,
                  backgroundColor: '#e0e0e0',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${(stats.learnedWords / stats.totalWords) * 100}%`,
                    height: '100%',
                    backgroundColor: '#4caf50',
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {Math.round((stats.learnedWords / stats.totalWords) * 100)}% learned
            </Typography>
          </Box>
        </Box>
      )}

      <Dialog
        open={jsonDialogOpen}
        onClose={() => setJsonDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Today&apos;s Correct Words JSON</DialogTitle>
        <DialogContent dividers>
          {jsonError ? (
            <Typography color="error">{jsonError}</Typography>
          ) : (
            <Box
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                mb: 0,
              }}
            >
              {todayWordsJson || '[]'}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {!jsonError && (
            <Button onClick={handleCopyTodayWordsJson}>
              Copy to Clipboard
            </Button>
          )}
          <Button onClick={() => setJsonDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmOpen}
        onClose={() => {
          if (actionLoading) return;
          setConfirmOpen(false);
        }}
      >
        <DialogTitle>Clear All Answers?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will remove every saved answer and reset your statistics. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button onClick={handleClearAnswers} color="error" variant="contained" disabled={actionLoading}>
            {actionLoading ? 'Clearing...' : 'Clear' }
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarState.severity} sx={{ width: '100%' }}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
