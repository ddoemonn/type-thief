# 🔍 type-thief

Automatically generate TypeScript types from your runtime data with zero effort!

## ⚡ Quick Start

```typescript
import { thief } from 'type-thief';

// Generate a type from a simple object
const user = { name: 'John', age: 30 };
thief(user, { typeName: 'User', fileName: 'user.ts' });

// Result in types/user.ts:
// export type User = { name: string; age: number };
```

## 🚀 Next.js Example: Todo App

Here's how to use Type Thief in a Next.js application to generate types for your API data:

```typescript
// app/page.tsx
import { thief } from 'type-thief';

async function getTodos() {
  // Fetch a single todo first
  const singleRes = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const singleTodo = await singleRes.json();
  
  // Generate the Todo type
  await thief(singleTodo, {
    typeName: 'Todo',
    outputDir: 'types',
    fileName: 'todo.ts',
    debug: true
  });
  
  // Then fetch all todos
  const todosRes = await fetch('https://jsonplaceholder.typicode.com/todos');
  const todos = await todosRes.json();
  
  // Generate the Todos type - it will automatically use Todo[] if structures match
  await thief(todos, {
    typeName: 'Todos',
    outputDir: 'types',
    fileName: 'todo.ts',
    debug: true
  });
  
  return todos;
}

export default async function Home() {
  const todos = await getTodos();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <ul className="space-y-2">
        {todos.slice(0, 5).map((todo) => (
          <li key={todo.id} className="p-4 border rounded">
            <span className={`${todo.completed ? 'line-through text-green-600' : 'text-red-600'}`}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

This will generate the following types in `types/todo.ts`:

```typescript
export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type Todos = Todo[];
```

Notice how the `Todos` type automatically references the existing `Todo` type instead of duplicating the structure!

## 🛠️ Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `typeName` | string | 'GeneratedType' | Name of the generated type |
| `outputDir` | string | 'types' | Directory where type files are saved |
| `fileName` | string | 'generated.ts' | Name of the output file |
| `debug` | boolean | false | Enable debug logging |

## ✨ Features

- 🔄 Automatically detects arrays and generates appropriate types
- 🧩 Reuses existing types when possible
- 📝 Preserves existing type definitions
- 🔍 Smart type inference for nested objects and arrays
- 🌟 Special handling for common patterns like Todo/Todos
- 📦 **Zero dependencies** - lightweight and fast

## 📦 Installation

```bash
npm install type-thief
# or
yarn add type-thief
# or
pnpm add type-thief
```
