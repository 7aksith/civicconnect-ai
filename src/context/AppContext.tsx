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

  // ===================================================
  // CHALLENGES
  // ===================================================

  const [challenges, setChallenges] = useState<Challenge[]>(
    mockChallenges
  );

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
          'http://localhost:5000/reports'
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

        setChallenges(formattedChallenges);
      } catch (error) {
        console.error(
          '❌ Could not load reports from backend:',
          error
        );

        // Keep mock data if backend is unavailable
        setChallenges(mockChallenges);
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
  // SWITCH USER ROLE
  // ===================================================

  const switchUserRole = (
    role: UserRole
  ) => {
    const selected =
      mockUsers[role] ||
      mockUsers.citizen;

    setCurrentUser(selected);

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
    setChallenges((prev) => [
      newChallenge,
      ...prev,
    ]);

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