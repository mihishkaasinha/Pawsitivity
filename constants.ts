import { Pet, Post, Product, Service, Reminder, LostPetReport, AdoptionListing, SitterProfile, PetEvent, HelpRequest, MessageThread, CareCircle } from './types';

export const INITIAL_PETS: Pet[] = [];

export const MOCK_REMINDERS: Reminder[] = [];

export const MOCK_SITTERS: SitterProfile[] = [
  {
    id: 's1',
    name: 'Ananya Rao',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    reviews: 24,
    price: 450,
    services: ['Dog Walking', 'Pet Sitting', 'Daycare'],
    location: 'Indiranagar, Bangalore',
    verified: true,
    bio: 'Avid dog lover with 5 years of experience. I have two indies of my own!',
    experience: '5 Years'
  },
  {
    id: 's2',
    name: 'Karan Mehra',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.7,
    reviews: 18,
    price: 600,
    services: ['Overnight Boarding', 'Training', 'Medication'],
    location: 'Bandra, Mumbai',
    verified: true,
    bio: 'Certified pet trainer and behavioral specialist. Safety is my priority.',
    experience: '8 Years'
  },
  {
    id: 's3',
    name: 'Suresh Raina',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    reviews: 12,
    price: 550,
    services: ['Puppy Training', 'Obedience'],
    location: 'Gurgaon, Delhi NCR',
    verified: true,
    bio: 'I specialize in large breed training and anxiety management.',
    experience: '6 Years'
  },
  {
    id: 's4',
    name: 'Priya Verma',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    rating: 5.0,
    reviews: 45,
    price: 400,
    services: ['Cat Sitting', 'Grooming'],
    location: 'Powai, Mumbai',
    verified: true,
    bio: 'Full-time cat whisperer. I have experience with medical cats.',
    experience: '4 Years'
  },
  {
    id: 's5',
    name: 'Vikram Singh',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    rating: 4.6,
    reviews: 9,
    price: 350,
    services: ['Dog Walking', 'Park Visits'],
    location: 'Hauz Khas, Delhi',
    verified: false,
    bio: 'Active individual who loves long park walks with high-energy dogs.',
    experience: '2 Years'
  }
];

export const MOCK_EVENTS: PetEvent[] = [
  {
    id: 'e1',
    title: 'Indie Pride Meetup',
    description: 'A celebration of our beautiful Indian Pariah dogs! Prizes for best behaved.',
    type: 'Meetup',
    date: '2024-06-15',
    time: '4:00 PM',
    location: 'Cubbon Park, Bangalore',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
    organizer: 'Bangalore Pet Club',
    attendees: 42
  },
  {
    id: 'e2',
    title: 'Puppy Socialization Class',
    description: 'Essential social skills for pups under 6 months. Guided by experts.',
    type: 'Training',
    date: '2024-06-20',
    time: '10:00 AM',
    location: 'Lodi Garden, Delhi',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80',
    organizer: 'Dr. Sameer',
    attendees: 15,
    capacity: 20,
    price: 500
  }
];

export const MOCK_HELP_REQUESTS: HelpRequest[] = [
  {
    id: 'h1',
    title: 'Urgent: Need blood donor for Lab (Bangalore)',
    content: 'My 4yo Lab needs blood for surgery tomorrow. DEA 1.1 negative preferred.',
    type: 'Urgent',
    category: 'Health',
    author: 'Priya S',
    location: 'Koramangala',
    timestamp: '2 hours ago',
    fulfilled: false
  },
  {
    id: 'h2',
    title: 'Free: Extra bag of puppy food',
    content: 'My pup has moved to adult food. One 2kg bag of Drools Focus available.',
    type: 'Offer',
    category: 'Donation',
    author: 'Amit K',
    location: 'Powai, Mumbai',
    timestamp: '5 hours ago',
    fulfilled: false
  }
];

export const MOCK_MESSAGE_THREADS: MessageThread[] = [
  { id: 't1', name: 'Rohan (Sheru\'s Dad)', lastMessage: 'See you at the park at 5?', timestamp: '10:30 AM', unread: 2, type: 'Individual' },
  { id: 't2', name: 'Indiranagar Pack 🐾', lastMessage: 'Simran: Anyone up for a late walk?', timestamp: 'Yesterday', unread: 0, type: 'Group' },
  { id: 't3', name: 'Dr. Sameer', lastMessage: 'The reports look normal, don\'t worry.', timestamp: 'Mon', unread: 0, type: 'Individual' },
  { id: 't4', name: 'Pet Shop Koramangala', lastMessage: 'Your order for Royal Canin is ready.', timestamp: 'Sunday', unread: 1, type: 'Individual' }
];

export const MOCK_CARE_CIRCLES: CareCircle[] = [
  { id: 'c1', name: 'Koramangala Watch', description: 'Emergency backup for pets in 4th block.', members: 8, maxMembers: 10, location: 'Bangalore', emergencyActive: false },
  { id: 'c2', name: 'Powai Paws Circle', description: 'Daily walking rotation and key swap.', members: 5, maxMembers: 8, location: 'Mumbai', emergencyActive: true }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: 'Rahul Verma',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    title: 'Best home food for Indies in summer?',
    content: 'My Bruno (Indian Pariah) is refusing kibble in this Delhi heat. Any cooling homemade recipes? Currently giving curd rice but want variety.',
    likes: 45,
    comments: [
      { id: 'c1', author: 'Anita Roy', content: 'Try watermelon and yogurt popsicles! My indie loves them.', timestamp: '1 hour ago' },
      { id: 'c2', author: 'Dr. Sameer', content: 'Keep hydration high. Buttermilk (without salt/spice) is excellent.', timestamp: '30 mins ago' }
    ],
    tags: ['Nutrition', 'SummerCare', 'IndianBreeds'],
    timestamp: '2 hours ago'
  },
  {
    id: 'p2',
    author: 'Meera Kapur',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    title: 'Monsoon Paw Care Alert! ☔',
    content: 'Started seeing some redness between my Golden\'s paws after walks. Vets in Bangalore say fungal infections are rising due to the wet ground. Make sure to dry their paws thoroughly after every walk! Using a simple ACV + Water mix helps a lot.',
    likes: 82,
    comments: [
      { id: 'c3', author: 'Amit Singh', content: 'Thanks for the tip! Just noticed my dog licking his paws constantly.', timestamp: '10 mins ago' }
    ],
    tags: ['Health', 'Monsoon', 'CareTips'],
    timestamp: '4 hours ago'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Royal Canin Maxi Adult (15kg)', brand: 'Royal Canin', price: 6800, category: 'Food', rating: 4.8, image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=400&q=80' },
  { id: '2', name: 'Classic Rubber Chew Toy', brand: 'KONG', price: 850, category: 'Toys', rating: 4.9, image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80' },
  { id: '3', name: 'Drools Focus Adult (12kg)', brand: 'Drools', price: 3200, category: 'Food', rating: 4.5, image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80' },
  { id: '4', name: 'Himalaya Erina-EP Shampoo', brand: 'Himalaya', price: 250, category: 'Grooming', rating: 4.7, image: 'https://images.unsplash.com/photo-1583947581924-860bda3a44f0?auto=format&fit=crop&w=400&q=80' },
  { id: '5', name: 'Zodiac Interactive Laser Toy', brand: 'Zodiac', price: 1200, category: 'Toys', rating: 4.3, image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=400&q=80' },
  { id: '6', name: 'Orthopedic Memory Foam Bed', brand: 'Pawsome', price: 4500, category: 'Accessories', rating: 4.9, image: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=400&q=80' },
  { id: '7', name: 'Reflective Dog Harness', brand: 'Bark Out Loud', price: 950, category: 'Accessories', rating: 4.6, image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=400&q=80' },
  { id: '8', name: 'Cat Litter Scoop & Tray', brand: 'Savic', price: 1500, category: 'Accessories', rating: 4.4, image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=400&q=80' }
];

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: "Dr. Sharma's Pet Hospital", type: 'Vet', location: 'Delhi', rating: 4.8, contact: '+91 98765 43210', priceStart: 500 },
  { id: '2', name: "Happy Paws Dog Walkers", type: 'Walker', location: 'Mumbai', rating: 4.5, contact: '+91 98765 12345', priceStart: 300 },
  { id: '3', name: "Bangalore Grooming Den", type: 'Groomer', location: 'Bangalore', rating: 4.9, contact: '+91 80123 45678', priceStart: 800 }
];

export const MOCK_LOST_PETS: LostPetReport[] = [
  { id: '1', type: 'Lost', petName: 'Snowy', petType: 'Dog', breed: 'Labrador', location: 'Indiranagar, Bangalore', date: '2024-05-20', contactName: 'Amit Patel', contactPhone: '+91 98765 43210', description: 'White Labrador, 2 years old, wearing a blue collar. Last seen near 100ft road.', image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?auto=format&fit=crop&w=400&q=80', status: 'Open', reward: 5000 },
  { id: '2', type: 'Found', petName: 'Ginger', petType: 'Cat', breed: 'Indie Cat', location: 'Powai, Mumbai', date: '2024-06-01', contactName: 'Neha', contactPhone: '+91 91234 56789', description: 'Small ginger cat found near Hiranandani gardens. Very friendly and looks well-fed.', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', status: 'Open' },
  { id: '3', type: 'Lost', petName: 'Buster', petType: 'Dog', breed: 'Beagle', location: 'Hauz Khas, Delhi', date: '2024-05-28', contactName: 'Rajesh Kumar', contactPhone: '+91 98111 22334', description: 'Tri-color Beagle. Responds to name Buster. Very energetic. Escaped from the gate.', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80', status: 'Open', reward: 3000 },
  { id: '4', type: 'Found', petName: 'Milo', petType: 'Dog', breed: 'Pug', location: 'Kothrud, Pune', date: '2024-06-05', contactName: 'Sonal', contactPhone: '+91 97777 55555', description: 'Fawn-colored Pug found wandering in a society. Wearing a red harness.', image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=400&q=80', status: 'Open' },
  { id: '5', type: 'Lost', petName: 'Bella', petType: 'Cat', breed: 'Persian', location: 'Jubilee Hills, Hyderabad', date: '2024-06-03', contactName: 'Priya Reddy', contactPhone: '+91 94440 12121', description: 'White Persian cat with long hair. Very shy. Please check under parked cars.', image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=400&q=80', status: 'Open', reward: 10000 },
  { id: '6', type: 'Found', petName: 'Chotu', petType: 'Dog', breed: 'Indie Pup', location: 'T Nagar, Chennai', date: '2024-06-07', contactName: 'Arjun', contactPhone: '+91 98400 98400', description: 'Young black and tan Indie puppy found crying near the bus stand. Currently safe with me.', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', status: 'Open' }
];

export const MOCK_ADOPTIONS: AdoptionListing[] = [
  { id: '1', name: 'Barfi', type: 'Dog', breed: 'Indian Pariah', gender: 'Male', age: '3 Months', location: 'Delhi NCR', vaccinated: true, neutered: false, description: 'Playful indie pup rescued from a construction site. Loves belly rubs and is very food motivated!', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', contactName: 'Priya Sharma', contactPhone: '+91 98765 11111', postedDate: '2024-06-01' },
  { id: '2', name: 'Misty', type: 'Cat', breed: 'Persian Mix', gender: 'Female', age: '1 Year', location: 'Mumbai', vaccinated: true, neutered: true, description: 'Calm and affectionate indoor cat. Perfect for a quiet apartment life.', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', contactName: 'Rahul', contactPhone: '+91 90000 12345', postedDate: '2024-05-28' },
  { id: '3', name: 'Sheru', type: 'Dog', breed: 'Indie', gender: 'Male', age: '2 Years', location: 'Bangalore', vaccinated: true, neutered: true, description: 'Excellent guard dog and companion. Very intelligent and already basic-trained.', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80', contactName: 'Suresh', contactPhone: '+91 99887 76655', postedDate: '2024-06-05' },
  { id: '4', name: 'Goldie', type: 'Fish', breed: 'Goldfish', gender: 'Male', age: '6 Months', location: 'Pune', vaccinated: false, neutered: false, description: 'Healthy goldfish looking for a bigger tank. Very active and beautiful colors.', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80', contactName: 'Kunal', contactPhone: '+91 98765 00000', postedDate: '2024-06-10' },
  { id: '5', name: 'Kiwi', type: 'Bird', breed: 'Budgie', gender: 'Female', age: '1 Year', location: 'Chennai', vaccinated: false, neutered: false, description: 'Active budgie. Needs a home with other birds to socialize. Loves singing in the morning.', image: 'https://images.unsplash.com/photo-1552728089-57bdde30eba3?auto=format&fit=crop&w=400&q=80', contactName: 'Lakshmi', contactPhone: '+91 98400 12345', postedDate: '2024-06-08' },
  { id: '6', name: 'Simba', type: 'Dog', breed: 'Golden Retriever', gender: 'Male', age: '4 Years', location: 'Hyderabad', vaccinated: true, neutered: true, description: 'Very gentle. Good with kids. Looking for a loving family that can give him long walks.', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80', contactName: 'Anil', contactPhone: '+91 98660 00111', postedDate: '2024-06-12' },
  { id: '7', name: 'Zorro', type: 'Cat', breed: 'Indian Shorthair', gender: 'Male', age: '5 Months', location: 'Kolkata', vaccinated: true, neutered: false, description: 'Super energetic kitten who thinks he is a tiger. Loves chasing shadows!', image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=400&q=80', contactName: 'Arjun', contactPhone: '+91 97765 44321', postedDate: '2024-06-14' },
  { id: '8', name: 'Binky', type: 'Rabbit', breed: 'Angora', gender: 'Female', age: '2 Years', location: 'Chandigarh', vaccinated: true, neutered: true, description: 'Fluffy bundle of joy. Enjoys fresh carrots and gentle strokes on the ears.', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80', contactName: 'Mehak', contactPhone: '+91 98888 77777', postedDate: '2024-06-15' },
  { id: '9', name: 'Shelly', type: 'Turtle', breed: 'Indian Star', gender: 'Female', age: '8 Years', location: 'Kochi', vaccinated: false, neutered: false, description: 'Rescued from a dry pond. Needs a proper aquatic setup and calcium-rich diet.', image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80', contactName: 'Dr. Nair', contactPhone: '+91 94470 11223', postedDate: '2024-06-16' },
  { id: '10', name: 'Shadow', type: 'Dog', breed: 'German Shepherd', gender: 'Male', age: '3 Years', location: 'Gurgaon', vaccinated: true, neutered: true, description: 'Loyal protector. Needs an active owner who can provide firm leadership and plenty of exercise.', image: 'https://images.unsplash.com/photo-1589944191401-efb6713a2a6d?auto=format&fit=crop&w=400&q=80', contactName: 'Vikas', contactPhone: '+91 99999 88888', postedDate: '2024-06-17' },
  { id: '11', name: 'Clover', type: 'Rabbit', breed: 'Dutch', gender: 'Male', age: '1 Year', location: 'Jaipur', vaccinated: true, neutered: true, description: 'A small, friendly bunny who loves to hop around the house. Loves leafy greens.', image: 'https://images.unsplash.com/photo-1583301286816-f4f05e1e8b25?auto=format&fit=crop&w=400&q=80', contactName: 'Aditi', contactPhone: '+91 98222 33333', postedDate: '2024-06-18' },
  { id: '12', name: 'Rio', type: 'Bird', breed: 'Macaw Mix', gender: 'Male', age: '5 Years', location: 'Ahmedabad', vaccinated: false, neutered: false, description: 'Very vocal and intelligent bird. Needs a committed owner who understands parrot behavior.', image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=400&q=80', contactName: 'Rajesh', contactPhone: '+91 99000 44444', postedDate: '2024-06-19' },
  { id: '13', name: 'Zara', type: 'Cat', breed: 'Indie', gender: 'Female', age: '2 Months', location: 'Lucknow', vaccinated: false, neutered: false, description: 'Tiny rescue kitten. Very sweet and starting to explore solid food.', image: 'https://images.unsplash.com/photo-1573865668131-974f71230a49?auto=format&fit=crop&w=400&q=80', contactName: 'Sonal', contactPhone: '+91 97777 55555', postedDate: '2024-06-20' },
  { id: '14', name: 'Buster', type: 'Dog', breed: 'Beagle', gender: 'Male', age: '9 Years', location: 'Surat', vaccinated: true, neutered: true, description: 'Senior beagle looking for a quiet home to spend his golden years. Still loves a good sniff-walk!', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80', contactName: 'Manoj', contactPhone: '+91 98000 66666', postedDate: '2024-06-21' },
  { id: '15', name: 'Spike', type: 'Other', breed: 'Hamster', gender: 'Male', age: '4 Months', location: 'Indore', vaccinated: false, neutered: false, description: 'Active little guy. Comes with a cage and running wheel. Enjoys sunflower seeds.', image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=400&q=80', contactName: 'Nisha', contactPhone: '+91 91111 77777', postedDate: '2024-06-22' },
  { id: '16', name: 'Puff', type: 'Bird', breed: 'Cockatiel', gender: 'Male', age: '2 Years', location: 'Bhopal', vaccinated: false, neutered: false, description: 'Whistles Bollywood tunes! Looking for a spacious cage and plenty of time out to fly.', image: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=400&q=80', contactName: 'Rahul', contactPhone: '+91 90000 99999', postedDate: '2024-06-23' },
  { id: '17', name: 'Daisy', type: 'Dog', breed: 'Labrador Mix', gender: 'Female', age: '2 Years', location: 'Goa', vaccinated: true, neutered: true, description: 'Beach-loving dog! Very high energy and loves swimming. Great with other dogs.', image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?auto=format&fit=crop&w=400&q=80', contactName: 'Chris', contactPhone: '+91 98222 11111', postedDate: '2024-06-24' },
  { id: '18', name: 'Ninja', type: 'Cat', breed: 'Black Indie', gender: 'Male', age: '3 Years', location: 'Kochi', vaccinated: true, neutered: true, description: 'A sleek black panther who loves to hide. Very vocal during meal times.', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', contactName: 'Anu', contactPhone: '+91 94470 55555', postedDate: '2024-06-25' },
  { id: '19', name: 'Slowpoke', type: 'Turtle', breed: 'Red-eared Slider', gender: 'Male', age: '5 Years', location: 'Visakhapatnam', vaccinated: false, neutered: false, description: 'Enjoys basking in the sun. Healthy and comes with basic tank equipment.', image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80', contactName: 'Sanjay', contactPhone: '+91 91234 44444', postedDate: '2024-06-26' },
  { id: '20', name: 'Maximus', type: 'Dog', breed: 'Rottweiler Mix', gender: 'Male', age: '4 Years', location: 'Nagpur', vaccinated: true, neutered: true, description: 'A big softie despite his size. Needs a yard to play in. Very protective of his family.', image: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=400&q=80', contactName: 'Gaurav', contactPhone: '+91 97654 33333', postedDate: '2024-06-27' },
  { id: '21', name: 'Bruno', type: 'Dog', breed: 'Boxer Mix', gender: 'Male', age: '2 Years', location: 'Ludhiana', vaccinated: true, neutered: true, description: 'High energy boxer mix. Needs a home with plenty of space to run.', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', contactName: 'Deepak', contactPhone: '+91 98111 22222', postedDate: '2024-06-28' },
  { id: '22', name: 'Snowball', type: 'Cat', breed: 'Persian', gender: 'Female', age: '3 Years', location: 'Amritsar', vaccinated: true, neutered: true, description: 'White fluffy Persian cat. Very regal and calm. Prefers quiet environments.', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', contactName: 'Gurpreet', contactPhone: '+91 98222 44444', postedDate: '2024-06-29' },
  { id: '23', name: 'Pip', type: 'Bird', breed: 'Lovebird', gender: 'Female', age: '1 Year', location: 'Mysore', vaccinated: false, neutered: false, description: 'A small lovebird with colorful feathers. Very social and loves company.', image: 'https://images.unsplash.com/photo-1552728089-57bdde30eba3?auto=format&fit=crop&w=400&q=80', contactName: 'Kavitha', contactPhone: '+91 98444 66666', postedDate: '2024-06-30' },
  { id: '24', name: 'Flash', type: 'Turtle', breed: 'Star Turtle', gender: 'Male', age: '12 Years', location: 'Trivandrum', vaccinated: false, neutered: false, description: 'Calm turtle looking for a large garden pond. Healthy and well-maintained.', image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80', contactName: 'Dr. Rahul', contactPhone: '+91 94444 88888', postedDate: '2024-07-01' },
  { id: '25', name: 'Cookie', type: 'Rabbit', breed: 'Mini Lop', gender: 'Female', age: '6 Months', location: 'Dehradun', vaccinated: true, neutered: false, description: 'Adorable mini lop rabbit. Very curious and loves exploring indoor spaces.', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80', contactName: 'Meghna', contactPhone: '+91 97777 99999', postedDate: '2024-07-02' }
];