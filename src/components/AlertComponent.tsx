import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import './AlertComponent.css';

interface AlertComponentProps {
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  message: string;
  show: boolean;
  onClose: () => void;
}

function AlertComponent({ variant, message, show, onClose }: AlertComponentProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <Alert variant={variant} show={show} onClose={onClose} dismissible className="alert-fixed">
      {message}
    </Alert>
  );
}

export default AlertComponent;