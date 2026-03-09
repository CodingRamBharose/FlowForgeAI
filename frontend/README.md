# FlowForge AI - Workflow Orchestration & Governance Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.10-blue.svg)](https://mui.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.1.0-purple.svg)](https://redux-toolkit.js.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.3-black.svg)](https://socket.io/)
[![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF.svg)](https://vitejs.dev/)

A modern, real-time AI workflow orchestration and governance platform built with React, TypeScript, and cutting-edge web technologies. FlowForge provides a comprehensive solution for managing, monitoring, and governing AI workflows with enterprise-grade features.

## 🌟 Features

### Core Functionality
- **Workflow Management** - Create, edit, and manage complex AI workflows
- **Real-time Collaboration** - Live updates and notifications via Socket.IO
- **Visual Workflow Builder** - Drag-and-drop interface for workflow creation
- **Version Control** - Track workflow changes and maintain version history
- **Audit Trail** - Complete logging of all user actions and workflow changes

### User Experience
- **Dark/Light Theme** - Automatic theme switching with system preference detection
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Role-based Access Control** - Permission-based feature access
- **Real-time Notifications** - Live activity feeds and status updates
- **Advanced Filtering** - Powerful search and filter capabilities

### Technical Features
- **Type-Safe Development** - Full TypeScript coverage
- **State Management** - Redux Toolkit for predictable state updates
- **Component Architecture** - Reusable, composable UI components
- **Performance Optimized** - Lazy loading, code splitting, and efficient rendering
- **Accessibility** - WCAG compliant components and keyboard navigation

## 🚀 Tech Stack

### Frontend Framework
- **React 18** - Modern React with concurrent features and hooks
- **TypeScript 5.3** - Type-safe JavaScript with advanced type features
- **Vite 5.1** - Fast build tool with HMR and optimized production builds

### UI & Styling
- **Material-UI 5.15** - Comprehensive component library with theming
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Emotion** - CSS-in-JS for dynamic styling
- **React Select** - Enhanced select components with icons

### State Management & Validation
- **Redux Toolkit 2.1** - Simplified Redux with modern patterns
- **React Redux 9.1** - Official React bindings for Redux
- **Zod 4.3** - TypeScript-first schema declaration and validation
- **React Hook Form 7.71** - Performant, flexible and extensible forms

### Routing & Navigation
- **React Router 6.22** - Declarative routing for React applications

### Real-time Communication
- **Socket.IO Client 4.8** - Real-time bidirectional communication

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript Compiler** - Type checking and compilation

## 📁 Project Structure

```
flowforge/
├── src/
│   ├── app/
│   │   └── providers/
│   ├── components/
│   │   ├── activity/
│   │   ├── audit/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── notifications/
│   │   ├── settings/
│   │   ├── ui/
│   │   └── workflows/
│   ├── config/
│   ├── context/
│   ├── features/
│   │   ├── activity/
│   │   ├── audit/
│   │   ├── auth/
│   │   ├── notifications/
│   │   └── workflows/
│   ├── hooks/
│   ├── routes/
│   │   └── layouts/
│   ├── styles/
│   ├── theme/
│   ├── types/
│   └── utils/
```

## 🏗️ Architecture Overview

### Feature-Sliced Design
FlowForge follows the **Feature-Sliced Design** architecture, where each business feature is self-contained with its own:
- Components (UI logic)
- Business logic (state management)
- Types and interfaces
- API integrations

### State Management
- **Redux Toolkit** for global state management
- Feature-based slices for modular state organization
- RTK Query for server state management (future enhancement)

### Component Architecture
- **Atomic Design** principles for component organization
- Reusable UI components in `/components/ui/`
- Feature-specific components in `/features/*/components/`
- Page-specific components in `/pages/components/`

### Real-time Communication
- **Socket.IO** for bidirectional real-time communication
- Live activity monitoring and notifications
- Real-time workflow status updates

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/flowforge-ai.git
   cd flowforge-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Scripts

```bash
# Start development server with HMR
npm run dev

# Run TypeScript type checking
npm run type-check

# Run ESLint for code quality
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 How It Works

### Application Flow

1. **Authentication**
   - User logs in via `/auth/login`
   - JWT tokens stored in localStorage
   - Protected routes check authentication status

2. **Dashboard**
   - Displays workflow statistics and quick actions
   - Real-time activity feed via Socket.IO
   - Theme-aware components that adapt to user preferences

3. **Workflow Management**
   - **List View** (`/workflows`) - Browse and filter workflows
   - **Editor** (`/workflows/new` or `/workflows/:id`) - Create/edit workflows
   - **Preview** (`/workflows/:id/preview`) - Test workflow execution

4. **Real-time Features**
   - Socket.IO connections established on app load
   - Live notifications for workflow status changes
   - Activity panel shows real-time workflow executions

5. **Settings & Configuration**
   - Theme switching (Light/Dark/Auto)
   - Language preferences
   - Profile management
   - Advanced settings

### Key Components Explained

#### Theme System
#### Theme System
- **ThemeContext** - Global theme state management implementing `useTheme`
- **Material-UI Theme** - Dynamic theme creation based on mode
- **CSS Classes** - Tailwind dark mode classes for custom styling

#### Workflow Builder
- **Visual Interface** - Drag-and-drop workflow creation
- **Step Configuration** - Detailed parameter setup for each step
- **Version Control** - Track changes and maintain history

#### Real-time Activity
- **SocketProvider** - Manages WebSocket connections
- **Activity Slice** - Redux state for activity data
- **Activity Panel** - Floating panel showing live updates

#### Component Reusability
- **IconSelect** - Custom select component with icons
- **SettingsCard** - Reusable settings option cards
- **PageHeader** - Consistent page headers across the app

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Configuration
VITE_APP_NAME="FlowForge AI"
VITE_API_BASE_URL="http://localhost:8000/api"

# Feature Flags (true/false)
VITE_FEATURE_VERSIONING=true
VITE_FEATURE_AUDIT_TRAIL=true
VITE_ENABLE_MOCK_API=true
```

### Theme Configuration
Themes are configured in `src/theme/muiTheme.ts` with support for:
- Light and dark mode palettes
- Custom color schemes
- Typography settings
- Component overrides

### Feature Flags
Feature toggles are managed in `src/utils/featureFlags.ts` for:
- Experimental features
- A/B testing
- Gradual rollouts

## 🧪 Development Guidelines

### Code Style
- **ESLint** for code quality and consistency
- **Prettier** for automatic code formatting
- **TypeScript** for type safety

### Component Development
- **Use functional components with hooks**
- **Implement proper TypeScript interfaces**
- **Follow atomic design principles**
- **Use theme-aware styling**

### State Management
- **Use Redux Toolkit for complex state**
- **Prefer local state for component-specific data**
- **Implement proper error handling**

### Testing Strategy
- **Unit tests for utilities and hooks**
- **Integration tests for components**
- **E2E tests for critical user flows**

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run type-check
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Commit Convention
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Testing related changes

**Built with ❤️ using modern web technologies**
