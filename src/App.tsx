import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CharacterCreation } from '@/features/character-creation/CharacterCreation';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

function App() {
  return (
    <Theme>
      <Router>
        <Routes>
          <Route path="/" element={<CharacterCreation />} />
        </Routes>
      </Router>
    </Theme>
  );
}

export default App;
