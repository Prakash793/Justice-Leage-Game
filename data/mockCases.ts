
import { CaseScenario } from '../types';

export const MOCK_CASES: CaseScenario[] = [
  {
    id: 'ipc-001',
    title: 'State vs. Mani (Theft at Central Station)',
    category: 'IPC',
    brief: 'A case involving alleged theft under Section 379 of the Indian Penal Code at the Chennai Central Railway Station. The accused was apprehended with a gold chain belonging to a passenger.',
    facts: [
      'The complainant was waiting for the Podhigai Express at 9:30 PM.',
      'A person later identified as the accused snatched a 2-sovereign gold chain.',
      'Railway Protection Force (RPF) personnel caught the accused after a short chase.',
      'The stolen article was recovered from the accused in the presence of witnesses.',
      'The accused claims it is a case of mistaken identity and the item was planted.'
    ],
    parties: {
      petitioner: 'State of Tamil Nadu',
      respondent: 'Mani (Accused)'
    }
  },
  {
    id: 'crpc-002',
    title: 'Bail Application: Selvam vs. State',
    category: 'CrPC',
    brief: 'An application for anticipatory bail under Section 438 of the CrPC filed before the Sessions Court in Coimbatore. The petitioner is accused of criminal intimidation.',
    facts: [
      'The petitioner is a local businessman with no prior criminal record.',
      'A dispute arose over a land transaction in Pollachi.',
      'The complainant alleges that the petitioner threatened him with dire consequences.',
      'Police have registered an FIR under Section 506(ii) IPC.',
      'The petitioner argues the FIR is a tool for harassment to settle a civil score.'
    ],
    parties: {
      petitioner: 'Selvam (Petitioner)',
      respondent: 'State of Tamil Nadu'
    }
  },
  {
    id: 'cpc-003',
    title: 'Meenakshi vs. Sundaram (Property Partition)',
    category: 'CPC',
    brief: 'A civil suit for partition and separate possession of ancestral property located in Madurai under the Code of Civil Procedure.',
    facts: [
      'The parties are siblings claiming shares in their father\'s self-acquired property.',
      'The father died intestate in 2015.',
      'The defendant (brother) claims a will exists favoring him exclusively.',
      'The plaintiff (sister) challenges the validity of the will, alleging forgery.',
      'The property consists of a residential house and 2 acres of agricultural land.'
    ],
    parties: {
      petitioner: 'Meenakshi (Plaintiff)',
      respondent: 'Sundaram (Defendant)'
    }
  },
  {
    id: 'const-004',
    title: 'Writ Petition: Right to Education',
    category: 'Constitution',
    brief: 'A Writ of Mandamus filed under Article 226 of the Constitution before the Madras High Court regarding the implementation of the RTE Act.',
    facts: [
      'A private school in Tirunelveli refused admission to children from economically weaker sections.',
      'The school claims it is a minority institution and exempt from certain RTE provisions.',
      'The petitioners argue that the school receives government aid and must comply.',
      'Violation of Article 21A and Article 14 is alleged.',
      'The State government is a respondent for failing to enforce the quota.'
    ],
    parties: {
      petitioner: 'Parents Association',
      respondent: 'Bright Future School & State of TN'
    }
  }
];
