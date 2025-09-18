# CarouselCraft

Create stunning Instagram carousels with AI-powered content generation.

## Features

- 🎨 **AI-Powered Content**: Generate engaging titles and descriptions using OpenAI
- 📱 **Instagram Ready**: Perfect 1080×1350 dimensions for Instagram carousels
- 🎭 **Multiple Styles**: Choose from various preset styles and customize text
- 🖼️ **Image Selection**: Pick 2-10 images from your gallery
- ✏️ **Live Editing**: Edit text and styles with real-time preview
- 📤 **Easy Export**: Save and share your carousels as PNG files

## Tech Stack

- **Framework**: Expo with TypeScript
- **State Management**: Zustand
- **Navigation**: Expo Router
- **AI Integration**: OpenAI API
- **Image Processing**: expo-image-picker, react-native-view-shot
- **UI Components**: Custom design system

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (for development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your OpenAI API key:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your-api-key-here
     ```

4. Start the development server:
   ```bash
   npm start
   ```

### Configuration

The app uses environment variables for configuration. Create a `.env` file with:

```
OPENAI_API_KEY=your-openai-api-key-here
```

## Project Structure

```
src/
├── core/                 # Core utilities and constants
│   ├── theme.ts         # Design system colors, typography, spacing
│   ├── presets.ts       # Style presets for carousels
│   ├── sizes.ts         # App dimensions and constraints
│   ├── validators.ts    # Input validation helpers
│   ├── image.ts         # Image processing utilities
│   └── export.ts        # Export functionality
├── features/
│   └── project/         # Project-related features
│       ├── models/      # Data models (Project, Slide, AI types)
│       ├── components/  # Feature-specific components
│       ├── store.ts     # Zustand store for project state
│       ├── wizardStore.ts # Wizard state management
│       ├── aiStore.ts   # AI state management
│       ├── openai.ts    # OpenAI API integration
│       └── prompt.ts    # AI prompt building
└── shared/
    └── ui/              # Reusable UI components
        ├── Button.tsx
        ├── Card.tsx
        └── Segmented.tsx
```

## Usage

1. **New Project**: Tap "New Project" to start creating a carousel
2. **Select Images**: Choose 2-10 images from your gallery
3. **Configure Content**: Set category, goal, audience, and tone
4. **Choose Style**: Select from preset styles (Classic Black, Tech Blue, Bold Card)
5. **Add Key Points**: Enter key points or use voice input
6. **Generate AI Content**: Let AI create engaging titles and descriptions
7. **Preview & Edit**: Review your carousel and make final adjustments
8. **Export**: Save as PNG files ready for Instagram

## Style Presets

- **Classic Black**: Dark overlay with top-left aligned text
- **Tech Blue**: Blue gradient with centered text
- **Bold Card**: Semi-transparent card with bottom text

## API Integration

The app integrates with OpenAI's API to generate carousel content. Make sure to:

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to your environment variables
3. Test the connection in the Settings screen

## Development

### Running the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details