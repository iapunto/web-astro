import type { BlogPost } from '../types/blogPosts';
import designImage from '../../assets/images/design.jpg';
import techImage from '../../assets/images/tech.jpg';
import businessImage from '../../assets/images/business.jpg';
import creativeImage from '../../assets/images/creative.jpg';
import aiImage from '../../assets/images/ai.jpg';
import sustainableImage from '../../assets/images/sustainable.jpg';

import johnDoeImage from '../../assets/images/john-doe.jpg';
import janeSmithImage from '../../assets/images/jane-smith.jpg';
import bobJohnsonImage from '../../assets/images/bob-johnson.jpg';
import sarahLeeImage from '../../assets/images/sarah-lee.jpg';
import michaelChenImage from '../../assets/images/michael-chen.jpg';
import emilyBrownImage from '../../assets/images/emily-brown.jpg';

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Transforming Design',
    category: 'Design',
    excerpt: 'Discover how we approach design with innovative solutions.',
    imageUrl: designImage,
    link: '/blog/design',
    author: 'John Doe',
    authorImage: johnDoeImage,
    date: 'February 1, 2023',
    readTime: '2 min read',
  },
  {
    id: 2,
    title: 'Planet Tech',
    category: 'Tech',
    excerpt: 'Exploring the latest in technology and digital trends.',
    imageUrl: techImage,
    link: '/blog/tech',
    author: 'Jane Smith',
    authorImage: janeSmithImage,
    date: 'January 1, 2023',
    readTime: '3 min read',
  },
  {
    id: 3,
    title: 'Business Solutions',
    category: 'Business',
    excerpt: 'Tailored solutions for modern business challenges.',
    imageUrl: businessImage,
    link: '/blog/business',
    author: 'Bob Johnson',
    authorImage: bobJohnsonImage,
    date: 'March 1, 2023',
    readTime: '4 min read',
  },
  {
    id: 4,
    title: 'Creative Strategies',
    category: 'Creative',
    excerpt: 'Unleashing creativity to solve complex problems.',
    imageUrl: creativeImage,
    link: '/blog/creative',
    author: 'Sarah Lee',
    authorImage: sarahLeeImage,
    date: 'April 1, 2023',
    readTime: '5 min read',
  },
  {
    id: 5,
    title: 'Future of AI',
    category: 'AI',
    excerpt: 'Exploring the impact of AI on various industries.',
    imageUrl: aiImage,
    link: '/blog/ai',
    author: 'Michael Chen',
    authorImage: michaelChenImage,
    date: 'May 1, 2023',
    readTime: '6 min read',
  },
  {
    id: 6,
    title: 'Sustainable Growth',
    category: 'Sustainable',
    excerpt: 'Strategies for achieving sustainable business growth.',
    imageUrl: sustainableImage,
    link: '/blog/sustainable',
    author: 'Emily Brown',
    authorImage: emilyBrownImage,
    date: 'June 1, 2023',
    readTime: '7 min read',
  },
];
