# Repository Overview

- **Name**: freeio-react
- **Build Tool**: Vite 5
- **Language**: React 18 (JS)
- **Router**: react-router-dom v6
- **State**: zustand
- **Aliases**: `@` -> `./src`

## Scripts
- **dev**: `vite`
- **build**: `vite build`
- **preview**: `vite preview`
- **lint**: eslint

## Key App Structure
- **src/main.jsx**: App entry
- **src/Routes.jsx**: Routes
- **src/pages/**: Page routes
- **src/components/**: Reusable UI
- **src/store/**: Zustand stores
- **public/**: Static assets

## Service-1 Integration
- **Page**: `src/pages/service/service-1/index.jsx`
  - Fetches from `http://192.168.1.222:9003/catalog-service/listServices` if navigation state is absent
  - Passes `services` to `Listing1` and a custom `CardComponent`
- **Listing**: `src/components/section/Listing1.jsx`
  - Accepts `services` as array or `{ success, message, data }`
  - Normalizes backend items to listing card schema
  - Filters via zustand stores
  - Uses `CardComponent` if provided; falls back to existing cards
- **Custom Card**: `src/components/card/ServiceCardService1.jsx`
  - Displays: image, title, short description, capabilities (up to 4), tools (chips), milestone badges, author, and advance value
  - Links to `/service-single/:id`

## Normalization Highlights
- **img**: from `imgURLs[0]` else `/images/header-logo.svg`
- **title**: from `name`
- **category**: from `shortDescription || description`
- **price**: numeric from `milestoneRules.advance` (percent/number supported)
- **raw**: original backend item attached for custom card

## Notes / Next Steps
- Move API URL to `.env` and reference via import.meta.env
- Update filters if a real price field arrives
- Ensure `service-single/:id` consumes backend shape (currently uses normalized item id/name)