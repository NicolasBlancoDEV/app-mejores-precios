import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-4 text-center text-red-500">
          <h2>Algo salió mal.</h2>
          <p>Error: {this.state.error.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn bg-blue-500 text-white mt-4"
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;