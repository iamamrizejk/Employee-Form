import React from 'react';
import Frontend from './components/frontend'; 

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Main Content */}
      <main className="flex-grow">
        <Frontend />
      </main>
    </div>
  );
};

export default App;
