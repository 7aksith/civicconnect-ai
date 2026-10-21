import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  User,
  UserRole,
  Challenge,
  ChallengeStatus,
  NotificationItem,
} from '../types';

import {
  mockUsers,
  mockChallenges,
  mockNotifications,
} from '../data/mockData';

// =====================================================
// TOAST TYPE
// =====================================================

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

// =====================================================
// APP CONTEXT TYPE
// =====================================================

interface AppContextType {
  currentUser: User;

  isAuthenticated: boolean;

  loginWithCredentials: (
    email: string,
    password: string,
    mode: 'user' | 'admin'
  ) => { success: boolean; message: string };

  logout: () => void;

  switchUserRole: (role: UserRole) => void;

  updateUserProfile: (updates: Partial<User>) => void;

  challenges: Challenge[];

  activeChallengeId: string | null;

  setActiveChallengeId: (id: string | null) => void;

  selectedChallenge: Challenge | undefined;

  addNewChallenge: (newChallenge: Challenge) => void;

  updateChallengeStatus: (
    id: string,
    status: ChallengeStatus,
    note?: string
  ) => void;

  assignOrganizationToChallenge: (
    challengeId: string,
    orgId: string,
    orgName: string,
    orgType: string
  ) => void;

  toggleSupport: (challengeId: string) => void;

  addComment: (
    challengeId: string,
    content: string
  ) => void;

  notifications: NotificationItem[];

  unreadNotificationCount: number;

  markNotificationRead: (id: string) => void;

  markAllNotificationsRead: () => void;

  currentView: string;

  setCurrentView: (view: string) => void;

  toasts: Toast[];

  addToast: (toast: Omit<Toast, 'id'>) => void;

  removeToast: (id: string) => void;

  selectedMapChallenge: Challenge | null;

  setSelectedMapChallenge: (
    challenge: Challenge | null
  ) => void;

  isReportingFlowActive: boolean;

  setIsReportingFlowActive: (active: boolean) => void;
}

// =====================================================
// CREATE CONTEXT
// =====================================================

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

// =====================================================
// APP PROVIDER
// =====================================================

export const AppProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ===================================================
  // CURRENT USER
  // ===================================================

  const [currentUser, setCurrentUser] = useState<User>(
    mockUsers.citizen
  );

  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(false);

  const STORAGE_KEY = 'civicconnect_saved_accounts_v1';

  const buildDisplayNameFromEmail = (
    email: string,
    fallbackName: string
  ) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) {
      return fallbackName;
    }

    const localPart = normalized.split('@')[0];
    const cleaned = localPart
      .split(/[._+-]+/g)
      .map((part) => part.replace(/\d+$/g, '').trim())
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned) {
      return fallbackName;
    }

    return cleaned
      .split(' ')
      .filter(Boolean)
      .map((part) => {
        const cleanedPart = part.replace(/\d+$/g, '');
        return cleanedPart
          ? cleanedPart.charAt(0).toUpperCase() + cleanedPart.slice(1)
          : '';
      })
      .filter(Boolean)
      .join(' ');
  };

  const buildUserFromCredentials = (
    email: string,
    mode: 'user' | 'admin'
  ) => {
    const baseUser =
      mode === 'admin'
        ? mockUsers.authority
        : mockUsers.citizen;

    return {
      ...baseUser,
      id: `${mode}-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: buildDisplayNameFromEmail(
        email,
        baseUser.name
      ),
    };
  };

  const getSavedAccounts = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {
          user: {
            email: 'citizen@civicconnect.in',
            password: 'citizen123',
          },
          admin: {
            email: 'admin@civicconnect.in',
            password: 'admin123',
          },
        };
      }

      const parsed = JSON.parse(raw) || {};

      return {
        user: {
          email: 'citizen@civicconnect.in',
          password: 'citizen123',
          ...(parsed?.user || {}),
        },
        admin: {
          email: 'laksith0987@gmail.com',
          password: 'laksith0987@',
        },
      };
    } catch {
      return {
        user: {
          email: 'citizen@civicconnect.in',
          password: 'citizen123',
        },
        admin: {
          email: 'laksith0987@gmail.com',
          password: 'laksith0987@',
        },
      };
    }
  };

  // ===================================================
  // CHALLENGES
  // ===================================================

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const raw = localStorage.getItem('civicconnect_challenges_v1');
      if (raw) {
        return JSON.parse(raw) as Challenge[];
      }
    } catch {
      // Ignore invalid local storage payloads.
    }

    return mockChallenges;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'civicconnect_challenges_v1',
        JSON.stringify(challenges)
      );
    } catch {
      // Ignore storage failures in constrained environments.
    }
  }, [challenges]);

  // ===================================================
  // OTHER STATE
  // ===================================================

  const [activeChallengeId, setActiveChallengeId] =
    useState<string | null>(null);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(mockNotifications);

  const [currentView, setCurrentView] =
    useState<string>('landing');

  const [toasts, setToasts] = useState<Toast[]>([]);

  const [selectedMapChallenge, setSelectedMapChallenge] =
    useState<Challenge | null>(null);

  const [isReportingFlowActive, setIsReportingFlowActive] =
    useState<boolean>(false);

  // ===================================================
  // LOAD REPORTS FROM MYSQL
  // ===================================================

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        console.log(
          '🔄 Loading reports from CivicConnect backend...'
        );

        const response = await fetch(
          '/api/v1/challenges'
        );

        if (!response.ok) {
          throw new Error(
            `Backend returned status ${response.status}`
          );
        }

        const reports = await response.json();

        console.log(
          '✅ Reports loaded from MySQL:',
          reports
        );

        const formattedChallenges: Challenge[] =
          reports.map((report: any) => {
            const status =
              report.status || 'Reported';

            let progressPercent = 15;

            if (status === 'Resolved') {
              progressPercent = 100;
            } else if (status === 'Implementation') {
              progressPercent = 85;
            } else if (
              status === 'Solution_Development'
            ) {
              progressPercent = 60;
            } else if (
              status === 'Organization_Assigned'
            ) {
              progressPercent = 40;
            } else if (status === 'Under_Review') {
              progressPercent = 25;
            }

            return {
              id: String(report.id),

              title: report.title || '',

              description: report.description || '',

              category: report.category || 'Other',

              severity: report.severity || 'Medium',

              priorityScore:
                Number(report.priority_score) || 0,

              status: status as ChallengeStatus,

              progressPercent,

              location: {
                lat: Number(report.latitude) || 0,

                lng: Number(report.longitude) || 0,

                address: report.address || '',

                city: report.city || '',

                state: report.state || '',
              },

              evidence: {
                images: [],
              },

              aiAnalysis: {
                category: report.category || 'Other',

                severity: report.severity || 'Medium',

                priorityScore:
                  Number(report.priority_score) || 0,

                confidenceScore: 0,

                affectedPopulationEstimate: 0,

                duplicatesDetected: [],

                analysisRationale: [],

                recommendedAction: '',

                urgencyLevel: 'Standard',

                matchedKeywords: [],
              },

              reporterId: String(
                report.reporter_id || ''
              ),

              reporterName:
                report.reporter_name || 'Citizen',

              reporterRole: 'citizen',

              createdAt:
                report.created_at ||
                new Date().toISOString(),

              updatedAt:
                report.created_at ||
                new Date().toISOString(),

              supportersCount: 0,

              isSupportedByMe: false,

              matchedPartners: [],

              comments: [],

              timelineEvents: [
                {
                  status: status as ChallengeStatus,

                  title: `Challenge ${status}`,

                  description:
                    'Report submitted through CivicConnect AI.',

                  timestamp:
                    report.created_at ||
                    new Date().toISOString(),

                  actor:
                    report.reporter_name ||
                    'Citizen',
                },
              ],
            } as Challenge;
          });

        setChallenges((prev) => {
          const nextChallenges =
            formattedChallenges.length > 0
              ? formattedChallenges
              : prev;

          try {
            localStorage.setItem(
              'civicconnect_challenges_v1',
              JSON.stringify(nextChallenges)
            );
          } catch {
            // Ignore storage failures in constrained environments.
          }

          return nextChallenges;
        });
      } catch (error) {
        console.error(
          '❌ Could not load reports from backend:',
          error
        );

        // Keep stored local data if backend is unavailable
        try {
          const saved = localStorage.getItem(
            'civicconnect_challenges_v1'
          );
          if (saved) {
            setChallenges(JSON.parse(saved));
          } else {
            setChallenges(mockChallenges);
          }
        } catch {
          setChallenges(mockChallenges);
        }
      }
    };

    loadChallenges();
  }, []);

  // ===================================================
  // TOAST FUNCTIONS
  // ===================================================

  const addToast = (
    toast: Omit<Toast, 'id'>
  ) => {
    const id =
      `toast-${Date.now()}-${Math.random()}`;

    const newToast: Toast = {
      ...toast,
      id,
    };

    setToasts((prev) => [
      ...prev,
      newToast,
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter(
          (toast) => toast.id !== id
        )
      );
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) =>
      prev.filter(
        (toast) => toast.id !== id
      )
    );
  };

  // ===================================================
  // AUTHENTICATION
  // ===================================================

  const loginWithCredentials = (
    email: string,
    password: string,
    mode: 'user' | 'admin'
  ) => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!normalizedEmail || !trimmedPassword) {
      return {
        success: false,
        message: 'Please enter both email and password to continue.',
      };
    }

    const defaultCredentials = {
      user: {
        email: 'citizen@civicconnect.in',
        password: 'citizen123',
        user: mockUsers.citizen,
      },
      admin: {
        email: 'laksith0987@gmail.com',
        password: 'laksith0987@',
        user: mockUsers.authority,
      },
    }[mode];

    if (mode === 'admin') {
      if (
        normalizedEmail !== defaultCredentials.email.toLowerCase() ||
        trimmedPassword !== defaultCredentials.password
      ) {
        return {
          success: false,
          message: 'Invalid admin credentials. Please use the official admin login.',
        };
      }

      setCurrentUser(defaultCredentials.user);
      setIsAuthenticated(true);

      addToast({
        type: 'success',
        title: 'Welcome back, Dr. Rajesh Verma',
        message: 'Admin dashboard unlocked for emergency response coordination.',
      });

      return {
        success: true,
        message: 'Login successful',
      };
    }

    const savedAccounts = getSavedAccounts();
    const storedCredentials = savedAccounts[mode];
    const accountMatch =
      (storedCredentials &&
        normalizedEmail === storedCredentials.email.toLowerCase() &&
        trimmedPassword === storedCredentials.password) ||
      (normalizedEmail === defaultCredentials.email.toLowerCase() &&
        trimmedPassword === defaultCredentials.password);

    const signedInUser = buildUserFromCredentials(
      normalizedEmail,
      mode
    );

    if (!accountMatch) {
      try {
        const nextStorage = {
          ...savedAccounts,
          [mode]: {
            email: normalizedEmail,
            password: trimmedPassword,
          },
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStorage));
      } catch {
        // Ignore storage-related issues in restricted environments.
      }

      setCurrentUser(signedInUser);
      setIsAuthenticated(true);

      addToast({
        type: 'success',
        title: `Welcome, ${signedInUser.name}`,
        message: 'Your custom user account has been saved for future logins.',
      });

      return {
        success: true,
        message: 'Login successful',
      };
    }

    setCurrentUser(signedInUser);
    setIsAuthenticated(true);

    addToast({
      type: 'success',
      title: `Welcome back, ${signedInUser.name}`,
      message: 'Citizen dashboard unlocked for reporting and tracking community issues.',
    });

    return {
      success: true,
      message: 'Login successful',
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(mockUsers.citizen);
    setCurrentView('login');

    addToast({
      type: 'info',
      title: 'Signed out',
      message: 'You have been redirected to the login screen.',
    });
  };

  // ===================================================
  // SWITCH USER ROLE
  // ===================================================

  const switchUserRole = (
    role: UserRole
  ) => {
    const selected =
      mockUsers[role] ||
      mockUsers.citizen;

    setCurrentUser(selected);
    setIsAuthenticated(true);

    addToast({
      type: 'info',

      title:
        `Switched Persona: ${selected.role.toUpperCase()}`,

      message:
        `Now operating as ${selected.name} (${
          selected.organizationName ||
          selected.city
        })`,
    });
  };

  // ===================================================
  // UPDATE USER PROFILE
  // ===================================================

  const updateUserProfile = (
    updates: Partial<User>
  ) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updates,
    }));

    addToast({
      type: 'success',

      title: 'Profile Updated',

      message:
        'Your civic details have been saved successfully.',
    });
  };

  // ===================================================
  // ADD NEW CHALLENGE
  // ===================================================

  const addNewChallenge = (
    newChallenge: Challenge
  ) => {
    setChallenges((prev) => {
      const next = [
        newChallenge,
        ...prev.filter(
          (challenge) => challenge.id !== newChallenge.id
        ),
      ];

      try {
        localStorage.setItem(
          'civicconnect_challenges_v1',
          JSON.stringify(next)
        );
      } catch {
        // Ignore storage failures in constrained environments.
      }

      return next;
    });

    setCurrentUser((prev) => ({
      ...prev,

      reportsSubmitted:
        prev.reportsSubmitted + 1,

      reputationScore:
        prev.reputationScore + 50,
    }));

    const newNotif: NotificationItem = {
      id:
        `notif-${Date.now()}`,

      title:
        'AI Classification Completed',

      message:
        `Report "${newChallenge.title.slice(
          0,
          38
        )}..." verified with ${
          newChallenge.aiAnalysis
            .confidenceScore
        }% confidence.`,

      type: 'AI_ANALYSIS',

      createdAt: 'Just now',

      isRead: false,

      challengeId:
        newChallenge.id,
    };

    setNotifications((prev) => [
      newNotif,
      ...prev,
    ]);

    addToast({
      type: 'success',

      title:
        'Challenge Dispatched & AI Verified',

      message:
        `Reference ID #${newChallenge.id} created with priority score ${newChallenge.priorityScore}/100.`,
    });
  };

  // ===================================================
  // UPDATE CHALLENGE STATUS
  // ===================================================

  const updateChallengeStatus = (
    id: string,
    newStatus: ChallengeStatus,
    note?: string
  ) => {
    setChallenges((prev) =>
      prev.map((challenge) => {
        if (challenge.id !== id) {
          return challenge;
        }

        const updatedTimeline = [
          ...challenge.timelineEvents,

          {
            status: newStatus,

            title:
              `Status Changed to ${newStatus.replace(
                /_/g,
                ' '
              )}`,

            description:
              note ||
              `Updated by authority ${currentUser.name}`,

            timestamp: 'Just now',

            actor: currentUser.name,
          },
        ];

        let progressPercent = 15;

        if (newStatus === 'Resolved') {
          progressPercent = 100;
        } else if (
          newStatus === 'Implementation'
        ) {
          progressPercent = 85;
        } else if (
          newStatus === 'Solution_Development'
        ) {
          progressPercent = 60;
        } else if (
          newStatus === 'Organization_Assigned'
        ) {
          progressPercent = 40;
        } else if (
          newStatus === 'Under_Review'
        ) {
          progressPercent = 25;
        }

        return {
          ...challenge,

          status: newStatus,

          progressPercent,

          updatedAt:
            new Date().toISOString(),

          timelineEvents:
            updatedTimeline,
        };
      })
    );

    addToast({
      type: 'success',

      title: 'Status Updated',

      message:
        `Challenge #${id} updated to ${newStatus.replace(
          /_/g,
          ' '
        )}.`,
    });
  };

  // ===================================================
  // ASSIGN ORGANIZATION
  // ===================================================

  const assignOrganizationToChallenge = (
    challengeId: string,
    orgId: string,
    orgName: string,
    orgType: string
  ) => {
    setChallenges((prev) =>
      prev.map((challenge) => {
        if (
          challenge.id !== challengeId
        ) {
          return challenge;
        }

        return {
          ...challenge,

          status:
            'Organization_Assigned',

          progressPercent: 40,

          assignedOrganization: {
            id: orgId,

            name: orgName,

            type: orgType,

            assignedAt:
              new Date().toISOString(),
          },

          timelineEvents: [
            ...challenge.timelineEvents,

            {
              status:
                'Organization_Assigned',

              title:
                'Organization Dispatched',

              description:
                `Assigned to ${orgName} (${orgType}) for field action.`,

              timestamp: 'Just now',

              actor:
                currentUser.name,
            },
          ],
        };
      })
    );

    addToast({
      type: 'success',

      title:
        'Partner Organization Assigned',

      message:
        `${orgName} notified to address challenge #${challengeId}.`,
    });
  };

  // ===================================================
  // SUPPORT / UPVOTE
  // ===================================================

  const toggleSupport = (
    challengeId: string
  ) => {
    setChallenges((prev) =>
      prev.map((challenge) => {
        if (
          challenge.id !== challengeId
        ) {
          return challenge;
        }

        const isSupported =
          !challenge.isSupportedByMe;

        const supportersCount =
          isSupported
            ? challenge.supportersCount + 1
            : Math.max(
                0,
                challenge.supportersCount - 1
              );

        return {
          ...challenge,

          isSupportedByMe:
            isSupported,

          supportersCount,
        };
      })
    );

    const target =
      challenges.find(
        (challenge) =>
          challenge.id === challengeId
      );

    const nowSupported =
      !target?.isSupportedByMe;

    addToast({
      type: 'info',

      title:
        nowSupported
          ? 'Challenge Supported'
          : 'Upvote Removed',

      message:
        nowSupported
          ? 'Your endorsement increases the priority weighting for this community issue.'
          : 'Support withdrawn.',
    });
  };

  // ===================================================
  // ADD COMMENT
  // ===================================================

  const addComment = (
    challengeId: string,
    content: string
  ) => {
    if (!content.trim()) {
      return;
    }

    const newComment = {
      id:
        `comment-${Date.now()}`,

      userId:
        currentUser.id,

      userName:
        currentUser.name,

      userRole:
        currentUser.role,

      userAvatar:
        currentUser.avatar,

      content:
        content.trim(),

      createdAt:
        'Just now',

      upvotes: 0,
    };

    setChallenges((prev) =>
      prev.map((challenge) => {
        if (
          challenge.id !== challengeId
        ) {
          return challenge;
        }

        return {
          ...challenge,

          comments: [
            newComment,
            ...challenge.comments,
          ],
        };
      })
    );

    addToast({
      type: 'success',

      title:
        'Comment Posted',

      message:
        'Your field observation was added to the public thread.',
    });
  };

  // ===================================================
  // NOTIFICATIONS
  // ===================================================

  const markNotificationRead = (
    id: string
  ) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );

    addToast({
      type: 'info',

      title:
        'Notifications Cleared',

      message:
        'All notifications marked as read.',
    });
  };

  // ===================================================
  // DERIVED VALUES
  // ===================================================

  const unreadNotificationCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  const selectedChallenge =
    challenges.find(
      (challenge) =>
        challenge.id === activeChallengeId
    );

  // ===================================================
  // RETURN PROVIDER
  // ===================================================

  return (
    <AppContext.Provider
      value={{
        currentUser,

        isAuthenticated,

        loginWithCredentials,

        logout,

        switchUserRole,

        updateUserProfile,

        challenges,

        activeChallengeId,

        setActiveChallengeId,

        selectedChallenge,

        addNewChallenge,

        updateChallengeStatus,

        assignOrganizationToChallenge,

        toggleSupport,

        addComment,

        notifications,

        unreadNotificationCount,

        markNotificationRead,

        markAllNotificationsRead,

        currentView,

        setCurrentView,

        toasts,

        addToast,

        removeToast,

        selectedMapChallenge,

        setSelectedMapChallenge,

        isReportingFlowActive,

        setIsReportingFlowActive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// =====================================================
// USE APP HOOK
// =====================================================

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
};