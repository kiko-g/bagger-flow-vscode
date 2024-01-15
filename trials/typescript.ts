// Example TypeScript code to test syntax highlighting
// Basic type annotations
let counter: number = 0
let userName: string = "John Doe"
let isCompleted: boolean = false

// Arrays and tuple types
let numbers: number[] = [1, 2, 3, 4, 5]
let tupleType: [string, number] = ["hello", 10]

// Enum declaration
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green

// Interface declaration
interface Person {
  name: string
  age: number
  address?: string // optional property
}

// Implementing an interface
const person: Person = { name: "Alice", age: 30 }

// Function with type parameters
function identity<T>(arg: T): T {
  return arg
}

// Class with generics
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
}

// Decorator
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
  greet() {
    return "Hello, " + this.greeting
  }
}

// Union and intersection types
type Combined = string | number
type Student = Person & { studentId: number }

// Type assertion
let someValue: any = "this is a string"
let strLength: number = (someValue as string).length

// Async function and await
async function getAsyncData<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return await response.json()
}

// Export statement
export { Person, Greeter, identity as default }
