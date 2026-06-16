import React from 'react';
import { Link } from 'react-router-dom';

function InnerHero({ title, breadcrumbs = [] }) {
    return (
        <div className='innerhero'>
            <div className='content-wrapper'>
                <div className='innerhero_section'>
                    <div className='innerhero_title'>
                        <h1>{title}</h1>
                    </div>
                    <div className='innerhero_breadcrumbs'>
                        <Link to="/">Home</Link>
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                <span className="breadcrumb_separator"> / </span>
                                {crumb.path ? (
                                    <Link to={crumb.path}>{crumb.label}</Link>
                                ) : (
                                    <span className="current_crumb">{crumb.label}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InnerHero;