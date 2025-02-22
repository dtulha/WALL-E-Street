# WALL-E Street

An AI-powered equity research platform.

## Setup & Development

### Prerequisites
- Node.js (v18 or higher)
- Python 3.12 or higher
- npm or yarn

### Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/WALL-E-Street.git
cd WALL-E-Street
```

2. Install dependencies and start development servers
```bash
npm install
npm run dev
```

The `npm run dev` command will:
1. Set up a Python virtual environment (if not exists)
2. Install Python dependencies
3. Start the Next.js frontend (http://localhost:3000)
4. Start the FastAPI backend (http://localhost:8000)

### Manual Setup (if needed)

If you need to set up the Python environment separately:
```bash
npm run setup  # Sets up Python venv and installs dependencies
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:
```bash
cp .env.example .env
```
