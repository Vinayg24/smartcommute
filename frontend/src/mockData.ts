export type Role = 'ADMIN' | 'EMPLOYEE';

export interface HomeLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface MockEmployee {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  employeeId: string;
  phone: string;
  homeLocation: HomeLocation;
}

export interface MockOffice {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  capacity: number;
}

export type DemandStatus = 'PENDING' | 'APPROVED' | 'MATCHED' | 'COMPLETED';
export type CrowdLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface MockDemandRequest {
  id: string;
  employeeId: string;
  officeId: string;
  from: string;
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // HH:mm
  distance: number;
  status: DemandStatus;
  crowd: CrowdLevel;
  costSaved: number;
  co2Reduced: number;
}

export interface MockSharingGroup {
  id: string;
  officeId: string;
  members: string[]; // employeeIds
  route: string;
  status: 'ACTIVE' | 'COMPLETED';
  date: string;
}

export interface MockOfficeCrowd {
  officeId: string;
  level: CrowdLevel;
  percentage: number;
  count: number;
}

export interface MockDailyStat {
  date: string;
  requests: number;
  matches: number;
  costSaved: number;
  co2Reduced: number;
}

export const mockEmployees: MockEmployee[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@smartcommute.com',
    role: 'ADMIN',
    department: 'Engineering',
    employeeId: 'ADM001',
    phone: '+91 90000 00001',
    homeLocation: {
      lat: 19.076,
      lng: 72.8777,
      address: 'Andheri West, Mumbai',
    },
  },
  {
    id: 'user-1',
    name: 'Rahul Sharma',
    email: 'rahul@smartcommute.com',
    role: 'EMPLOYEE',
    department: 'Engineering',
    employeeId: 'EMP001',
    phone: '+91 90000 00002',
    homeLocation: {
      lat: 19.1136,
      lng: 72.8697,
      address: 'Borivali East, Mumbai',
    },
  },
  {
    id: 'user-2',
    name: 'Priya Mehta',
    email: 'priya@smartcommute.com',
    role: 'EMPLOYEE',
    department: 'Design',
    employeeId: 'EMP002',
    phone: '+91 90000 00003',
    homeLocation: {
      lat: 19.0544,
      lng: 72.8322,
      address: 'Bandra West, Mumbai',
    },
  },
  {
    id: 'user-3',
    name: 'Arjun Patel',
    email: 'arjun@smartcommute.com',
    role: 'EMPLOYEE',
    department: 'Product',
    employeeId: 'EMP003',
    phone: '+91 90000 00004',
    homeLocation: {
      lat: 19.0728,
      lng: 72.8826,
      address: 'Powai, Mumbai',
    },
  },
  {
    id: 'user-4',
    name: 'Sneha Reddy',
    email: 'sneha@smartcommute.com',
    role: 'EMPLOYEE',
    department: 'Marketing',
    employeeId: 'EMP004',
    phone: '+91 90000 00005',
    homeLocation: {
      lat: 19.033,
      lng: 73.0297,
      address: 'Navi Mumbai',
    },
  },
  {
    id: 'user-5',
    name: 'Vikram Singh',
    email: 'vikram@smartcommute.com',
    role: 'EMPLOYEE',
    department: 'Sales',
    employeeId: 'EMP005',
    phone: '+91 90000 00006',
    homeLocation: {
      lat: 19.1663,
      lng: 72.9493,
      address: 'Thane West',
    },
  },
  {
    id: 'user-6',
    name: 'Kavya Nair',
    email: 'kavya@smartcommute.com',
    role: 'EMPLOYEE',
    department: 'HR',
    employeeId: 'EMP006',
    phone: '+91 90000 00007',
    homeLocation: {
      lat: 19.0176,
      lng: 72.8562,
      address: 'Kurla, Mumbai',
    },
  },
  {
    id: 'user-7',
    name: 'Rohit Gupta',
    email: 'rohit@smartcommute.com',
    role: 'EMPLOYEE',
    department: 'Finance',
    employeeId: 'EMP007',
    phone: '+91 90000 00008',
    homeLocation: {
      lat: 18.9647,
      lng: 72.8258,
      address: 'Colaba, Mumbai',
    },
  },
  {
    id: 'user-8',
    name: 'Ananya Iyer',
    email: 'ananya@smartcommute.com',
    role: 'EMPLOYEE',
    department: 'Engineering',
    employeeId: 'EMP008',
    phone: '+91 90000 00009',
    homeLocation: {
      lat: 19.0895,
      lng: 72.8656,
      address: 'Goregaon East, Mumbai',
    },
  },
  {
    id: 'user-9',
    name: 'Deepak Kumar',
    email: 'deepak@smartcommute.com',
    role: 'EMPLOYEE',
    department: 'Design',
    employeeId: 'EMP009',
    phone: '+91 90000 00010',
    homeLocation: {
      lat: 19.1075,
      lng: 72.8263,
      address: 'Malad West, Mumbai',
    },
  },
  {
    id: 'user-10',
    name: 'Pooja Shah',
    email: 'pooja@smartcommute.com',
    role: 'EMPLOYEE',
    department: 'Product',
    employeeId: 'EMP010',
    phone: '+91 90000 00011',
    homeLocation: {
      lat: 19.0759,
      lng: 72.9078,
      address: 'Vikhroli, Mumbai',
    },
  },
  {
    id: 'user-11',
    name: 'Amit Joshi',
    email: 'amit@smartcommute.com',
    role: 'EMPLOYEE',
    department: 'Marketing',
    employeeId: 'EMP011',
    phone: '+91 90000 00012',
    homeLocation: {
      lat: 19.1307,
      lng: 72.9152,
      address: 'Mulund West, Mumbai',
    },
  },
];

export const mockOffices: MockOffice[] = [
  {
    id: 'office-1',
    name: 'BKC HQ',
    address: 'Bandra Kurla Complex, Mumbai 400051',
    lat: 19.0659,
    lng: 72.8682,
    capacity: 200,
  },
  {
    id: 'office-2',
    name: 'Powai Tech Park',
    address: 'Hiranandani Gardens, Powai, Mumbai 400076',
    lat: 19.1197,
    lng: 72.9051,
    capacity: 150,
  },
  {
    id: 'office-3',
    name: 'Lower Parel Hub',
    address: 'Lower Parel, Mumbai 400013',
    lat: 18.9929,
    lng: 72.8332,
    capacity: 100,
  },
];

export const mockDemandRequests: MockDemandRequest[] = [
  { id: 'req-1', employeeId: 'user-1', officeId: 'office-1', from: 'Borivali East, Mumbai', date: '2026-03-10', time: '09:00', distance: 18.4, status: 'COMPLETED', crowd: 'LOW', costSaved: 280, co2Reduced: 1.2 },
  { id: 'req-2', employeeId: 'user-2', officeId: 'office-1', from: 'Bandra West, Mumbai', date: '2026-03-10', time: '09:30', distance: 4.2, status: 'MATCHED', crowd: 'MEDIUM', costSaved: 120, co2Reduced: 0.5 },
  { id: 'req-3', employeeId: 'user-3', officeId: 'office-2', from: 'Powai, Mumbai', date: '2026-03-10', time: '08:30', distance: 3.1, status: 'APPROVED', crowd: 'LOW', costSaved: 90, co2Reduced: 0.4 },
  { id: 'req-4', employeeId: 'user-4', officeId: 'office-1', from: 'Navi Mumbai', date: '2026-03-10', time: '09:00', distance: 22.7, status: 'PENDING', crowd: 'HIGH', costSaved: 0, co2Reduced: 0 },
  { id: 'req-5', employeeId: 'user-5', officeId: 'office-3', from: 'Thane West', date: '2026-03-10', time: '08:00', distance: 28.3, status: 'MATCHED', crowd: 'MEDIUM', costSaved: 350, co2Reduced: 1.8 },
  { id: 'req-6', employeeId: 'user-6', officeId: 'office-1', from: 'Kurla, Mumbai', date: '2026-03-09', time: '09:30', distance: 6.8, status: 'COMPLETED', crowd: 'LOW', costSaved: 160, co2Reduced: 0.7 },
  { id: 'req-7', employeeId: 'user-7', officeId: 'office-2', from: 'Colaba, Mumbai', date: '2026-03-09', time: '09:00', distance: 31.2, status: 'COMPLETED', crowd: 'MEDIUM', costSaved: 420, co2Reduced: 2.1 },
  { id: 'req-8', employeeId: 'user-8', officeId: 'office-1', from: 'Goregaon East, Mumbai', date: '2026-03-09', time: '08:30', distance: 14.6, status: 'MATCHED', crowd: 'LOW', costSaved: 220, co2Reduced: 1.0 },
  { id: 'req-9', employeeId: 'user-9', officeId: 'office-3', from: 'Malad West, Mumbai', date: '2026-03-09', time: '09:00', distance: 16.9, status: 'APPROVED', crowd: 'HIGH', costSaved: 0, co2Reduced: 0 },
  { id: 'req-10', employeeId: 'user-10', officeId: 'office-1', from: 'Vikhroli, Mumbai', date: '2026-03-08', time: '09:30', distance: 8.3, status: 'COMPLETED', crowd: 'LOW', costSaved: 180, co2Reduced: 0.8 },
  { id: 'req-11', employeeId: 'user-11', officeId: 'office-2', from: 'Mulund West, Mumbai', date: '2026-03-08', time: '08:00', distance: 12.1, status: 'COMPLETED', crowd: 'MEDIUM', costSaved: 200, co2Reduced: 0.9 },
  { id: 'req-12', employeeId: 'user-1', officeId: 'office-1', from: 'Borivali East, Mumbai', date: '2026-03-08', time: '09:00', distance: 18.4, status: 'COMPLETED', crowd: 'LOW', costSaved: 280, co2Reduced: 1.2 },
  { id: 'req-13', employeeId: 'user-2', officeId: 'office-3', from: 'Bandra West, Mumbai', date: '2026-03-07', time: '09:30', distance: 4.8, status: 'COMPLETED', crowd: 'LOW', costSaved: 130, co2Reduced: 0.6 },
  { id: 'req-14', employeeId: 'user-3', officeId: 'office-1', from: 'Powai, Mumbai', date: '2026-03-07', time: '08:30', distance: 9.4, status: 'MATCHED', crowd: 'MEDIUM', costSaved: 190, co2Reduced: 0.9 },
  { id: 'req-15', employeeId: 'user-4', officeId: 'office-2', from: 'Navi Mumbai', date: '2026-03-07', time: '09:00', distance: 26.1, status: 'COMPLETED', crowd: 'LOW', costSaved: 380, co2Reduced: 1.9 },
  { id: 'req-16', employeeId: 'user-5', officeId: 'office-1', from: 'Thane West', date: '2026-03-06', time: '08:00', distance: 28.3, status: 'COMPLETED', crowd: 'HIGH', costSaved: 350, co2Reduced: 1.8 },
  { id: 'req-17', employeeId: 'user-6', officeId: 'office-1', from: 'Kurla, Mumbai', date: '2026-03-06', time: '09:30', distance: 6.8, status: 'COMPLETED', crowd: 'LOW', costSaved: 160, co2Reduced: 0.7 },
  { id: 'req-18', employeeId: 'user-7', officeId: 'office-2', from: 'Colaba, Mumbai', date: '2026-03-06', time: '09:00', distance: 31.2, status: 'MATCHED', crowd: 'MEDIUM', costSaved: 420, co2Reduced: 2.1 },
  { id: 'req-19', employeeId: 'user-8', officeId: 'office-3', from: 'Goregaon East, Mumbai', date: '2026-03-05', time: '08:30', distance: 19.8, status: 'COMPLETED', crowd: 'LOW', costSaved: 290, co2Reduced: 1.4 },
  { id: 'req-20', employeeId: 'user-9', officeId: 'office-1', from: 'Malad West, Mumbai', date: '2026-03-05', time: '09:00', distance: 16.9, status: 'COMPLETED', crowd: 'MEDIUM', costSaved: 250, co2Reduced: 1.1 },
  { id: 'req-21', employeeId: 'user-10', officeId: 'office-2', from: 'Vikhroli, Mumbai', date: '2026-03-05', time: '09:30', distance: 11.7, status: 'COMPLETED', crowd: 'LOW', costSaved: 210, co2Reduced: 1.0 },
  { id: 'req-22', employeeId: 'user-11', officeId: 'office-1', from: 'Mulund West, Mumbai', date: '2026-03-04', time: '08:00', distance: 12.1, status: 'COMPLETED', crowd: 'COMPLETED', costSaved: 200, co2Reduced: 0.9 },
  { id: 'req-23', employeeId: 'user-1', officeId: 'office-3', from: 'Borivali East, Mumbai', date: '2026-03-04', time: '09:00', distance: 22.6, status: 'COMPLETED', crowd: 'MEDIUM', costSaved: 320, co2Reduced: 1.5 },
  { id: 'req-24', employeeId: 'user-2', officeId: 'office-1', from: 'Bandra West, Mumbai', date: '2026-03-04', time: '09:30', distance: 4.2, status: 'MATCHED', crowd: 'LOW', costSaved: 120, co2Reduced: 0.5 },
  { id: 'req-25', employeeId: 'user-3', officeId: 'office-2', from: 'Powai, Mumbai', date: '2026-03-03', time: '08:30', distance: 3.1, status: 'COMPLETED', crowd: 'LOW', costSaved: 90, co2Reduced: 0.4 },
  { id: 'req-26', employeeId: 'user-4', officeId: 'office-1', from: 'Navi Mumbai', date: '2026-03-03', time: '09:00', distance: 22.7, status: 'COMPLETED', crowd: 'HIGH', costSaved: 340, co2Reduced: 1.7 },
  { id: 'req-27', employeeId: 'user-5', officeId: 'office-3', from: 'Thane West', date: '2026-03-03', time: '08:00', distance: 28.3, status: 'COMPLETED', crowd: 'MEDIUM', costSaved: 350, co2Reduced: 1.8 },
  { id: 'req-28', employeeId: 'user-6', officeId: 'office-2', from: 'Kurla, Mumbai', date: '2026-03-02', time: '09:30', distance: 14.2, status: 'COMPLETED', crowd: 'LOW', costSaved: 230, co2Reduced: 1.1 },
  { id: 'req-29', employeeId: 'user-7', officeId: 'office-1', from: 'Colaba, Mumbai', date: '2026-03-02', time: '09:00', distance: 17.8, status: 'COMPLETED', crowd: 'MEDIUM', costSaved: 270, co2Reduced: 1.3 },
  { id: 'req-30', employeeId: 'user-8', officeId: 'office-1', from: 'Goregaon East, Mumbai', date: '2026-03-02', time: '08:30', distance: 14.6, status: 'COMPLETED', crowd: 'LOW', costSaved: 220, co2Reduced: 1.0 },
];

export const mockSharingGroups: MockSharingGroup[] = [
  { id: 'group-1', officeId: 'office-1', members: ['user-1', 'user-6', 'user-8'], route: 'Borivali → Goregaon → Kurla → BKC', status: 'ACTIVE', date: '2026-03-10' },
  { id: 'group-2', officeId: 'office-1', members: ['user-2', 'user-10'], route: 'Bandra → Vikhroli → BKC', status: 'ACTIVE', date: '2026-03-10' },
  { id: 'group-3', officeId: 'office-2', members: ['user-3', 'user-11'], route: 'Mulund → Powai Tech Park', status: 'ACTIVE', date: '2026-03-10' },
  { id: 'group-4', officeId: 'office-3', members: ['user-5', 'user-9'], route: 'Thane → Malad → Lower Parel', status: 'ACTIVE', date: '2026-03-10' },
  { id: 'group-5', officeId: 'office-1', members: ['user-4', 'user-7'], route: 'Navi Mumbai → Colaba → BKC', status: 'ACTIVE', date: '2026-03-10' },
  { id: 'group-6', officeId: 'office-2', members: ['user-8', 'user-9', 'user-10'], route: 'Goregaon → Malad → Vikhroli → Powai', status: 'ACTIVE', date: '2026-03-09' },
  { id: 'group-7', officeId: 'office-1', members: ['user-11', 'user-1'], route: 'Mulund → Borivali → BKC', status: 'COMPLETED', date: '2026-03-09' },
  { id: 'group-8', officeId: 'office-3', members: ['user-2', 'user-6', 'user-7'], route: 'Bandra → Kurla → Colaba → Lower Parel', status: 'COMPLETED', date: '2026-03-08' },
];

export const mockOfficeCrowd: MockOfficeCrowd[] = [
  { officeId: 'office-1', level: 'MEDIUM', percentage: 68, count: 136 },
  { officeId: 'office-2', level: 'LOW', percentage: 34, count: 51 },
  { officeId: 'office-3', level: 'HIGH', percentage: 87, count: 87 },
];

export const mockDailyStats: MockDailyStat[] = [
  { date: '2026-02-25', requests: 18, matches: 12, costSaved: 3200, co2Reduced: 14.2 },
  { date: '2026-02-26', requests: 22, matches: 16, costSaved: 3800, co2Reduced: 17.1 },
  { date: '2026-02-27', requests: 15, matches: 10, costSaved: 2600, co2Reduced: 11.8 },
  { date: '2026-02-28', requests: 24, matches: 18, costSaved: 4100, co2Reduced: 18.6 },
  { date: '2026-03-01', requests: 20, matches: 14, costSaved: 3500, co2Reduced: 15.9 },
  { date: '2026-03-02', requests: 26, matches: 19, costSaved: 4400, co2Reduced: 19.8 },
  { date: '2026-03-03', requests: 28, matches: 21, costSaved: 4800, co2Reduced: 21.7 },
  { date: '2026-03-04', requests: 23, matches: 17, costSaved: 3900, co2Reduced: 17.6 },
  { date: '2026-03-05', requests: 30, matches: 22, costSaved: 5100, co2Reduced: 23.1 },
  { date: '2026-03-06', requests: 27, matches: 20, costSaved: 4600, co2Reduced: 20.8 },
  { date: '2026-03-07', requests: 25, matches: 18, costSaved: 4200, co2Reduced: 19.0 },
  { date: '2026-03-08', requests: 29, matches: 22, costSaved: 5000, co2Reduced: 22.6 },
  { date: '2026-03-09', requests: 31, matches: 24, costSaved: 5400, co2Reduced: 24.4 },
  { date: '2026-03-10', requests: 24, matches: 8, costSaved: 1160, co2Reduced: 5.2 },
];

