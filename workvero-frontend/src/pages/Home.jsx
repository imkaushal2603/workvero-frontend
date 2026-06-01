import React from 'react';
import Banner from '../components/Banner';

function Home() {
    return (
        <div>
            <Banner />
            <div style={{ padding: '40px 20px' }}>
                <h2>Welcome to the Homepage</h2>
                <p>This is the unique content for the home view.</p>
            </div>
        </div>
    );
}

export default Home;