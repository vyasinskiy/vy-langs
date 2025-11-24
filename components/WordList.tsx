'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  Typography,
  TablePagination,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Delete,
  Favorite,
  FavoriteBorder,
  Add,
  Search,
} from '@mui/icons-material';
import { Word, CreateWordRequest, UpdateWordRequest } from '../types';
import { wordsApi } from '../services/api';

interface WordListProps {
  onWordUpdated: () => void;
}

interface WordTableProps {
  words: Word[];
  onEdit: (word: Word) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  loading: boolean;
}

const WordTable = memo(({ words, onEdit, onDelete, onToggleFavorite, loading }: WordTableProps) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>English</TableCell>
          <TableCell>Russian</TableCell>
          <TableCell>Example (EN)</TableCell>
          <TableCell>Example (RU)</TableCell>
          <TableCell>Favorite</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} align="center">
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress size={24} />
              </Box>
            </TableCell>
          </TableRow>
        ) : words.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} align="center">
              <Typography variant="body2">No words found</Typography>
            </TableCell>
          </TableRow>
        ) : (
          words.map((word) => (
            <TableRow key={word.id}>
              <TableCell>{word.english}</TableCell>
              <TableCell>{word.russian}</TableCell>
              <TableCell sx={{ maxWidth: 200 }}>
                <Typography variant="body2" noWrap>
                  {word.exampleEn}
                </Typography>
              </TableCell>
              <TableCell sx={{ maxWidth: 200 }}>
                <Typography variant="body2" noWrap>
                  {word.exampleRu}
                </Typography>
              </TableCell>
              <TableCell>
                <Tooltip title={word.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                  <IconButton onClick={() => onToggleFavorite(word.id)}>
                    {word.isFavorite ? <Favorite color="primary" /> : <FavoriteBorder />}
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton onClick={() => onEdit(word)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(word.id)} color="error">
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
));

export const WordList: React.FC<WordListProps> = ({ onWordUpdated }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [formData, setFormData] = useState<CreateWordRequest>({
    english: '',
    russian: '',
    exampleEn: '',
    exampleRu: '',
  });

  const fetchWords = useCallback(async (pageToLoad: number, rowsToLoad: number, searchToUse: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await wordsApi.getPaginated({
        page: pageToLoad,
        pageSize: rowsToLoad,
        search: searchToUse.trim() || undefined,
      });
      setWords(result.items);
      setTotalCount(result.total);
      setPage(result.page);
      setRowsPerPage(result.pageSize);
      setSearchQuery(searchToUse);
    } catch (err: unknown) {
      setError('Failed to load words');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWords(page, rowsPerPage, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = useCallback((word: Word) => {
    setEditingWord(word);
    setFormData({
      english: word.english,
      russian: word.russian,
      exampleEn: word.exampleEn,
      exampleRu: word.exampleRu,
    });
    setEditDialogOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingWord(null);
    setFormData({
      english: '',
      russian: '',
      exampleEn: '',
      exampleRu: '',
    });
    setAddDialogOpen(true);
  }, []);

  const handleSave = async () => {
    try {
      if (editingWord) {
        await wordsApi.update(editingWord.id, formData);
      } else {
        await wordsApi.create(formData);
      }
      
      setEditDialogOpen(false);
      setAddDialogOpen(false);
      await fetchWords(page, rowsPerPage, searchQuery);
      onWordUpdated();
    } catch (err: unknown) {
      setError('Failed to save word');
    }
  };

  const handleDelete = useCallback(async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this word?')) return;
    
    try {
      await wordsApi.delete(id);
      await fetchWords(page, rowsPerPage, searchQuery);
      onWordUpdated();
    } catch (err: unknown) {
      setError('Failed to delete word');
    }
  }, [fetchWords, onWordUpdated, page, rowsPerPage, searchQuery]);

  const handleToggleFavorite = useCallback(async (id: number) => {
    try {
      await wordsApi.toggleFavorite(id);
      await fetchWords(page, rowsPerPage, searchQuery);
      onWordUpdated();
    } catch (err: unknown) {
      setError('Failed to toggle favorite');
    }
  }, [fetchWords, onWordUpdated, page, rowsPerPage, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(0);
    fetchWords(0, rowsPerPage, value);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    fetchWords(newPage, rowsPerPage, searchQuery);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = parseInt(event.target.value, 10);
    setRowsPerPage(newRows);
    setPage(0);
    fetchWords(0, newRows, searchQuery);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Words List</Typography>
        <Box display="flex" gap={1} alignItems="center">
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          {loading && <CircularProgress size={20} />}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            Add Word
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <WordTable
        words={words}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
      />
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Word</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="English"
            value={formData.english}
            onChange={(e) => setFormData({ ...formData, english: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Russian"
            value={formData.russian}
            onChange={(e) => setFormData({ ...formData, russian: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Example (English)"
            value={formData.exampleEn}
            onChange={(e) => setFormData({ ...formData, exampleEn: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Example (Russian)"
            value={formData.exampleRu}
            onChange={(e) => setFormData({ ...formData, exampleRu: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Word</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="English"
            value={formData.english}
            onChange={(e) => setFormData({ ...formData, english: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Russian"
            value={formData.russian}
            onChange={(e) => setFormData({ ...formData, russian: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Example (English)"
            value={formData.exampleEn}
            onChange={(e) => setFormData({ ...formData, exampleEn: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Example (Russian)"
            value={formData.exampleRu}
            onChange={(e) => setFormData({ ...formData, exampleRu: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
