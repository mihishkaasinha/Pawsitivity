export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
  image: string;
  nextVaccination?: string;
  energyLevel?: 'Low' | 'Moderate' | 'High';
  playStyle?: string;
}

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  date: string;
  type: 'Vaccine' | 'Grooming' | 'Medication' | 'Food';
  completed: boolean;
}

export interface Comment {
  id: string;
  author: string;
  authorImage?: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: string;
  authorImage?: string;
  title: string;
  content: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  timestamp: string;
  type?: 'Text' | 'Photo' | 'Video' | 'Poll' | 'Urgent' | 'Alert';
  media?: string[];
  location?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

export interface Service {
  id: string;
  name: string;
  type: 'Vet' | 'Groomer' | 'Walker' | 'Store';
  location: string;
  rating: number;
  contact: string;
  priceStart: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface LostPetReport {
  id: string;
  type: 'Lost' | 'Found';
  petName: string;
  petType: string;
  breed: string;
  location: string;
  date: string;
  contactName: string;
  contactPhone: string;
  description: string;
  image: string;
  status: 'Open' | 'Resolved';
  reward?: number;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  memberType: string;
  image?: string;
  points?: number;
  bio?: string;
  friends?: string[];
  karma?: number;
  isVerified?: boolean;
  trustScore?: number;
}

export interface AdoptionListing {
  id: string;
  name: string;
  type: 'Dog' | 'Cat' | 'Fish' | 'Bird' | 'Rabbit' | 'Hamster' | 'Turtle' | 'Other';
  breed: string;
  gender: 'Male' | 'Female';
  age: string;
  location: string;
  vaccinated: boolean;
  neutered: boolean;
  description: string;
  image: string;
  contactName: string;
  contactPhone: string;
  adoptionFee?: number;
  postedDate: string;
}

export interface SitterProfile {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  services: string[];
  location: string;
  verified: boolean;
  bio: string;
  experience: string;
}

export interface PetEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location: string;
  image: string;
  organizer: string;
  attendees: number;
  capacity?: number;
  price?: number;
}

export interface HelpRequest {
  id: string;
  title: string;
  content: string;
  type: 'Urgent' | 'Regular' | 'Offer';
  category: string;
  author: string;
  location: string;
  timestamp: string;
  fulfilled: boolean;
}

export interface MessageThread {
  id: string;
  name: string;
  image?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: 'Individual' | 'Group';
}

export interface CareCircle {
  id: string;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  location: string;
  emergencyActive: boolean;
}