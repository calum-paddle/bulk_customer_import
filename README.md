# Paddle Bulk Customer Importer

A modern web application for importing customers in bulk to Paddle using their API. Features a beautiful React frontend and a Flask backend that processes CSV files and creates customers, addresses, and businesses via the Paddle API.

## Features

- 🎨 Modern, responsive React frontend with drag-and-drop file upload
- 🔐 Secure API key input with show/hide toggle
- 🌐 Sandbox/Production environment toggle (defaults to production)
- 📊 Real-time progress tracking and detailed logging
- 🏢 Support for customers, addresses, and businesses
- ✅ Comprehensive error handling and reporting
- 📱 Mobile-friendly design
- 📥 CSV template download with example data
- 🔍 Detailed debugging logs for troubleshooting

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

## Setup

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

## Running the Application

### Option 1: One Command (Recommended)

**macOS/Linux:**

```bash
./start.sh
```

**Windows:**

```bash
start.bat
```

This will automatically:

- Install dependencies if needed
- Create a Python virtual environment
- Start both the Flask backend and React frontend
- Open the application in your browser

### Option 2: Manual Startup

#### 1. Start the Backend Server

```bash
python app.py
```

The Flask server will start on `http://localhost:5001`

#### 2. Start the Frontend Development Server

In a new terminal:

```bash
npm start
```

The React app will start on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. **Environment Selection**: Choose between Sandbox (for testing) or Production (for real data)
3. **API Key**: Enter your Paddle API key (use the eye icon to show/hide the key)
4. **CSV File**: Upload a CSV file with customer data or download the template
5. Click "Start Import" to begin the bulk import process
6. Monitor the progress and review the results

## Environment Configuration

The application supports both Paddle environments:

- **Production** (default): Uses `https://api.paddle.com` - Creates real customers and data
- **Sandbox**: Uses `https://sandbox-api.paddle.com` - Safe for testing

⚠️ **Warning**: Production mode will create real customers in your Paddle account. Use sandbox mode for testing.

## CSV Format

Your CSV file should include the following columns:

### Required Columns

- `customer_email` - Customer's email address
- `customer_full_name` - Customer's full name

### Optional Columns

- `customer_external_id` - External customer ID
- `address_country_code` - Country code (e.g., US, GB)
- `address_street_line1` - Street address line 1
- `address_street_line2` - Street address line 2
- `address_city` - City
- `address_region` - State/Region
- `address_postal_code` - Postal code
- `address_external_id` - External address ID
- `business_name` - Business name
- `business_company_number` - Company number
- `business_tax_identifier` - Tax identifier (e.g., GB123456789)
- `business_external_id` - External business ID

## Example CSV

```csv
customer_email,customer_full_name,customer_external_id,address_country_code,address_street_line1,address_street_line2,address_city,address_region,address_postal_code,address_external_id,business_name,business_company_number,business_tax_identifier,business_external_id
john@example.com,John Doe,CUST001,US,123 Main St,Apt 4B,New York,NY,10001,ADDR001,Acme Corp,123456789,GB123456789,BIZ001
jane@example.com,Jane Smith,CUST002,GB,456 High St,,London,England,SW1A 1AA,ADDR002,Smith Ltd,987654321,GB987654321,BIZ002
```

## API Configuration

The application automatically uses the correct API endpoint based on your environment selection:

- **Sandbox**: `https://sandbox-api.paddle.com`
- **Production**: `https://api.paddle.com`

### API Key Requirements

Your Paddle API key needs the following permissions:

- Create customers
- Create addresses
- Create businesses

## Error Handling

The application provides comprehensive error handling:

- Individual record failures are logged with specific error messages
- Progress tracking shows successful vs failed imports
- Error details are displayed in the frontend logs
- Processing continues even if some records fail
- Detailed backend logs for debugging

## Security Features

- API keys are transmitted securely to the backend
- Files are processed temporarily and deleted after processing
- CORS is enabled for local development
- API key visibility toggle for verification
- Environment toggle prevents accidental production use

## Development

### Frontend Structure

- `src/App.tsx` - Main React component with all UI logic
- `src/index.css` - Styling with dark theme
- `src/index.tsx` - React entry point

### Backend Structure

- `app.py` - Flask API server with Paddle integration
- `bulk_customer_importer.py` - Original Python script (for reference)

### Key Features

- **Environment Toggle**: Switch between sandbox and production
- **API Key Toggle**: Show/hide API key for verification
- **Template Download**: Get a CSV template with correct headers
- **Progress Tracking**: Real-time progress with percentage
- **Error Logging**: Detailed error messages and debugging info

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the Flask server is running on port 5001
2. **File Upload Issues**: Check that the file is a valid CSV
3. **API Errors**: Verify your Paddle API key is correct and has the necessary permissions
4. **Environment Issues**: Make sure you're using the correct environment (sandbox vs production)

### Debugging

- Check browser console for frontend logs
- Check Flask server logs for backend debugging
- Use the environment toggle to verify API URLs
- Use the API key toggle to verify your key

### Logs

The application provides detailed logging:

- **Frontend**: Progress updates, file selection, environment changes
- **Backend**: API requests, responses, error details, processing status

## License

This project is for internal use at Paddle.
