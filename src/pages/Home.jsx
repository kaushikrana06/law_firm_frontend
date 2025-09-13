import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the homepage with Redux example</p>
      <Link to="/about">Go to About</Link>
    </div>
  )
}