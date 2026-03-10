import {
  mockDailyStats,
  mockDemandRequests,
  mockEmployees,
  mockOfficeCrowd,
  mockOffices,
  mockSharingGroups,
} from '@/mockData';

// Mutable copies so we can simulate stateful operations
let demandRequests = [...mockDemandRequests];
let sharingGroups = [...mockSharingGroups];

// ── Auth API (mock) ──────────────────────────────────────────
export const authAPI = {
  login: async (email: string, password: string) => {
    // Actual auth is handled in AuthContext; this is a no-op helper.
    return { data: { user: null, token: 'mock-token', email, password } };
  },
  logout: async () => {
    return { data: { success: true } };
  },
  getProfile: async () => {
    return { data: null };
  },
};

// ── Office API (mock) ────────────────────────────────────────
export const officeAPI = {
  getAll: async () => ({ data: mockOffices }),
  getById: async (id: string) => ({
    data: mockOffices.find((o) => o.id === id) ?? null,
  }),
  getCrowd: async (id: string) => ({
    data: mockOfficeCrowd.find((c) => c.officeId === id) ?? null,
  }),
  getAllCrowd: async () => ({ data: mockOfficeCrowd }),
};

// ── Travel API (mock) ────────────────────────────────────────
export const travelAPI = {
  getAll: async (params?: { officeId?: string; status?: string }) => {
    let result = [...demandRequests];
    if (params?.officeId) {
      result = result.filter((r) => r.officeId === params.officeId);
    }
    if (params?.status) {
      result = result.filter((r) => r.status === params.status);
    }
    return {
      data: result.map((r) => ({
        ...r,
        employee: mockEmployees.find((e) => e.id === r.employeeId),
        office: mockOffices.find((o) => o.id === r.officeId),
      })),
    };
  },

  // userId is optional; when omitted, we try to read from localStorage demo_user
  getMine: async (userId?: string) => {
    let currentId = userId;
    if (!currentId) {
      const stored = localStorage.getItem('demo_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          currentId = parsed.id;
        } catch {
          currentId = undefined;
        }
      }
    }
    if (!currentId) {
      return { data: [] as any[] };
    }
    const result = demandRequests.filter((r) => r.employeeId === currentId);
    return {
      data: result.map((r) => ({
        ...r,
        office: mockOffices.find((o) => o.id === r.officeId),
      })),
    };
  },

  submit: async (payload: {
    employeeId: string;
    officeId: string;
    from: string;
    date: string;
    time: string;
  }) => {
    const newRequest = {
      id: crypto.randomUUID(),
      ...payload,
      distance: 10 + Math.random() * 15,
      status: 'PENDING' as const,
      crowd: 'MEDIUM' as const,
      costSaved: 0,
      co2Reduced: 0,
    };
    demandRequests = [newRequest, ...demandRequests];
    return { data: newRequest };
  },

  cancel: async (id: string) => {
    demandRequests = demandRequests.filter((r) => r.id !== id);
    return { data: { success: true } };
  },

  updateStatus: async (id: string, status: string) => {
    demandRequests = demandRequests.map((r) =>
      r.id === id ? { ...r, status: status as any } : r
    );
    return { data: { success: true } };
  },
};

// ── Matching API (mock) ──────────────────────────────────────
export const matchingAPI = {
  getGroups: async () => ({
    data: sharingGroups.map((g) => ({
      ...g,
      office: mockOffices.find((o) => o.id === g.officeId),
      memberDetails: g.members
        .map((id) => mockEmployees.find((e) => e.id === id))
        .filter(Boolean),
    })),
  }),

  findMatches: async (_requestId: string) => ({
    data: [],
  }),

  acceptMatch: async (_requestId: string, _matchRequestId: string) => ({
    data: { success: true },
  }),

  declineMatch: async (_requestId: string, _matchRequestId: string) => ({
    data: { success: true },
  }),
};

// ── Analytics API (mock) ─────────────────────────────────────
export const analyticsAPI = {
  getDashboard: async () => {
    const todayDate = '2026-03-10';
    const today = demandRequests.filter((r) => r.date === todayDate);
    const activeRideShares = sharingGroups.filter(
      (g) => g.status === 'ACTIVE'
    ).length;

    const totalCostSaved = demandRequests.reduce(
      (sum, r) => sum + (r.costSaved || 0),
      0
    );
    const totalCo2 = demandRequests.reduce(
      (sum, r) => sum + (r.co2Reduced || 0),
      0
    );

    const requestsByOffice = mockOffices.map((o) => ({
      office: o.name,
      count: demandRequests.filter((r) => r.officeId === o.id).length,
    }));

    const statusBreakdown = ['PENDING', 'APPROVED', 'MATCHED', 'COMPLETED'].map(
      (s) => ({
        status: s,
        count: demandRequests.filter((r) => r.status === s).length,
      })
    );

    return {
      data: {
        totalRequestsToday: today.length,
        activeRideShares,
        costSaved: totalCostSaved,
        co2Reduced: parseFloat(totalCo2.toFixed(1)),
        dailyStats: mockDailyStats,
        requestsByOffice,
        statusBreakdown,
        officeCrowd: mockOfficeCrowd,
      },
    };
  },

  exportCSV: async () => {
    const headers =
      'Employee,From,Office,Date,Time,Distance (km),Status,Cost Saved,CO2 Reduced\n';
    const rows = demandRequests
      .map((r) => {
        const emp = mockEmployees.find((e) => e.id === r.employeeId);
        const off = mockOffices.find((o) => o.id === r.officeId);
        return [
          emp?.name ?? '',
          r.from,
          off?.name ?? '',
          r.date,
          r.time,
          r.distance.toFixed(1),
          r.status,
          `₹${r.costSaved}`,
          `${r.co2Reduced} kg`,
        ].join(',');
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    return { data: blob };
  },
};

// Default export kept for backwards-compat imports; not used directly
const api = {};
export default api;