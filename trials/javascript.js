// Example JavaScript code to test syntax highlighting

// Import statement
import { exampleFunction } from "./exampleModule"

// Variable declarations
const CONSTANT_VALUE = 50
let counter = 0
var oldStyleVariable = null

// Function declaration
function calculateSum(a, b) {
  return a + b
}

const sum = calculateSum(1, 2)

// Arrow function and template literals
const greetUser = (userName) => `Hello, ${userName}!`

// Class definition
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  introduce() {
    console.log(`My name is ${this.name} and I am ${this.age} years old.`)
  }
}

// Object creation
const john = new Person("John Doe", 30)

// Promises and async/await
const fetchData = async () => {
  try {
    const response = await fetch("https://api.example.com/data")
    return await response.json()
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

// Using a Map
const mapExample = new Map()
mapExample.set("key1", "value1")
mapExample.set("key2", "value2")

// Conditional statement
if (counter < CONSTANT_VALUE) {
  counter++
}

// Loop
for (let i = 0; i < 5; i++) {
  console.log(`Counter value: ${i}`)
}

// Usage of imported function
console.log(exampleFunction("test input"))

// Export statement
export default Person
