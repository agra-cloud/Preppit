export type StudentClass = '10' | '11' | '12';

export type ExamCategory =
  | 'Engineering'
  | 'Medical'
  | 'Boards'
  | 'Law & MBA'
  | 'Govt & CA'
  | 'Scholarship'
  | 'Defence & General';

export type TopicDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface SyllabusTopic {
  id: string;
  title: string;
  weightage: 'High' | 'Medium' | 'Core';
  difficulty?: TopicDifficulty;
  note?: string;
}

export interface SubjectSyllabus {
  subject: string;
  topics: SyllabusTopic[];
}

export interface ExamData {
  id: string;
  name: string;
  shortName: string;
  category: ExamCategory;
  targetClasses: StudentClass[];
  levelSummary: string;
  aliases: string[];
  subjects: SubjectSyllabus[];
}

// Reusable normalized topics so overlap calculations are exact and consistent
const PHY_11 = {
  units: { id: 'phy-units', title: 'Units, Dimensions & Error Analysis', weightage: 'Medium' as const },
  kinematics: { id: 'phy-kinematics', title: 'Kinematics (1D & 2D Motion)', weightage: 'High' as const },
  laws: { id: 'phy-laws', title: 'Laws of Motion & Friction', weightage: 'High' as const },
  workEnergy: { id: 'phy-work-energy', title: 'Work, Energy & Power', weightage: 'High' as const },
  rotational: { id: 'phy-rotational', title: 'System of Particles & Rotational Motion', weightage: 'High' as const },
  gravitation: { id: 'phy-gravitation', title: 'Gravitation', weightage: 'Medium' as const },
  solidsFluids: { id: 'phy-solids-fluids', title: 'Mechanical Properties of Solids & Fluids', weightage: 'Medium' as const },
  thermo: { id: 'phy-thermo', title: 'Thermal Properties & Thermodynamics', weightage: 'High' as const },
  ktg: { id: 'phy-ktg', title: 'Kinetic Theory of Gases', weightage: 'Medium' as const },
  oscillations: { id: 'phy-oscillations', title: 'Oscillations & Waves', weightage: 'High' as const },
};

const PHY_12 = {
  electrostatics: { id: 'phy-electrostatics', title: 'Electric Charges, Fields & Potential', weightage: 'High' as const },
  capacitance: { id: 'phy-capacitance', title: 'Electrostatic Potential & Capacitance', weightage: 'High' as const },
  current: { id: 'phy-current', title: 'Current Electricity', weightage: 'High' as const },
  magnetism: { id: 'phy-magnetism', title: 'Moving Charges & Magnetism', weightage: 'High' as const },
  emiAc: { id: 'phy-emi-ac', title: 'Electromagnetic Induction & AC Circuits', weightage: 'High' as const },
  emWaves: { id: 'phy-em-waves', title: 'Electromagnetic Waves', weightage: 'Core' as const },
  rayOptics: { id: 'phy-ray-optics', title: 'Ray Optics & Optical Instruments', weightage: 'High' as const },
  waveOptics: { id: 'phy-wave-optics', title: 'Wave Optics', weightage: 'Medium' as const },
  dualNature: { id: 'phy-dual-nature', title: 'Dual Nature of Radiation & Matter', weightage: 'Medium' as const },
  atomsNuclei: { id: 'phy-atoms-nuclei', title: 'Atoms & Nuclei', weightage: 'High' as const },
  semiconductors: { id: 'phy-semiconductors', title: 'Semiconductor Electronics', weightage: 'High' as const },
  experimental: { id: 'phy-experimental', title: 'Experimental Physics & Vernier Skills', weightage: 'Core' as const },
};

const CHEM_11 = {
  mole: { id: 'chem-mole', title: 'Some Basic Concepts of Chemistry (Mole Concept)', weightage: 'High' as const },
  atomic: { id: 'chem-atomic', title: 'Structure of Atom', weightage: 'High' as const },
  periodicity: { id: 'chem-periodicity', title: 'Classification of Elements & Periodicity', weightage: 'Core' as const },
  bonding: { id: 'chem-bonding', title: 'Chemical Bonding & Molecular Structure', weightage: 'High' as const },
  thermo: { id: 'chem-thermo', title: 'Chemical Thermodynamics', weightage: 'High' as const },
  equilibrium: { id: 'chem-equilibrium', title: 'Chemical & Ionic Equilibrium', weightage: 'High' as const },
  redox: { id: 'chem-redox', title: 'Redox Reactions', weightage: 'Core' as const },
  goc: { id: 'chem-goc', title: 'Organic Chemistry: Basic Principles & GOC', weightage: 'High' as const },
  hydrocarbons: { id: 'chem-hydrocarbons', title: 'Hydrocarbons', weightage: 'High' as const },
};

const CHEM_12 = {
  solutions: { id: 'chem-solutions', title: 'Solutions & Colligative Properties', weightage: 'High' as const },
  electrochem: { id: 'chem-electrochem', title: 'Electrochemistry', weightage: 'High' as const },
  kinetics: { id: 'chem-kinetics', title: 'Chemical Kinetics', weightage: 'High' as const },
  dBlock: { id: 'chem-d-f-block', title: 'd- and f-Block Elements', weightage: 'Medium' as const },
  coordination: { id: 'chem-coordination', title: 'Coordination Compounds', weightage: 'High' as const },
  haloalkanes: { id: 'chem-haloalkanes', title: 'Haloalkanes & Haloarenes', weightage: 'Medium' as const },
  alcohols: { id: 'chem-alcohols', title: 'Alcohols, Phenols & Ethers', weightage: 'High' as const },
  aldehydes: { id: 'chem-aldehydes', title: 'Aldehydes, Ketones & Carboxylic Acids', weightage: 'High' as const },
  amines: { id: 'chem-amines', title: 'Amines', weightage: 'Medium' as const },
  biomolecules: { id: 'chem-biomolecules', title: 'Biomolecules', weightage: 'Core' as const },
  pBlock: { id: 'chem-p-block', title: 'p-Block Elements (Group 13–18)', weightage: 'Medium' as const },
  practicalChem: { id: 'chem-practical', title: 'Principles Related to Practical Chemistry', weightage: 'Core' as const },
};

const MATH_11 = {
  sets: { id: 'math-sets', title: 'Sets, Relations & Functions', weightage: 'High' as const },
  trig: { id: 'math-trig', title: 'Trigonometric Functions', weightage: 'High' as const },
  complex: { id: 'math-complex', title: 'Complex Numbers & Quadratic Equations', weightage: 'High' as const },
  pnc: { id: 'math-pnc', title: 'Permutations & Combinations', weightage: 'High' as const },
  binomial: { id: 'math-binomial', title: 'Binomial Theorem', weightage: 'Medium' as const },
  sequence: { id: 'math-sequence', title: 'Sequences & Series', weightage: 'High' as const },
  straightLines: { id: 'math-straight-lines', title: 'Straight Lines & Circles', weightage: 'High' as const },
  conics: { id: 'math-conics', title: 'Conic Sections (Parabola, Ellipse, Hyperbola)', weightage: 'High' as const },
  limits: { id: 'math-limits', title: 'Limits & Derivatives', weightage: 'High' as const },
  statistics: { id: 'math-statistics', title: 'Statistics & Probability Basics', weightage: 'Medium' as const },
};

const MATH_12 = {
  matrices: { id: 'math-matrices', title: 'Matrices & Determinants', weightage: 'High' as const },
  continuity: { id: 'math-continuity', title: 'Continuity, Differentiability & Applications', weightage: 'High' as const },
  integrals: { id: 'math-integrals', title: 'Indefinite & Definite Integrals', weightage: 'High' as const },
  diffEq: { id: 'math-diff-eq', title: 'Differential Equations', weightage: 'Medium' as const },
  vectors3d: { id: 'math-vectors-3d', title: 'Vectors & 3D Geometry', weightage: 'High' as const },
  probability: { id: 'math-probability', title: 'Conditional Probability & Bayes Theorem', weightage: 'High' as const },
  lpp: { id: 'math-lpp', title: 'Linear Programming', weightage: 'Core' as const },
  inverseTrig: { id: 'math-inverse-trig', title: 'Inverse Trigonometric Functions', weightage: 'Medium' as const },
};

const BIO_11 = {
  livingWorld: { id: 'bio-living-world', title: 'Diversity in Living World & Classification', weightage: 'Medium' as const },
  plantKingdom: { id: 'bio-plant-kingdom', title: 'Plant & Animal Kingdom', weightage: 'High' as const },
  morphology: { id: 'bio-morphology', title: 'Morphology & Anatomy of Flowering Plants', weightage: 'Medium' as const },
  cell: { id: 'bio-cell', title: 'Cell: The Unit of Life & Cell Cycle', weightage: 'High' as const },
  plantPhysio: { id: 'bio-plant-physio', title: 'Plant Physiology (Photosynthesis & Respiration)', weightage: 'High' as const },
  humanPhysio: { id: 'bio-human-physio', title: 'Human Physiology (Digestion, Breathing, Neural)', weightage: 'High' as const },
};

const BIO_12 = {
  reproduction: { id: 'bio-reproduction', title: 'Human & Plant Reproduction', weightage: 'High' as const },
  genetics: { id: 'bio-genetics', title: 'Principles of Inheritance & Molecular Basis', weightage: 'High' as const },
  evolution: { id: 'bio-evolution', title: 'Evolution', weightage: 'Medium' as const },
  humanHealth: { id: 'bio-human-health', title: 'Human Health, Disease & Microbes', weightage: 'High' as const },
  biotech: { id: 'bio-biotech', title: 'Biotechnology: Principles & Applications', weightage: 'High' as const },
  ecology: { id: 'bio-ecology', title: 'Organisms, Populations & Biodiversity', weightage: 'High' as const },
};

const APT_TOPICS = {
  reading: { id: 'apt-reading', title: 'Reading Comprehension & Verbal Ability', weightage: 'High' as const },
  grammar: { id: 'apt-grammar', title: 'English Grammar & Vocabulary', weightage: 'Medium' as const },
  quant: { id: 'apt-quant', title: 'Quantitative Reasoning & Arithmetic (Percentages, Ratios, Profit & Loss)', weightage: 'High' as const },
  algebraGeom: { id: 'apt-algebra-geom', title: 'Algebra, Geometry & Number Systems', weightage: 'High' as const },
  di: { id: 'apt-di', title: 'Data Interpretation (Tables, Charts & Graphs)', weightage: 'High' as const },
  logical: { id: 'apt-logical', title: 'Logical & Analytical Reasoning', weightage: 'High' as const },
  gk: { id: 'apt-gk', title: 'Current Affairs & General Knowledge', weightage: 'High' as const },
  historyPolity: { id: 'gat-history-geo', title: 'Indian History, Polity & Geography', weightage: 'High' as const },
  economy: { id: 'gs-economy', title: 'Indian Economy, Banking & Fiscal Basics', weightage: 'High' as const },
  genScience: { id: 'gs-science', title: 'General Science & Everyday Technology', weightage: 'Medium' as const },
  constitutional: { id: 'clat-constitutional', title: 'Indian Constitution, Governance & Fundamental Rights', weightage: 'High' as const },
  contracts: { id: 'clat-contracts', title: 'Indian Contract Act & Agreements', weightage: 'High' as const },
};

const MED_TOPICS = {
  anatomy: { id: 'med-anatomy', title: 'Human Anatomy & Neuroanatomy', weightage: 'High' as const },
  physiology: { id: 'med-physiology', title: 'Applied Human Physiology', weightage: 'High' as const },
  biochem: { id: 'med-biochem', title: 'Clinical Biochemistry & Metabolism', weightage: 'High' as const },
  pathology: { id: 'med-pathology', title: 'General & Systemic Pathology', weightage: 'High' as const },
  pharmacology: { id: 'med-pharmacology', title: 'Clinical Pharmacology', weightage: 'High' as const },
  microbiology: { id: 'med-microbiology', title: 'Medical Microbiology & Immunology', weightage: 'Medium' as const },
  forensic: { id: 'med-forensic', title: 'Forensic Medicine & Toxicology', weightage: 'Core' as const },
  psm: { id: 'med-psm', title: 'Community Medicine (PSM)', weightage: 'High' as const },
  medicine: { id: 'med-medicine', title: 'General Medicine & Surgery', weightage: 'High' as const },
  obgyn: { id: 'med-obgyn', title: 'Obstetrics, Gynaecology & Pediatrics', weightage: 'High' as const },
  entOphth: { id: 'med-ent-ophthalmology', title: 'ENT, Ophthalmology & Anaesthesia', weightage: 'Medium' as const },
};

export const EXAMS: ExamData[] = [
  {
    id: 'jee-mains',
    name: 'JEE Mains',
    shortName: 'JEE Mains',
    category: 'Engineering',
    targetClasses: ['11', '12'],
    levelSummary: 'Class 11 & 12 PCM',
    aliases: ['jee', 'main', 'nta', 'engineering', 'nit', 'btech'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.solidsFluids,
          PHY_11.thermo,
          PHY_11.ktg,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
          PHY_12.experimental,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.periodicity,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.redox,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
          CHEM_12.pBlock,
          CHEM_12.practicalChem,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.binomial,
          MATH_11.sequence,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_11.statistics,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.inverseTrig,
        ],
      },
    ],
  },
  {
    id: 'jee-advanced',
    name: 'JEE Advanced',
    shortName: 'JEE Advanced',
    category: 'Engineering',
    targetClasses: ['11', '12'],
    levelSummary: 'Class 11 & 12 PCM (IIT)',
    aliases: ['jee', 'adv', 'iit', 'engineering'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.solidsFluids,
          PHY_11.thermo,
          PHY_11.ktg,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.experimental,
          {
            id: 'phy-rigid-body-advanced',
            title: 'Advanced Rigid Body Dynamics & Angular Momentum',
            weightage: 'High',
            note: 'Multi-concept numericals beyond Mains level',
          },
          {
            id: 'phy-thermal-radiation',
            title: 'Thermal Radiation, Stefan-Boltzmann & Wien Law',
            weightage: 'Medium',
          },
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.periodicity,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.redox,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
          CHEM_12.pBlock,
          CHEM_12.practicalChem,
          {
            id: 'chem-metallurgy',
            title: 'General Principles of Metallurgy & Ores',
            weightage: 'Medium',
          },
          {
            id: 'chem-surface-solid',
            title: 'Solid State & Surface Chemistry',
            weightage: 'Medium',
          },
          {
            id: 'chem-qualitative-analysis',
            title: 'Systematic Salt & Qualitative Inorganic Analysis',
            weightage: 'High',
          },
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.binomial,
          MATH_11.sequence,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_11.statistics,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.inverseTrig,
          {
            id: 'math-solutions-triangles',
            title: 'Properties & Solutions of Triangles',
            weightage: 'Medium',
          },
          {
            id: 'math-locus-3d-planes',
            title: 'Planes & Skew Lines in 3D Geometry',
            weightage: 'High',
          },
        ],
      },
    ],
  },
  {
    id: 'neet-ug',
    name: 'NEET UG',
    shortName: 'NEET UG',
    category: 'Medical',
    targetClasses: ['11', '12'],
    levelSummary: 'Class 11 & 12 PCB (Medical)',
    aliases: ['neet', 'ug', 'mbbs', 'medical', 'aiims', 'nta'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.solidsFluids,
          PHY_11.thermo,
          PHY_11.ktg,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
          PHY_12.experimental,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.periodicity,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.redox,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
          CHEM_12.pBlock,
          CHEM_12.practicalChem,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.livingWorld,
          BIO_11.plantKingdom,
          BIO_11.morphology,
          BIO_11.cell,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_12.humanHealth,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
    ],
  },
  {
    id: 'neet-pg',
    name: 'NEET PG',
    shortName: 'NEET PG',
    category: 'Medical',
    targetClasses: ['12'],
    levelSummary: 'MBBS Graduate Medical PG',
    aliases: ['neet', 'pg', 'md', 'ms', 'medical', 'mbbs'],
    subjects: [
      {
        subject: 'Biology',
        topics: [
          BIO_11.humanPhysio,
          BIO_12.genetics,
          BIO_12.humanHealth,
        ],
      },
      {
        subject: 'Medical Sciences',
        topics: [
          MED_TOPICS.anatomy,
          MED_TOPICS.physiology,
          MED_TOPICS.biochem,
          MED_TOPICS.pathology,
          MED_TOPICS.pharmacology,
          MED_TOPICS.microbiology,
          MED_TOPICS.forensic,
          MED_TOPICS.psm,
          MED_TOPICS.medicine,
          MED_TOPICS.obgyn,
          MED_TOPICS.entOphth,
        ],
      },
    ],
  },
  {
    id: 'ini-cet',
    name: 'INI-CET (AIIMS / JIPMER / PGIMER)',
    shortName: 'INI-CET',
    category: 'Medical',
    targetClasses: ['12'],
    levelSummary: 'AIIMS & Institutes of National Importance PG Medical',
    aliases: ['inicet', 'ini-cet', 'aiims pg', 'jipmer', 'pgimer', 'nimhans', 'medical'],
    subjects: [
      {
        subject: 'Biology',
        topics: [
          BIO_11.humanPhysio,
          BIO_12.genetics,
          BIO_12.humanHealth,
        ],
      },
      {
        subject: 'Medical Sciences',
        topics: [
          MED_TOPICS.anatomy,
          MED_TOPICS.physiology,
          MED_TOPICS.biochem,
          MED_TOPICS.pathology,
          MED_TOPICS.pharmacology,
          MED_TOPICS.microbiology,
          MED_TOPICS.forensic,
          MED_TOPICS.psm,
          MED_TOPICS.medicine,
          MED_TOPICS.obgyn,
          MED_TOPICS.entOphth,
        ],
      },
    ],
  },
  {
    id: 'fmge',
    name: 'FMGE (NMC Medical Screening)',
    shortName: 'FMGE',
    category: 'Medical',
    targetClasses: ['12'],
    levelSummary: 'Foreign Medical Graduate Exam (Pre & Clinical MBBS)',
    aliases: ['fmge', 'nmc', 'next', 'mci', 'mbbs', 'medical'],
    subjects: [
      {
        subject: 'Medical Sciences',
        topics: [
          MED_TOPICS.anatomy,
          MED_TOPICS.physiology,
          MED_TOPICS.biochem,
          MED_TOPICS.pathology,
          MED_TOPICS.pharmacology,
          MED_TOPICS.microbiology,
          MED_TOPICS.forensic,
          MED_TOPICS.psm,
          MED_TOPICS.medicine,
          MED_TOPICS.obgyn,
          MED_TOPICS.entOphth,
        ],
      },
    ],
  },
  {
    id: 'neet-mds',
    name: 'NEET MDS (Dental PG)',
    shortName: 'NEET MDS',
    category: 'Medical',
    targetClasses: ['12'],
    levelSummary: 'BDS Postgraduate Dental Entrance (Pre-Clinical + Dental)',
    aliases: ['mds', 'neet mds', 'dental', 'bds', 'medical'],
    subjects: [
      {
        subject: 'Medical Sciences',
        topics: [
          MED_TOPICS.anatomy,
          MED_TOPICS.physiology,
          MED_TOPICS.biochem,
          MED_TOPICS.pathology,
          MED_TOPICS.pharmacology,
          MED_TOPICS.microbiology,
          MED_TOPICS.medicine,
          { id: 'med-dental-anatomy', title: 'Dental Anatomy, Embryology & Oral Histology', weightage: 'High' },
          { id: 'med-oral-pathology', title: 'Oral Pathology, Oral Medicine & Radiology', weightage: 'High' },
          { id: 'med-prosthodontics', title: 'Prosthodontics, Endodontics & Orthodontics', weightage: 'High' },
        ],
      },
    ],
  },
  {
    id: 'aiims-nursing',
    name: 'AIIMS B.Sc. Nursing & Paramedical',
    shortName: 'AIIMS Nursing',
    category: 'Medical',
    targetClasses: ['11', '12'],
    levelSummary: 'Class 11 & 12 PCB + General Knowledge',
    aliases: ['aiims', 'nursing', 'bsc nursing', 'paramedical', 'medical', 'pcb'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.thermo,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.rayOptics,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.bonding,
          CHEM_11.equilibrium,
          CHEM_11.goc,
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.coordination,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.livingWorld,
          BIO_11.cell,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.humanHealth,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.gk,
        ],
      },
    ],
  },
  {
    id: 'mns',
    name: 'MNS (Military Nursing Service)',
    shortName: 'MNS Nursing',
    category: 'Medical',
    targetClasses: ['11', '12'],
    levelSummary: 'Indian Army B.Sc. Nursing (PCB + English + IQ)',
    aliases: ['mns', 'military nursing', 'army nursing', 'medical', 'nursing'],
    subjects: [
      {
        subject: 'Biology',
        topics: [
          BIO_11.cell,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.humanHealth,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.thermo,
          PHY_12.current,
          PHY_12.rayOptics,
          PHY_12.atomsNuclei,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.bonding,
          CHEM_11.redox,
          CHEM_12.solutions,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.logical,
          APT_TOPICS.gk,
        ],
      },
    ],
  },
  {
    id: 'gpat',
    name: 'GPAT (Pharmacy Entrance)',
    shortName: 'GPAT',
    category: 'Medical',
    targetClasses: ['12'],
    levelSummary: 'M.Pharm Entrance (Pharmacology, Medicinal Chem & Pharmaceutics)',
    aliases: ['gpat', 'pharmacy', 'bpharm', 'mpharm', 'pharma', 'medical'],
    subjects: [
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Medical Sciences',
        topics: [
          MED_TOPICS.pharmacology,
          MED_TOPICS.biochem,
          MED_TOPICS.microbiology,
          { id: 'pharma-pharmaceutics', title: 'Pharmaceutics, Dosage Forms & Biopharmaceutics', weightage: 'High' },
          { id: 'pharma-medicinal-chem', title: 'Pharmaceutical & Medicinal Chemistry (SAR)', weightage: 'High' },
          { id: 'pharma-pharmacognosy', title: 'Pharmacognosy & Phytochemistry', weightage: 'Medium' },
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.humanPhysio,
          BIO_12.biotech,
        ],
      },
    ],
  },
  {
    id: 'cuet-ug',
    name: 'CUET UG',
    shortName: 'CUET UG',
    category: 'Boards',
    targetClasses: ['12'],
    levelSummary: 'Class 12 NCERT + General Test',
    aliases: ['cuet', 'central university', 'du', 'ncert', 'ug'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.lpp,
          MATH_12.inverseTrig,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_12.humanHealth,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          { id: 'apt-reading', title: 'Reading Comprehension & Verbal Ability', weightage: 'High' },
          { id: 'apt-quant', title: 'Quantitative Reasoning (Class 8–10 Maths)', weightage: 'Medium' },
          { id: 'apt-logical', title: 'Logical & Analytical Reasoning', weightage: 'Medium' },
          { id: 'apt-gk', title: 'Current Affairs & General Knowledge', weightage: 'Core' },
        ],
      },
    ],
  },
  {
    id: 'bitsat',
    name: 'BITSAT',
    shortName: 'BITSAT',
    category: 'Engineering',
    targetClasses: ['11', '12'],
    levelSummary: 'Class 11 & 12 PCM + English',
    aliases: ['bits', 'pilani', 'bitsat', 'engineering'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.solidsFluids,
          PHY_11.thermo,
          PHY_11.ktg,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.periodicity,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.redox,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
          CHEM_12.pBlock,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.binomial,
          MATH_11.sequence,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_11.statistics,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.lpp,
          MATH_12.inverseTrig,
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          { id: 'apt-reading', title: 'Reading Comprehension & Verbal Ability', weightage: 'Medium' },
          { id: 'apt-logical', title: 'Logical & Analytical Reasoning', weightage: 'Medium' },
          { id: 'apt-grammar', title: 'English Grammar & Vocabulary', weightage: 'Core' },
        ],
      },
    ],
  },
  {
    id: 'viteee',
    name: 'VITEEE (VIT)',
    shortName: 'VITEEE',
    category: 'Engineering',
    targetClasses: ['11', '12'],
    levelSummary: 'Class 11 & 12 PCM + English & Aptitude',
    aliases: ['vit', 'viteee', 'vellore', 'engineering'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.solidsFluids,
          PHY_11.thermo,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.atomic,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.binomial,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.inverseTrig,
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          { id: 'apt-reading', title: 'Reading Comprehension & Verbal Ability', weightage: 'Core' },
          { id: 'apt-logical', title: 'Logical & Analytical Reasoning', weightage: 'Core' },
        ],
      },
    ],
  },
  {
    id: 'iiser-iat',
    name: 'IISER Aptitude Test (IAT)',
    shortName: 'IISER IAT',
    category: 'Defence & General',
    targetClasses: ['11', '12'],
    levelSummary: 'Class 11 & 12 PCMB Research',
    aliases: ['iiser', 'iat', 'science', 'research', 'pcmb'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.thermo,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.coordination,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.sequence,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.vectors3d,
          MATH_12.probability,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.cell,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
    ],
  },
  {
    id: 'mht-cet',
    name: 'MHT CET',
    shortName: 'MHT CET',
    category: 'Engineering',
    targetClasses: ['11', '12'],
    levelSummary: '80% Class 12 + 20% Class 11',
    aliases: ['mht', 'cet', 'maharashtra', 'engineering', 'pharmacy'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.gravitation,
          PHY_11.thermo,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.bonding,
          CHEM_11.redox,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.lpp,
          MATH_12.inverseTrig,
          { id: 'math-logic', title: 'Mathematical Logic', weightage: 'High' },
        ],
      },
    ],
  },
  {
    id: 'wbjee',
    name: 'WBJEE',
    shortName: 'WBJEE',
    category: 'Engineering',
    targetClasses: ['11', '12'],
    levelSummary: 'Class 11 & 12 PCM (West Bengal)',
    aliases: ['wbjee', 'jadavpur', 'west bengal', 'engineering'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.solidsFluids,
          PHY_11.thermo,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.periodicity,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.binomial,
          MATH_11.sequence,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
        ],
      },
    ],
  },
  {
    id: 'nda',
    name: 'NDA & NA',
    shortName: 'NDA & NA',
    category: 'Defence & General',
    targetClasses: ['11', '12'],
    levelSummary: 'Maths + General Ability Test',
    aliases: ['nda', 'upsc', 'defence', 'army', 'navy', 'airforce'],
    subjects: [
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.binomial,
          MATH_11.sequence,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_11.statistics,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.inverseTrig,
        ],
      },
      {
        subject: 'Physics',
        topics: [
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.gravitation,
          PHY_11.thermo,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.rayOptics,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.redox,
          { id: 'chem-acids-bases-everyday', title: 'Acids, Bases, Salts & Everyday Chemistry', weightage: 'Core' },
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          { id: 'apt-reading', title: 'Reading Comprehension & Verbal Ability', weightage: 'High' },
          { id: 'apt-grammar', title: 'English Grammar & Vocabulary', weightage: 'High' },
          { id: 'apt-gk', title: 'Current Affairs & General Knowledge', weightage: 'High' },
          { id: 'gat-history-geo', title: 'Indian History, Polity & Geography', weightage: 'High' },
        ],
      },
    ],
  },
  {
    id: 'cbse-12-science',
    name: 'Class 12 CBSE Science',
    shortName: 'Class 12 CBSE',
    category: 'Boards',
    targetClasses: ['12'],
    levelSummary: 'NCERT Class 12 Board Exam',
    aliases: ['class 12', 'cbse', 'boards', '12th', 'ncert'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.lpp,
          MATH_12.inverseTrig,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_12.humanHealth,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
    ],
  },
  {
    id: 'cbse-11-science',
    name: 'Class 11 CBSE Science',
    shortName: 'Class 11 CBSE',
    category: 'Boards',
    targetClasses: ['11'],
    levelSummary: 'NCERT Class 11 Foundation',
    aliases: ['class 11', 'cbse', '11th', 'ncert', 'school'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.solidsFluids,
          PHY_11.thermo,
          PHY_11.ktg,
          PHY_11.oscillations,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.periodicity,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.redox,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.binomial,
          MATH_11.sequence,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_11.statistics,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.livingWorld,
          BIO_11.plantKingdom,
          BIO_11.morphology,
          BIO_11.cell,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
        ],
      },
    ],
  },
  {
    id: 'cbse-10-boards',
    name: 'Class 10 CBSE Boards',
    shortName: 'Class 10 Boards',
    category: 'Boards',
    targetClasses: ['10'],
    levelSummary: 'NCERT Class 10 Science & Maths',
    aliases: ['class 10', '10th', 'cbse', 'boards', 'matric'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          { id: '10-phy-light', title: 'Light: Reflection & Refraction', weightage: 'High' },
          { id: '10-phy-eye', title: 'Human Eye & Colourful World', weightage: 'Medium' },
          { id: '10-phy-electricity', title: 'Electricity & Ohm’s Law', weightage: 'High' },
          { id: '10-phy-magnetic', title: 'Magnetic Effects of Electric Current', weightage: 'High' },
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          { id: '10-chem-reactions', title: 'Chemical Reactions & Equations', weightage: 'High' },
          { id: '10-chem-acids', title: 'Acids, Bases & Salts', weightage: 'High' },
          { id: '10-chem-metals', title: 'Metals & Non-Metals', weightage: 'Medium' },
          { id: '10-chem-carbon', title: 'Carbon & Its Compounds', weightage: 'High' },
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          { id: '10-math-real', title: 'Real Numbers & Polynomials', weightage: 'Medium' },
          { id: '10-math-quadratic', title: 'Linear & Quadratic Equations', weightage: 'High' },
          { id: '10-math-ap', title: 'Arithmetic Progressions (AP)', weightage: 'High' },
          { id: '10-math-triangles', title: 'Triangles & Coordinate Geometry', weightage: 'High' },
          { id: '10-math-trig', title: 'Introduction to Trigonometry & Heights', weightage: 'High' },
          { id: '10-math-circles', title: 'Circles & Surface Areas / Volumes', weightage: 'High' },
          { id: '10-math-stats', title: 'Statistics & Probability', weightage: 'Medium' },
        ],
      },
      {
        subject: 'Biology',
        topics: [
          { id: '10-bio-life', title: 'Life Processes & Control / Coordination', weightage: 'High' },
          { id: '10-bio-repro', title: 'How Do Organisms Reproduce?', weightage: 'High' },
          { id: '10-bio-heredity', title: 'Heredity & Our Environment', weightage: 'Medium' },
        ],
      },
    ],
  },
  {
    id: 'icse-10-boards',
    name: 'Class 10 ICSE Boards (CISCE)',
    shortName: 'Class 10 ICSE',
    category: 'Boards',
    targetClasses: ['10'],
    levelSummary: 'CISCE Class 10 Science, Maths & English',
    aliases: ['icse', 'cisce', 'class 10', '10th', 'boards', 'icse 10'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.workEnergy,
          { id: '10-phy-light', title: 'Refraction, Lenses & Spectrum of Light', weightage: 'High' },
          { id: '10-phy-electricity', title: 'Current Electricity & Household Circuits', weightage: 'High' },
          { id: '10-phy-magnetic', title: 'Electromagnetism & Electromagnetic Induction', weightage: 'High' },
          { id: '10-phy-calorimetry-sound', title: 'Machines, Calorimetry & Sound Waves', weightage: 'High' },
          { id: '10-phy-radioactivity', title: 'Radioactivity & Nuclear Physics Basics', weightage: 'Medium' },
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.periodicity,
          CHEM_11.bonding,
          CHEM_11.mole,
          { id: '10-chem-acids', title: 'Acids, Bases, Salts & Analytical Chemistry', weightage: 'High' },
          { id: '10-chem-carbon', title: 'Organic Chemistry (Alkanes, Alkenes, Alcohols & Acids)', weightage: 'High' },
          { id: '10-chem-electrolysis-metallurgy', title: 'Electrolysis, Metallurgy & Study of Compounds (HCl, NH3, HNO3, H2SO4)', weightage: 'High' },
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          { id: '10-math-gst-banking', title: 'Commercial Maths (GST, Banking & Shares/Dividends)', weightage: 'High' },
          { id: '10-math-quadratic', title: 'Linear Inequations, Quadratic Equations & Ratio/Proportion', weightage: 'High' },
          { id: '10-math-ap', title: 'Arithmetic & Geometric Progressions (AP & GP)', weightage: 'High' },
          { id: '10-math-triangles', title: 'Similarity, Loci & Coordinate Geometry', weightage: 'High' },
          { id: '10-math-trig', title: 'Trigonometrical Identities & Heights/Distances', weightage: 'High' },
          { id: '10-math-circles', title: 'Circles, Tangents, Mensuration (Cylinder, Cone, Sphere)', weightage: 'High' },
          { id: '10-math-stats', title: 'Statistics (Mean, Median, Ogive) & Probability', weightage: 'Medium' },
          MATH_12.matrices,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.cell,
          BIO_11.plantPhysio,
          { id: '10-bio-life', title: 'Circulatory, Excretory & Transpiration Systems', weightage: 'High' },
          { id: '10-bio-repro', title: 'Human Reproductive System & Population', weightage: 'High' },
          { id: '10-bio-heredity', title: 'Genetics Basics, Evolution & Pollution', weightage: 'Medium' },
          { id: '10-bio-nervous-endocrine', title: 'Nervous System, Sense Organs & Endocrine Glands', weightage: 'High' },
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
        ],
      },
    ],
  },
  {
    id: 'isc-12-science',
    name: 'Class 12 ISC Science (CISCE)',
    shortName: 'Class 12 ISC',
    category: 'Boards',
    targetClasses: ['12'],
    levelSummary: 'CISCE Class 12 Board Exam (PCM / PCB)',
    aliases: ['isc', 'icse', 'cisce', 'class 12', '12th', 'boards', 'isc 12'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
          CHEM_12.pBlock,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.lpp,
          MATH_12.inverseTrig,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_12.humanHealth,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
        ],
      },
    ],
  },
  {
    id: 'isc-11-science',
    name: 'Class 11 ISC Science (CISCE)',
    shortName: 'Class 11 ISC',
    category: 'Boards',
    targetClasses: ['11'],
    levelSummary: 'CISCE Class 11 Foundation (PCM / PCB)',
    aliases: ['isc', 'icse', 'cisce', 'class 11', '11th', 'boards', 'isc 11'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.solidsFluids,
          PHY_11.thermo,
          PHY_11.ktg,
          PHY_11.oscillations,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.periodicity,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.redox,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.binomial,
          MATH_11.sequence,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_11.statistics,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.livingWorld,
          BIO_11.plantKingdom,
          BIO_11.morphology,
          BIO_11.cell,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
        ],
      },
    ],
  },
  {
    id: 'mpbse-12-science',
    name: 'Class 12 MP Board (MPBSE)',
    shortName: 'MP Board 12',
    category: 'Boards',
    targetClasses: ['12'],
    levelSummary: 'Madhya Pradesh State Board Class 12 (PCM / PCB)',
    aliases: ['mp board', 'mpbse', 'madhya pradesh', 'state board', 'class 12', '12th', 'boards', 'mp 12', 'ncert'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.lpp,
          MATH_12.inverseTrig,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_12.humanHealth,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
    ],
  },
  {
    id: 'mpbse-11-science',
    name: 'Class 11 MP Board (MPBSE)',
    shortName: 'MP Board 11',
    category: 'Boards',
    targetClasses: ['11'],
    levelSummary: 'Madhya Pradesh State Board Class 11 (PCM / PCB)',
    aliases: ['mp board', 'mpbse', 'madhya pradesh', 'state board', 'class 11', '11th', 'boards', 'mp 11', 'ncert'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.solidsFluids,
          PHY_11.thermo,
          PHY_11.ktg,
          PHY_11.oscillations,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.periodicity,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.redox,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.binomial,
          MATH_11.sequence,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_11.statistics,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.livingWorld,
          BIO_11.plantKingdom,
          BIO_11.morphology,
          BIO_11.cell,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
        ],
      },
    ],
  },
  {
    id: 'mpbse-10-boards',
    name: 'Class 10 MP Board (MPBSE)',
    shortName: 'MP Board 10',
    category: 'Boards',
    targetClasses: ['10'],
    levelSummary: 'Madhya Pradesh State Board Class 10 Science & Maths',
    aliases: ['mp board', 'mpbse', 'madhya pradesh', 'state board', 'class 10', '10th', 'boards', 'mp 10'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          { id: '10-phy-light', title: 'Light: Reflection & Refraction', weightage: 'High' },
          { id: '10-phy-eye', title: 'Human Eye & Colourful World', weightage: 'Medium' },
          { id: '10-phy-electricity', title: 'Electricity & Ohm’s Law', weightage: 'High' },
          { id: '10-phy-magnetic', title: 'Magnetic Effects of Electric Current', weightage: 'High' },
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          { id: '10-chem-reactions', title: 'Chemical Reactions & Equations', weightage: 'High' },
          { id: '10-chem-acids', title: 'Acids, Bases & Salts', weightage: 'High' },
          { id: '10-chem-metals', title: 'Metals & Non-Metals', weightage: 'Medium' },
          { id: '10-chem-carbon', title: 'Carbon & Its Compounds', weightage: 'High' },
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          { id: '10-math-real', title: 'Real Numbers & Polynomials', weightage: 'Medium' },
          { id: '10-math-quadratic', title: 'Linear & Quadratic Equations', weightage: 'High' },
          { id: '10-math-ap', title: 'Arithmetic Progressions (AP)', weightage: 'High' },
          { id: '10-math-triangles', title: 'Triangles & Coordinate Geometry', weightage: 'High' },
          { id: '10-math-trig', title: 'Introduction to Trigonometry & Heights', weightage: 'High' },
          { id: '10-math-circles', title: 'Circles & Surface Areas / Volumes', weightage: 'High' },
          { id: '10-math-stats', title: 'Statistics & Probability', weightage: 'Medium' },
        ],
      },
      {
        subject: 'Biology',
        topics: [
          { id: '10-bio-life', title: 'Life Processes & Control / Coordination', weightage: 'High' },
          { id: '10-bio-repro', title: 'How Do Organisms Reproduce?', weightage: 'High' },
          { id: '10-bio-heredity', title: 'Heredity & Our Environment', weightage: 'Medium' },
        ],
      },
    ],
  },
  {
    id: 'rbse-12-science',
    name: 'Class 12 RBSE (Rajasthan Board)',
    shortName: 'RBSE 12',
    category: 'Boards',
    targetClasses: ['12'],
    levelSummary: 'Rajasthan State Board (BSER) Class 12 PCM / PCB',
    aliases: ['rbse', 'bser', 'rajasthan board', 'ajmer', 'state board', 'class 12', '12th', 'boards', 'rbse 12', 'ncert'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.lpp,
          MATH_12.inverseTrig,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_12.humanHealth,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
    ],
  },
  {
    id: 'rbse-11-science',
    name: 'Class 11 RBSE (Rajasthan Board)',
    shortName: 'RBSE 11',
    category: 'Boards',
    targetClasses: ['11'],
    levelSummary: 'Rajasthan State Board (BSER) Class 11 PCM / PCB',
    aliases: ['rbse', 'bser', 'rajasthan board', 'ajmer', 'state board', 'class 11', '11th', 'boards', 'rbse 11', 'ncert'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.solidsFluids,
          PHY_11.thermo,
          PHY_11.ktg,
          PHY_11.oscillations,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.periodicity,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.redox,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.binomial,
          MATH_11.sequence,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_11.statistics,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.livingWorld,
          BIO_11.plantKingdom,
          BIO_11.morphology,
          BIO_11.cell,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
        ],
      },
    ],
  },
  {
    id: 'rbse-10-boards',
    name: 'Class 10 RBSE (Rajasthan Board)',
    shortName: 'RBSE 10',
    category: 'Boards',
    targetClasses: ['10'],
    levelSummary: 'Rajasthan State Board (BSER) Class 10 Science & Maths',
    aliases: ['rbse', 'bser', 'rajasthan board', 'ajmer', 'state board', 'class 10', '10th', 'boards', 'rbse 10'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          { id: '10-phy-light', title: 'Light: Reflection & Refraction', weightage: 'High' },
          { id: '10-phy-eye', title: 'Human Eye & Colourful World', weightage: 'Medium' },
          { id: '10-phy-electricity', title: 'Electricity & Ohm’s Law', weightage: 'High' },
          { id: '10-phy-magnetic', title: 'Magnetic Effects of Electric Current', weightage: 'High' },
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          { id: '10-chem-reactions', title: 'Chemical Reactions & Equations', weightage: 'High' },
          { id: '10-chem-acids', title: 'Acids, Bases & Salts', weightage: 'High' },
          { id: '10-chem-metals', title: 'Metals & Non-Metals', weightage: 'Medium' },
          { id: '10-chem-carbon', title: 'Carbon & Its Compounds', weightage: 'High' },
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          { id: '10-math-real', title: 'Real Numbers & Polynomials', weightage: 'Medium' },
          { id: '10-math-quadratic', title: 'Linear & Quadratic Equations', weightage: 'High' },
          { id: '10-math-ap', title: 'Arithmetic Progressions (AP)', weightage: 'High' },
          { id: '10-math-triangles', title: 'Triangles & Coordinate Geometry', weightage: 'High' },
          { id: '10-math-trig', title: 'Introduction to Trigonometry & Heights', weightage: 'High' },
          { id: '10-math-circles', title: 'Circles & Surface Areas / Volumes', weightage: 'High' },
          { id: '10-math-stats', title: 'Statistics & Probability', weightage: 'Medium' },
        ],
      },
      {
        subject: 'Biology',
        topics: [
          { id: '10-bio-life', title: 'Life Processes & Control / Coordination', weightage: 'High' },
          { id: '10-bio-repro', title: 'How Do Organisms Reproduce?', weightage: 'High' },
          { id: '10-bio-heredity', title: 'Heredity & Our Environment', weightage: 'Medium' },
        ],
      },
    ],
  },
  {
    id: 'up-12-science',
    name: 'Class 12 UP Board (UPMSP)',
    shortName: 'UP Board 12',
    category: 'Boards',
    targetClasses: ['12'],
    levelSummary: 'Uttar Pradesh State Board Class 12 (PCM / PCB)',
    aliases: ['up board', 'upmsp', 'uttar pradesh', 'state board', 'class 12', '12th', 'boards', 'ncert'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.lpp,
          MATH_12.inverseTrig,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_12.humanHealth,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
    ],
  },
  {
    id: 'up-11-science',
    name: 'Class 11 UP Board (UPMSP)',
    shortName: 'UP Board 11',
    category: 'Boards',
    targetClasses: ['11'],
    levelSummary: 'Uttar Pradesh State Board Class 11 (PCM / PCB)',
    aliases: ['up board', 'upmsp', 'uttar pradesh', 'state board', 'class 11', '11th', 'boards', 'ncert'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.gravitation,
          PHY_11.solidsFluids,
          PHY_11.thermo,
          PHY_11.ktg,
          PHY_11.oscillations,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.periodicity,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.redox,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.binomial,
          MATH_11.sequence,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_11.limits,
          MATH_11.statistics,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.livingWorld,
          BIO_11.plantKingdom,
          BIO_11.morphology,
          BIO_11.cell,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
        ],
      },
    ],
  },
  {
    id: 'bseb-12-science',
    name: 'Class 12 Bihar Board (BSEB)',
    shortName: 'Bihar Board 12',
    category: 'Boards',
    targetClasses: ['12'],
    levelSummary: 'Bihar State Board Class 12 Inter Science (PCM / PCB)',
    aliases: ['bihar board', 'bseb', 'inter', 'state board', 'class 12', '12th', 'boards', 'ncert'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_12.electrostatics,
          PHY_12.capacitance,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.emWaves,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
          CHEM_12.pBlock,
          { id: 'chem-surface-solid', title: 'Solid State & Surface Chemistry', weightage: 'Medium' },
          { id: 'chem-metallurgy', title: 'General Principles of Metallurgy & Ores', weightage: 'Medium' },
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.lpp,
          MATH_12.inverseTrig,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_12.humanHealth,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
    ],
  },
  {
    id: 'maharashtra-12-science',
    name: 'Class 12 Maharashtra HSC Board',
    shortName: 'Maharashtra HSC 12',
    category: 'Boards',
    targetClasses: ['12'],
    levelSummary: 'Maharashtra State Board (MSBSHSE) Class 12 Science',
    aliases: ['maharashtra board', 'hsc', 'msbshse', 'state board', 'class 12', '12th', 'boards', 'mht'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.rotational,
          PHY_11.solidsFluids,
          PHY_11.ktg,
          PHY_11.thermo,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.waveOptics,
          PHY_12.dualNature,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          { id: 'chem-surface-solid', title: 'Solid State Chemistry', weightage: 'Medium' },
          CHEM_12.solutions,
          CHEM_11.equilibrium,
          CHEM_11.thermo,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.pBlock,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.haloalkanes,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.amines,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          { id: 'math-logic', title: 'Mathematical Logic', weightage: 'High' },
          MATH_12.matrices,
          MATH_11.trig,
          MATH_11.straightLines,
          MATH_12.vectors3d,
          MATH_12.lpp,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.probability,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
          BIO_12.humanHealth,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
    ],
  },
  {
    id: 'ntse-foundation',
    name: 'NTSE & Science Olympiad (Class 10)',
    shortName: 'NTSE / Olympiad',
    category: 'Scholarship',
    targetClasses: ['10'],
    levelSummary: 'Class 10 + Mental Ability (MAT)',
    aliases: ['ntse', 'olympiad', 'ioqm', 'nsejs', 'scholarship', 'class 10', 'foundation'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          { id: '10-phy-light', title: 'Light: Reflection & Refraction', weightage: 'High' },
          { id: '10-phy-eye', title: 'Human Eye & Colourful World', weightage: 'Medium' },
          { id: '10-phy-electricity', title: 'Electricity & Ohm’s Law', weightage: 'High' },
          { id: '10-phy-magnetic', title: 'Magnetic Effects of Electric Current', weightage: 'High' },
          PHY_11.kinematics,
          PHY_11.laws,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          { id: '10-chem-reactions', title: 'Chemical Reactions & Equations', weightage: 'High' },
          { id: '10-chem-acids', title: 'Acids, Bases & Salts', weightage: 'High' },
          { id: '10-chem-metals', title: 'Metals & Non-Metals', weightage: 'Medium' },
          { id: '10-chem-carbon', title: 'Carbon & Its Compounds', weightage: 'High' },
          CHEM_11.mole,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          { id: '10-math-real', title: 'Real Numbers & Polynomials', weightage: 'Medium' },
          { id: '10-math-quadratic', title: 'Linear & Quadratic Equations', weightage: 'High' },
          { id: '10-math-ap', title: 'Arithmetic Progressions (AP)', weightage: 'High' },
          { id: '10-math-triangles', title: 'Triangles & Coordinate Geometry', weightage: 'High' },
          { id: '10-math-trig', title: 'Introduction to Trigonometry & Heights', weightage: 'High' },
          { id: '10-math-circles', title: 'Circles & Surface Areas / Volumes', weightage: 'High' },
          { id: '10-math-stats', title: 'Statistics & Probability', weightage: 'Medium' },
          MATH_11.pnc,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          { id: '10-bio-life', title: 'Life Processes & Control / Coordination', weightage: 'High' },
          { id: '10-bio-repro', title: 'How Do Organisms Reproduce?', weightage: 'High' },
          { id: '10-bio-heredity', title: 'Heredity & Our Environment', weightage: 'Medium' },
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          { id: 'apt-logical', title: 'Mental Ability Test (Series, Coding, Puzzles)', weightage: 'High' },
          { id: 'gat-history-geo', title: 'Social Science (History, Civics & Geography)', weightage: 'High' },
        ],
      },
    ],
  },
  {
    id: 'clat',
    name: 'CLAT (Common Law Admission Test)',
    shortName: 'CLAT',
    category: 'Law & MBA',
    targetClasses: ['11', '12'],
    levelSummary: '5-Year Integrated LLB Entrance (NLU)',
    aliases: ['clat', 'law', 'nlu', 'llb', 'legal', 'ailet'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.logical,
          APT_TOPICS.di,
          APT_TOPICS.gk,
        ],
      },
      {
        subject: 'Legal Reasoning',
        topics: [
          APT_TOPICS.constitutional,
          APT_TOPICS.contracts,
          { id: 'clat-torts', title: 'Law of Torts & Negligence', weightage: 'High' },
          { id: 'clat-criminal', title: 'Criminal Law Principles (BNS / IPC Basics)', weightage: 'Medium' },
          { id: 'clat-legal-gk', title: 'Landmark Judgments & Contemporary Legal Issues', weightage: 'High' },
        ],
      },
    ],
  },
  {
    id: 'cat',
    name: 'CAT (Common Admission Test)',
    shortName: 'CAT',
    category: 'Law & MBA',
    targetClasses: ['12'],
    levelSummary: 'IIM / MBA Entrance (VARC, DILR, QA)',
    aliases: ['cat', 'mba', 'iim', 'management', 'varc', 'dilr', 'qa'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.logical,
          APT_TOPICS.di,
          APT_TOPICS.quant,
          APT_TOPICS.algebraGeom,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.pnc,
          MATH_11.sequence,
          MATH_12.probability,
        ],
      },
    ],
  },
  {
    id: 'sat',
    name: 'SAT (Digital SAT)',
    shortName: 'SAT',
    category: 'Law & MBA',
    targetClasses: ['10', '11', '12'],
    levelSummary: 'Reading, Writing & Maths (Global UG)',
    aliases: ['sat', 'college board', 'us admissions', 'undergraduate', 'abroad'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.di,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          APT_TOPICS.quant,
          APT_TOPICS.algebraGeom,
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.statistics,
          MATH_12.probability,
        ],
      },
    ],
  },
  {
    id: 'gate',
    name: 'GATE (CS & Engineering)',
    shortName: 'GATE',
    category: 'Engineering',
    targetClasses: ['12'],
    levelSummary: 'M.Tech / PSU Entrance (Maths + CS + GA)',
    aliases: ['gate', 'mtech', 'iit', 'psu', 'graduate', 'engineering', 'cs'],
    subjects: [
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.limits,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.probability,
          { id: 'gate-discrete-math', title: 'Discrete Mathematics & Graph Theory', weightage: 'High' },
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.quant,
          APT_TOPICS.logical,
          APT_TOPICS.di,
        ],
      },
      {
        subject: 'Engineering & CS',
        topics: [
          { id: 'gate-digital-logic', title: 'Digital Logic & Number Systems', weightage: 'Medium' },
          { id: 'gate-coa', title: 'Computer Organization & Architecture', weightage: 'High' },
          { id: 'gate-dsa', title: 'Programming & Data Structures (C, Trees, Graphs)', weightage: 'High' },
          { id: 'gate-algorithms', title: 'Design & Analysis of Algorithms', weightage: 'High' },
          { id: 'gate-toc-compiler', title: 'Theory of Computation & Compiler Design', weightage: 'Medium' },
          { id: 'gate-os', title: 'Operating Systems (Processes, Deadlocks, Memory)', weightage: 'High' },
          { id: 'gate-dbms', title: 'Database Management Systems (SQL & Normalization)', weightage: 'High' },
          { id: 'gate-cn', title: 'Computer Networks (TCP/IP & Routing)', weightage: 'High' },
        ],
      },
    ],
  },
  {
    id: 'ashoka-aat',
    name: 'Ashoka Aptitude Test (AAT)',
    shortName: 'Ashoka AAT',
    category: 'Law & MBA',
    targetClasses: ['11', '12'],
    levelSummary: 'Ashoka University UG Admission (Thinking & Problem Solving)',
    aliases: ['aat', 'ashoka', 'ashoka amplitude test', 'ashoka aptitude', 'liberal arts', 'ug'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.logical,
          APT_TOPICS.quant,
          APT_TOPICS.di,
          { id: 'xat-critical-reasoning', title: 'Critical Thinking & Problem Solving', weightage: 'High' },
          { id: 'aat-critical-essay', title: 'On-the-Spot Essay & Analytical Writing', weightage: 'High' },
        ],
      },
    ],
  },
  {
    id: 'upsc-cse',
    name: 'UPSC CSE (IAS / Civil Services)',
    shortName: 'UPSC CSE',
    category: 'Govt & CA',
    targetClasses: ['12'],
    levelSummary: 'Civil Services Prelims (GS + CSAT) & Mains',
    aliases: ['upsc', 'cse', 'ias', 'ips', 'ifs', 'civil services', 'csat'],
    subjects: [
      {
        subject: 'General Studies',
        topics: [
          APT_TOPICS.historyPolity,
          APT_TOPICS.constitutional,
          APT_TOPICS.economy,
          APT_TOPICS.genScience,
          { id: 'upsc-environment', title: 'Environment, Ecology & Climate Change', weightage: 'High' },
          { id: 'upsc-ir', title: 'International Relations & Global Affairs', weightage: 'Medium' },
          { id: 'upsc-ethics', title: 'Ethics, Integrity & Case Studies (Mains GS-IV)', weightage: 'Medium' },
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.gk,
          APT_TOPICS.reading,
          APT_TOPICS.quant,
          APT_TOPICS.logical,
          APT_TOPICS.di,
        ],
      },
    ],
  },
  {
    id: 'ssc-cgl',
    name: 'SSC CGL (Combined Graduate Level)',
    shortName: 'SSC CGL',
    category: 'Govt & CA',
    targetClasses: ['12'],
    levelSummary: 'Central Govt Group B & C (Tier 1 & Tier 2)',
    aliases: ['ssc', 'cgl', 'ssc cgl', 'govt', 'staff selection', 'inspector'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.quant,
          APT_TOPICS.algebraGeom,
          APT_TOPICS.di,
          APT_TOPICS.logical,
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.gk,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.trig,
          MATH_11.statistics,
          MATH_12.probability,
        ],
      },
      {
        subject: 'General Studies',
        topics: [
          APT_TOPICS.historyPolity,
          APT_TOPICS.economy,
          APT_TOPICS.genScience,
        ],
      },
      {
        subject: 'Computer Knowledge',
        topics: [
          { id: 'ssc-computer', title: 'Computer Fundamentals, MS Office, Networking & Cyber Security', weightage: 'Medium' },
        ],
      },
    ],
  },
  {
    id: 'ca-foundation',
    name: 'CA Foundation (ICAI)',
    shortName: 'CA Foundation',
    category: 'Govt & CA',
    targetClasses: ['11', '12'],
    levelSummary: 'ICAI Chartered Accountancy Entry Exam',
    aliases: ['ca', 'ca foundation', 'icai', 'chartered accountant', 'commerce', 'accounts'],
    subjects: [
      {
        subject: 'Accounting & Finance',
        topics: [
          { id: 'ca-accounting-basics', title: 'Accounting Principles, Journal, Ledger & Trial Balance', weightage: 'High' },
          { id: 'ca-final-accounts', title: 'Final Accounts, Depreciation & Inventory Valuation', weightage: 'High' },
          { id: 'ca-partnership-company', title: 'Partnership Accounts & Issue of Shares / Debentures', weightage: 'High' },
        ],
      },
      {
        subject: 'Business Laws & Economics',
        topics: [
          APT_TOPICS.contracts,
          { id: 'ca-sale-partnership-act', title: 'Sale of Goods Act, Partnership Act & Companies Act Basics', weightage: 'High' },
          { id: 'ca-microeconomics', title: 'Microeconomics (Demand, Supply, Production & Markets)', weightage: 'High' },
          APT_TOPICS.economy,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.pnc,
          MATH_11.sequence,
          MATH_11.statistics,
          MATH_12.probability,
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.quant,
          APT_TOPICS.logical,
        ],
      },
    ],
  },
  {
    id: 'xat',
    name: 'XAT (Xavier Aptitude Test)',
    shortName: 'XAT',
    category: 'Law & MBA',
    targetClasses: ['12'],
    levelSummary: 'XLRI / MBA Entrance (VALR, DM, QADI, GK)',
    aliases: ['xat', 'xlri', 'mba', 'management', 'decision making', 'valr', 'qadi'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.logical,
          APT_TOPICS.di,
          APT_TOPICS.quant,
          APT_TOPICS.algebraGeom,
          APT_TOPICS.gk,
        ],
      },
      {
        subject: 'Decision Making & Ethics',
        topics: [
          { id: 'xat-decision-making', title: 'Business Decision Making & Ethical Dilemmas', weightage: 'High' },
          { id: 'xat-critical-reasoning', title: 'Critical Reasoning & Argument Analysis', weightage: 'High' },
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.pnc,
          MATH_11.sequence,
          MATH_12.probability,
        ],
      },
    ],
  },
  {
    id: 'cds',
    name: 'CDS (Combined Defence Services)',
    shortName: 'CDS',
    category: 'Defence & General',
    targetClasses: ['12'],
    levelSummary: 'UPSC Defence Officer Exam (IMA, INA, AFA, OTA)',
    aliases: ['cds', 'upsc cds', 'ima', 'ota', 'ina', 'afa', 'defence', 'army', 'navy', 'airforce'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.gk,
          APT_TOPICS.quant,
          APT_TOPICS.algebraGeom,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.trig,
          MATH_11.statistics,
        ],
      },
      {
        subject: 'General Studies',
        topics: [
          APT_TOPICS.historyPolity,
          APT_TOPICS.constitutional,
          APT_TOPICS.economy,
          APT_TOPICS.genScience,
        ],
      },
    ],
  },
  {
    id: 'mext',
    name: 'MEXT Scholarship (Japan)',
    shortName: 'MEXT',
    category: 'Scholarship',
    targetClasses: ['11', '12'],
    levelSummary: 'Japanese Govt UG Scholarship (Eng, Maths, Science)',
    aliases: ['mext', 'monbukagakusho', 'japan', 'scholarship', 'ug', 'study abroad'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.gk,
          { id: 'mext-japanese-basics', title: 'Japanese Language Aptitude (Bonus / Placement)', weightage: 'Core' },
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.sequence,
          MATH_11.limits,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.vectors3d,
          MATH_12.probability,
        ],
      },
      {
        subject: 'Physics',
        topics: [
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.thermo,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.rayOptics,
          PHY_12.atomsNuclei,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.redox,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.solutions,
          CHEM_12.electrochem,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.cell,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
          BIO_12.genetics,
          BIO_12.ecology,
        ],
      },
    ],
  },
  {
    id: 'nstse-scholarship',
    name: 'NSTSE / National Science Scholarship',
    shortName: 'NSTSE',
    category: 'Scholarship',
    targetClasses: ['10', '11', '12'],
    levelSummary: 'Class 10–12 PCMB + Critical Thinking Scholarship',
    aliases: ['nstse', 'scholarship', 'inspire', 'science', 'olympiad', 'kvpy'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_12.current,
          PHY_12.rayOptics,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.bonding,
          CHEM_11.redox,
          CHEM_11.goc,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.sequence,
          MATH_11.pnc,
          MATH_12.probability,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.cell,
          BIO_11.humanPhysio,
          BIO_12.genetics,
          BIO_12.ecology,
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.logical,
        ],
      },
    ],
  },
  {
    id: 'ipmat',
    name: 'IPMAT (IIM Indore & Rohtak)',
    shortName: 'IPMAT',
    category: 'Law & MBA',
    targetClasses: ['11', '12'],
    levelSummary: '5-Year Integrated Management (IIM IPM)',
    aliases: ['ipmat', 'iim indore', 'iim rohtak', 'ipm', 'bba', 'management'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.logical,
          APT_TOPICS.di,
          APT_TOPICS.quant,
          APT_TOPICS.algebraGeom,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.pnc,
          MATH_11.sequence,
          MATH_11.binomial,
          MATH_12.matrices,
          MATH_12.probability,
        ],
      },
    ],
  },
  {
    id: 'comedk-kcet',
    name: 'COMEDK UGET / KCET',
    shortName: 'COMEDK / KCET',
    category: 'Engineering',
    targetClasses: ['11', '12'],
    levelSummary: 'Karnataka Engineering Entrance (Class 11 & 12 PCM)',
    aliases: ['comedk', 'kcet', 'karnataka', 'bangalore', 'rvce', 'engineering'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.units,
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.gravitation,
          PHY_11.thermo,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.straightLines,
          MATH_11.conics,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
          MATH_12.lpp,
        ],
      },
    ],
  },
  {
    id: 'nest',
    name: 'NEST (NISER / UM-DAE CEBS)',
    shortName: 'NEST',
    category: 'Defence & General',
    targetClasses: ['11', '12'],
    levelSummary: 'National Entrance Screening Test (PCMB Research)',
    aliases: ['nest', 'niser', 'cebs', 'science', 'research', 'pcmb'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_11.thermo,
          PHY_11.oscillations,
          PHY_12.electrostatics,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.rayOptics,
          PHY_12.atomsNuclei,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.goc,
          CHEM_11.hydrocarbons,
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.coordination,
          CHEM_12.aldehydes,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.trig,
          MATH_11.complex,
          MATH_11.pnc,
          MATH_11.sequence,
          MATH_11.conics,
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.vectors3d,
          MATH_12.probability,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.cell,
          BIO_11.plantPhysio,
          BIO_11.humanPhysio,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
    ],
  },
  {
    id: 'afcat',
    name: 'AFCAT (Indian Air Force)',
    shortName: 'AFCAT',
    category: 'Defence & General',
    targetClasses: ['12'],
    levelSummary: 'Air Force Common Admission Test (Flying & Ground Duty)',
    aliases: ['afcat', 'air force', 'iaf', 'defence', 'officer'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.quant,
          APT_TOPICS.logical,
          APT_TOPICS.gk,
        ],
      },
      {
        subject: 'General Studies',
        topics: [
          APT_TOPICS.historyPolity,
          APT_TOPICS.genScience,
        ],
      },
    ],
  },
  {
    id: 'ibps-po',
    name: 'IBPS PO / SBI PO (Banking)',
    shortName: 'IBPS / SBI PO',
    category: 'Govt & CA',
    targetClasses: ['12'],
    levelSummary: 'Public Sector Bank Officer (Prelims + Mains)',
    aliases: ['ibps', 'sbi', 'po', 'banking', 'bank', 'govt'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.reading,
          APT_TOPICS.grammar,
          APT_TOPICS.quant,
          APT_TOPICS.di,
          APT_TOPICS.logical,
          APT_TOPICS.gk,
        ],
      },
      {
        subject: 'General Studies',
        topics: [
          APT_TOPICS.economy,
        ],
      },
      {
        subject: 'Computer Knowledge',
        topics: [
          { id: 'ssc-computer', title: 'Computer Fundamentals, Banking Tech & Cyber Security', weightage: 'Medium' },
        ],
      },
    ],
  },
  {
    id: 'inspire-she',
    name: 'INSPIRE Scholarship (DST-SHE)',
    shortName: 'INSPIRE SHE',
    category: 'Scholarship',
    targetClasses: ['12'],
    levelSummary: 'Govt of India DST Science Scholarship (Top 1% / JEE / NEET)',
    aliases: ['inspire', 'dst', 'she', 'scholarship', 'india', 'science'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_12.electrostatics,
          PHY_12.current,
          PHY_12.magnetism,
          PHY_12.emiAc,
          PHY_12.rayOptics,
          PHY_12.waveOptics,
          PHY_12.atomsNuclei,
          PHY_12.semiconductors,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_12.solutions,
          CHEM_12.electrochem,
          CHEM_12.kinetics,
          CHEM_12.dBlock,
          CHEM_12.coordination,
          CHEM_12.alcohols,
          CHEM_12.aldehydes,
          CHEM_12.biomolecules,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_12.matrices,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.diffEq,
          MATH_12.vectors3d,
          MATH_12.probability,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_12.reproduction,
          BIO_12.genetics,
          BIO_12.evolution,
          BIO_12.biotech,
          BIO_12.ecology,
        ],
      },
    ],
  },
  {
    id: 'jbnsts',
    name: 'JBNSTS Scholarship (Senior & Junior)',
    shortName: 'JBNSTS',
    category: 'Scholarship',
    targetClasses: ['11', '12'],
    levelSummary: 'Jagadis Bose National Science Talent Search Scholarship',
    aliases: ['jbnsts', 'jagadis bose', 'scholarship', 'india', 'stem', 'bengal'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
          PHY_11.rotational,
          PHY_12.electrostatics,
          PHY_12.current,
          PHY_12.rayOptics,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          CHEM_11.mole,
          CHEM_11.bonding,
          CHEM_11.thermo,
          CHEM_11.equilibrium,
          CHEM_11.goc,
          CHEM_12.electrochem,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          MATH_11.sets,
          MATH_11.pnc,
          MATH_11.sequence,
          MATH_12.continuity,
          MATH_12.integrals,
          MATH_12.probability,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          BIO_11.cell,
          BIO_11.humanPhysio,
          BIO_12.genetics,
          BIO_12.biotech,
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.logical,
        ],
      },
    ],
  },
  {
    id: 'nmms',
    name: 'NMMS Scholarship (Govt of India)',
    shortName: 'NMMS',
    category: 'Scholarship',
    targetClasses: ['10'],
    levelSummary: 'National Means-cum-Merit Scholarship (MAT + SAT)',
    aliases: ['nmms', 'scholarship', 'india', 'govt scholarship', 'mat', 'sat'],
    subjects: [
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.logical,
          APT_TOPICS.quant,
          APT_TOPICS.historyPolity,
        ],
      },
      {
        subject: 'Physics',
        topics: [
          { id: '10-phy-light', title: 'Light: Reflection & Refraction', weightage: 'High' },
          { id: '10-phy-electricity', title: 'Electricity & Circuits', weightage: 'High' },
          { id: '10-phy-magnetic', title: 'Magnetism & Force', weightage: 'Medium' },
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          { id: '10-chem-reactions', title: 'Chemical Reactions & Changes', weightage: 'High' },
          { id: '10-chem-acids', title: 'Acids, Bases & Salts', weightage: 'High' },
          { id: '10-chem-metals', title: 'Metals & Non-Metals', weightage: 'Medium' },
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          { id: '10-math-real', title: 'Number Systems & Algebra Basics', weightage: 'High' },
          { id: '10-math-triangles', title: 'Geometry, Triangles & Mensuration', weightage: 'High' },
          { id: '10-math-stats', title: 'Data Handling & Statistics', weightage: 'Medium' },
        ],
      },
      {
        subject: 'Biology',
        topics: [
          { id: '10-bio-life', title: 'Cell Structure, Nutrition & Respiration', weightage: 'High' },
          { id: '10-bio-heredity', title: 'Environment & Microorganisms', weightage: 'Medium' },
        ],
      },
    ],
  },
  {
    id: 'anthe-tallentex',
    name: 'ANTHE / TALLENTEX Merit Scholarship',
    shortName: 'ANTHE / TALLENTEX',
    category: 'Scholarship',
    targetClasses: ['10', '11', '12'],
    levelSummary: 'Indian National Talent Scholarship (PCMB + IQ)',
    aliases: ['anthe', 'tallentex', 'aakash', 'allen', 'scholarship', 'india'],
    subjects: [
      {
        subject: 'Physics',
        topics: [
          { id: '10-phy-light', title: 'Light: Reflection & Refraction', weightage: 'High' },
          { id: '10-phy-electricity', title: 'Electricity & Ohm’s Law', weightage: 'High' },
          PHY_11.kinematics,
          PHY_11.laws,
          PHY_11.workEnergy,
        ],
      },
      {
        subject: 'Chemistry',
        topics: [
          { id: '10-chem-reactions', title: 'Chemical Reactions & Equations', weightage: 'High' },
          { id: '10-chem-carbon', title: 'Carbon & Its Compounds', weightage: 'High' },
          CHEM_11.mole,
          CHEM_11.atomic,
          CHEM_11.bonding,
        ],
      },
      {
        subject: 'Mathematics',
        topics: [
          { id: '10-math-quadratic', title: 'Linear & Quadratic Equations', weightage: 'High' },
          { id: '10-math-trig', title: 'Trigonometry & Coordinate Geometry', weightage: 'High' },
          MATH_11.sequence,
          MATH_11.pnc,
        ],
      },
      {
        subject: 'Biology',
        topics: [
          { id: '10-bio-life', title: 'Life Processes & Control / Coordination', weightage: 'High' },
          BIO_11.cell,
          BIO_11.humanPhysio,
        ],
      },
      {
        subject: 'English & Aptitude',
        topics: [
          APT_TOPICS.logical,
        ],
      },
    ],
  },
];

export interface QuickPairing {
  label: string;
  subtitle: string;
  examIds: string[];
  recommendedFor: StudentClass[];
}

export const QUICK_PAIRINGS: QuickPairing[] = [
  {
    label: 'JEE Mains + Class 12 CBSE',
    subtitle: 'Check how much Boards cover for JEE',
    examIds: ['jee-mains', 'cbse-12-science'],
    recommendedFor: ['12'],
  },
  {
    label: 'JEE Mains + BITSAT',
    subtitle: 'Engineering duo with English & Aptitude',
    examIds: ['jee-mains', 'bitsat'],
    recommendedFor: ['11', '12'],
  },
  {
    label: 'NEET UG + CUET UG',
    subtitle: 'Medical + Central University backup',
    examIds: ['neet-ug', 'cuet-ug'],
    recommendedFor: ['12'],
  },
  {
    label: 'CLAT + CUET UG',
    subtitle: 'Law entrance + Central University aptitude overlap',
    examIds: ['clat', 'cuet-ug'],
    recommendedFor: ['12'],
  },
  {
    label: 'CAT + SSC CGL',
    subtitle: 'Shared Quant, DI, Reasoning & Verbal prep',
    examIds: ['cat', 'ssc-cgl'],
    recommendedFor: ['12'],
  },
  {
    label: 'JEE Mains + NDA & NA',
    subtitle: 'Engineering + Defence prep together',
    examIds: ['jee-mains', 'nda'],
    recommendedFor: ['11', '12'],
  },
  {
    label: 'Class 11 CBSE + JEE Mains',
    subtitle: 'Start early in Class 11 without overload',
    examIds: ['cbse-11-science', 'jee-mains'],
    recommendedFor: ['11'],
  },
  {
    label: 'Class 10 Boards + NTSE / Olympiad',
    subtitle: 'School boards + foundation competitive prep',
    examIds: ['cbse-10-boards', 'ntse-foundation'],
    recommendedFor: ['10'],
  },
];

export interface TopicComparisonItem {
  topic: SyllabusTopic;
  subject: string;
  presentInExamIds: string[];
  status: 'common' | 'partial' | 'unique';
  uniqueToExamId?: string;
}

export interface SubjectComparison {
  subject: string;
  totalUnionTopics: number;
  commonCount: number;
  partialCount: number;
  uniqueCountsByExam: Record<string, number>;
  overlapPercent: number;
  items: TopicComparisonItem[];
}

export interface ComparisonSummary {
  exams: ExamData[];
  totalUnionTopics: number;
  commonTopicsCount: number;
  partialTopicsCount: number;
  overallOverlapPercent: number;
  verdictLevel: 'high' | 'moderate' | 'low';
  verdictTitle: string;
  verdictExplanation: string;
  subjectComparisons: SubjectComparison[];
}

export function getExamTopicCount(exam: ExamData): number {
  return exam.subjects.reduce((sum, s) => sum + s.topics.length, 0);
}

export function compareExams(exams: ExamData[]): ComparisonSummary {
  const subjectNamesSet = new Set<string>();
  exams.forEach((exam) => {
    exam.subjects.forEach((sub) => subjectNamesSet.add(sub.subject));
  });

  const orderedSubjectNames = Array.from(subjectNamesSet);
  const subjectComparisons: SubjectComparison[] = [];

  let totalUnionTopics = 0;
  let commonTopicsCount = 0;
  let partialTopicsCount = 0;

  for (const subjectName of orderedSubjectNames) {
    const topicMap = new Map<
      string,
      { topic: SyllabusTopic; presentInExamIds: string[] }
    >();

    for (const exam of exams) {
      const sub = exam.subjects.find((s) => s.subject === subjectName);
      if (!sub) continue;

      for (const topic of sub.topics) {
        const existing = topicMap.get(topic.id);
        if (existing) {
          if (!existing.presentInExamIds.includes(exam.id)) {
            existing.presentInExamIds.push(exam.id);
          }
        } else {
          topicMap.set(topic.id, {
            topic,
            presentInExamIds: [exam.id],
          });
        }
      }
    }

    const items: TopicComparisonItem[] = [];
    let commonCount = 0;
    let partialCount = 0;
    const uniqueCountsByExam: Record<string, number> = {};
    exams.forEach((e) => {
      uniqueCountsByExam[e.id] = 0;
    });

    topicMap.forEach(({ topic, presentInExamIds }) => {
      let status: 'common' | 'partial' | 'unique';
      let uniqueToExamId: string | undefined;

      if (presentInExamIds.length === exams.length) {
        status = 'common';
        commonCount += 1;
      } else if (presentInExamIds.length > 1) {
        status = 'partial';
        partialCount += 1;
      } else {
        status = 'unique';
        uniqueToExamId = presentInExamIds[0];
        uniqueCountsByExam[uniqueToExamId] =
          (uniqueCountsByExam[uniqueToExamId] ?? 0) + 1;
      }

      items.push({
        topic,
        subject: subjectName,
        presentInExamIds,
        status,
        uniqueToExamId,
      });
    });

    // Sort: common first, then partial, then unique
    const rank = { common: 0, partial: 1, unique: 2 };
    items.sort((a, b) => rank[a.status] - rank[b.status]);

    const subUnion = items.length;
    const subOverlap =
      subUnion === 0
        ? 0
        : Math.round(((commonCount + partialCount * 0.5) / subUnion) * 100);

    totalUnionTopics += subUnion;
    commonTopicsCount += commonCount;
    partialTopicsCount += partialCount;

    subjectComparisons.push({
      subject: subjectName,
      totalUnionTopics: subUnion,
      commonCount,
      partialCount,
      uniqueCountsByExam,
      overlapPercent: subOverlap,
      items,
    });
  }

  const overallOverlapPercent =
    totalUnionTopics === 0
      ? 0
      : Math.round(
          ((commonTopicsCount + partialTopicsCount * 0.5) / totalUnionTopics) *
            100
        );

  let verdictLevel: 'high' | 'moderate' | 'low';
  let verdictTitle: string;
  let verdictExplanation: string;

  if (overallOverlapPercent >= 65) {
    verdictLevel = 'high';
    verdictTitle = 'High Overlap — Very realistic to prep together';
    verdictExplanation =
      'Most core chapters match directly. Preparing your primary exam covers the bulk of the syllabus, leaving only a small set of extra chapters to add.';
  } else if (overallOverlapPercent >= 35) {
    verdictLevel = 'moderate';
    verdictTitle = 'Moderate Overlap — Manageable with a weekly split';
    verdictExplanation =
      'Core science or maths chapters overlap, while each exam adds distinct sections or subjects. Study common chapters first, then block weekend slots for extra topics.';
  } else {
    verdictLevel = 'low';
    verdictTitle = 'Low Overlap — Separate prep recommended';
    verdictExplanation =
      'These exams test mostly different subjects or academic levels. Preparing both simultaneously can split your focus unless one is a secondary backup.';
  }

  return {
    exams,
    totalUnionTopics,
    commonTopicsCount,
    partialTopicsCount,
    overallOverlapPercent,
    verdictLevel,
    verdictTitle,
    verdictExplanation,
    subjectComparisons,
  };
}

export interface RelatedExamMatch {
  exam: ExamData;
  overlapPercent: number;
  sharedTopicsCount: number;
}

export function getRelatedExams(
  primaryExam: ExamData,
  excludeIds: string[] = [],
  limit = 6
): RelatedExamMatch[] {
  const excluded = new Set([primaryExam.id, ...excludeIds]);

  return EXAMS.filter((candidate) => !excluded.has(candidate.id))
    .map((candidate) => {
      const result = compareExams([primaryExam, candidate]);
      return {
        exam: candidate,
        overlapPercent: result.overallOverlapPercent,
        sharedTopicsCount: result.commonTopicsCount,
      };
    })
    .filter((match) => match.overlapPercent > 0)
    .sort((a, b) => {
      if (b.overlapPercent !== a.overlapPercent) {
        return b.overlapPercent - a.overlapPercent;
      }
      return b.sharedTopicsCount - a.sharedTopicsCount;
    })
    .slice(0, limit);
}

const TOPIC_DIFFICULTY_MAP: Record<string, TopicDifficulty> = {
  // Physics
  'phy-units': 'Easy',
  'phy-kinematics': 'Medium',
  'phy-laws': 'Medium',
  'phy-work-energy': 'Medium',
  'phy-rotational': 'Hard',
  'phy-gravitation': 'Easy',
  'phy-solids-fluids': 'Medium',
  'phy-thermo': 'Hard',
  'phy-ktg': 'Easy',
  'phy-oscillations': 'Medium',
  'phy-electrostatics': 'Hard',
  'phy-capacitance': 'Medium',
  'phy-current': 'Medium',
  'phy-magnetism': 'Hard',
  'phy-emi-ac': 'Hard',
  'phy-em-waves': 'Easy',
  'phy-ray-optics': 'Medium',
  'phy-wave-optics': 'Hard',
  'phy-dual-nature': 'Easy',
  'phy-atoms-nuclei': 'Easy',
  'phy-semiconductors': 'Easy',
  'phy-experimental': 'Easy',
  'phy-rigid-body-advanced': 'Hard',
  'phy-thermal-radiation': 'Medium',

  // Chemistry
  'chem-mole': 'Medium',
  'chem-atomic': 'Easy',
  'chem-periodicity': 'Easy',
  'chem-bonding': 'Medium',
  'chem-thermo': 'Hard',
  'chem-equilibrium': 'Hard',
  'chem-redox': 'Easy',
  'chem-goc': 'Hard',
  'chem-hydrocarbons': 'Medium',
  'chem-solutions': 'Easy',
  'chem-electrochem': 'Hard',
  'chem-kinetics': 'Medium',
  'chem-d-f-block': 'Medium',
  'chem-coordination': 'Medium',
  'chem-haloalkanes': 'Medium',
  'chem-alcohols': 'Medium',
  'chem-aldehydes': 'Hard',
  'chem-amines': 'Medium',
  'chem-biomolecules': 'Easy',
  'chem-p-block': 'Medium',
  'chem-practical': 'Easy',
  'chem-metallurgy': 'Easy',
  'chem-surface-solid': 'Easy',
  'chem-qualitative-analysis': 'Hard',
  'chem-acids-bases-everyday': 'Easy',

  // Mathematics
  'math-sets': 'Easy',
  'math-trig': 'Medium',
  'math-complex': 'Hard',
  'math-pnc': 'Hard',
  'math-binomial': 'Medium',
  'math-sequence': 'Medium',
  'math-straight-lines': 'Medium',
  'math-conics': 'Hard',
  'math-limits': 'Medium',
  'math-statistics': 'Easy',
  'math-matrices': 'Easy',
  'math-continuity': 'Medium',
  'math-integrals': 'Hard',
  'math-diff-eq': 'Medium',
  'math-vectors-3d': 'Medium',
  'math-probability': 'Hard',
  'math-lpp': 'Easy',
  'math-inverse-trig': 'Easy',
  'math-solutions-triangles': 'Hard',
  'math-locus-3d-planes': 'Hard',
  'math-logic': 'Easy',

  // Biology
  'bio-living-world': 'Easy',
  'bio-plant-kingdom': 'Medium',
  'bio-morphology': 'Medium',
  'bio-cell': 'Easy',
  'bio-plant-physio': 'Hard',
  'bio-human-physio': 'Hard',
  'bio-reproduction': 'Medium',
  'bio-genetics': 'Hard',
  'bio-evolution': 'Easy',
  'bio-human-health': 'Easy',
  'bio-biotech': 'Medium',
  'bio-ecology': 'Easy',

  // Medical & Aptitude & Class 10
  'med-anatomy': 'Hard',
  'med-physiology': 'Hard',
  'med-biochem': 'Medium',
  'med-pathology': 'Hard',
  'med-pharmacology': 'Hard',
  'med-microbiology': 'Medium',
  'med-forensic': 'Easy',
  'med-psm': 'Medium',
  'med-medicine': 'Hard',
  'med-obgyn': 'Medium',
  'med-ent-ophthalmology': 'Medium',
  'med-dental-anatomy': 'Medium',
  'med-oral-pathology': 'Hard',
  'med-prosthodontics': 'Hard',
  'pharma-pharmaceutics': 'Medium',
  'pharma-medicinal-chem': 'Hard',
  'pharma-pharmacognosy': 'Easy',
  'apt-reading': 'Easy',
  'apt-quant': 'Medium',
  'apt-algebra-geom': 'Medium',
  'apt-di': 'Medium',
  'apt-logical': 'Medium',
  'apt-gk': 'Easy',
  'apt-grammar': 'Easy',
  'gat-history-geo': 'Medium',
  'gs-economy': 'Medium',
  'gs-science': 'Easy',

  // CLAT, GATE, AAT, UPSC, SSC, CA
  'clat-constitutional': 'Medium',
  'clat-contracts': 'Medium',
  'clat-torts': 'Easy',
  'clat-criminal': 'Medium',
  'clat-legal-gk': 'Medium',
  'gate-discrete-math': 'Hard',
  'gate-digital-logic': 'Easy',
  'gate-coa': 'Hard',
  'gate-dsa': 'Medium',
  'gate-algorithms': 'Hard',
  'gate-toc-compiler': 'Hard',
  'gate-os': 'Medium',
  'gate-dbms': 'Medium',
  'gate-cn': 'Medium',
  'aat-critical-essay': 'Medium',
  'upsc-environment': 'Medium',
  'upsc-ir': 'Medium',
  'upsc-ethics': 'Medium',
  'ssc-computer': 'Easy',
  'ca-accounting-basics': 'Easy',
  'ca-final-accounts': 'Medium',
  'ca-partnership-company': 'Hard',
  'ca-sale-partnership-act': 'Medium',
  'ca-microeconomics': 'Medium',
  'xat-decision-making': 'Hard',
  'xat-critical-reasoning': 'Medium',
  'mext-japanese-basics': 'Easy',

  // Class 10 & ICSE
  '10-phy-light': 'Medium',
  '10-phy-eye': 'Easy',
  '10-phy-electricity': 'Medium',
  '10-phy-magnetic': 'Medium',
  '10-phy-calorimetry-sound': 'Medium',
  '10-phy-radioactivity': 'Easy',
  '10-chem-reactions': 'Easy',
  '10-chem-acids': 'Easy',
  '10-chem-metals': 'Easy',
  '10-chem-carbon': 'Medium',
  '10-chem-electrolysis-metallurgy': 'Medium',
  '10-math-real': 'Easy',
  '10-math-quadratic': 'Medium',
  '10-math-ap': 'Easy',
  '10-math-gst-banking': 'Easy',
  '10-math-triangles': 'Hard',
  '10-math-trig': 'Medium',
  '10-math-circles': 'Medium',
  '10-math-stats': 'Easy',
  '10-bio-life': 'Medium',
  '10-bio-repro': 'Easy',
  '10-bio-heredity': 'Medium',
  '10-bio-nervous-endocrine': 'Medium',
};

export function getTopicDifficulty(topic: SyllabusTopic): TopicDifficulty {
  if (topic.difficulty) return topic.difficulty;
  if (TOPIC_DIFFICULTY_MAP[topic.id]) return TOPIC_DIFFICULTY_MAP[topic.id];
  if (topic.weightage === 'High') return 'Medium';
  return 'Easy';
}

export type ExamDifficultyLevel =
  | 'Moderate'
  | 'Moderate–Hard'
  | 'High'
  | 'Very High';

export interface ExamPatternInfo {
  conductingBody: string;
  markingScheme: string;
  negativeMarking: string;
  selectionRatio: string;
  difficulty: ExamDifficultyLevel;
  modeDuration: string;
}

export const EXAM_PATTERNS: Record<string, ExamPatternInfo> = {
  'jee-mains': {
    conductingBody: 'NTA (National Testing Agency)',
    markingScheme: '+4 per Q · 300 marks (75 Qs)',
    negativeMarking: '-1 for every wrong answer',
    selectionRatio: '~1.8% (NIT/IIIT) · Top ~2.5L for Adv',
    difficulty: 'High',
    modeDuration: 'CBT · 3 hours',
  },
  'jee-advanced': {
    conductingBody: 'Rotating IIT (JCC / IIT Kanpur)',
    markingScheme: 'Variable (+3/+4) · 360 marks (2 papers)',
    negativeMarking: '-1 / -2 on MCQ & matching',
    selectionRatio: '~1.1% (~17,700 IIT seats)',
    difficulty: 'Very High',
    modeDuration: 'CBT · 6 hours (Paper 1 & 2)',
  },
  'neet-ug': {
    conductingBody: 'NTA (National Testing Agency)',
    markingScheme: '+4 per Q · 720 marks (180 Qs)',
    negativeMarking: '-1 for every wrong answer',
    selectionRatio: '~4.5% Govt+Pvt MBBS (~24L test-takers)',
    difficulty: 'High',
    modeDuration: 'Pen & Paper (OMR) · 3 hrs',
  },
  'neet-pg': {
    conductingBody: 'NBEMS (Nat. Board of Examinations)',
    markingScheme: '+4 per Q · 800 marks (200 Qs)',
    negativeMarking: '-1 (25% negative marking)',
    selectionRatio: '~20%–25% PG seats (~2.2L test-takers)',
    difficulty: 'Very High',
    modeDuration: 'CBT · 3 hrs 30 mins',
  },
  'ini-cet': {
    conductingBody: 'AIIMS New Delhi',
    markingScheme: '+1 per Q · 200 marks (200 Qs)',
    negativeMarking: '-1/3 per wrong answer',
    selectionRatio: '~1%–1.5% (AIIMS / JIPMER / PGIMER)',
    difficulty: 'Very High',
    modeDuration: 'CBT · 3 hours',
  },
  fmge: {
    conductingBody: 'NBEMS (Nat. Board of Examinations)',
    markingScheme: '+1 per Q · 300 marks (300 Qs)',
    negativeMarking: 'None (Qualifying: 150/300)',
    selectionRatio: '~15%–22% pass rate',
    difficulty: 'High',
    modeDuration: 'CBT · 5 hrs (2 parts)',
  },
  'neet-mds': {
    conductingBody: 'NBEMS (Nat. Board of Examinations)',
    markingScheme: '+4 per Q · 960 marks (240 Qs)',
    negativeMarking: '-1 (25% negative marking)',
    selectionRatio: '~20%–25% MDS seats',
    difficulty: 'High',
    modeDuration: 'CBT · 3 hours',
  },
  'aiims-nursing': {
    conductingBody: 'AIIMS New Delhi',
    markingScheme: '+1 per Q · 100 marks (100 Qs)',
    negativeMarking: '-1/3 per wrong answer',
    selectionRatio: '~2%–3% (AIIMS B.Sc. Nursing)',
    difficulty: 'Moderate–Hard',
    modeDuration: 'CBT · 2 hours',
  },
  mns: {
    conductingBody: 'Indian Army (DGMS) via NEET UG',
    markingScheme: 'NEET UG + ToGIGE (+2 per Q · 80 marks)',
    negativeMarking: '-0.5 in ToGIGE (-1 in NEET)',
    selectionRatio: '~1%–1.5% (~220 seats)',
    difficulty: 'High',
    modeDuration: 'CBT + Interview',
  },
  gpat: {
    conductingBody: 'NBEMS (Nat. Board of Examinations)',
    markingScheme: '+4 per Q · 500 marks (125 Qs)',
    negativeMarking: '-1 for every wrong answer',
    selectionRatio: '~8%–10% qualified',
    difficulty: 'Moderate–Hard',
    modeDuration: 'CBT · 3 hours',
  },
  'cuet-ug': {
    conductingBody: 'NTA (National Testing Agency)',
    markingScheme: '+5 per Q · 250 marks per domain',
    negativeMarking: '-1 for every wrong answer',
    selectionRatio: '~2%–5% for top DU / BHU colleges',
    difficulty: 'Moderate',
    modeDuration: 'CBT · 60 mins per paper',
  },
  bitsat: {
    conductingBody: 'BITS Pilani',
    markingScheme: '+3 per Q · 390 marks (130 Qs)',
    negativeMarking: '-1 for every wrong answer',
    selectionRatio: '~1%–1.5% (~3,000 BITS seats)',
    difficulty: 'High',
    modeDuration: 'CBT · 3 hours',
  },
  viteee: {
    conductingBody: 'VIT Vellore',
    markingScheme: '+1 per Q · 125 marks (125 Qs)',
    negativeMarking: 'None (No negative marking)',
    selectionRatio: '~10%–15% across VIT campuses',
    difficulty: 'Moderate',
    modeDuration: 'CBT · 2 hrs 30 mins',
  },
  'iiser-iat': {
    conductingBody: 'IISERs (Joint Admissions Committee)',
    markingScheme: '+4 per Q · 240 marks (60 Qs)',
    negativeMarking: '-1 for every wrong answer',
    selectionRatio: '~2%–3% (~1,900 IISER seats)',
    difficulty: 'High',
    modeDuration: 'CBT · 3 hours',
  },
  'mht-cet': {
    conductingBody: 'State CET Cell, Maharashtra',
    markingScheme: '+1 (Phy/Chem) · +2 (Maths) · 200 marks',
    negativeMarking: 'None (No negative marking)',
    selectionRatio: '~12%–18% top state engg colleges',
    difficulty: 'Moderate–Hard',
    modeDuration: 'CBT · 3 hours',
  },
  wbjee: {
    conductingBody: 'WBJEEB (West Bengal Board)',
    markingScheme: '+1 / +2 per Q · 200 marks (155 Qs)',
    negativeMarking: '-1/4 (Cat 1) · -1/2 (Cat 2) · 0 (Cat 3)',
    selectionRatio: '~5%–8% for top Govt engg (JU/CU)',
    difficulty: 'Moderate–Hard',
    modeDuration: 'Pen & Paper (OMR) · 4 hrs',
  },
  nda: {
    conductingBody: 'UPSC (Union Public Service Commission)',
    markingScheme: 'Maths (300) + GAT (600) = 900 marks',
    negativeMarking: '-1/3rd (33% negative marking)',
    selectionRatio: '~0.1% final merit (~400 vacancies)',
    difficulty: 'High',
    modeDuration: 'Pen & Paper · 5 hrs + SSB',
  },
  'cbse-12-science': {
    conductingBody: 'CBSE (Central Board)',
    markingScheme: '70 Theory + 30 Practical = 100/subject',
    negativeMarking: 'None',
    selectionRatio: '~87%–90% pass rate (Score-based)',
    difficulty: 'Moderate',
    modeDuration: 'Written Board · 3 hours',
  },
  'cbse-11-science': {
    conductingBody: 'CBSE Affiliated Schools',
    markingScheme: '70 Theory + 30 Practical = 100/subject',
    negativeMarking: 'None',
    selectionRatio: 'School promotion (33% pass)',
    difficulty: 'Moderate',
    modeDuration: 'Written Exam · 3 hours',
  },
  'cbse-10-boards': {
    conductingBody: 'CBSE (Central Board)',
    markingScheme: '80 Theory + 20 Internal = 100/subject',
    negativeMarking: 'None',
    selectionRatio: '~93% pass rate (Score-based)',
    difficulty: 'Moderate',
    modeDuration: 'Written Board · 3 hours',
  },
  'icse-10-boards': {
    conductingBody: 'CISCE (Council for Indian School Cert.)',
    markingScheme: '80 Theory + 20 Internal = 100/subject',
    negativeMarking: 'None',
    selectionRatio: '~99% pass rate (Score-based)',
    difficulty: 'Moderate–Hard',
    modeDuration: 'Written Board · 2–2.5 hrs',
  },
  'isc-12-science': {
    conductingBody: 'CISCE (Council for Indian School Cert.)',
    markingScheme: '70 Theory + 30 Practical = 100/subject',
    negativeMarking: 'None',
    selectionRatio: '~98% pass rate (Score-based)',
    difficulty: 'Moderate–Hard',
    modeDuration: 'Written Board · 3 hours',
  },
  'isc-11-science': {
    conductingBody: 'CISCE Affiliated Schools',
    markingScheme: '70 Theory + 30 Practical = 100/subject',
    negativeMarking: 'None',
    selectionRatio: 'School promotion (35% pass)',
    difficulty: 'Moderate–Hard',
    modeDuration: 'Written Exam · 3 hours',
  },
  'mpbse-12-science': {
    conductingBody: 'MPBSE (Madhya Pradesh Board)',
    markingScheme: '70 Theory + 30 Practical = 100/subject',
    negativeMarking: 'None',
    selectionRatio: '~65%–75% pass rate (Score-based)',
    difficulty: 'Moderate',
    modeDuration: 'Written Board · 3 hours',
  },
  'mpbse-11-science': {
    conductingBody: 'MPBSE Schools',
    markingScheme: '70 Theory + 30 Practical = 100/subject',
    negativeMarking: 'None',
    selectionRatio: 'School promotion (33% pass)',
    difficulty: 'Moderate',
    modeDuration: 'Written Exam · 3 hours',
  },
  'mpbse-10-boards': {
    conductingBody: 'MPBSE (Madhya Pradesh Board)',
    markingScheme: '75 Theory + 25 Practical = 100/subject',
    negativeMarking: 'None',
    selectionRatio: '~60%–70% pass rate (Score-based)',
    difficulty: 'Moderate',
    modeDuration: 'Written Board · 3 hours',
  },
  'rbse-12-science': {
    conductingBody: 'BSER / RBSE (Rajasthan Board, Ajmer)',
    markingScheme: '56 Theory + 14 Sess + 30 Prac = 100',
    negativeMarking: 'None',
    selectionRatio: '~95%–97% Science pass rate',
    difficulty: 'Moderate',
    modeDuration: 'Written Board · 3 hrs 15 mins',
  },
  'rbse-11-science': {
    conductingBody: 'RBSE Affiliated Schools',
    markingScheme: '70 Theory + 30 Practical = 100/subject',
    negativeMarking: 'None',
    selectionRatio: 'School promotion (33% pass)',
    difficulty: 'Moderate',
    modeDuration: 'Written Exam · 3 hrs 15 mins',
  },
  'rbse-10-boards': {
    conductingBody: 'BSER / RBSE (Rajasthan Board, Ajmer)',
    markingScheme: '80 Theory + 20 Sessional = 100/subject',
    negativeMarking: 'None',
    selectionRatio: '~90%–93% pass rate',
    difficulty: 'Moderate',
    modeDuration: 'Written Board · 3 hrs 15 mins',
  },
  'up-12-science': {
    conductingBody: 'UPMSP (UP Board, Prayagraj)',
    markingScheme: '70 Theory + 30 Practical = 100/subject',
    negativeMarking: 'None',
    selectionRatio: '~80%–83% pass rate',
    difficulty: 'Moderate',
    modeDuration: 'Written Board · 3 hrs 15 mins',
  },
  'up-11-science': {
    conductingBody: 'UPMSP Schools',
    markingScheme: '70 Theory + 30 Practical = 100/subject',
    negativeMarking: 'None',
    selectionRatio: 'School promotion (33% pass)',
    difficulty: 'Moderate',
    modeDuration: 'Written Exam · 3 hrs 15 mins',
  },
  'bseb-12-science': {
    conductingBody: 'BSEB (Bihar School Exam Board)',
    markingScheme: '70 Theory + 30 Practical (50% MCQ)',
    negativeMarking: 'None',
    selectionRatio: '~85%–88% pass rate',
    difficulty: 'Moderate',
    modeDuration: 'Written + OMR · 3 hrs 15 mins',
  },
  'maharashtra-12-science': {
    conductingBody: 'MSBSHSE (Maharashtra State Board)',
    markingScheme: '70 Theory + 30 Practical = 100/subject',
    negativeMarking: 'None',
    selectionRatio: '~93%–97% Science pass rate',
    difficulty: 'Moderate',
    modeDuration: 'Written Board · 3 hours',
  },
  'ntse-foundation': {
    conductingBody: 'NCERT / HBCSE (Olympiads)',
    markingScheme: '+1 per Q · 200 marks (MAT + SAT)',
    negativeMarking: 'None in NTSE (varies in IOQM/NSEJS)',
    selectionRatio: '~0.2%–0.5% national scholars',
    difficulty: 'High',
    modeDuration: 'Pen & Paper · 4 hours',
  },
  clat: {
    conductingBody: 'Consortium of NLUs',
    markingScheme: '+1 per Q · 120 marks (120 Qs)',
    negativeMarking: '-0.25 for every wrong answer',
    selectionRatio: '~4%–5% NLU seats (~70k test-takers)',
    difficulty: 'Moderate–Hard',
    modeDuration: 'Pen & Paper · 2 hours',
  },
  cat: {
    conductingBody: 'IIMs (Rotating IIM)',
    markingScheme: '+3 per Q · ~204 marks (68 Qs)',
    negativeMarking: '-1 on MCQs (0 on TITA)',
    selectionRatio: '~1%–2% for top IIMs (~3.2L test-takers)',
    difficulty: 'Very High',
    modeDuration: 'CBT · 2 hours',
  },
  sat: {
    conductingBody: 'College Board (USA)',
    markingScheme: '400–1600 scale (RW + Math)',
    negativeMarking: 'None (No penalty for guessing)',
    selectionRatio: 'Score-based (1450+ = top 3%)',
    difficulty: 'Moderate–Hard',
    modeDuration: 'Adaptive Digital · 2 hrs 14 mins',
  },
  gate: {
    conductingBody: 'IISc / Rotating IIT',
    markingScheme: '+1 / +2 per Q · 100 marks (65 Qs)',
    negativeMarking: '-1/3 (1-mark) · -2/3 (2-mark MCQ)',
    selectionRatio: '~15% qualify · ~1%–2% top IIT/PSU',
    difficulty: 'Very High',
    modeDuration: 'CBT · 3 hours',
  },
  'ashoka-aat': {
    conductingBody: 'Ashoka University',
    markingScheme: '40 Objective Qs + On-the-spot Essay',
    negativeMarking: 'None (No negative marking)',
    selectionRatio: '~10%–15% admission + interview',
    difficulty: 'Moderate–Hard',
    modeDuration: 'Online Proctored · 1 hr 45 mins',
  },
  'upsc-cse': {
    conductingBody: 'UPSC (Union Public Service Commission)',
    markingScheme: 'Prelims (400) · Mains+Interview (2025)',
    negativeMarking: '-1/3rd in Prelims (GS & CSAT)',
    selectionRatio: '~0.1% (~1,000 services / ~10L applicants)',
    difficulty: 'Very High',
    modeDuration: 'Offline (3-stage exam)',
  },
  'ssc-cgl': {
    conductingBody: 'SSC (Staff Selection Commission)',
    markingScheme: 'Tier 1 (200) · Tier 2 (390+ marks)',
    negativeMarking: '-0.5 (Tier 1) · -1 (Tier 2)',
    selectionRatio: '~0.5%–1% (~17k posts / ~30L applicants)',
    difficulty: 'Moderate–Hard',
    modeDuration: 'CBT · 60 mins (T1) / 2.5 hrs (T2)',
  },
  'ca-foundation': {
    conductingBody: 'ICAI (Inst. of Chartered Accountants)',
    markingScheme: '4 Papers × 100 = 400 marks (40%/50% pass)',
    negativeMarking: '-0.25 in Papers 3 & 4 (Objective)',
    selectionRatio: '~15%–25% pass rate per attempt',
    difficulty: 'High',
    modeDuration: 'Pen & Paper · 2–3 hrs/paper',
  },
  xat: {
    conductingBody: 'XLRI Jamshedpur',
    markingScheme: '+1 per Q · ~95–100 Qs + Essay/GK',
    negativeMarking: '-0.25 per wrong (-0.10 after 8 unattempted)',
    selectionRatio: '~1%–2% for XLRI (~1.3L test-takers)',
    difficulty: 'Very High',
    modeDuration: 'CBT · 3 hours',
  },
  cds: {
    conductingBody: 'UPSC (Union Public Service Commission)',
    markingScheme: '300 marks (IMA/INA/AFA) · 200 (OTA)',
    negativeMarking: '-1/3rd per wrong answer',
    selectionRatio: '~0.2% final merit (~450 vacancies)',
    difficulty: 'High',
    modeDuration: 'Pen & Paper · 6 hrs + SSB',
  },
  mext: {
    conductingBody: 'MEXT (Govt of Japan / Embassy)',
    markingScheme: 'Written Subject Tests + Interview',
    negativeMarking: 'None (Evaluation-based)',
    selectionRatio: '<1% (Highly selective Embassy track)',
    difficulty: 'Very High',
    modeDuration: 'Written + Embassy Interview',
  },
  'nstse-scholarship': {
    conductingBody: 'Unified Council (India)',
    markingScheme: '+1 per Q · 60 marks (60 Qs)',
    negativeMarking: 'None (No negative marking)',
    selectionRatio: '~1%–3% national top rankers',
    difficulty: 'Moderate–Hard',
    modeDuration: 'Offline / Online · 60 mins',
  },
  ipmat: {
    conductingBody: 'IIM Indore / IIM Rohtak',
    markingScheme: '+4 per Q · 360 marks (Indore)',
    negativeMarking: '-1 per wrong MCQ (0 on Short Answer)',
    selectionRatio: '~1% (~150 seats / ~25k+ applicants)',
    difficulty: 'High',
    modeDuration: 'CBT · 2 hours + Interview',
  },
  'comedk-kcet': {
    conductingBody: 'COMEDK / KEA (Karnataka)',
    markingScheme: '+1 per Q · 180 marks (180 Qs)',
    negativeMarking: 'None (No negative marking)',
    selectionRatio: '~5%–10% top Bengaluru engg colleges',
    difficulty: 'Moderate–Hard',
    modeDuration: 'CBT (COMEDK) / OMR (KCET) · 3 hrs',
  },
  nest: {
    conductingBody: 'NISER & UM-DAE CEBS',
    markingScheme: '+2.5 / +4 per Q · 200 marks (Best 3 of 4)',
    negativeMarking: '-1 on single-choice MCQs',
    selectionRatio: '~0.5%–1% (~257 seats)',
    difficulty: 'Very High',
    modeDuration: 'CBT · 3 hrs 30 mins',
  },
  afcat: {
    conductingBody: 'Indian Air Force (IAF)',
    markingScheme: '+3 per Q · 300 marks (100 Qs)',
    negativeMarking: '-1 for every wrong answer',
    selectionRatio: '~0.3% final merit (~300 vacancies)',
    difficulty: 'Moderate–Hard',
    modeDuration: 'CBT · 2 hours + AFSB',
  },
  'ibps-po': {
    conductingBody: 'IBPS / SBI',
    markingScheme: 'Prelims (100) · Mains (200 + 25 Desc)',
    negativeMarking: '-0.25 (25% negative marking)',
    selectionRatio: '~0.8%–1.5% (~4,000–5,000 posts)',
    difficulty: 'Moderate–Hard',
    modeDuration: 'CBT + Interview',
  },
  'inspire-she': {
    conductingBody: 'DST, Govt of India',
    markingScheme: 'Top 1% Class 12 Board / JEE-NEET Rank',
    negativeMarking: 'N/A (Merit scholarship selection)',
    selectionRatio: 'Top 1% Board / Top 10k JEE-NEET',
    difficulty: 'High',
    modeDuration: 'Merit-based (₹80,000/yr)',
  },
  jbnsts: {
    conductingBody: 'JBNSTS Kolkata (Govt of WB / DST)',
    markingScheme: 'Written Subjective + Objective + Interview',
    negativeMarking: 'None',
    selectionRatio: '~2%–4% (~200–300 scholars)',
    difficulty: 'High',
    modeDuration: 'Written Test + Interview',
  },
  nmms: {
    conductingBody: 'SCERT / State Govts (MoE, India)',
    markingScheme: '+1 per Q · 180 marks (90 MAT + 90 SAT)',
    negativeMarking: 'None (No negative marking)',
    selectionRatio: '~5%–8% (1,00,000 scholarships/yr)',
    difficulty: 'Moderate',
    modeDuration: 'Pen & Paper (OMR) · 3 hours',
  },
  'anthe-tallentex': {
    conductingBody: 'Aakash (ANTHE) / ALLEN (TALLENTEX)',
    markingScheme: '+4 per Q (varies by class)',
    negativeMarking: 'None (usually no negative marking)',
    selectionRatio: '~5%–15% scholarship tiers',
    difficulty: 'Moderate–Hard',
    modeDuration: 'Online / Offline · 1–2 hrs',
  },
};

export function getExamPattern(examId: string): ExamPatternInfo {
  return (
    EXAM_PATTERNS[examId] ?? {
      conductingBody: 'National / State Exam Authority',
      markingScheme: 'Objective / Descriptive Pattern',
      negativeMarking: 'Check official notification',
      selectionRatio: 'Merit-based selection',
      difficulty: 'Moderate–Hard',
      modeDuration: 'Standard Exam Format',
    }
  );
}



