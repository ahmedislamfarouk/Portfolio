export interface Project {
  title: string;
  category: string;
  image: string;
  stats: string;
  year: string;
  description: string;
  details: string[];
  tech: string[];
  link?: string;
  status: 'Deployed' | 'In Development' | 'Research Phase';
}

export const projects: Project[] = [
  {
    title: "Renal Rejection AI",
    category: "Medical Diagnostics / Deep Learning",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200",
    stats: "3rd Place @ R!L",
    year: "2024",
    description: "A non-invasive approach to classify renal rejection grades in kidney transplant patients. Developed during a research internship at the University of Louisville bioengineering labs.",
    details: [
      "Integrated imaging, genomic, and clinical data for multi-modal classification.",
      "Implemented Random Forest, SVM, Neural Networks, XGBoost, and CatBoost.",
      "Performed extensive cross-validation and hyperparameter tuning.",
      "Awarded 3rd Place at the R!L competition for research excellence."
    ],
    tech: ["TensorFlow", "Scikit-learn", "XGBoost", "CatBoost", "OpenCV", "Pandas"],
    status: "Deployed"
  },
  {
    title: "Autonomous Fleet",
    category: "Robotics / Perception",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200",
    stats: "YOLOv8 + ROS 2",
    year: "2024",
    description: "Developed a ROS 2–based perception and control system for autonomous golf cart navigation at James Madison University.",
    details: [
      "Implemented YOLOv8 & SSD algorithms for robust real-time object detection.",
      "Utilized ZED 2i stereo camera for depth estimation and obstacle detection.",
      "Designed modular ROS 2 publisher–subscriber nodes for system planning.",
      "Achieved sub-100ms latency for high-performance responsiveness."
    ],
    tech: ["ROS 2", "YOLOv8", "Docker", "ZED SDK", "C++", "Python"],
    status: "Deployed"
  },
  {
    title: "SkyVision Swarm",
    category: "Multi-Agent Systems / Fusion",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200",
    stats: "Real-time Fusion",
    year: "2024",
    description: "AI-powered aerial monitoring and vision system designed for real-time environmental analysis using drone swarms. Collaboration with JMU.",
    details: [
      "Designing ROS 2-based multi-drone control and CV pipelines.",
      "Implementing collision avoidance with modular perception nodes.",
      "Integrating LLM-assisted situational analysis for anomaly detection.",
      "Building a real-time sensor fusion pipeline for disaster response."
    ],
    tech: ["ROS 2", "Computer Vision", "LLMs", "C++", "Python", "Sensor Fusion"],
    status: "In Development"
  },
  {
    title: "Intelligent Assets",
    category: "LLM / Semantic Search",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=1200",
    stats: "BERT + RAG",
    year: "2024",
    description: "LLM-powered semantic search platform and microservices architecture for asset retrieval, developed as part of a Virginia Tech capstone.",
    details: [
      "Built a scalable microservices backend using FastAPI and PostgreSQL.",
      "Implemented an AI-powered search engine using BERT, LLMs, and RAG pipelines.",
      "Integrated FAISS vector databases and Sentence-BERT embeddings.",
      "Developed multimodal retrieval for text, diagrams, and voice data."
    ],
    tech: ["FastAPI", "React", "PostgreSQL", "BERT", "RAG", "FAISS"],
    status: "Deployed"
  },
  {
    title: "Emotion Recog",
    category: "Multimodal AI (SER & FER)",
    image: "https://images.unsplash.com/photo-1527433270404-21b12746a108?w=1200",
    stats: "SER + FER Fusion",
    year: "2024",
    description: "Comprehensive AI framework focused on Speech Emotion Recognition (SER) and Facial Emotion Recognition (FER) systems.",
    details: [
      "Leveraging deep learning architectures for high-accuracy classification.",
      "Exploring RAG pipelines with vector databases for enhanced reasoning.",
      "Joint analysis of audio and visual cues for robustness.",
      "Collaborating on developing the core emotion monitoring framework."
    ],
    tech: ["PyTorch", "TensorFlow", "OpenCV", "Vector Databases", "RAG", "Multimodal Fusion"],
    status: "Research Phase"
  },
  {
    title: "Sobriety Detection",
    category: "Computer Vision / Health",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=1200",
    stats: "JMU Research",
    year: "2024",
    description: "Specialized AI platform built to detect intoxication levels through non-invasive facial recognition and behavioral analysis.",
    details: [
      "Built a modular pipeline using Siamese Networks for user profiling.",
      "Developed eye-tracking algorithms with OpenFace (288+ features).",
      "Implemented facial behavior analysis for intoxication detection.",
      "Designed a comprehensive CSV-based data export system for research."
    ],
    tech: ["Python", "OpenCV", "OpenFace", "Siamese Networks", "Deep Learning"],
    status: "Deployed"
  },
  {
    title: "Egyptian Museum App",
    category: "EdTech / NLP",
    image: "https://images.unsplash.com/photo-1503174971373-b1f69850bbd6?w=1200",
    stats: "3rd Place @ Hackathon",
    year: "2024",
    description: "Innovative application designed to revitalize the visitor experience in Egyptian museums through interactive AI technology.",
    details: [
      "Created a museum application featuring an interactive chatbot for visitor engagement.",
      "Integrated a real-time chatroom using modern web technologies.",
      "Designed a user-friendly interface for seamless navigation within a virtual museum.",
      "Implemented NLP techniques to simulate educational conversations about artifacts."
    ],
    tech: ["React", "NLP", "Socket.io", "Chatbots"],
    status: "Deployed"
  },
  {
    title: "Snake Game AI",
    category: "Reinforcement Learning",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200",
    stats: "Q-Learning / DQN",
    year: "2023",
    description: "Enhanced version of the classic Snake game featuring AI-driven opponents and real-time multiplayer gameplay.",
    details: [
      "Implemented Reinforcement Learning algorithms (Q-Learning / DQN).",
      "Designed advanced decision-making systems for AI opponents.",
      "Utilized threading and concurrency for zero-latency interactions.",
      "Integrated networking components for synchronized multiplayer."
    ],
    tech: ["Python", "Pygame", "Reinforcement Learning", "Socket Programming", "Threading"],
    status: "Deployed"
  },
  {
    title: "Nomeda",
    category: "AI Startup",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200",
    stats: "Founder",
    year: "2024",
    description: "Innovative venture focused on integrating cutting-edge AI with modern software engineering practices to solve complex digital challenges.",
    details: [
      "Leading multiple innovative ventures from conception to technical implementation.",
      "Integrating AI models into functional software products.",
      "Managing cross-functional development tasks and strategic technical direction."
    ],
    tech: ["Business Strategy", "Product Management", "AI Engineering", "Software Architecture"],
    status: "In Development"
  }
];
