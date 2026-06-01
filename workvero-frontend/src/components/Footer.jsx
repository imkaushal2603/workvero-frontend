import React from 'react';

function Footer() {
    return (
        <footer style={{ padding: '20px', background: '#111', color: '#aaa', textAlign: 'center', marginTop: '40px' }}>
            <p>&copy; {new Date().getFullYear()} My Company. All rights reserved.</p>
        </footer>
    );
}

export default Footer;