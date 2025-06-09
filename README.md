# Skip Hire - Modern React Implementation
git 
**Live Demo:** [chose-skip.vercel.app](https://chose-skip.vercel.app)
**Sandbox:** [codesandbox.io/p/github/ikiK-CRO/choseSkip/main](https://codesandbox.io/p/github/ikiK-CRO/choseSkip/main)

This project is a modern redesign of the skip hire selection page, focusing on user experience, performance, and accessibility while maintaining core functionality.

## Key Features & Improvements

### Interactive Carousel
- Implemented a smooth, touch-enabled carousel for skip size selection
- Supports both mouse drag and touch interactions
- Keyboard navigation support (left/right arrows) for accessibility
- Visual feedback with scaling and transitions for selected items
- Dot indicators for easy navigation between options

### Location-Based Skip Options
- Integration with the We Want Waste API for dynamic skip data
- Prepared for Google Maps API integration to:
  - Fetch precise geolocation
  - Display skip placement on actual street addresses
  - Support dynamic address validation
- Currently using hardcoded addresses with architecture ready for dynamic implementation
  -choseSkip.tsx: ```<MapBackground address="197 Ashby Road, Hinckley, LE10 1SH">```

### Mobile-First & Accessibility
- Fully responsive design that works seamlessly across all devices
- Comprehensive ARIA attributes implementation:
  - Proper role descriptions for carousel components
  - Clear navigation labels
  - Screen reader friendly structure
- Touch-optimized interactions for mobile users
- Adaptive layouts and sizing based on viewport

### Technical Optimizations
- Image optimization:
  - WebP format for better compression and quality
  - Lazy loading implementation for improved performance
  - Responsive image sizing based on device
- Performance improvements:
  - Memoization of expensive calculations
  - Optimized re-renders using React.memo
  - Efficient state management
- Error handling and loading states
- TypeScript for type safety and better development experience

### Modern Tech Stack
- Built with React + TypeScript + Vite for optimal development experience
- Tailwind CSS for:
  - Rapid UI development
  - Consistent design system
  - Responsive layouts
  - Custom animations and transitions
- Modern React patterns and hooks
- Clean, maintainable code structure

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Google Maps API Configuration

To enable the full location-based features:

1. Create a `.env.local` file in the root directory
2. Add your Google Maps API key:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```
3. Enable the following APIs in your Google Cloud Console:
   - Maps JavaScript API
   - Geocoding API
   - Places API

The application will automatically use the API key for geolocation and address validation features.
