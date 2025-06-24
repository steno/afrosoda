import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Globe, Leaf, Music } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import SimpleLayout from '../components/SimpleLayout';
import { useLanguage } from '../context/LanguageContext';

// Reuse the Bubble component from App.tsx
const Bubble = ({ delay = 0, size = 100, x = 0 }: { delay?: number; size?: number; x?: number }) => (
  <motion.div
    initial={{ y: '100vh', opacity: 0.7 }}
    animate={{
      y: '-100vh',
      opacity: [0.7, 0.9, 0.7],
      x: [x, x + 50, x],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      repeat: Infinity,
      delay: delay,
      ease: 'linear',
      x: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }}
    className="absolute rounded-full bg-white/10 backdrop-blur-sm pointer-events-none"
    style={{
      width: size,
      height: size,
    }}
  />
);

// Define testimonial images separately since they don’t need translation
const testimonialImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 2,
    image: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/daniela.jpg?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 3,
    image: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/teiko.jpg?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  },
];

const AboutPage: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const { language } = useLanguage();
  const { t } = useTranslation();

  // Merge translated testimonials with images
  const testimonials = t('about', 'testimonials', 'items').map((item, index) => ({
    ...item,
    id: index + 1,
    image: testimonialImages[index].image,
  }));

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Map value icons to Lucide components
  const valueIcons = [
    <Globe className="w-8 h-8 text-purple-600" />,
    <Leaf className="w-8 h-8 text-green-600" />,
    <Music className="w-8 h-8 text-pink-600" />,
  ];

  // Generate bubbles for the hero section
  const heroBubbles = Array.from({ length: 10 }, (_, i) => ({
    delay: i * 2,
    size: 50 + Math.random() * 100,
    x: (i % 5) * (window.innerWidth / 5) + Math.random() * 100 - 50,
  }));

  // Generate bubbles for the about section
  const aboutBubbles = Array.from({ length: 8 }, (_, i) => ({
    delay: i * 1.5,
    size: 30 + Math.random() * 80,
    x: (i % 4) * (window.innerWidth / 4) + Math.random() * 80 - 40,
  }));

  return (
    <SimpleLayout>
      {/* Hero Section with Bubbles */}
      <section className="relative py-20 bg-purple text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {heroBubbles.map((bubble, i) => (
            <Bubble key={`hero-bubble-${i}`} {...bubble} />
          ))}
        </div>
        <div className="absolute mytexture inset-0 bg-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center mb-6 mt-8 font-heading"
          >
            {t('about', 'hero', 'title')}
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-center max-w-3xl mx-auto"
          >
            {t('about', 'hero', 'subtitle')}
          </motion.p>
        </div>
      </section>

      {/* About Section - 2 Column Layout with Bubbles */}
      <section className="relative py-20 px-4 bg-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {aboutBubbles.map((bubble, i) => (
            <Bubble key={`about-bubble-${i}`} {...bubble} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/bottle-group.jpg?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="AfroSoda founders"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full -z-10" />
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full -z-10" />
            </motion.div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 mt-8 text-gray-800 font-heading">
                {t('about', 'story', 'title')}
              </h2>
              <div className="space-y-4 text-gray-600">
                {Array.isArray(t('about', 'story', 'paragraphs')) &&
                  t('about', 'story', 'paragraphs').map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-gray-800 font-heading"
          >
            {t('about', 'values', 'title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray(t('about', 'values', 'items')) &&
              t('about', 'values', 'items').map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                    {valueIcons[index]}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 font-heading">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-purple mytexture text-white">
        
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 font-heading"
          >
            {t('about', 'testimonials', 'title')}
          </motion.h2>
          <div className="relative">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 mytexture backdrop-blur-md rounded-3xl p-8 md:p-12 max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-white/20">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonials[currentTestimonial].rating
                            ? 'text-yellow-300 fill-yellow-300'
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-xl md:text-2xl italic mb-6">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div>
                    <p className="font-bold text-lg font-heading">{testimonials[currentTestimonial].name}</p>
                    <p className="opacity-70">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentTestimonial === index ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-gray-800 font-heading"
          >
            {t('about', 'team', 'title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t('about', 'team', 'members').map((member, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="rounded-3xl overflow-hidden mb-6 shadow-lg h-80">
                  <img
                    src={`https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/${member.image}`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 font-heading">{member.name}</h3>
                <p className="text-purple-600 mb-4">{member.role}</p>
                <p className="text-gray-600 max-w-xs mx-auto">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </SimpleLayout>
  );
};

export default AboutPage;