# Project Civil AI Assistant Rules

## UI Components
- **Shadcn UI First**: ALWAYS use Shadcn UI components to build the UI (e.g., `<Select>`, `<Input>`, `<Card>`) instead of native HTML elements (e.g., `<select>`, `<input>`). Create custom components **if and only if** a suitable Shadcn component is not available for the task.
- **Loading States**: Always use the custom `ConstructionLoader` (`@/components/ui/ConstructionLoader`) for loading spinners instead of generic spinning circles (`animate-spin`), as this aligns with the construction theme of the application.

## TypeScript and Forms
- **Shadcn Select Nullability**: When using the Shadcn `<Select>` component's `onValueChange` handler to update state variables that are strictly typed as `string`, ALWAYS provide an empty string fallback to avoid `Type 'null' is not assignable to type 'string'` errors.
  - Correct: `onValueChange={(val) => setFormData(prev => ({ ...prev, field: val || '' }))}`
  - Incorrect: `onValueChange={(val) => setFormData(prev => ({ ...prev, field: val }))}`

## Architecture and State Management
- **Component Reusability**: Always follow the existing project structure and aim to make components highly reusable. Do not duplicate UI or logic; abstract them into reusable components.
- **Redux for API State**: Whenever integrating a new API or fetching data from the backend, ALWAYS use Redux for proper state management (create slices, async thunks, and use `useAppDispatch`/`useAppSelector`). Avoid managing API data in local component state.

## Code Quality
- **Robustness and Readability**: All code written must be robust, easy to read, and easy to understand. Favor clear variable naming and simple, expressive logic over clever but complex code. Ensure proper error handling and edge-case management.
