import React from 'react'

const Footer = () => {
    return (
        <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} LAW Legal. All rights reserved.</p>
                    <p className="mt-2">Secure case management for modern law firms.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer

