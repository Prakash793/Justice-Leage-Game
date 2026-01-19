
import { QuizQuestion, CaseScenario } from '../types';

export const OFFLINE_QUIZ: Record<string, QuizQuestion[]> = {
  'Constitutional Law': [
    {
      id: 'lc-001',
      question: 'Which Article of the Indian Constitution provides the Right to Privacy as a fundamental right?',
      options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'],
      correctAnswer: 2,
      explanation: 'The Supreme Court in Justice K.S. Puttaswamy (Retd.) v. Union of India (2017) declared the Right to Privacy as a fundamental right under Article 21.',
      tamilExplanation: 'புட்டாசாமி வழக்கில் தனிநபர் ரகசிய காப்புரிமை பிரிவு 21-ன் கீழ் அடிப்படை உரிமை என அறிவிக்கப்பட்டது.',
      lawSection: 'Article 21'
    },
    {
      id: 'lc-002',
      question: 'The concept of "Directive Principles of State Policy" was borrowed from which country?',
      options: ['USA', 'Ireland', 'UK', 'Canada'],
      correctAnswer: 1,
      explanation: 'DPSP were borrowed from the Irish Constitution (Eire).',
      tamilExplanation: 'அரசுக்கு வழிகாட்டும் நெறிமுறைகள் அயர்லாந்து அரசியலமைப்பிலிருந்து பெறப்பட்டது.',
      lawSection: 'Part IV'
    }
  ],
  'Evidence Act': [
    {
      id: 'le-001',
      question: 'Under which section of the Indian Evidence Act is a "Confession to a Police Officer" not admissible?',
      options: ['Section 24', 'Section 25', 'Section 26', 'Section 27'],
      correctAnswer: 1,
      explanation: 'Section 25 states that no confession made to a police officer shall be proved as against a person accused of any offence.',
      tamilExplanation: 'பிரிவு 25-ன் படி காவல்துறை அதிகாரியிடம் அளிக்கும் வாக்குமூலம் சாட்சியமாக ஏற்கப்படாது.',
      lawSection: 'Section 25'
    }
  ]
};

export const OFFLINE_FEEDBACK = [
  "Excellent citation of statutes, Counsel. Proceed.",
  "The Bench notes your argument. Do you have supporting precedents?",
  "That interpretation of the section is consistent with Madras High Court rulings.",
  "Objection overruled. Please continue your line of questioning.",
  "Be brief and stick to the facts of the case, Advocate."
];
