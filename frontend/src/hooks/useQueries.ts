import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";
import type {
  UserProfile,
  SchoolInfo,
  FeeCategory,
  Photo,
  HomeHeroSection,
  HeroStats,
  SchoolHighlights,
  Testimonial,
  AdmissionsContent,
  Announcement,
  ThemeSettings,
  ContactMessage,
} from "../backend";

// ========== USER PROFILE ==========
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const principalStr = identity?.getPrincipal().toString() ?? "anonymous";

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile", principalStr],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const principalStr = identity?.getPrincipal().toString() ?? "anonymous";

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile", principalStr] });
    },
  });
}

// ========== ADMIN ==========
export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const principalStr = identity?.getPrincipal().toString() ?? "anonymous";

  return useQuery<boolean>({
    queryKey: ["isAdmin", principalStr],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0,
  });
}

export const useIsOwner = useIsAdmin;

// ========== SCHOOL INFO ==========
export function useGetSchoolInfo() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<SchoolInfo>({
    queryKey: ["schoolInfo"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getSchoolInfo();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateSchoolInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (info: SchoolInfo) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSchoolInfo(
        info.schoolName,
        info.adminContactInfo,
        info.phoneNumber,
        info.emailAddress,
        info.address,
        info.principalName,
        info.facebookLink,
        info.twitterLink,
        info.instagramLink,
        info.website
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schoolInfo"] });
    },
  });
}

// ========== FEE CATEGORIES ==========
export function useGetFeeCategories() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<FeeCategory[]>({
    queryKey: ["feeCategories"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getFeeCategories();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddFeeCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, amount }: { name: string; amount: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addFeeCategory(name, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeCategories"] });
    },
  });
}

export function useUpdateFeeCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name, amount }: { id: bigint; name: string; amount: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateFeeCategory(id, name, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeCategories"] });
    },
  });
}

export function useDeleteFeeCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteFeeCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeCategories"] });
    },
  });
}

// ========== GALLERY ==========
export function useGalleryPhotos() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Photo[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getGallery();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ url, caption }: { url: string; caption: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPhoto(url, caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

export function useDeletePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deletePhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

// ========== HOME HERO SECTION ==========
export function useHomeHeroSection() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<HomeHeroSection>({
    queryKey: ["homeHeroSection"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getHomeHeroSection();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateHomeHeroSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      schoolName: string;
      tagline: string;
      address: string;
      stats: HeroStats;
      highlights: SchoolHighlights;
      testimonials: Testimonial[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateHomeHeroSection(
        data.schoolName,
        data.tagline,
        data.address,
        data.stats,
        data.highlights,
        data.testimonials
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeHeroSection"] });
    },
  });
}

// ========== ADMISSIONS CONTENT ==========
export function useAdmissionsContent() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<AdmissionsContent>({
    queryKey: ["admissionsContent"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAdmissionsContent();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateAdmissionsContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: AdmissionsContent) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAdmissionsContent(
        content.eligibility,
        content.process,
        content.documents,
        content.applicationSteps,
        content.portalLink,
        content.faq
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissionsContent"] });
    },
  });
}

// ========== ANNOUNCEMENTS ==========
export function useAnnouncements() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllAnnouncements();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, body, date }: { title: string; body: string; date: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addAnnouncement(title, body, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useUpdateAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title, body, date }: { id: bigint; title: string; body: string; date: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAnnouncement(id, title, body, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

// ========== THEME SETTINGS ==========
export function useThemeSettings() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<ThemeSettings>({
    queryKey: ["themeSettings"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getThemeSettings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateThemeSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: ThemeSettings) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateThemeSettings(
        settings.primaryColor,
        settings.accentColor,
        settings.fontChoice
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themeSettings"] });
    },
  });
}

// ========== CONTACT MESSAGES ==========
export function useContactMessages() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<ContactMessage[]>({
    queryKey: ["contactMessages"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getContactMessages();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSubmitContactMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
      timestamp: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitContactMessage(
        data.name,
        data.email,
        data.phone,
        data.subject,
        data.message,
        data.timestamp
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
    },
  });
}
