import React from 'react'
import { dummyTestimonial } from '../../assets/assets'
import { assets } from '../../assets/assets'

const TestimonialsSection = () => {
    return (
        <div className='pb-14 px-6 md:px-0'>

            <h1 className='text-2xl font-bold text-center sm:text-4xl mb-2'>
                Customer
                <span className='underline underline-offset-4 decoration-1 font-light'>
                    Testimonials
                </span>
            </h1>

            <p className='text-center text-gray-500 mb-12 max-w-2xl mx-auto'>
                Hear from our learners as they share their journey of transformation, success, and how our
                platform has made a difference in their lives.
            </p>

            {/* CENTER FIXED CONTAINER */}
            <div className='flex justify-center'>

                <div className='
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    gap-8
                    mt-10
                    w-full
                    max-w-6xl
                '>

                    {dummyTestimonial.map((testimonial, index) => (
                        <div
                            key={index}
                            className='
                                w-full
                                text-sm
                                text-left
                                border
                                border-gray-500/30
                                pb-6
                                rounded-lg
                                bg-white
                                shadow-[0px_4px_15px_0px]
                                shadow-black/5
                                overflow-hidden
                                transition-all
                                duration-300
                                hover:border-blue-500
                            '
                        >

                            {/* Header */}
                            <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
                                <img
                                    className='h-12 w-12 rounded-full'
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                />
                                <div>
                                    <h1 className='text-lg font-medium text-gray-800'>
                                        {testimonial.name}
                                    </h1>
                                    <p className='text-gray-600'>
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className='p-5 pb-7'>

                                {/* Rating */}
                                <div className='flex gap-0.5'>
                                    {[...Array(5)].map((_, i) => (
                                        <img
                                            key={i}
                                            className='h-5'
                                            src={
                                                i < Math.floor(testimonial.rating)
                                                    ? assets.star
                                                    : assets.star_blank
                                            }
                                            alt=""
                                        />
                                    ))}
                                </div>

                                {/* Feedback */}
                                <p className='text-gray-500 mt-5'>
                                    {testimonial.feedback}
                                </p>
                            </div>

                            <a href="#" className='text-blue-500 underline px-5'>
                                Read More
                            </a>

                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}

export default TestimonialsSection