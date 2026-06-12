import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import person from '../assets/person.png'

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
    { id: 1, name: 'Jhon Cally', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { id: 2, name: 'Jhon Cally', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { id: 3, name: 'Jhon Cally', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { id: 4, name: 'Jhon Cally', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { id: 5, name: 'Jhon Cally', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { id: 6, name: 'Jhon Cally', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { id: 7, name: 'Jhon Cally', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { id: 8, name: 'Jhon Cally', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' }
];

function Testimonials() {
    return (
        <div className='testimonials'>
            <div className='content-wrapper'>
                <div className='testimonials_title'>
                    <h5>Testimonials</h5>
                    <h2>What Our Customers Say About Us</h2>
                </div>
                <div className='testimonials_content'>
                    <div className='testimonials_section'>
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={35}
                            loop={true}
                            grabCursor={true}
                            speed={1500}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                0: { slidesPerView: 1, slidesPerGroup: 1 },
                                768: { slidesPerView: 2, slidesPerGroup: 2 },
                                991: { slidesPerView: 3, slidesPerGroup: 3 },
                            }}
                        >
                            {testimonials.map((testimonial) => (
                                <SwiperSlide key={testimonial.id}>
                                    <div className='testimonials_card'>
                                        <div className='testimonials_img_text'>
                                            <div className='testimonials_img'>
                                                <img src={person} alt={testimonial.name} />
                                            </div>
                                            <div className='testimonials_text'>
                                                <h6>{testimonial.name}</h6>
                                            </div>
                                        </div>
                                        <div className='testimonials_card_body'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="23" viewBox="0 0 31 23" fill="none">
                                                <path d="M0 0H13.4583V12.1125L6.36183 22.1667H2.05042L6.27158 12.6667H0V0ZM3.16667 3.16667V9.5H10.2917V3.16667H3.16667ZM16.625 0H30.0833V12.1125L22.9868 22.1667H18.6754L22.8966 12.6667H16.625V0ZM19.7917 3.16667V9.5H26.9167V3.16667H19.7917Z" fill="#D9D9D9" />
                                            </svg>
                                            <p>{testimonial.description}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Testimonials;