import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

import GoalForm from './components/GoalForm';
import GoalList from './components/GoalList';
import Header from './components/Header';
import { GoalProvider } from './context/GoalContext';
import './i18n/index.js';

const system = createSystem(defaultConfig);

export default function App() {
  return (
    <ChakraProvider value={system}>
      <GoalProvider>
        <Box maxW="720px" mx="auto" p={6}>
          <Header />
          <GoalForm />
          <GoalList />
        </Box>
      </GoalProvider>
    </ChakraProvider>
  );
}
