import React from 'react'
import { dummyTestimonial } from '../../assets/assets'
import { assets } from '../../assets/assets'

const TestimonialsSection = (props) => {
    return (
        <div className='pb-14 px-8 md:px-0 h'>

            <h1 className='text-2xl font-bold text-center sm:text-4xl mb-2'>
                Cutomer
                <span className='underline underline-offset-4 decoration-1 under font-light'>
                    Testimonials
                </span>
            </h1>

            <p className='text-center text-gray-500 mb-12 max-w-80 mx-auto'>
                Hear from our learners as they share thier journey of transformation, success ,and how our
                <br />
                platform has made a differnece in thier lives.
            </p>

            {/* testimonial adata from assets */}
            <div >
                <div
                    className='
                    grid
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        gap-8
                        mt-14
                        max-w-7xl
                        w-full
                          mx-auto
    place-items-center
                    '
                >
                    {dummyTestimonial.map((testimonial, index) => (
                        <div
                            key={index}
                            className='
                                w-full
                                max-w-sm
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
        hover:border-4
                            '
                        >
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
                                    <p className='text-gray-800/80'>
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>

                            <div className='p-5 pb-7'>
                                {/* rating */}
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

                                {/* review */}
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
