/**
 * Timeline data for Ahmed Badr's research and professional journey.
 *
 * Each entry represents a milestone in his career as an AI Researcher
 * and Robotics Engineer, spanning education, research, work, and achievements.
 */

/** Discriminated icon identifiers for timeline visual rendering */
export type TimelineIcon = 'brain' | 'microscope' | 'code' | 'trophy' | 'graduation';

/** Category labels for timeline entries */
export type TimelineEntryType = 'education' | 'research' | 'work' | 'achievement';

/** A single entry in the professional timeline */
export interface TimelineEntry {
  /** Display date or date range (e.g. "Sep. 2022 – Jun. 2026") */
  date: string;
  /** Role, degree, or milestone title */
  title: string;
  /** Institution, company, or organizing body */
  organization: string;
  /** Geographic location */
  location: string;
  /** Category discriminator */
  type: TimelineEntryType;
  /** Short paragraph describing the entry */
  description: string;
  /** Key bullet-point highlights */
  highlights: string[];
  /** Related technology or domain tags */
  tags: string[];
  /** Optional icon key for visual markers */
  icon?: TimelineIcon;
}

/**
 * Chronological timeline of Ahmed Badr's career.
 * Ordered from most recent to earliest.
 */
export const timeline: TimelineEntry[] = [
  {
    date: 'Jun. 2025 – Jul. 2025',
    title: 'Research Intern',
    organization: 'James Madison University',
    location: 'Harrisonburg, VA, USA',
    type: 'research',
    description:
      'Developed perception and control systems for autonomous golf cart navigation and sobriety detection using computer vision.',
    highlights: [
      'Implemented YOLOv8 and SSD algorithms for real-time object detection in autonomous golf cart navigation.',
      'Built a modular ROS 2 publisher–subscriber architecture for system planning and control.',
      'Developed a sobriety detection pipeline using Siamese Networks and OpenFace with 288+ facial features.',
      'Utilized ZED 2i stereo camera for depth estimation and obstacle detection.',
    ],
    tags: ['ROS 2', 'Computer Vision', 'YOLOv8', 'Autonomous Vehicles', 'OpenFace'],
    icon: 'microscope',
  },
  {
    date: 'Jan. 2025 – Jun. 2025',
    title: 'Software Engineering Intern',
    organization: 'Virginia Tech',
    location: 'Blacksburg, VA, USA',
    type: 'work',
    description:
      'Built an LLM-powered semantic search platform and microservices architecture for intelligent project asset retrieval.',
    highlights: [
      'Designed and deployed a scalable microservices backend using FastAPI and PostgreSQL.',
      'Implemented an AI-powered search engine leveraging BERT, LLMs, and Retrieval-Augmented Generation (RAG).',
      'Integrated FAISS vector databases with Sentence-BERT embeddings for similarity search.',
      'Developed multimodal retrieval capabilities for text, diagrams, and voice data.',
    ],
    tags: ['FastAPI', 'BERT', 'RAG', 'FAISS', 'PostgreSQL', 'LLMs'],
    icon: 'code',
  },
  {
    date: 'Jan. 2025 – Present',
    title: 'Research Assistant',
    organization: 'Alamein International University',
    location: 'Alexandria, Egypt',
    type: 'research',
    description:
      'Conducting research on Speech Emotion Recognition (SER) and Facial Emotion Recognition (FER) systems with RAG-enhanced pipelines.',
    highlights: [
      'Developing deep learning architectures for high-accuracy emotion classification from speech and facial cues.',
      'Exploring RAG pipelines combined with vector databases to improve reasoning and context retrieval.',
      'Performing joint analysis of audio and visual modalities for robust multi-modal emotion recognition.',
    ],
    tags: ['Deep Learning', 'SER', 'FER', 'RAG', 'Vector Databases', 'Multimodal AI'],
    icon: 'brain',
  },
  {
    date: 'Oct. 2024 – Present',
    title: 'Founder',
    organization: 'Nomeda',
    location: 'Alexandria, Egypt',
    type: 'work',
    description:
      'Leading an AI-focused startup that bridges cutting-edge research with practical software products to solve complex digital challenges.',
    highlights: [
      'Directing product strategy and technical execution across multiple AI-driven ventures.',
      'Integrating state-of-the-art AI models into production-grade software solutions.',
      'Managing cross-functional development teams and setting technical roadmaps.',
    ],
    tags: ['Startup', 'Product Management', 'AI Engineering', 'Software Architecture'],
    icon: 'code',
  },
  {
    date: 'Jul. 2024 – Sep. 2024',
    title: 'Research Intern',
    organization: 'University of Louisville',
    location: 'Louisville, KY, USA',
    type: 'research',
    description:
      'Developed a non-invasive multi-modal AI approach for classifying renal rejection grades in kidney transplant patients.',
    highlights: [
      'Integrated imaging, genomic, and clinical data for multi-modal classification of renal rejection.',
      'Implemented and compared Random Forest, SVM, Neural Networks, XGBoost, and CatBoost models.',
      'Performed extensive cross-validation and hyperparameter tuning to optimize performance.',
      'Awarded 3rd Place at the R!L (Research!Louisville) competition.',
    ],
    tags: ['TensorFlow', 'Scikit-learn', 'XGBoost', 'CatBoost', 'Medical Imaging'],
    icon: 'microscope',
  },
  {
    date: 'Dec. 2024 – Present',
    title: 'IEEE Club Member',
    organization: 'IEEE',
    location: 'Alexandria, Egypt',
    type: 'achievement',
    description:
      'Active member of the IEEE student community, participating in technical workshops, networking events, and collaborative research initiatives.',
    highlights: [
      'Engaging with the global engineering community through IEEE events and publications.',
      'Collaborating on interdisciplinary projects spanning AI, robotics, and electrical engineering.',
    ],
    tags: ['IEEE', 'Professional Development', 'Networking'],
    icon: 'trophy',
  },
  {
    date: 'Sep. 2022 – Jun. 2026',
    title: 'B.Sc. in Computer Science and Engineering',
    organization: 'Alamein International University',
    location: 'Alexandria, Egypt',
    type: 'education',
    description:
      'Pursuing a Bachelor of Science in Computer Science and Engineering with a strong focus on AI, machine learning, and robotics.',
    highlights: [
      'Maintaining a CGPA of 3.73/4.0 with consistent Dean\'s List recognition.',
      'Engaging in undergraduate research projects in AI, computer vision, and NLP.',
      'Building a solid foundation in algorithms, data structures, and software engineering principles.',
    ],
    tags: ['Computer Science', 'AI', 'Robotics', 'Software Engineering'],
    icon: 'graduation',
  },
  {
    date: 'Ongoing',
    title: 'Taekwondo National Champion',
    organization: 'Egyptian Taekwondo Federation',
    location: 'Egypt',
    type: 'achievement',
    description:
      'Awarded 43 medals across national and international Taekwondo competitions, demonstrating discipline, resilience, and peak performance under pressure.',
    highlights: [
      'Accumulated 17 Gold, 10 Silver, and 16 Bronze medals across multiple competitions.',
      'Achieved the rank of 3rd Dan Black Belt.',
      'Consistently competing at the national level while pursuing a rigorous academic and research career.',
    ],
    tags: ['Taekwondo', 'Martial Arts', 'Discipline', 'Sports'],
    icon: 'trophy',
  },
];
