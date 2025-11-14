# RentalTool

A modern rental management platform built with Next.js, React, and TypeScript. RentalTool helps property managers and landlords streamline their rental operations with an intuitive, accessible interface.

## Features

- 🏢 **Property Management** - Efficiently manage multiple rental properties
- 👥 **Tenant Portal** - Streamlined communication and document sharing
- 🔑 **Lease Tracking** - Track rental agreements, payments, and renewals
- 📊 **Analytics Dashboard** - Monitor rental performance and financials
- 🎨 **Modern UI** - Beautiful, accessible interface built with Untitled UI components

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and Turbopack
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4.1](https://tailwindcss.com/)
- **Components**: [React Aria Components](https://react-spectrum.adobe.com/react-aria/) for accessibility
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [@untitledui/icons](https://www.untitledui.com/react/resources/icons)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/milhamakbarjr/rentaltool.git
cd rentaltool
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Copy the environment file and configure:
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
rentaltool/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── application/  # Application-specific components
│   │   ├── base/         # Base UI components
│   │   ├── foundations/  # Foundation elements (icons, logos)
│   │   └── marketing/    # Marketing page components
│   ├── hooks/            # Custom React hooks
│   ├── providers/        # React context providers
│   ├── styles/           # Global styles and themes
│   └── utils/            # Utility functions
├── public/               # Static assets
└── ...config files
```

## Configuration

### Environment Variables

See `.env.example` for all available environment variables. Key configurations include:

- Database connection
- API endpoints
- Authentication settings
- Payment gateway credentials
- Email service configuration

### Tailwind Configuration

Tailwind CSS v4 is configured in `src/styles/globals.css` with custom utilities and theme extensions.

## Component Library

This project uses Untitled UI open-source components as a foundation. The component library includes:

- **Base Components**: Buttons, inputs, forms, badges, avatars, etc.
- **Application Components**: Navigation, modals, tables, date pickers, etc.
- **Foundation Elements**: Icons, logos, patterns, illustrations

Components are built with React Aria for world-class accessibility and keyboard navigation.

## Development

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting with Tailwind CSS plugin
- **Import Sorting**: Automatic import organization

### Best Practices

- Use TypeScript for all new code
- Follow accessibility guidelines (WCAG 2.1)
- Write semantic HTML
- Prefer server components when possible
- Use client components only when needed (interactivity, hooks)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Untitled UI React](https://www.untitledui.com/react) open-source components
- Icons from [@untitledui/icons](https://www.untitledui.com/react/resources/icons)
- Accessibility powered by [React Aria](https://react-spectrum.adobe.com/react-aria/)

## Support

For issues, questions, or contributions, please visit:
- [GitHub Issues](https://github.com/milhamakbarjr/rentaltool/issues)
- [GitHub Discussions](https://github.com/milhamakbarjr/rentaltool/discussions)

---

Built with ❤️ by the RentalTool Team
