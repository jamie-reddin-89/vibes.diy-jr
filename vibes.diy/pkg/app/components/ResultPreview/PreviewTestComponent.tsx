// Simple test component for debugging preview issues
import React, { useState } from 'react';

export default function PreviewTestComponent() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>Preview Test Component</h1>
      <p>This is a simple React component to test if preview rendering works.</p>
      
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '15px', 
        borderRadius: '8px',
        border: '2px solid #007bff',
        margin: '20px 0'
      }}>
        <h2>Counter: {count}</h2>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Increment
        </button>
        <button 
          onClick={() => setCount(0)}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginLeft: '10px'
          }}
        >
          Reset
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#d4edda', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid #c3e6cb'
      }}>
        <h3 style={{ color: '#155724', marginTop: 0 }}>Success!</h3>
        <p style={{ color: '#155724', marginBottom: 0 }}>
          If you can see this component, the preview system is working correctly.
        </p>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Debug Info:</p>
        <ul>
          <li>React version: {React.version}</li>
          <li>Current time: {new Date().toLocaleString()}</li>
          <li>User Agent: {navigator.userAgent}</li>
        </ul>
      </div>
    </div>
  );
}