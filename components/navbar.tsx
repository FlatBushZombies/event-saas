import { Heart } from 'lucide-react'
import Link from 'next/link'

const Navbar = () => {
    const handleAuthClick = async () => {
        
    }
  return (
    <header className='navbar'>
        <nav className='inner'>
            <div className='left'>
                <div className='brand'>
                    <Heart className='logo' />
                    <span className='name'>
                        Wedspace
                    </span>
                </div>

                <ul className='links'>
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#">Pricing</a>
                    <a href="#">Stories</a>
                </ul>
            </div>

            <div className='actions'>
                <Link
                href='/sign-in'
                className='login'
                >
                    SIGN IN
                </Link>
                <a href="/sign-up" className='cta'> Get Started</a>
            </div>
        </nav>
    </header>
  )
}

export default Navbar
