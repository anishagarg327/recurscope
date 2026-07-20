import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#330000', color: '#ff9999', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <h2>Something went wrong in the React Tree!</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: '#000', padding: '10px' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: '#000', padding: '10px', marginTop: '10px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
