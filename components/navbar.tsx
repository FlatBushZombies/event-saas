import { Box } from 'lucide-react'
import Link from 'next/link'

const Navbar = () => {
    const handleAuthClick = async () => {
        
    }
  return (
    <header className='navbar'>
        <nav className='inner'>
            <div className='left'>
                <div className='brand'>
                    <Box className='logo' />
                    <span className='name'>
                        Evently
                    </span>
                </div>

                <ul className='links'>
                    <a href="#">Product</a>
                    <a href="#">Pricing</a>
                    <a href="#">Community</a>
                    <a href="#">Enteprise</a>
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
