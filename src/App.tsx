import { Routes, Route, Navigate } from 'react-router-dom';
import ChooseSkip from './pages/ChooseSkip';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/choose" />} />
      <Route path="/choose" element={<ChooseSkip />} />
    </Routes>
  );
}

export default App;
