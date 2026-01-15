# Site24x7 Uptime Report System

A React application that parses Site24x7 PDF uptime reports and generates formatted summaries for Slack posting.

## Features

- **Dual Upload Zones**: Separate upload areas for Critical and Down reports
- **PDF Parsing**: Extracts incident data from Site24x7 PDF reports
- **Summary Statistics**: Shows total incidents, breakdown by type, and affected monitors
- **Copy to Clipboard**: Three copy buttons for different output formats
  - Copy Critical Only
  - Copy Down Only
  - Copy All (Summary + Critical + Down)
- **Slack-Ready Formatting**: Output includes emojis and proper formatting for Slack
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Error Handling**: Comprehensive validation for file types, corrupted files, and more

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd uptime-report-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage

### File Naming Conventions

The application expects PDF files with specific naming patterns:

- **Critical Reports**: Filename must contain "critical" (case-insensitive)
  - Example: `site24x7_critical_2025-01-15.pdf`
  - Example: `Critical_Report_January.pdf`

- **Down Reports**: Filename must contain "down" (case-insensitive)
  - Example: `site24x7_down_2025-01-15.pdf`
  - Example: `Down_Incidents_Report.pdf`

### Uploading Files

1. Drag and drop a PDF file onto the appropriate upload zone, or click to browse
2. The Critical Report zone (red) accepts files with "critical" in the filename
3. The Down Report zone (blue) accepts files with "down" in the filename
4. Files are processed automatically upon upload

### Copying Results

After uploading files, three copy buttons appear:

- **Copy Critical**: Copies only Critical incidents with red emoji markers
- **Copy Down**: Copies only Down incidents with blue emoji markers
- **Copy All**: Copies the complete summary including statistics and all incidents

### Output Format

The copied text is formatted for Slack with:
- Section separators
- Emoji indicators (red for Critical, blue for Down)
- Bullet-formatted incident lists
- Monitor breakdown statistics

Example output:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 OVERALL SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Incidents: 5
Critical: 2 | Down: 3
Affected Monitors: 3/10

Monitor Breakdown:
• Server-A: 2 incidents (1 Critical, 1 Down)
• Server-B: 2 incidents (1 Critical, 1 Down)
• Server-C: 1 incident (0 Critical, 1 Down)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 CRITICAL INCIDENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 Server-A is Critical at 10:30AM Resolved at 10:45AM
🔴 Server-B is Critical at 2:15PM Resolved at 2:30PM
```

## Development

### Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

### Project Structure

```
uptime-report-app/
├── public/
│   ├── index.html
│   └── pdf.worker.mjs      # PDF.js worker file
├── src/
│   ├── components/
│   │   ├── CopyButton.tsx  # Clipboard copy button
│   │   ├── IncidentList.tsx
│   │   ├── ResultsDisplay.tsx
│   │   ├── SummaryStats.tsx
│   │   └── UploadZone.tsx
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces
│   ├── utils/
│   │   ├── clipboard.ts    # Clipboard utilities
│   │   ├── constants.ts
│   │   ├── incidentParser.ts
│   │   ├── pdfParser.ts
│   │   ├── summaryCalculator.ts
│   │   └── timeFormatter.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- PDF.js (for PDF parsing)
- Create React App

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment
4. Get your production URL

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `build/` folder to Netlify
3. Or connect your GitHub repository for automatic deployments

### Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
{
  "homepage": "https://<username>.github.io/<repo-name>",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

## Error Handling

The application handles the following error scenarios:

- **Invalid file type**: Only PDF files are accepted
- **File too large**: Maximum file size is 10MB
- **Corrupted files**: Validates PDF header and structure
- **Password protected**: Rejects encrypted PDFs
- **No text content**: Warns if PDF contains no extractable text
- **Wrong filename**: Validates that files match the expected naming pattern
- **No incidents found**: Shows informational message when no incidents are parsed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

The clipboard API uses the modern `navigator.clipboard` API with a fallback for older browsers.

## License

MIT
