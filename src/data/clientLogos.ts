export type ClientLogo = {
  name: string;
  src: string;
  alt: string;
};

const logo = (name: string) =>
  `https://placehold.co/200x60/F6F6F6/939393/png?text=${encodeURIComponent(name)}`;

export const clientLogos: ClientLogo[] = [
  { name: 'SMC', src: logo('SMC'), alt: 'SMC' },
  { name: 'OECD Korea', src: logo('OECD'), alt: 'OECD Korea' },
  { name: '한일원자력', src: logo('HANIL+NUC'), alt: '한일원자력' },
  { name: 'Galux', src: logo('Galux'), alt: 'Galux' },
  { name: 'FASTFIVE C&D', src: logo('FASTFIVE'), alt: 'FASTFIVE C&D' },
  { name: '크리스천메이트', src: logo('Christian+Mate'), alt: '크리스천메이트' },
  { name: 'NKS', src: logo('NKS'), alt: 'NKS' },
  { name: '디알코디', src: logo('DR+CODI'), alt: '디알코디' },
  { name: '브레인맵', src: logo('BrainMap'), alt: '브레인맵' },
  { name: '문화체육관광부', src: logo('MCST'), alt: '문화체육관광부' },
  { name: 'RadiSen', src: logo('RadiSen'), alt: 'RadiSen' },
  { name: 'Medical Korea', src: logo('Medical+KR'), alt: 'Medical Korea' },
  { name: 'NovaDO', src: logo('NovaDO'), alt: 'NovaDO' },
  { name: 'X-LOG', src: logo('X-LOG'), alt: 'X-LOG' },
  { name: 'Virex', src: logo('Virex'), alt: 'Virex' },
  { name: 'S-COM Tech', src: logo('S-COM'), alt: 'S-COM Tech' },
  { name: 'Nordinary', src: logo('Nordinary'), alt: 'Nordinary' },
  { name: 'AZgram', src: logo('AZgram'), alt: 'AZgram' },
  { name: '에코커피컴', src: logo('Eco+Coffee'), alt: '에코커피컴' },
  { name: '과학의전당', src: logo('SAC'), alt: '과학의전당' },
  { name: 'GRTH DesignLab', src: logo('GRTH'), alt: 'GRTH DesignLab' },
];
