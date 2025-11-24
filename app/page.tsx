'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { School, List, Favorite, BarChart } from '@mui/icons-material';
import { StudyCard } from '../components/StudyCard';
import { WordList } from '../components/WordList';
import { StatsComponent } from '../components/Stats';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4dabf7',
    },
    secondary: {
      main: '#ff6b6b',
    },
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function HomePage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleWordCompleted = () => {};

  const handleWordUpdated = () => {};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              VY - Langs learning application
            </Typography>
          </Toolbar>
        </AppBar>

        <Container>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="app tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<School />} label="Study" iconPosition="start" />
              <Tab icon={<Favorite />} label="Favorites" iconPosition="start" />
              <Tab icon={<List />} label="Words List" iconPosition="start" />
              <Tab icon={<BarChart />} label="Statistics" iconPosition="start" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box display="flex" justifyContent="center" marginTop="-16px">
              <StudyCard onWordCompleted={handleWordCompleted} favoriteOnly={false} />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box display="flex" justifyContent="center">
              <StudyCard onWordCompleted={handleWordCompleted} favoriteOnly />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <WordList onWordUpdated={handleWordUpdated} />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <StatsComponent />
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
