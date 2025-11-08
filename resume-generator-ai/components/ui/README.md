# UI Component Design System

Centralized, reusable UI components with consistent styling across the entire application.

## 🎨 Design Principles

- **Consistent**: Same look and feel across all components
- **Accessible**: WCAG AA compliant contrast ratios
- **Flexible**: Props for customization without breaking consistency
- **Typed**: Full TypeScript support

## 📦 Components

### FormInput

Text input with label, validation, and helper text.

```tsx
import { FormInput } from '@/components/ui'

<FormInput
  id="email"
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="john@example.com"
  required
  error={emailError}
  helperText="We'll never share your email"
/>
```

**Props:**
- `label?`: Input label text
- `error?`: Error message to display
- `helperText?`: Helper text below input
- `required?`: Shows red asterisk next to label
- All standard input props (type, placeholder, value, onChange, etc.)

**Visual:**
- White background with dark text (high contrast)
- Blue focus ring
- Red border when error present
- Gray disabled state

---

### FormTextarea

Multi-line textarea with character count.

```tsx
import { FormTextarea } from '@/components/ui'

<FormTextarea
  id="summary"
  label="Professional Summary"
  value={summary}
  onChange={(e) => setSummary(e.target.value)}
  rows={8}
  maxLength={500}
  showCount
  placeholder="Brief professional summary..."
/>
```

**Props:**
- `label?`: Textarea label text
- `maxLength?`: Maximum character limit
- `showCount?`: Show character counter
- `error?`: Error message
- `helperText?`: Helper text
- All standard textarea props

**Visual:**
- Same styling as FormInput
- Character counter turns red when over limit
- Resizable vertically

---

### Button

Primary action button with variants and loading state.

```tsx
import { Button } from '@/components/ui'

<Button
  variant="primary"
  size="md"
  onClick={handleSave}
  isLoading={saving}
  disabled={!hasChanges}
>
  Save Changes
</Button>
```

**Props:**
- `variant?`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size?`: 'sm' | 'md' | 'lg'
- `isLoading?`: Show spinner and disable
- All standard button props

**Variants:**
- **primary**: Blue background (main actions)
- **secondary**: Gray background (secondary actions)
- **danger**: Red background (destructive actions)
- **ghost**: Transparent (subtle actions)

---

### Badge

Pill-shaped tag for skills, categories, etc.

```tsx
import { Badge } from '@/components/ui'

<Badge
  variant="blue"
  onRemove={() => handleRemove(skill)}
>
  JavaScript
</Badge>
```

**Props:**
- `variant?`: 'blue' | 'green' | 'purple' | 'gray' | 'red'
- `onRemove?`: Function to call when X clicked
- `children`: Badge content

**Visual:**
- Rounded pill shape
- Color-coded backgrounds
- Optional remove button with X icon

---

## 🎯 Usage Examples

### Personal Info Form

```tsx
import { FormInput } from '@/components/ui'

<div className="space-y-4">
  <FormInput
    id="name"
    label="Full Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />

  <FormInput
    id="email"
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={emailError}
    required
  />
</div>
```

### Skills List with Badges

```tsx
import { FormInput, Button, Badge } from '@/components/ui'

const [input, setInput] = useState('')
const [skills, setSkills] = useState<string[]>([])

<div>
  <div className="flex gap-2">
    <FormInput
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Add a skill..."
    />
    <Button onClick={() => addSkill(input)}>
      Add
    </Button>
  </div>

  <div className="flex flex-wrap gap-2 mt-2">
    {skills.map((skill, i) => (
      <Badge
        key={i}
        variant="blue"
        onRemove={() => removeSkill(i)}
      >
        {skill}
      </Badge>
    ))}
  </div>
</div>
```

### Form with Actions

```tsx
import { FormInput, FormTextarea, Button } from '@/components/ui'

<form onSubmit={handleSubmit}>
  <div className="space-y-4">
    <FormInput
      label="Job Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
    />

    <FormTextarea
      label="Job Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={6}
      maxLength={500}
      showCount
    />

    <div className="flex gap-2">
      <Button type="submit" variant="primary">
        Save
      </Button>
      <Button type="button" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  </div>
</form>
```

## 🎨 Color System

All components use consistent colors:

### Text
- **Primary**: `text-gray-900` (dark gray, #111827)
- **Secondary**: `text-gray-700` (medium gray)
- **Muted**: `text-gray-500` (light gray)

### Backgrounds
- **Input**: `bg-white` (white)
- **Disabled**: `bg-gray-100` (very light gray)

### Borders
- **Default**: `border-gray-300` (light gray)
- **Focus**: Blue ring
- **Error**: Red border

### Focus States
- All interactive elements have blue focus ring
- Consistent `focus:ring-2` and `focus:ring-blue-500`

## 🔧 Customization

All components accept a `className` prop to add additional styling:

```tsx
<FormInput
  className="font-mono"  // Monospace font
  {...props}
/>

<Button
  className="w-full"  // Full width
  {...props}
/>
```

## 📝 Migration Guide

### Before (Inconsistent)

```tsx
<input
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-lg..."
  // Different styling in every component
/>
```

### After (Consistent)

```tsx
<FormInput
  type="text"
  // Consistent styling from design system
/>
```

**Benefits:**
- ✅ Consistent styling automatically
- ✅ Less code to write
- ✅ Built-in accessibility
- ✅ Error handling included
- ✅ Easier to maintain
- ✅ Type-safe props

## 🚀 Getting Started

1. **Import from `@/components/ui`:**
   ```tsx
   import { FormInput, Button, Badge } from '@/components/ui'
   ```

2. **Use in your component:**
   ```tsx
   <FormInput
     label="Email"
     value={email}
     onChange={handleChange}
   />
   ```

3. **That's it!** Consistent styling applied automatically.

## 🎯 Next Steps

To migrate existing components:

1. Replace `<input>` with `<FormInput>`
2. Replace `<textarea>` with `<FormTextarea>`
3. Replace `<button>` with `<Button>`
4. Replace skill tags with `<Badge>`
5. Remove inline className styling (already in components)
6. Test and verify

All editor components migrated:
- ✅ `PersonalInfoEditor.tsx` - Uses FormInput
- ✅ `SummaryEditor.tsx` - Uses FormTextarea
- ✅ `SkillsEditor.tsx` - Uses FormInput, Button, Badge
- ✅ `ExperienceEditor.tsx` - Uses FormInput, FormTextarea, Button
- ✅ `EducationEditor.tsx` - Uses FormInput, FormTextarea, Button
- ✅ `AdditionalSectionsEditor.tsx` - Uses FormInput, FormTextarea, Button, Badge
