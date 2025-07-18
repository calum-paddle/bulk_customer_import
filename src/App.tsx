import React, { useState, useRef } from 'react';

interface LogEntry {
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

function App() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (type: 'success' | 'error' | 'info', message: string) => {
    setLogs(prev => [...prev, { type, message, timestamp: new Date() }]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      addLog('info', `Selected file: ${file.name}`);
    } else if (file) {
      addLog('error', 'Please select a valid CSV file');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      addLog('info', `Dropped file: ${file.name}`);
    } else {
      addLog('error', 'Please drop a valid CSV file');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!apiKey.trim()) {
      addLog('error', 'Please enter your Paddle API key');
      return;
    }
    
    if (!csvFile) {
      addLog('error', 'Please select a CSV file');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    addLog('info', 'Starting bulk customer import...');

    try {
      const formData = new FormData();
      formData.append('csv_file', csvFile);
      formData.append('api_key', apiKey);
      formData.append('is_sandbox', isSandbox.toString());

      addLog('info', 'Uploading file and processing data...');
      addLog('info', `📁 File: ${csvFile.name} (${csvFile.size} bytes)`);
      addLog('info', `🔑 API key: ${apiKey ? 'Provided' : 'Missing'}`);
      addLog('info', `🌐 Environment: ${isSandbox ? 'Sandbox' : 'Production'}`);
      setProgress(10);

      console.log('🚀 Sending request to backend...');
      const response = await fetch('http://localhost:5001/api/import', {
        method: 'POST',
        body: formData,
      });
      
      console.log('📥 Response received:', response.status, response.statusText);

      setProgress(50);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import customers');
      }

      const result = await response.json();
      setProgress(100);

      addLog('success', `🎉 Import completed! Processed ${result.total_records} records`);
      addLog('success', `✅ Successful: ${result.successful} customers`);
      
      if (result.failed > 0) {
        addLog('error', `❌ Failed: ${result.failed} customers`);
      }

      if (result.errors && result.errors.length > 0) {
        addLog('info', 'Error details:');
        result.errors.slice(0, 5).forEach((error: string) => {
          addLog('error', error);
        });
        if (result.errors.length > 5) {
          addLog('info', `... and ${result.errors.length - 5} more errors`);
        }
      }
      
    } catch (error) {
      addLog('error', `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const downloadTemplate = () => {
    const headers = [
      'customer_email',
      'customer_full_name',
      'customer_external_id',
      'address_country_code',
      'address_street_line1',
      'address_street_line2',
      'address_city',
      'address_region',
      'address_postal_code',
      'address_external_id',
      'business_name',
      'business_company_number',
      'business_tax_identifier',
      'business_external_id'
    ];
    
    const exampleData = [
      'john@example.com',
      'John Doe',
      'CUST001',
      'US',
      '123 Main St',
      'Apt 4B',
      'New York',
      'NY',
      '10001',
      'ADDR001',
      'Acme Corp',
      '123456789',
      'GB123456789',
      'BIZ001'
    ];
    
    const csvContent = [
      headers.join(','),
      exampleData.join(',')
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paddle_customer_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    addLog('info', 'CSV template downloaded successfully');
  };

  return (
    <div className="container">
      <div className="logo">paddle</div>
      
      <div className="card">
        <h1 className="title">Bulk Customer Importer</h1>
        <p className="subtitle">
          Upload your CSV file and enter your Paddle API key to import customers in bulk
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="apiKey" className="label">
              Paddle API Key
            </label>
            <div className="input-with-toggle">
              <input
                type={showApiKey ? "text" : "password"}
                id="apiKey"
                className="input"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Paddle API key"
                disabled={isProcessing}
              />
              <button
                type="button"
                className="toggle-button"
                onClick={() => setShowApiKey(!showApiKey)}
                disabled={isProcessing}
                title={showApiKey ? "Hide API key" : "Show API key"}
              >
                {showApiKey ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="label">
              Environment
            </label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="environment-toggle"
                checked={isSandbox}
                onChange={(e) => {
                  const newIsSandbox = e.target.checked;
                  setIsSandbox(newIsSandbox);
                  const apiUrl = newIsSandbox ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com';
                  console.log(`🌐 Environment switched to: ${newIsSandbox ? 'Sandbox' : 'Production'}`);
                  console.log(`🔗 API URL: ${apiUrl}`);
                }}
                disabled={isProcessing}
              />
              <label htmlFor="environment-toggle" className="toggle-label">
                <span className="toggle-text">{isSandbox ? 'Sandbox' : 'Production'}</span>
                <span className="toggle-slider"></span>
              </label>
            </div>
            <small className="environment-help">
              {isSandbox ? 'Using sandbox environment for testing' : 'Using production environment - real data will be created'}
            </small>
          </div>

          <div className="form-group">
            <label className="label">CSV File</label>
            <div className="template-download">
              <button
                type="button"
                onClick={downloadTemplate}
                className="template-button"
                disabled={isProcessing}
              >
                📥 Download Template
              </button>
              <small>Get a CSV template with the correct headers and example data</small>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="file-input"
              disabled={isProcessing}
            />
            <div
              className={`file-label ${dragOver ? 'dragover' : ''}`}
              onClick={handleFileClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {csvFile ? (
                <div>
                  <strong>Selected: {csvFile.name}</strong>
                  <br />
                  <small>Click to change file or drag and drop a new CSV file</small>
                </div>
              ) : (
                <div>
                  <strong>Click to select CSV file</strong>
                  <br />
                  <small>or drag and drop your CSV file here</small>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="button"
            disabled={isProcessing || !apiKey.trim() || !csvFile}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Processing... {Math.round(progress)}%
              </>
            ) : (
              'Start Import'
            )}
          </button>
        </form>

        {isProcessing && (
          <div className="progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {logs.length > 0 && (
          <div className="logs">
            {logs.map((log, index) => (
              <div key={index} className={`log-entry ${log.type}`}>
                [{log.timestamp.toLocaleTimeString()}] {log.message}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="csv-requirements">
        <h3>CSV Format Requirements</h3>
        <p>
          Your CSV file should include the following columns:
        </p>
        <ul>
          <li><strong>customer_email</strong> - Required: Customer's email address</li>
          <li><strong>customer_full_name</strong> - Required: Customer's full name</li>
          <li><strong>customer_external_id</strong> - Optional: External customer ID</li>
          <li><strong>address_country_code</strong> - Optional: Country code (e.g., US, GB)</li>
          <li><strong>address_street_line1</strong> - Optional: Street address line 1</li>
          <li><strong>address_street_line2</strong> - Optional: Street address line 2</li>
          <li><strong>address_city</strong> - Optional: City</li>
          <li><strong>address_region</strong> - Optional: State/Region</li>
          <li><strong>address_postal_code</strong> - Optional: Postal code</li>
          <li><strong>address_external_id</strong> - Optional: External address ID</li>
          <li><strong>business_name</strong> - Optional: Business name</li>
          <li><strong>business_company_number</strong> - Optional: Company number</li>
          <li><strong>business_tax_identifier</strong> - Optional: Tax identifier</li>
          <li><strong>business_external_id</strong> - Optional: External business ID</li>
        </ul>
      </div>
    </div>
  );
}

export default App; 