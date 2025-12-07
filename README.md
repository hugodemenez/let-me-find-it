# let-me-find-it

Let me find it by Franchizor

A Next.js 16 application featuring:
- **App Router** with dynamic routing
- **Vercel AI SDK v6 Beta** with streamObject for AI-powered features
- **Internationalization** (EN/FR) using next-international
- **Cached Components** using React cache()
- **React 19** with latest features
- **Tailwind CSS** for styling

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hugodemenez/let-me-find-it.git
cd let-me-find-it
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_actual_api_key_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Features

### 1. Next.js 16 App Router
The application uses Next.js 16 with the modern App Router, featuring:
- Server Components by default
- File-based routing with `[locale]` dynamic segments
- API routes in the `app/api` directory
- Turbopack for fast builds

### 2. Vercel AI SDK v6 Beta with streamObject
The `/api/stream-object` endpoint demonstrates:
- Real-time streaming of AI-generated structured data using the latest AI SDK v6 beta
- Type-safe schemas using Zod
- Integration with OpenAI's GPT-4 model
- Streaming UI with `@ai-sdk/react`

### 3. Internationalization (EN/FR)
- Uses `next-international` for type-safe i18n
- Supports English and French languages
- Client-side language switching
- Server-side translations with `setStaticParamsLocale`

### 4. Cached Components
The `CachedComponent` demonstrates React's `cache()` function:
- Deduplicates requests during a single render
- Improves performance for repeated data fetching
- Works seamlessly with Server Components

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Localized pages
│   │   ├── layout.tsx     # Root layout with I18nProvider
│   │   └── page.tsx       # Home page
│   ├── api/
│   │   └── stream-object/ # AI streaming endpoint
│   └── globals.css        # Global styles
├── components/
│   ├── AIStreamDemo.tsx      # Client component for AI streaming
│   ├── CachedComponent.tsx   # Server component with caching
│   ├── ClientProvider.tsx    # I18n client provider wrapper
│   └── LanguageSwitcher.tsx  # Client component for language switching
├── locales/
│   ├── client.ts          # Client-side i18n setup
│   ├── server.ts          # Server-side i18n setup
│   ├── en.ts              # English translations
│   └── fr.ts              # French translations
└── proxy.ts               # I18n proxy (Next.js 16 convention)
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with Server Components
- **Vercel AI SDK v6 Beta** - AI integration and streaming (`ai@6.0.0-beta.138`)
- **@ai-sdk/react** - React hooks for AI SDK
- **@ai-sdk/openai** - OpenAI integration
- **next-international** - Type-safe internationalization
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety and developer experience
- **Zod** - Schema validation

## Security Notes

⚠️ **Important**: The AI streaming endpoint (`/api/stream-object`) includes basic input validation but is intended for demonstration purposes. For production use, you should:

1. Add authentication (e.g., API keys, JWT tokens)
2. Implement rate limiting to prevent abuse
3. Add monitoring and logging
4. Consider using Vercel's edge config or middleware for access control
5. Set up usage limits for the OpenAI API

## License

MIT
