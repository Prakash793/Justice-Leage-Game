
import { QuizQuestion } from '../types';

export const OFFLINE_QUIZ: Record<string, QuizQuestion[]> = {
  'Constitutional Law': [
    { id: 'c1', question: 'The "Basic Structure Doctrine" was introduced in which landmark case?', options: ['Golaknath', 'Kesavananda Bharati', 'Minerva Mills', 'S.R. Bommai'], correctAnswer: 1, explanation: 'The 13-judge bench in 1973 established that Parliament cannot alter the basic structure of the Constitution.', tamilExplanation: 'அரசியலமைப்பின் அடிப்படை கட்டமைப்பை மாற்ற முடியாது என்று கேசவானந்த பாரதி வழக்கில் தீர்ப்பளிக்கப்பட்டது.', lawSection: 'Art. 368' },
    { id: 'c2', question: 'Which Article is known as the "Heart and Soul" of the Constitution?', options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'], correctAnswer: 3, explanation: 'Dr. B.R. Ambedkar called Article 32 (Constitutional Remedies) the heart and soul.', tamilExplanation: 'பிரிவு 32 அரசியலமைப்பின் இதயம் மற்றும் ஆன்மா என்று அழைக்கப்படுகிறது.', lawSection: 'Art. 32' },
    { id: 'c3', question: 'Right to Education was added by which Amendment?', options: ['86th', '42nd', '44th', '91st'], correctAnswer: 0, explanation: 'The 86th Amendment Act (2002) inserted Article 21A.', tamilExplanation: '86-வது திருத்தம் கல்வி உரிமையை அடிப்படை உரிமையாக மாற்றியது.', lawSection: 'Art. 21A' },
    { id: 'c4', question: 'Who appoints the Governor of a State?', options: ['Chief Minister', 'Prime Minister', 'President', 'Chief Justice'], correctAnswer: 2, explanation: 'The President of India appoints the Governor under Article 155.', tamilExplanation: 'ஆளுநரை இந்திய குடியரசுத் தலைவர் நியமிக்கிறார்.', lawSection: 'Art. 155' },
    { id: 'c5', question: 'The concept of "Single Citizenship" is borrowed from?', options: ['USA', 'UK', 'Ireland', 'Canada'], correctAnswer: 1, explanation: 'India followed the British model for single citizenship.', tamilExplanation: 'ஒற்றை குடியுரிமை முறை இங்கிலாந்திலிருந்து பெறப்பட்டது.', lawSection: 'Part II' },
    { id: 'c6', question: 'Which Article deals with the Finance Commission?', options: ['Art 280', 'Art 300', 'Art 110', 'Art 356'], correctAnswer: 0, explanation: 'Article 280 provides for the constitution of a Finance Commission every 5 years.', tamilExplanation: 'பிரிவு 280 நிதி ஆணையம் பற்றியது.', lawSection: 'Art. 280' }
  ],
  'Evidence Act': [
    { id: 'e1', question: 'Which section deals with "Dying Declaration"?', options: ['Section 24', 'Section 32(1)', 'Section 45', 'Section 114'], correctAnswer: 1, explanation: 'Section 32(1) makes statements of deceased persons relevant.', tamilExplanation: 'மரண வாக்குமூலம் பிரிவு 32(1)-ன் கீழ் வருகிறது.', lawSection: 'Sec. 32' },
    { id: 'e2', question: 'Confession to a Police Officer is inadmissible under?', options: ['Section 25', 'Section 26', 'Section 27', 'Section 30'], correctAnswer: 0, explanation: 'No confession made to a police officer shall be proved against an accused.', tamilExplanation: 'காவல்துறையினரிடம் சொல்லும் வாக்குமூலம் செல்லாது (பிரிவு 25).', lawSection: 'Sec. 25' },
    { id: 'e3', question: 'Expert opinion is relevant under which section?', options: ['Section 40', 'Section 45', 'Section 50', 'Section 60'], correctAnswer: 1, explanation: 'Opinions of experts on foreign law, science, art, etc., are relevant under Section 45.', tamilExplanation: 'வல்லுநர்களின் கருத்துக்கள் பிரிவு 45-ன் கீழ் முக்கியத்துவம் பெறுகின்றன.', lawSection: 'Sec. 45' },
    { id: 'e4', question: 'What is the "Presumption of Dowry Death"?', options: ['Sec 113A', 'Sec 113B', 'Sec 114A', 'Sec 115'], correctAnswer: 1, explanation: 'Section 113B was added in 1986 regarding presumption of dowry death.', tamilExplanation: 'வரதட்சணை மரணம் குறித்த அனுமானம் பிரிவு 113B-ல் உள்ளது.', lawSection: 'Sec. 113B' },
    { id: 'e5', question: 'Doctrine of "Estoppel" is found in?', options: ['Section 101', 'Section 115', 'Section 121', 'Section 132'], correctAnswer: 1, explanation: 'Estoppel prevents a person from denying a statement they previously made.', tamilExplanation: 'முரண் தடை கோட்பாடு பிரிவு 115-ல் விவரிக்கப்பட்டுள்ளது.', lawSection: 'Sec. 115' }
  ],
  'Contract Law': [
    { id: 'ct1', question: 'Agreement with a minor is?', options: ['Valid', 'Voidable', 'Void-ab-initio', 'Illegal'], correctAnswer: 2, explanation: 'In Mohori Bibee v. Dharmodas Ghose, it was held that a minor’s contract is void from the beginning.', tamilExplanation: 'மைனருடன் செய்யப்படும் ஒப்பந்தம் ஆரம்பத்திலிருந்தே செல்லாதது.', lawSection: 'Sec. 11' },
    { id: 'ct2', question: 'Consideration is defined under?', options: ['Section 2(a)', 'Section 2(d)', 'Section 2(h)', 'Section 10'], correctAnswer: 1, explanation: 'Section 2(d) defines Consideration as the benefit received by the parties.', tamilExplanation: 'மறுபயன் (Consideration) பிரிவு 2(d)-ல் வரையறுக்கப்பட்டுள்ளது.', lawSection: 'Sec. 2(d)' },
    { id: 'ct3', question: 'A contract without consideration is?', options: ['Void', 'Valid', 'Illegal', 'Voidable'], correctAnswer: 0, explanation: 'Section 25 states an agreement without consideration is void with some exceptions.', tamilExplanation: 'மறுபயன் இல்லாத ஒப்பந்தம் செல்லாதது.', lawSection: 'Sec. 25' },
    { id: 'ct4', question: 'Specific Performance can be granted under which Act?', options: ['Contract Act', 'Specific Relief Act', 'TPA', 'Companies Act'], correctAnswer: 1, explanation: 'Remedies for breach like specific performance are in the Specific Relief Act 1963.', tamilExplanation: 'குறிப்பிட்ட செயல்திறன் தீர்வு குறிப்பிட்ட நிவாரணச் சட்டத்தில் உள்ளது.', lawSection: 'SRA 1963' }
  ],
  'Criminal Procedure': [
    { id: 'p1', question: 'Which section empowers the police to arrest without a warrant?', options: ['Section 41', 'Section 42', 'Section 50', 'Section 51'], correctAnswer: 0, explanation: 'Section 41 outlines conditions where police can arrest without a warrant.', tamilExplanation: 'பிடிவாரண்ட் இன்றி கைது செய்யும் அதிகாரம் பிரிவு 41-ல் உள்ளது.', lawSection: 'Sec. 41' },
    { id: 'p2', question: 'Anticipatory Bail is provided under?', options: ['Section 437', 'Section 438', 'Section 439', 'Section 440'], correctAnswer: 1, explanation: 'Section 438 deals with bail for persons apprehending arrest.', tamilExplanation: 'முன்பிணை பிரிவு 438-ன் கீழ் வழங்கப்படுகிறது.', lawSection: 'Sec. 438' },
    { id: 'p3', question: 'The period of limitation for a 6-month punishable offence is?', options: ['6 months', '1 year', '3 years', 'No limit'], correctAnswer: 0, explanation: 'Section 468 sets a 6-month limitation if the punishment is only fine or up to 6 months.', tamilExplanation: 'குறைந்த தண்டனை கொண்ட குற்றங்களுக்கு கால வரம்பு 6 மாதங்கள்.', lawSection: 'Sec. 468' },
    { id: 'p4', question: 'Summary Trial is conducted by?', options: ['CJM only', 'JM 1st Class', 'Any Magistrate', 'High Court'], correctAnswer: 1, explanation: 'Under Section 260, CJM or JM 1st Class (empowered) can conduct summary trials.', tamilExplanation: 'சுருக்கமான விசாரணை நீதித்துறை நடுவர் 1-ம் வகுப்பால் நடத்தப்படலாம்.', lawSection: 'Sec. 260' }
  ]
};

export const OFFLINE_FEEDBACK = [
  "Sharp reasoning, Counsel. The Bench is impressed.",
  "Your argument follows the spirit of Article 21. Continue.",
  "Citation is accurate. Opposing counsel, your rebuttal?",
  "The Court notes this precedent. Proceed to your next point.",
  "Focus on the mens rea of the accused, Advocate."
];
