
import { Service } from './types';

export const SERVICES: Service[] = [
  {
    id: 'e960d0f1-caeb-4937-a628-32a7783d7141',
    name: 'Alongamento Molde F1',
    price: 180,
    description: 'Técnica moderna e ágil para extensões impecáveis com acabamento natural e duradouro.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpftLyEknKMbCRyNMgt7TKzIqV7RK3uTLnz8jJQbhWfP8wjJj-Golo9QgEFRcBJzWRXslE_AQPQyew1PLPmfQdCdFS_W4YFShJNyhfR7Xut4Ml01nLqB7P3S05_YAmPqx1w2ukp4yMR3bbiD4gHoCxnsC8jTyNRqvPLoQWk_DTM6fpDjyzEY8nHTqtrmiDEd1d3WKX-qj9BIdItJbk4DJ98d3B5AZRbGSgdRs1PO8Mq6DtlVhg5nuK7iJEAiFir8udeFAPrlv2hWf0',
    popular: true
  },
  {
    id: 'bfd7bbfa-fd37-4450-ae12-1fe559b7ab34',
    name: 'Esmaltação em Gel na Unha Natural',
    price: 220,
    description: 'Brilho intenso e durabilidade superior para suas unhas naturais sem descascar por semanas.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfi2pvTG4fnjaYfg_ls95HIeCTrWTdXaYQavN9U1Tlvev1G1ojs4Ym-Y4LrtChLaKVOQg0IwFHIXZUHy1peMK9PoHlwrTBp5k22O5oQN0nIeKd0qA85qQNC11y_RbLAG-yVKe0CUAn93WDe6skyEzYOChuzA0GJXIuSCL4eMhmyDk_KGkRLK8BY5V7rpRwWV2WqmUoByJDTu_mU2xEWdz-O9MiuGaVos_A1c-2SwvXsRTIUSY93lH8GTeEbMfQ3ufWsP7MTHAfwoDO',
  },
  {
    id: 'faec1306-bc83-4f52-a9eb-a8990a33b6d2',
    name: 'Banho de Gel',
    price: 150,
    description: 'Capa seladora de gel sobre a unha natural para garantir força, resistência e um acabamento perfeito.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyDfQOJZdZr4teqJC-ZFYFCXZ6wmRpw2mGNZLjheUQL_b1TlD8ynV9EB5dEIaWqqSnX8OvTIfPBmdgrw5qlxXd4sYE6TgEFOKOjwYcdiGYSU-h49uq3klXuYLag_nKlbtu1Jodw5O0X1uQBdyeH3qL3N9cVGu4sF0zoPnbH-Zg86EuzQORqmJ35JallLb3Fc8zyFWxpJpZNaYHFO0-yJkm9Ewt0Zwmefr2OgZlYtGgtklU0Xf0Nz-NoamIzrrD4HAwsYMYtCEFHGoX',
  },
  {
    id: '3a233b06-fd6a-4185-985d-52d9f837723c',
    name: 'Blindagem Em Gel',
    price: 180,
    description: 'Reforce suas unhas naturais com uma camada protetora de gel, ideal para quem busca durabilidade e brilho.',
    image: 'https://images.unsplash.com/photo-1632345031435-072706333555?q=80&w=1470&auto=format&fit=crop',
  }
];

export const TIME_SLOTS = [
  '09:00', '10:30', '13:00', '14:30', '16:00', '19:00'
];

export const CALENDAR_DAYS = [
  { day: 1, available: false }, { day: 2, available: false }, { day: 3, available: false }, { day: 4, available: true },
  { day: 5, available: true }, { day: 6, available: true }, { day: 7, available: true }, { day: 8, available: true },
  { day: 9, available: true }, { day: 10, available: true }, { day: 11, available: true }, { day: 12, available: true },
  { day: 13, available: true }, { day: 14, available: true }, { day: 15, available: true }
];
